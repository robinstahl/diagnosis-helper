import torch.nn.functional as F
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
    if "MED" in response_text:
        label = "MED"
    elif "DIAG" in response_text:
        label = "DIAG"
    elif "TREAT" in response_text:
        label = "TREAT"
    else:
        label = "O"  # Default Label

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
        print(f"Word: {word}, Label: {label}")  # Debugging output
        if label == "MED":
            results["MED"].append(word)
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
