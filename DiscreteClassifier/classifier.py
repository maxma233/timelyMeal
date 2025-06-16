# %%
import pandas as pd
import numpy as np
from collections import Counter as ctr

# %%
data = pd.read_csv('timelymealsdiscreteannotated.csv', skiprows=1, names=['type','text', 'c3', 'c4', 'c5'], delimiter=',', encoding='ISO-8859-1')

# %%
data['clean'] = data.text.apply(lambda x: x.lower().split())

# %%
data.drop(['c3', 'c4', 'c5'], axis=1, inplace=True)

# %%
type_ctr = ctr(data.type)

type_ctr['Invalid']/len(data), type_ctr['Valid']/len(data)

# %%
test = data.sample(frac=0.1)
train = data[~data.index.isin(test.index)]

# %%
counter = ctr(train.type)

def Pa(X=''):
    return counter[X] / len(train)

# %%
words_ctr = ctr([word for row in train.clean for word in row])

def Pb(W=''):
    if W not in words_ctr: return 0.000001
    return words_ctr[W] / sum(words_ctr.values())

# %%
words_valid_invalid = {}

for col_name in list(set(data.type)):
    sub_df = train[train.type == col_name] #masking data type to only be ham sub-datatype
    words_valid_invalid[col_name] = []
    for row in sub_df.clean:
        for word in row:
            words_valid_invalid[col_name].append(word)
    words_valid_invalid[col_name] = ctr(words_valid_invalid[col_name])

def Pba(W='', X=''):
    t = words_valid_invalid[X]
    if W not in t: return 0.0000001
    return t[W] / sum(t.values())

# %%
def Pab(X='', W=''):
    return Pba(W, X) * Pa(X) / Pb(W)

# %%
def Ps(T, X=''):
    return np.prod([Pab(X=X, W=word) for word in T])


