import torch.nn.functional as F

from flask import Flask, jsonify,request

from transformers import AutoTokenizer, AutoModelForTokenClassification

tokenizer = AutoTokenizer.from_pretrained("2ndBestKiller/gelectra-large")
model = AutoModelForTokenClassification.from_pretrained("2ndBestKiller/gelectra-large")

def process_text(text):
    
    return model.generate("Der patient hat Arschkrebs")