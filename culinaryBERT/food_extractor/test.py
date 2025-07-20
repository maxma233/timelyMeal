import torch
from transformers import DistilBertForTokenClassification, DistilBertTokenizerFast, pipeline

def test_model(model_path, test_sentences, label_map=None):
    """
    Test the trained model on sample sentences and print predicted DISH tags.
    
    Args:
        model_path (str): Path to the trained model (e.g., '../models/culinaryBERT').
        test_sentences (list): List of sentences to test (e.g., ["I ate a pizza and pasta."]).
        label_map (dict): Mapping of label IDs to tags (e.g., {0: 'B-DISH', 1: 'I-DISH', 2: 'O'}).
    """
    # Default label map (assuming no_product_labels=True)
    if label_map is None:
        label_map = {0: 'B-DISH', 1: 'I-DISH', 2: 'O'}

    # Load tokenizer and model
    tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-cased")
    model = DistilBertForTokenClassification.from_pretrained(model_path)
    
    # Move model to GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    # Set to testing mode
    model.eval()

    # Create NER pipeline
    ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, device=0 if device == "cuda" else -1)

    print(f"Testing model from {model_path} on {len(test_sentences)} sentences:")
    for sentence in test_sentences:
        print(f"\nSentence: {sentence}")
        predictions = ner_pipeline(sentence)
        
        # Process predictions
        # tokens = tokenizer.convert_ids_to_tokens(tokenizer(sentence, return_offsets_mapping=True)["input_ids"])
        print("Token\tPredicted Tag")
        print("-" * 30)
        print('Predictions: ', predictions)
        for pred in predictions:
            # print('Prediction: ', pred)
            token = pred["word"]
            label = pred["entity"]
            score = pred["score"]
            print(f"{token}\t{label} ({score:.3f})")
        
        # Optional: Group by entity
        entities = []
        current_entity = []
        for pred in predictions:
            label = pred["entity"]
            if label.startswith("B-"):
                if current_entity:
                    entities.append(" ".join(current_entity))
                current_entity = [pred["word"]]
            elif label.startswith("I-"):
                current_entity.append(pred["word"])
            else:  # O
                if current_entity:
                    entities.append(" ".join(current_entity))
                    current_entity = []
        if current_entity:
            entities.append(" ".join(current_entity))
        
        print("\nExtracted DISH entities:", entities if entities else "None")

if __name__ == "__main__":
    model_path = "../models/culinaryBERT"
    test_sentences = [
        # "I ate a delicious pizza and pasta.",
        # "The restaurant serves sushi and ramen.",
        # "I ordered a burger with fries.",
        # "No food here, just drinks.",
        # 'Dirt',
        # 'Chicken Alfredo',
        # 'Lobster Bisque',
        # 'Car',
        # 'Bag',
        # 'Water Bottle',
        # 'chicken alfredo',
        # 'pizza',
        # 'hamburger',
        # 'hot dog',
        # 'barbeque pork',
        # 'Pizza',
        # 'Hamburger',
        # 'Hot Dog',
        # 'Barbeque Pork',
        # 'burger',
        # 'toast',
        # 'sausage',
        # 'tomato',
        # 'rice',
        'I loved eating the ratatouille',
        'full english breakfast',
        "shepherd's pie",
        'key lime pie',
        'I went to go eat at the restaurant',
        'I love to go gokarting',
        'The scent from the flowers was nice',
    ]
    label_map = {0: "B-DISH", 1: "I-DISH", 2: "O"}  # Matches no_product_labels=True

    test_model(model_path, list(map(str.lower, test_sentences)), label_map)