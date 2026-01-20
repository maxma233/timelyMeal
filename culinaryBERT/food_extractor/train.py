import torch
from transformers import DistilBertForTokenClassification, TrainingArguments, Trainer, pipeline, BertModel, BertForTokenClassification
from data_utils import preprocess_bio_data, TokenClassificationDataset
from eval_utils import evaluate_model, build_conll_file

from eval_file_builder import EvalFileBuilder

def train(
    train_data_path: str,
    model_save_path: str,
    prop_train: float = 0.8,
    no_product_labels: bool = False,  # Align with judge_tags
    seed: int = 9,
    evaluate_after_training: bool = True,
    eval_file_path: str = "../data/eval/eval_labeled.json",
):
    """
    train_data_path: The path to your training data. Will be split 
    model_save_path: The path to where your model should be saved.
    prop_train: The proportion of your training data to be held out for 
    calculating the loss during training.
    no_product_labels: If False, removes Product tags from the training data
    and converts them to O's, so the model will not learn to extract Products.
    seed: Random seed to initialize the weights. I found good results with 9.
    evaluate_after_training: Whether to evaluate the model immediately after
    training and save the stats at `data/performance/{model_path}`.
    eval_file_path: Path to a custom eval file. Note this needs to be a 
    LabelStudio-formatted JSON to work correctly. (See format of included 
    eval file.)
    """
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

    with open(train_data_path) as f:
        data = f.read()

    max_length = 128  # Ensure consistent sequence length
    train_encodings, train_labels, val_encodings, val_labels, train_sentences, test_sentences = preprocess_bio_data(
        data, prop_train=prop_train
    )

    train_dataset = TokenClassificationDataset(train_encodings, train_labels, max_length=max_length)
    val_dataset = TokenClassificationDataset(val_encodings, val_labels, max_length=max_length)

    # if no_product_labels:
    train_dataset.unique_tags = ["B-DISH", "I-DISH", "O", "B-RESTAURANT", "I-RESTAURANT"]
    val_dataset.unique_tags = ["B-DISH", "I-DISH", "O", "B-RESTAURANT", "I-RESTAURANT"]

    # print()

    # model = DistilBertForTokenClassification.from_pretrained(
    #     "distilbert-base-cased", num_labels=len(train_dataset.unique_tags)
    # )

    model = BertForTokenClassification.from_pretrained("bert-base-cased", num_labels=len(train_dataset.unique_tags))

    model.config.id2label = {0: "B-DISH", 1: "I-DISH", 2: "O", 3: "B-RESTAURANT", 4: "I-RESTAURANT"}
    model.config.label2id = {"B-DISH": 0, "I-DISH": 1, "O": 2, "B-RESTAURANT": 3, "I-RESTAURANT": 4}  
    model.to(DEVICE)

    training_args = TrainingArguments(
        output_dir=model_save_path,
        num_train_epochs=7,
        per_device_train_batch_size=32,  # Reduced to debug
        per_device_eval_batch_size=16,
        do_eval=True,
        eval_steps=10,
        warmup_steps=50,
        weight_decay=0.01,
        overwrite_output_dir=True,
        seed=seed,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )

    trainer.train()
    trainer.save_model(model_save_path)

    # Build the eval file
    # sentences, labels = [], []
    # for sentence, label in test_sentences:
    #     sentences.append(sentence)
    #     labels.append(label)

    # sentences = [sentence for sentence, label in test_sentences]
    # labels = [label for sentence, label in test_sentences]
    # print('Sentences: ', sentences)
    # print('Labels: ', labels)

    # Build the evaluation file to reference
    # build_conll_file(file_location_path='../training/test.txt', sentence_list=sentences, label_list=labels)
    # eval_builder = EvalFileBuilder(data_file_path='../training/test.txt')
    # eval_builder.build_file()

    # if evaluate_after_training:
    #     evaluate_model(
    #         model_save_path,
    #         eval_file_path=eval_file_path,
    #         no_product_labels=no_product_labels,
    #     )
    #     print(
    #         "Model has been evaluated. Results are available at "
    #         f"../data/performance/{model_save_path.split('/')[-1]}."
    #     )

if __name__ == "__main__":
    train_data_path = "../training/unique_stuff.txt"
    model_save_path = "../models/culinaryBERT"
    prop_train = .8
    no_product_labels = True  # Align with judge_tags
    seed = 9
    evaluate_after_training = True
    eval_file_path: str = "../data/eval/eval_labeled.json"

    train(
        train_data_path=train_data_path,
        model_save_path=model_save_path,
        prop_train=prop_train,
        no_product_labels=no_product_labels,
        seed=seed,
        evaluate_after_training=evaluate_after_training,
    )