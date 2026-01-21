from flask import Flask, request, jsonify 
from flask_cors import CORS

import torch
import os
from huggingface_hub import login
from transformers import pipeline

from dotenv import load_dotenv

load_dotenv() # Loading Huggingface token

app = Flask(__name__)
CORS(app) # enable CORS to allow request from native react app

# Use CUDA for the model
device = "cuda:0" if torch.cuda.is_available() else "cpu"

# Loading the model
model_name = "timely/TimelyAI"
secret_token = os.getenv("SECRET_KEY")

# print(os.environ)

print(f'Secret Token: {secret_token}')

# Login to huggingface
login(token=secret_token)

print('loading the pipeline!')
pipe = pipeline("text-generation", model="timely/TimelyAI", device=device, torch_dtype=torch.bfloat16)
print('pipeline ready!')


def build_food_plan_prompt(user_input=None) -> str:

    food_type = user_input['foodType']
    duration = user_input['duration']
    preferences = user_input['preferences']

    ethnic_cuisines = preferences['ethnicCuisines'] or ['None']
    dishes = preferences['dishes'] or []
    restaurants = preferences['restaurants'] or []
    
    prompt = f'I want this meal plan to be {food_type} food lasting for {duration} days. '

    if 'None' not in ethnic_cuisines:
        # Cuisines need to be addressed
        prompt += f'These dishes should be comprised of the {ethnic_cuisines} cuisines.'

    if len(dishes) > 0:     
        prompt += f' Some dishes I would like included are: {dishes}.'

    if len(restaurants) > 0:
        prompt += f' Some restaurants I would like included are: {restaurants}.'

    return prompt

@app.route('/prompt', methods=['POST'])
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
                {"type": "text", "text": "Also, can you add the genre of food the dish is before you state the meal in parentheses (Ex: (Italian) Pasta Primavera)? Can you also list the quantity per dish in []? Choose decisive meals. Ex: Turkey Club as opposed to any sandwich."}
            ]
        }
    ]

    if (request.method != 'POST'):
        return jsonify({"Error": "Invalid method request type"}), 400
    
    prompt = data['prompt'] if 'prompt' in data else ''

    if not prompt:
        return jsonify({"Error": "No prompt was sent to the backend"}), 400

    # Build up the prompt
    base_messages[1]['content'][0]['text'] = build_food_plan_prompt(user_input=prompt) + ' ' + base_messages[1]['content'][0]['text']

    print(base_messages)

    # start_time = t.perf_counter()
    # print(f'Start time: {t.perf_counter() - start_time} seconds')
    
    # Call the model
    output = pipe(text_inputs=base_messages, max_new_tokens=500)
    
    model_response = output[0]["generated_text"][-1]["content"]

    print(model_response)

    return jsonify({"Message": model_response}), 200
    # return jsonify({"Message": 'good job'}), 200
    
    # end_time = t.perf_counter() - start_time
    # print(end_time)
    
    # print('Ending time: {:2.2} seconds'.format(end_time))

## Run the backend from a portforwarded port
if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=20000)
