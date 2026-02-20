from dataclasses import dataclass
import statistics

class PredictionException(Exception):
    """
        This exception is for the instance when culinaryBERT
        produces results that are invalid.

        Args:
            message (str): A message that reflects the exception.
    """
    def __init__(self, message='model has returned an invalid response'):
        self.message = message
        super().__init__(self.message)

@dataclass
class Prediction:
    entity: str
    score: float
    index: int
    word: str
    start: int 
    end: int

def determine_most_confident(predictions:list[list[dict]]) -> str:
    """
    Used to determine the most confident entity type from the provided predictions
    
    :param predictions: Takes in a list of predictions, Ex: (Dish & Restaurant)
    :type predictions: list[dict]
    :return: Will return an entity label that reflects the highest confident score
    :rtype: str
    """

    entity_types = [[Prediction(**prediction[0]).entity[2:], None] for prediction in predictions]

    for index, prediction in enumerate(predictions):
        converted_predictions: list[Prediction] = [Prediction(**x) for x in prediction]
        score = statistics.mean([x.score for x in converted_predictions])
        entity_types[index][1] = score

    max_prob = 0
    prev_prob = 0
    most_confident = None

    for types in entity_types:
        prev_prob = max_prob
        max_prob = max(max_prob, types[1])
        if prev_prob < max_prob:
            most_confident = types[0]

    print(f'Most confident with: {most_confident}')
    return most_confident


def get_dishes(predictions) -> list:
    """
        Used to get the dishes from culinaryBERT.
    """
    # Group by entity
    entities = []
    current_entity = []
    buffer = ""
    is_subword = False
    prev_label = None
    label = None

    # entity_label = ''

    # Dictionary containing the rules for how new words (not subwords)
    # can be attached to previous words
    label_rule_book = { 'I': ['B', 'I'], 'B': [] }

    for pred in predictions:
        # Tracks the previous label
        if label:
            prev_label = label
            # entity_label = pred['entity'][2:] if entity_label == '' else entity_label

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
            exit()

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

    return entities

