from flask import Flask, request, jsonify 
from flask_cors import CORS
import time as t

# Used for the LMs
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline, DistilBertForTokenClassification, DistilBertTokenizerFast
import gc
from huggingface_hub import login

from dotenv import load_dotenv

load_dotenv() # Loading Huggingface token

from pathlib import Path
import sys
import os

app = Flask(__name__)
CORS(app) # enable CORS to allow request from native react app

# NOTE: Change structure later
current_dir = Path(__file__).resolve().parent
# Add the path correctly
middleware_dir = current_dir.parent / 'middleware'
classifier_dir = current_dir.parent.parent / 'DiscreteClassifier'
culinaryBERT_filepath = '../../culinaryBERT/models/culinaryBERT'
DEFAULT_FILE_LOCATION = classifier_dir / 'timelymealsdiscreteannotated.csv'

if classifier_dir.exists() and middleware_dir.exists():
    sys.path.append(str(classifier_dir))
    print(f"Added to path:{classifier_dir}")
    sys.path.append(str(middleware_dir))
    print(f"Added to path:{middleware_dir}")
else: 
    print(f"Classifier {classifier_dir} and middleware {middleware_dir} paths need to be checked.")

from classifier import Classifier
from parse_culinaryBERT import get_dishes

# Initialize the classifier
classifier = Classifier(file_location=DEFAULT_FILE_LOCATION)


# Use CUDA for the model
device = "cuda:0" if torch.cuda.is_available() else "cpu"

# Loading the models and tokenizers
model_name = "timely/TimelyAI"
secret_token = os.getenv("SECRET_KEY")

culinaryBERT_tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-cased")
culinaryBERT_model = DistilBertForTokenClassification.from_pretrained(culinaryBERT_filepath)
culinaryBERT_model.to(device)

# Login
login(token=secret_token)

# try:
#     # Load tokenizer first
#     tokenizer = AutoTokenizer.from_pretrained(
#         model_name,
#         trust_remote_code=True
#     )
#     print("Tokenizer loaded successfully")
    
#     # Load model with multi-GPU support
#     model = AutoModelForCausalLM.from_pretrained(
#         model_name
#     )
#     print("Model loaded successfully!")

# except Exception as e:
#     print(f"Error loading model: {e}")
#     print("Trying without quantization...")
    
#     # Fallback: Load without quantization
#     try:
#         model = AutoModelForCausalLM.from_pretrained(
#             model_name,
#             device_map="auto",
#             torch_dtype=torch.float16,
#             trust_remote_code=True,
#             low_cpu_mem_usage=True
#         )
#         print("Model loaded without quantization")
#     except Exception as e2:
#         print(f"Failed to load model: {e2}")
#         model = None

# Setting up pipeline
# gemma_pipe = pipeline("text-generation", model="timely/TimelyAI", device="cpu", torch_dtype=torch.bfloat16)
 
culinaryBERT_pipe = pipeline("ner", model=culinaryBERT_model, tokenizer=culinaryBERT_tokenizer, device="cpu")

@app.route('/add', methods=['POST'])
def append_to_classifier():

    # Get JSON
    data = request.get_json()

    # print(data)

    if (request.method != 'POST'):
        return jsonify({"Error": "Invalid method request type"}), 400

    message = data['message'] if 'message' in data else ''

    # print(message)

    if not message:
        return jsonify({"Error": "No message was sent to the backend"}), 400

    # Checking if prompt has the proper attributes 
    if not 'category' in message or not 'prompt' in message:
        return jsonify({"Error": "Invalid formatting of message"}), 400

    result = classifier.append(category=message['category'], prompt=message['prompt'])

    if result == 1:
        return jsonify({"Message": "Successful append!"}), 201
    else:
        return jsonify({"Error": "Failed to append!"}), 400    

@app.route('/prompt', methods=['POST'])
def verify():

    # Grab JSON of the request
    data = request.get_json()

    if (request.method != 'POST'):
        return jsonify({"Error": "Invalid method request type"}), 400

    # Should contain an attribute named 'prompt'
    prompt = data['prompt'] if 'prompt' in data else ''
    
    if not prompt:
        return jsonify({"Error": "No prompt was sent to the backend"}), 400
    
    # Validate the prompt
    result = classifier.verify(prompt=prompt)

    # print(prompt)
    # print(result)

    if result == 1:
        return jsonify({"Message": "Valid Prompt"}), 201
    else:
        return jsonify({"Error": "Invalid Prompt"}), 400
    
@app.route('/model', methods=['POST'])
def prompt_model():
    """ 
        Prompt the model and get a request back
        outputted into the terminal.
    """

    data = request.get_json()

    base_messages = [
        {
            "role": "system",
            "content": [
                {"type": "text", "text": "You are a meal planning assistant. Please do not provide recipes"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Also, can you add the ethnic cuisine of food the dish is before you state the meal in parentheses (Ex: (American) Hamburger)? Can you also list the quantity per dish inside square brackets (Ex: [1 burger])? Choose takeout meals. Choose decisive meals. Ex: Turkey Club as opposed to any sandwich. Do not add quips."}
            ]
        }
    ]

    if (request.method != 'POST'):
        return jsonify({"Error": "Invalid method request type"}), 400
    
    prompt = data['prompt'] if 'prompt' in data else ''

    if not prompt:
        return jsonify({"Error": "No prompt was sent to the backend"}), 400
    
    # Build up the prompt
    base_messages[1]['content'][0]['text'] = prompt + ' ' + base_messages[1]['content'][0]['text']

    print(base_messages)

    # start_time = t.perf_counter()
    # print(f'Start time: {t.perf_counter() - start_time} seconds')
    
    # Call the model
    # output = gemma_pipe(text_inputs=base_messages, max_new_tokens=750)
    
    # model_response = output[0]["generated_text"][-1]["content"]

    # print(model_response)

    return jsonify({"Message": model_response}), 200
    # return jsonify({"Message": 'good job'}), 200
    
    # end_time = t.perf_counter() - start_time
    # print(end_time)
    
    # print('Ending time: {:2.2} seconds'.format(end_time))

@app.route('/classify_dish', methods=['POST'])
def prompt_culinaryBERT():
    """
        Prompt culinaryBERT to classify what was presented in front of it.
        Used for dish and restaurant (in progress) classification.
    """

    print('Request received!')

    # Grab the data
    data = request.get_json()

    if (request.method != 'POST'):
        return jsonify({"Error": "Invalid method request type"}), 400
    
    text = data['text'] if 'text' in data else ''

    if not text:
        return jsonify({"Error": "No text was sent to the backend"}), 400
    
    # Send the text to culinaryBERT
    results = culinaryBERT_pipe(text)

    dishes = get_dishes(results)

    # Process the results
    print(dishes)

    return jsonify({"Message": dishes}), 200

# Run the backend
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
