from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from gelectralarge_service import process_text as gelectralarge_process_text
from tinybrollt_service import process_text as tinybrollt_process_text
from databse_service import init_db, add_instance, get_all_requests, add_missed_tokens, get_missed_tokens, add_wrong_tokens, get_wrong_tokens

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://diagnosis_user:password@localhost:5432/diagnosis_helper'

init_db(app)

@app.route('/classifyText/<model>', methods=['POST'])
def classify_text(model):
    data = request.json
    text = data.get('text')

    if model == 'TinyBrollt':
        generated_response = tinybrollt_process_text(text)
    elif model == 'GelectraLarge':
        generated_response = gelectralarge_process_text(text)
    else:
        return jsonify({"error": "Invalid model specified"}), 400

    new_entry_id = add_instance(text, generated_response, model)
    return jsonify({"id": new_entry_id, "model": model, "data": generated_response})

@app.route('/api/requests', methods=['GET'])
def get_requests():
    requests = get_all_requests()
    return jsonify(requests)

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
