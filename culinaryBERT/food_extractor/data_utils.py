import json
from typing import Dict, List

import torch
from torch.utils.data import Dataset
import transformers
from transformers import DistilBertTokenizerFast, BertTokenizerFast
import random

# BIO Tags
UNIQUE_TAGS = ["B-DISH", "I-DISH", "O", 'B-RESTAURANT', 'I-RESTAURANT']
tag2id = dict(zip(UNIQUE_TAGS, [0, 1, 2, 3, 4]))
id2tag = {id: tag for tag, id in tag2id.items()}

# Instantiate tokenizer
bert_tokenizer = BertTokenizerFast.from_pretrained('bert-base-cased')

def flatten(l: List[list]) -> list:
    """
        Takes a list containing sublists and combines them together by
        'flattening' all of the lists into one single list
    """
    # (X) for y in l for X in y
    return [item for sublist in l for item in sublist]

def pad_list(labels: list, encodings_len: int) -> list:
    """
        Takes an individual tag list and pads it to match the length of 
        the token encodings.
    """
    label_len = len(labels)
    if label_len < encodings_len:
        n_paddings = encodings_len - label_len
        padded = labels + ([0] * n_paddings)
        return padded
    return labels

def encode_tags(tags: List[str], encodings_len: int, tag2id: dict):
    labels = [pad_list([tag2id[tag] for tag in doc], encodings_len) for doc in tags]
    return labels

def get_words_and_labels(docs: list):
    words, labels = [], []
    for doc in docs:
        if not doc:
            continue
        doc = doc.strip()
        lines = doc.split("\n")
        doc_words, doc_labels = [], []
        for line in lines:
            parts = line.split()
            if len(parts) < 2:
                continue  # Skip malformed lines
            doc_words.append(parts[0])
            doc_labels.append(parts[-1])
        words.append(doc_words)
        labels.append(doc_labels)
    return words, labels

# Unsure for use case
# def detokenize(tokenizer: DistilBertTokenizerFast, words_list: List[list]):
#     detokenized = []
#     for words in words_list:
#         try:
#             token_ids = [tokenizer.convert_tokens_to_ids(word) for word in words if word in tokenizer.vocab]
#             detokenized.append(tokenizer.decode(token_ids))
#         except Exception as e:
#             print(f"Error detokenizing {words}: {e}")
#             detokenized.append("")
#     return detokenized


def preprocess_bio_data(data, prop_train=0.8, max_length=128):
    """
        
        Args:
        data (str):
    
    """

    # tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-cased")
    tokenizer = bert_tokenizer
    label_to_id = {"B-DISH": 0, "I-DISH": 1, "O": 2, "B-RESTAURANT": 3, "I-RESTAURANT": 4}

    # Parse BIO format (e.g., "I O\nate O\npizza B-DISH\n\n")
    sentences = []
    current_sentence = []
    current_labels = []

    # Purpose: Corral all sentences into a list by tupling with their labels
    for line in data.splitlines():
        data_line = line.strip()
        if data_line:
            # Ex: pizza, B-DISH
            token, label = data_line.split()
            current_sentence.append(token)
            current_labels.append(label)
        else:
            # The sentence is complete, '\n' reached
            if current_sentence:
                # Add the sentence and labels (['I', 'ate', 'pizza'], ['O', 'O', 'B-DISH'])
                sentences.append((current_sentence, current_labels))
                # Reset for new sentence
                current_sentence = []
                current_labels = []
    if current_sentence:
        # Add final sentence if did not terminate with a '\n'
        sentences.append((current_sentence, current_labels))

    encodings = []
    labels = []
    for tokens, token_labels in sentences:
        # Tokenize the sentence (tokens)
        tokenized = tokenizer(
            tokens,
            is_split_into_words=True,
            truncation=True,
            padding='max_length',
            max_length=max_length,
            return_offsets_mapping=True
        )

        # Align labels with subword tokens
        aligned_labels = []
        word_ids = tokenized.word_ids()

        # print(word_ids)

        for i, word_id in enumerate(word_ids):
            if word_id is None:  # Special tokens ([CLS], [SEP], [PAD], [MSK], [UNK])
                aligned_labels.append(-100)
            else:
                # Getting the label that correlates to the word id and then 
                # translating that to the text version of the label
                aligned_labels.append(label_to_id[token_labels[word_id]])

        # These will be both reflect each other [0] in one list correlates to [0] in the other
        encodings.append({
            'input_ids': tokenized['input_ids'],
            'attention_mask': tokenized['attention_mask']
        })
        labels.append(aligned_labels)

    # Split into train and validation
    # NOTE: Need to create some transparency for this step to pass to the eval file builder
    
    # Gets a list containing the indices from 0 up to the length of
    # the sentences list - 1 AKA the end 
    list_index_vals = list(range(len(sentences)))

    # Shuffle all the lists
    # Approach: get the indexes from the sentences list and shuffle them
    # then, apply those changes to each list
    # Ex: [0, 1, 2] => [2, 0, 1]


    random.seed(42)  # For reproducibility
    random.shuffle(list_index_vals)

    # Shuffle all of the lists
    # Now with the list_index_vals, it will pull the value correlating
    # at the shuffled index (i) by building a new list
    sentences = [sentences[i] for i in list_index_vals]
    encodings = [encodings[i] for i in list_index_vals]
    labels = [labels[i] for i in list_index_vals]

    # Split it up
    split_idx = int(len(sentences) * prop_train)
    train_encodings = encodings[:split_idx]
    val_encodings = encodings[split_idx:]
    train_labels = labels[:split_idx]
    val_labels = labels[split_idx:]
    
    train_sentences = sentences[:split_idx]
    test_sentences = sentences[split_idx:]
    # print("Test Sentences: ", test_sentences)

    return train_encodings, train_labels, val_encodings, val_labels, train_sentences, test_sentences


def ls_spans_to_bio(ls_data_path: str, save_path: str):
    with open(ls_data_path) as f:
        examples = json.load(f)
    tokenizer = bert_tokenizer
    seqs, labels = [], []
    for example in examples:
        try:
            seqs.append(example["data"]["text"])
            labels.append(example["completions"][0]["result"])
        except (KeyError, IndexError):
            print(f"Skipping invalid example: {example}")
            continue
    encodings = tokenizer(
        seqs,
        return_offsets_mapping=True,
        padding=False,
        truncation=True,
        add_special_tokens=False,
    )
    bio_labels = _spans_to_bio(labels, encodings)
    tokens = [enc.tokens for enc in encodings.encodings]
    with open(save_path, "w") as f:
        for toks, labs in zip(tokens, bio_labels):
            lines = [f"{t}\t{l}" for t, l in zip(toks, labs)]
            entry = "\n".join(lines)
            f.write(entry + "\n\n")
    return tokens, bio_labels


def _spans_to_bio(labels: List[List[dict]], encodings):
    bio_labels = []
    for enc, label_set in zip(encodings.encodings, labels):
        tok_starts = [tup[0] for tup in enc.offsets]
        tok_ends = [tup[1] for tup in enc.offsets]
        token_labels = ["O"] * len(enc)
        for label in label_set:
            entry = label["value"]
            start, end, ent_type = entry["start"], entry["end"], entry["labels"][0]
            if ent_type != "DISH" and ent_type != 'RESTAURANT':
                continue  # Skip on proc on dish and restaurant entities
            try:
                start_token = tok_starts.index(start)
                end_token = tok_ends.index(end) + 1
                if start_token == end_token + 1:
                    token_labels[start_token] = f"B-{ent_type}"
                else:
                    n_tokens = end_token - start_token
                    token_labels[start_token:end_token] = [f"I-{ent_type}"] * n_tokens
                    token_labels[start_token] = f"B-{ent_type}"
            except ValueError:
                print(f"Skipping invalid span: {start}-{end}")
                continue
        bio_labels.append(token_labels)
    return bio_labels


class TokenClassificationDataset(Dataset):
    def __init__(self, encodings, labels, max_length=128):
        self.encodings = encodings  # List of dicts: [{'input_ids': [...], 'attention_mask': [...]}, ...]
        self.labels = labels  # List of label lists: [[0, 1, 2, -100, ...], ...]
        self.max_length = max_length
        self.unique_tags = ["B-DISH", "I-DISH", "O", "B-RESTAURANT", "I-RESTAURANT"]  # Set in train function

    def __getitem__(self, idx):
        # Get the encoding dictionary for this sample
        encoding = self.encodings[idx]
        labels = self.labels[idx]

        # Convert to tensors
        item = {key: torch.tensor(val) for key, val in encoding.items()}
        item['labels'] = torch.tensor(labels)

        # Verify and pad to max_length
        seq_length = item['input_ids'].size(0)
        if seq_length != self.max_length:
            print(f"Warning: Sample {idx} has length {seq_length}, padding to {self.max_length}")
            padding_length = self.max_length - seq_length
            item['input_ids'] = torch.nn.functional.pad(item['input_ids'], (0, padding_length), value=0)
            item['attention_mask'] = torch.nn.functional.pad(item['attention_mask'], (0, padding_length), value=0)
            item['labels'] = torch.nn.functional.pad(item['labels'], (0, padding_length), value=-100)

        # Verify shapes
        assert item['input_ids'].size(0) == self.max_length, f"input_ids shape: {item['input_ids'].size(0)}"
        assert item['attention_mask'].size(0) == self.max_length, f"attention_mask shape: {item['attention_mask'].size(0)}"
        assert item['labels'].size(0) == self.max_length, f"labels shape: {item['labels'].size(0)}"

        return item

    def __len__(self):
        return len(self.labels)