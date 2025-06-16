import pandas as pd
import numpy as np
from collections import Counter as ctr

import os
# import subprocess

# Verifying and moving to correct location
os.chdir(os.getcwd() + '\\DiscreteClassifier')
print(f'Current Working Directory: {os.getcwd()}')
# subprocess.run("dir", shell=True)

def read_file() -> pd.DataFrame:
    """ 
        Building the data from the .csv file by
        parsing it into columns and then normalizing
        by tokenizing the input. 
        Returns: Pandas Dataframe containing the data
    """
    data = pd.read_csv('timelymealsdiscreteannotated.csv', skiprows=1, names=['type','text', 'c3', 'c4', 'c5'], delimiter=',', encoding='ISO-8859-1')

    # Tokenizing the input
    data['clean'] = data.text.apply(lambda x: x.lower().split())
    data.drop(['c3', 'c4', 'c5'], axis=1, inplace=True)

    return data

def build_classifier_dict(data: pd.DataFrame) -> dict:
    """
        Builds a dictionary that contains the respective
        token counter for each type of response (Valid/Invalid)
        Returns: Dictionary containing counter entries of the valid and invalid tokens
    """
    words_valid_invalid = {}

    # For each type (Valid/Invalid) have a counter that accounts for all tokenized entries for each respective response
    # Kinda acts like a guide to show you what words most likely appear in a valid or invalid response
    for col_name in list(set(data.type)):
        sub_df = data[data.type == col_name]
        words_valid_invalid[col_name] = []
        for row in sub_df.clean:
            for word in row:
                words_valid_invalid[col_name].append(word)
        words_valid_invalid[col_name] = ctr(words_valid_invalid[col_name])

    return words_valid_invalid

class Classifier:
    def __init__(self):
        """ 
            Creates a discrete classifier from a provided dataset
            using helper functions. The purpose is to indicate whether
            a provided prompt is valid or invalid for our application.
        """
        self.data = read_file()   
        self.valid_invalid_dict = build_classifier_dict(self.data)

        # Saved information for probability functions
        self.type_ctr = ctr(self.data.type)
        self.words_ctr = ctr([word for row in self.data.clean for word in row])

    def verify(self, prompt: str) -> int:
        """
            Main function: Verifies the prompt and returns a bool value on case
            Return: 1 for valid, 0 for invalid
        """
        tokenized_prompt = []
        tokenized_prompt.extend(prompt.lower().split())

        valid_case = self.Ps(tokenized_prompt, X='Valid')
        invalid_case = self.Ps(tokenized_prompt, X='Invalid')

        return 1 if valid_case > invalid_case else 0

    # Probability Helper functions   
    
    def Pa(self, X=''):
        return self.type_ctr[X] / len(self.data)

    def Pb(self, W='') -> float:
        if W not in self.words_ctr: return 0.000001
        return self.words_ctr[W] / sum(self.words_ctr.values())
        
    def Pba(self, W='', X='') -> float:
        t = self.valid_invalid_dict[X]
        if W not in t: return 0.0000001
        return t[W] / sum(t.values())

    def Pab(self, X='', W='') -> float:
        return self.Pba(W, X) * self.Pa(X) / self.Pb(W)
    
    def Ps(self, T, X=''):
        return np.prod([self.Pab(X=X, W=word) for word in T])
    
if __name__ == "__main__":
    classifier = Classifier()
    result = classifier.verify(prompt="Where is the zoo")
    
    print(result)
    print('Done!')
