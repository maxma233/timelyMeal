import torch
from transformers import DistilBertForTokenClassification, DistilBertTokenizerFast, pipeline

from prediction_exception import PredictionException 

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
        
        # Group by entity
        entities = []
        current_entity = []
        buffer = ""
        is_subword = False
        prev_label = None
        label = None

        # Dictionary containing the rules for how new words (not subwords)
        # can be attached to previous words
        label_rule_book = { 'I': ['B', 'I'], 'B': [] }

        for pred in predictions:
            # Tracks the previous label
            if label:
                prev_label = label

            label = pred["entity"][:1]
            current_rule = label_rule_book[label] 
            # print('Current rule: ', current_rule)
            # print('is_subword', is_subword)

            # Push out buffer to new entities if a dish that is fully satisfied
            if (len(buffer) != 0 and (not is_subword and prev_label not in current_rule)):
                entities.append(buffer)
                buffer = ""

            # Slowly build up the word using a buffer
            if (current_entity):
                buffer += current_entity.pop()
                # Reset the flag
                is_subword = False

            # print('Buffer: ', buffer)

            # GET NEW WORD

            # Check if it is a subword
            word_predicted = pred["word"]
            if (str.startswith(word_predicted, '##')):
                # print('is a subword!')
                is_subword = True
                word_predicted = str.replace(word_predicted, '##', '')

            try:
                if (is_subword and (prev_label == None or prev_label != label)):
                    # It is impossible for subwords to branch off a different label
                    print("This should not have happened [SHOULD PROBABLY ADDRESS THIS]")
                    raise PredictionException()
            except PredictionException as e:
                print(e)
                exit()

            current_entity = [word_predicted]
            # print("Current entity: ", current_entity)

            if not len(buffer) == 0 and (not is_subword and (prev_label in current_rule)):
                # print('Appending new word onto current one (non subword)')
                buffer += ' ' + current_entity.pop()

                # print('buffer: ', buffer)
        
        # Final addition to the buffer and added to the entities 
        if (current_entity):
            buffer += current_entity.pop()
        
        # print('Final buffer state: ', buffer)

        entities.append(buffer)
        buffer = ""

        # Final check (could have reached the end )
        if not len(buffer) == 0 and not is_subword:
            entities.append("".join(buffer))
            buffer = ""

        # if current_entity:
        #     entities.append(" ".join(current_entity))


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
        # 'I loved eating the ratatouille',
        # 'full english breakfast',
        # "shepherd's pie",
        # 'key lime pie',
        # 'I went to go eat at the restaurant',
        # 'I love to go gokarting',
        # 'The scent from the flowers was nice',
        # 'they enjoyed chicken enchilada bowl with rice .',
        # 'they enjoyed mushroom risotto last night .',
        # 'the egg rolls were crunchy',
        # 'the spaghetti carbonara was creamy',
        # 'i tried sea bass sashimi for dinner',
        # "i loved eating the chicken n' waffles",
        # 'the pho broth was great',
        # 'one of my favorite things to eat is bun bo hue',
        # 'he missed eating some udon',
        'i ordered waldorf salad for lunch .',
        'she loves beet risotto with goat cheese .',
        'i enjoyed tuna tataki by the coast .',
        'we ordered methi naan with curry .',
        'we had grilled lamb rack as the centerpiece .',
        'we tried mushroom risotto at the bistro .',
        'i ordered caprese salad for lunch .',
        'he loves sushi rolls with soy sauce .',
        'we had tandoori paneer tikka last night .',
        # 'hamburger',
        # 'I enjoyed lunchables',
        # 'I want a taco',
        # 'I am craving chicken quesadillas',
        # "I really want a dave's double",
        # 'craving',
        # 'craving hot dog',
        # 'craving cheese curds',
        # 'i crave tater tots',
        # 'club sandwich',
        # 'club soda',
        # 'butter chicken',
        # 'ice cream sundae',
        # 'pop corn',
        # 'sunday roast',
        # 'mac n cheese',
        # 'chocolate milkshake',
        'my favorite things to eat are crab rangoons and also some french fries',
    ]
    label_map = {0: "B-DISH", 1: "I-DISH", 2: "O"}  # Matches no_product_labels=True

    test_model(model_path, list(map(lambda x: str.lower(x), test_sentences)), label_map)