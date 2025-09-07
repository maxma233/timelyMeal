import json
from data_utils import get_words_and_labels

class EvalFileBuilder:

    def __init__(self, data_file_path: str='../training/train.txt', output_file_path: str='../data/eval/eval_labeled.json'):
        self.conll_path = data_file_path
        self.output_path = output_file_path

    def reset_file(self):
        try:
            file = open(self.output_path, 'w+')
            num = file.read()
            if len(num) > 0:
                raise Exception
            file.close()
        # except FileNotFoundError:
        #     print(f'File located at {self.output_path} not found!')
        except OSError as e:
            print(f'Failed to open the file.', e)
        except Exception as e:
            print('Error: ', e)    
            print(f'Something went wrong when clearing the file!')

    def build_file(self, prop_eval: float = 0.2) -> list:
        '''
            Builds a file from conll format to a labelstudio file that can be later used
            for evaluation
            NOTE: NO need for a prop_eval param anymore as the split is handled elsewhere
            ARGS:
        '''
        self.reset_file()

        with open(self.conll_path, 'r') as f:
            data = f.read()
        docs = data.strip().split("\n\n")
        
        words, labels = get_words_and_labels(docs=docs)
        
        examples = []
        for doc_words, doc_labels in zip(words, labels):
            text = " ".join(doc_words)
            spans = []
            char_pos = 0
            for word, label in zip(doc_words, doc_labels):
                if label == "O":
                    char_pos += len(word) + 1
                    continue
                start = char_pos
                end = char_pos + len(word)  

                ent_type: str = "O"
                if label in ["B-DISH", "I-DISH"]:
                    ent_type = "DISH"
                elif label in ["B-RESTAURANT", "I-RESTAURANT"]:
                    ent_type = "RESTAURANT"

                if ent_type:
                    spans.append({
                        "value": {
                            "start": start,
                            "end": end,
                            "text": word,
                            "labels": [ent_type]
                        }
                    })
                char_pos += len(word) + 1
            examples.append({
                "data": {"text": text},
                "completions": [{"result": spans}]
            })
        
        with open(self.output_path, 'w+') as f:
            json.dump(examples, f, indent=2)
        
        return examples