import torch
from flask import Flask, jsonify, request
from transformers import AutoTokenizer, ElectraForTokenClassification

tokenizer = AutoTokenizer.from_pretrained("2ndBestKiller/gelectra-large")
model = ElectraForTokenClassification.from_pretrained("2ndBestKiller/gelectra-large")


label_map = {0: 'O', 6: 'MED', 2: 'DIAG', 10: 'TREAT'}

def classify_word(word):
    inputs = tokenizer(word, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits
    predictions = torch.argmax(logits, dim=-1)
    predicted_token_class = predictions[0][0].item()

    label = label_map.get(predicted_token_class, 'O')
    print(f"Word: {word}, Prediction: {predicted_token_class}, Label: {label}")  # Debugging output

    return label

def process_text(text):

    words = text.split()

    results = {
        "MED": [],
        "DIAG": [],
        "TREAT": []
    }

    for word in words:
        label = classify_word(word)
        print("word classified: " + label)  # Debugging output
        if label == "MED":
            results["MED"].append(word )
        elif label == "DIAG":
            results["DIAG"].append(word)
        elif label == "TREAT":
            results["TREAT"].append(word)

    return {
        "input": text,
        "MED": results["MED"],
        "DIAG": results["DIAG"],
        "TREAT": results["TREAT"]
    }
