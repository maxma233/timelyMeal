from collections import Counter
import json
import logging
import os
from typing import List

import pandas as pd

# from food_extractor.food_model import FoodModel
from food_model import FoodModel

logger = logging.getLogger("errors")

def is_between(x, y, z):
    """Calculates whether x is between y and z."""
    return y <= x <= z


# It is possible for some tags to satisfy more than one of these, therefore
# it's important to return after getting one True result rather than counting all Trues.
def is_completely_inside(ML, TL):
    """Returns a bool for whether the model label is inside the true label.
    (Starts too late and ends too late.)"""
    cond_1 = is_between(ML["start"], TL["start"], TL["end"])
    cond_2 = is_between(ML["end"], TL["start"], TL["end"])
    return cond_1 and cond_2


def engulfs_true_label(ML, TL):
    """Returns a bool for whether the true label is inside the model label.
    (Starts too early, ends too late.)"""
    cond_1 = is_between(TL["start"], ML["start"], ML["end"])
    cond_2 = is_between(TL["end"], ML["start"], ML["end"])
    return cond_1 and cond_2


def starts_early_ends_early(ML, TL):
    """Returns a bool for whether the model label starts earlier or at 
    the same time as the true label but ends too early."""
    cond_1 = ML["start"] <= TL["start"]
    cond_2 = is_between(ML["end"], TL["start"], TL["end"])
    return cond_1 and cond_2


def starts_late_ends_late(ML, TL):
    """Returns a bool for whether the model label starts later or at 
    the same time as the true label but ends too late."""
    cond_1 = is_between(ML["start"], TL["start"], TL["end"])
    cond_2 = ML["end"] >= TL["end"]
    return cond_1 and cond_2


def is_overlap(ML: dict, true_labels: list) -> bool:

    """
    Calculate whether this model label has a span overlap with a 
    true label. For calculating partially overlapped labels.
    """

    partial_overlap_conds = [
        is_completely_inside,
        engulfs_true_label,
        starts_early_ends_early,
        starts_late_ends_late,
    ]

    for TL in true_labels:
        for cond in partial_overlap_conds:
            if cond(ML, TL):
                logger.info(
                    f"Partial overlap: {cond.__name__}. Predicted "
                    f"[{ML['text']}], actual entity was [{TL['text']}]"
                )
                return True

    return False


def count_misses(tag, model_labels: list, true_labels: list) -> int:

    """Count misses for this tag. Misses are strict and don't include
    partial matches or misclassified tags."""

    misses = 0
    for label in true_labels[tag]:
        if label not in model_labels[tag]:
            misses += 1
            logger.info(f"Missed entity: {label['text']}")

    return misses

def judge_tags(tag: str, model_labels: dict, true_labels: dict, text: str):
    """
    Judges the model's tags against the annotator-labeled tags for a single doc,
    specifically for the DISH tag.
    """
    if tag != "DISH":
        raise ValueError("This method only supports the DISH tag")

    label_classes = []
    true_labels_for_tag = true_labels.get(tag, [])

    for label in model_labels.get(tag, []):
        pred_text = label["text"]

        if label in true_labels_for_tag:
            label_class = "correctly classified, total overlap"
        elif is_overlap(label, true_labels_for_tag):
            label_class = "correctly classified, partial overlap"
        else:
            label_class = "not a named entity"
            logging.info(f"Not a named entity: [{pred_text}] (label: {tag})")

        label_classes.append(label_class)

    # Convert to dict of counts
    results = Counter(label_classes)
    results["missed"] = count_misses(tag, model_labels, true_labels)

    return results

def judge_perf(perf_dict: dict):
    perf = []
    ent_types = perf_dict.keys()
    for ent in ent_types:
        missed = perf_dict[ent]["missed"]
        correct_total = perf_dict[ent]["correctly classified, total overlap"]
        correct_partial = perf_dict[ent]["correctly classified, partial overlap"]
        not_entity = perf_dict[ent]["not a named entity"]
        prec_denom = correct_total + correct_partial + not_entity
        rec_denom = correct_total + correct_partial + missed
        if prec_denom == 0:
            prec_strict, prec_loose = 0, 0
        else:
            prec_strict = correct_total / prec_denom
            prec_loose = (correct_total + correct_partial) / prec_denom
        if rec_denom == 0:
            rec_strict, rec_loose = 0, 0
        else:
            rec_strict = correct_total / rec_denom
            rec_loose = (correct_total + correct_partial) / rec_denom
        perf.append([prec_strict, prec_loose, rec_strict, rec_loose])
    perf_df = pd.DataFrame(perf, index=ent_types, columns=["p_strict", "p_loose", "r_strict", "r_loose"])
    return perf_df.round(3)


def reformat_true_labels(completions: list) -> dict:
    reformatted = {"DISH": [], "RESTAURANT": []}
    try:
        labels = completions[0]["result"]
    except (IndexError, KeyError):
        return reformatted
    for label in labels:
        try:
            info = label["value"]
            ent_type = info["labels"][0]
            if ent_type != "RESTAURANT" and ent_type != "DISH":
                continue
            reformatted.setdefault(ent_type, []).append(
                {"start": info["start"], "end": info["end"], "text": info["text"]}
            )
        except (KeyError, IndexError):
            continue
    return reformatted


def reformat_model_labels(entities: dict, no_product_labels: bool = False) -> dict:
    reformatted = {"DISH": [], "RESTAURANT": []}
    for ent_type in entities:
        if ent_type != "RESTAURANT" and ent_type != "DISH":
            continue
        ents = entities[ent_type]
        for ent in ents:
            try:
                start, end = ent["span"]
                reformatted[ent_type].append(
                    {"start": start, "end": end, "text": ent["text"]}
                )
            except (KeyError, TypeError):
                continue
    return reformatted


def evaluate_model(
    model_path: str, eval_file_path: str, no_product_labels: bool = False
):
    model_dir = model_path.split("/")[-1]
    performance_dir = "../data/performance"
    eval_destination = os.path.join(performance_dir, model_dir)
    os.makedirs(eval_destination, exist_ok=True)
    try:
        with open(eval_file_path) as f:
            examples = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        logger.error(f"Failed to load eval file {eval_file_path}: {e}")
        return
    logging.basicConfig(
        filename=os.path.join(eval_destination, "preds.log"),
        format="%(message)s",
        filemode="w",
    )
    logger.setLevel("INFO")
    try:
        model = FoodModel(model_path, no_product_labels=no_product_labels)
    except Exception as e:
        logger.error(f"Failed to load model {model_path}: {e}")
        return
    tags = ["DISH", "RESTAURANT"]
    perf_dict = {"DISH": Counter(), "RESTAURANT": Counter()}
    for example in examples:
        try:
            text = example["data"]["text"]
            logger.info(f"TEXT: {text}")
            true_labels = reformat_true_labels(example["completions"], no_product_labels)
            model_labels = reformat_model_labels(model.extract_foods(text)[0], no_product_labels)
            for tag in tags:
                perf_dict[tag] += judge_tags(tag, model_labels, true_labels, text)
            logger.info("")
        except Exception as e:
            logger.error(f"Error processing example: {e}")
            continue
    perf_df = pd.DataFrame(judge_perf(perf_dict))
    perf_df.to_csv(os.path.join(eval_destination, "eval_PRF1.csv"))
    raw_stats = pd.DataFrame(perf_dict)
    raw_stats.to_csv(os.path.join(eval_destination, "eval_raw_stats.csv"))
    totals_df = raw_stats.drop("missed", errors="ignore").T
    totals_df["total_labels"] = totals_df.sum(axis=1)
    for col in totals_df.columns:
        if col != "total_labels":
            totals_df[col] = totals_df[col] / totals_df["total_labels"] * 100.0
    totals_df = totals_df.round(1)
    totals_df.to_csv(os.path.join(eval_destination, "eval_percentages.csv"))