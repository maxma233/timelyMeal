from flask import Flask, request, jsonify 
from flask_cors import CORS

from pathlib import Path
import sys

app = Flask(__name__)
CORS(app) # enable CORS to allow request from native react app

current_dir = Path(__file__).resolve().parent
# Add the path correctly
script_dir = current_dir.parent.parent / 'DiscreteClassifier'

if script_dir.exists():
    sys.path.append(str(script_dir))
    print(f"Added to path:{script_dir}")
else: 
    print(f"Path does not exist. {script_dir}")

from classifier import Classifier

# Initialize the classifier
classifier = Classifier()

@app.route('/prompt', methods=['POST'])
def verify():

    # Grab JSON of the request
    data = request.get_json()

    if (request.method != 'POST'):
        return jsonify({"Error": "Invalid method request type"}), 400

    # Should contain an attribute named 'prompt'
    prompt = data['prompt'] or ''
    
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



# Run the backend
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
