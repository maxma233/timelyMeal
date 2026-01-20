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

    entity_label = ''

    # Dictionary containing the rules for how new words (not subwords)
    # can be attached to previous words
    label_rule_book = { 'I': ['B', 'I'], 'B': [] }

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

    return entities, entity_label

