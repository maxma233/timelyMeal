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

def output_as_one_line(list=None) -> str:
    
    output = ''

    for item in range(len(list) - 1):
        output += f'{item}, '

    output += list[len(list) - 1]

    return output

def build_food_plan_prompt(user_input=None) -> str:

    food_type = user_input['foodType']
    # duration = user_input['duration']
    num_meals = user_input['numMeals']
    preferences = user_input['preferences']

    ethnic_cuisines = preferences['ethnicCuisines'] or ['None']
    dishes = preferences['dishes'] or []
    restaurants = preferences['restaurants'] or []
    
    prompt_requirements = ''

    # Length of plan and number of meals
    prompt_requirements += f'Create a 7-day {food_type} meal plan with {num_meals} per day.\n'

    # Requirement List
    prompt_requirements += 'Requirements:\n'
    prompt_requirements += f'• Meals must be {output_as_one_line(list=ethnic_cuisines)} cuisine only.\n'

    for dish in dishes:
        prompt_requirements += f'Include {dish} at least once.\n'

    for restaurant in restaurants:
        prompt_requirements += f'Include food from {restaurant} at least once.\n'

    prompt_requirements += '''
    • Each meal must be a specific menu item (example: “Carne Asada Tacos” instead of “tacos”).
    • Meals should be realistic takeout items from restaurants or fast-casual places.

    Output format:
    • Label each day (Day 1–Day 7).
    • List Breakfast, Lunch, Dinner for each day.
    • Do not include explanations, summaries, or extra commentary.

    Keep descriptions short and clear.
    '''

    return prompt_requirements

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
                {"type": "text", "text": "You are a meal planning assistant. Please do not provide recipes. Also, do not add any additional fluff text. Just return what is requested for."}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Choose specific variant meals. Ex: Turkey Club as opposed to any sandwich."}
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

    # print(base_messages)

    # Call the model
    output = pipe(text_inputs=base_messages, max_new_tokens=500)
    
    model_response = output[0]["generated_text"][-1]["content"]

    # print(model_response)

    return jsonify({"Message": model_response}), 200

## Run the backend from a portforwarded port
if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=20000)
