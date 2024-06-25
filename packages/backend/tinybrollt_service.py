import torch.nn.functional as F
from flask import Flask, jsonify, request
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("MSey/tiny_BROLLLT_0001.1")
model = AutoModelForCausalLM.from_pretrained("MSey/tiny_BROLLLT_0001.1")

def context_text(text):
    return f"### Context\n{text}\n\n### Answer"

def classify_word(word):
    prompt = context_text(word)
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        inputs['input_ids'],
        max_length=50,            # Maximale Länge der generierten Sequenz
        num_return_sequences=1,   # Anzahl der zu generierenden Sequenzen
        temperature=0.7,          # Steuert die Zufälligkeit der Vorhersagen (niedriger = deterministischer)
        top_k=50,                 # Wählt nur die K wahrscheinlichsten nächsten Wörter
        top_p=0.9,                # Wählt aus den Wörtern, deren kumulative Wahrscheinlichkeit mindestens P beträgt
        do_sample=True            # Sampling wird verwendet, um die nächste Token auszuwählen
    )
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extraktion der Labels MED, DIAG, TREAT aus der generierten Antwort
    label = "O"  # Default Label
    if "MED" in response_text:
        index = response_text.index("MED")
        prefix = response_text[max(0, index-3):index]
        label = prefix + "MED"
    elif "DIAG" in response_text:
        index = response_text.index("DIAG")
        prefix = response_text[max(0, index-3):index]
        label = prefix + "DIAG"
    elif "TREAT" in response_text:
        index = response_text.index("TREAT")
        prefix = response_text[max(0, index-3):index]
        label = prefix + "TREAT"

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
        print("word classified: " + label)
        if label.endswith("MED") or label.endswith("DIAG") or label.endswith("TREAT"):
            results[label[-5:]].append(word + "->" + label)

    return {
        "input": text,
        "MED": results["MED"],
        "DIAG": results["DIAG"],
        "TREAT": results["TREAT"]
    }
