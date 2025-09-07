import torch
from transformers import DistilBertForTokenClassification, DistilBertTokenizerFast, pipeline, BertTokenizerFast, BertForTokenClassification

from prediction_exception import PredictionException 

def test_model(model_path, test_sentences, label_map=None):
    """
    Test the trained model on sample sentences and print predicted DISH tags.
    
    Args:
        model_path (str): Path to the trained model (e.g., '../models/culinaryBERT').
        test_sentences (list): List of sentences to test (e.g., ["I ate a pizza and pasta."]).
        label_map (dict): Mapping of label IDs to tags (e.g., {0: 'B-DISH', 1: 'I-DISH', 2: 'O'}).
    """

    # Load tokenizer and model
    tokenizer = BertTokenizerFast.from_pretrained("bert-base-cased")
    model = BertForTokenClassification.from_pretrained(model_path)
    
    # Move model to GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    # Set to testing mode
    model.eval()

    # Create NER pipeline
    ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, device="cuda" if torch.cuda.is_available() else "cpu")

    print(f"Testing model from {model_path} on {len(test_sentences)} sentences:")
    for sentence in test_sentences:
        print(f"\nSentence: {sentence}")
        predictions = ner_pipeline(sentence)
        
        # Process predictions
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

        entity_label = ''

        # Dictionary containing the rules for how new words (not subwords)
        # can be attached to previous words
        label_rule_book = { 'I': ['B', 'I'], 'B': ['B'] }

        for pred in predictions:
            # Tracks the previous label
            if label:
                prev_label = label
                entity_label = pred['entity'][2:] if entity_label == '' else entity_label

            label = pred["entity"][:1]
            current_rule = label_rule_book[label] 

            # Push out buffer to new entities if a dish that is fully satisfied
            if (len(buffer) != 0 and (not is_subword and prev_label not in current_rule)):
                entities.append(buffer)
                buffer = ""

            # Slowly build up the word using a buffer
            if (current_entity):
                buffer += current_entity.pop()
                # Reset the flag
                is_subword = False

            # GET NEW WORD
            # Check if it is a subword
            word_predicted = pred["word"]
            if (str.startswith(word_predicted, '##')):
                is_subword = True
                word_predicted = str.replace(word_predicted, '##', '')

            try:
                if (is_subword and (prev_label == None or prev_label != label)):
                    # It is impossible for subwords to branch off a different label
                    print("This should not have happened [SHOULD PROBABLY ADDRESS THIS]")
                    raise PredictionException()
            except PredictionException as e:
                print(e)

                # Should not handle these cases
                buffer = ''
                is_subword = False
                current_entity.clear()

                break
                # exit()

            current_entity = [word_predicted]

            # Push out buffer if dish is fully completed before continuing
            if not len(buffer) == 0 and (not is_subword and prev_label not in current_rule):
                entities.append(buffer)
                buffer = ""

            # Append a new word (not subword) to the current dish in the buffer
            if not len(buffer) == 0 and (not is_subword and (prev_label in current_rule)):
                buffer += ' ' + current_entity.pop()
        
        # Final addition to the buffer and added to the entities 
        if (current_entity):
            buffer += current_entity.pop()

        # Final buffer push 
        entities.append(buffer)

        print("\nExtracted DISH entities:", entities if entities else "None")

if __name__ == "__main__":
    model_path = "../models/broad_model/culinaryBERT"
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
        # 'i ordered waldorf salad for lunch .',
        # 'she loves beet risotto with goat cheese .',
        # 'i enjoyed tuna tataki by the coast .',
        # 'we ordered methi naan with curry .',
        # 'we had grilled lamb rack as the centerpiece .',
        # 'we tried mushroom risotto at the bistro .',
        # 'i ordered caprese salad for lunch .',
        # 'he loves sushi rolls with soy sauce .',
        # 'we had tandoori paneer tikka last night .',
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
        # 'my favorite things to eat are crab rangoons and also some french fries',
        # 'she ate brazilian cheese bread for breakfast .',
        # 'pepperoni pizza',
        # 'grilled cheese',
        # 'chicken alfredo',
        # 'pho',
        # 'beef ramen',
        # 'fettuccine alfredo',
        # 'meatloaf',
        # 'sloppy joe',
        # 'pulled pork sandwich',
        # 'baked beans',
        # 'cornbread',
        # 'shrimp gumbo',
        # 'cheeseburger',
        # 'chicken biryani',
        # 'thai curry',
        # 'pad thai',
        # 'kung pao chicken',
        # 'apple pie',
        # 'chocolate ice cream',
        # 'steak',
        # 'sushi',
        # 'fried chicken',
        # 'al pastor tacos', 
        # 'scented candle',
        # 'pencil graphite',
        # 'wooden table',
        # 'blow dryer',
        # 'washing machine',
        # 'water bottle',
        # 'car engine',
        # 'engine',
        # 'dirt',
        # 'nothing',
        # "Chick-fil-A",
        # "Burger King",
        # "McDonald's",
        # "Red Lobster",
        # "Olive Garden",
        # "Taco Bell",
        # "White Castle",
        # "Panda Express",
        # "Sushi Bros", 
        # "Hamburger",
    ]
    label_map = {0: "B-DISH", 1: "I-DISH", 2: "O", 3: "B-RESTAURANT", 4: "I-RESTAURANT"}  # Matches no_product_labels=True

    # test_model(model_path, list(map(lambda x: str.lower(x), test_sentences)), label_map)
    test_model(model_path, test_sentences, label_map)