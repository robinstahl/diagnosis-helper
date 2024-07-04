import json
import time
import spacy
import torch
import torch.nn.functional as F
from flask_cors import CORS
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
from flask import Flask, jsonify, request

from tinybrollt_service import process_text as tinybrollt_process_text
from gelectralarge_service import process_text as gelectralarge_process_text
from databse_service import add_instance, get_instance_by_id, init_db, add_missed_tokens, get_missed_tokens, add_wrong_tokens, get_wrong_tokens

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://diagnosis_user:password@localhost:5432/diagnosis_helper'

# db = SQLAlchemy(app)
init_db(app)

@app.route('/test')
def test():
    add_instance("test", {"test": "test"}, "test")
    return {"hallo": "Hallo"}

@app.route('/classifyText/TinyBrollt', methods=['GET'])
def classify_text_tinybrollt():
    text = request.args.get('text', default='', type=str)
    erg = tinybrollt_process_text(text)
    id = add_instance(text, erg, "TinyBrollt")
    print("a")
    return jsonify({"id": id, "model": "TinyBrollt", "data": erg})

@app.route('/classifyText/GelectraLarge', methods=['GET'])
def classify_text_gelectralarge():
    text = request.args.get('text', default='', type=str)
    erg = gelectralarge_process_text(text)
    id = add_instance(text, erg, "GelectraLarge")
    return jsonify({"id": id, "model": "GelectraLarge", "data": erg})

@app.route('/api/requests', methods=['GET'])
def get_requests():
    requests = Request.query.all()
    result = [
        {
            'input_text': req.input_text,
            'missed_tokens': req.missed_tokens,
            'wrong_tokens': req.wrong_tokens,
            'generatedResponse': req.generatedResponse,
            'model': req.model,
            'timestamp': req.timestamp.isoformat()
        }
        for req in requests
    ]
    return jsonify(result)

@app.route('/database/missedToken', methods=['GET', 'PUT'])
def handle_missed_token():
    if request.method == 'GET':
        id = request.args.get('id', default=0, type=int)
        tokens = get_missed_tokens(id)
        return jsonify({"id": id, "missedTokens": tokens})
    elif request.method == 'PUT':
        data = request.json
        id = data.get('id')
        tokens = data.get('tokens')
        add_missed_tokens(id, tokens)
        return jsonify({"status": "success", "id": id, "tokens": tokens})

@app.route('/database/wrongToken', methods=['GET', 'PUT'])
def handle_wrong_token():
    if request.method == 'GET':
        id = request.args.get('id', default=0, type=int)
        tokens = get_wrong_tokens(id)
        return jsonify({"id": id, "wrongTokens": tokens})
    elif request.method == 'PUT':
        data = request.json
        id = data.get('id')
        tokens = data.get('tokens')
        add_wrong_tokens(id, tokens)
        return jsonify({"status": "success", "id": id, "tokens": tokens})

if __name__ == '__main__':
    app.run(debug=True)
