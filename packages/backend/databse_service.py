import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

def add_instance(input_text, generated_response_in, model_name):
    generated_response_str = json.dumps(generated_response_in)
    new_entry = Request(
        input_text=input_text,
        generatedResponse=generated_response_str,
        model=model_name,
        timestamp=datetime.now().astimezone()
    )
    db.session.add(new_entry)
    db.session.commit()
    return new_entry.id

def get_instance_by_id(model, id):
    return model.query.get(id)

def get_all_instances():
    return Request.query.all()

def add_missed_tokens(id, tokens):
    request_instance = get_instance_by_id(Request, id)
    try:
        missed_tokens = json.loads(request_instance.missed_tokens) if request_instance.missed_tokens else {"MED": [], "DIAG": [], "TREAT": []}
    except json.JSONDecodeError:
        missed_tokens = {"MED": [], "DIAG": [], "TREAT": []}

    for category, new_tokens in tokens.items():
        if category in missed_tokens:
            missed_tokens[category].extend(new_tokens)
    request_instance.missed_tokens = json.dumps(missed_tokens)
    db.session.commit()

def get_missed_tokens(id):
    request_instance = get_instance_by_id(Request, id)
    try:
        return json.loads(request_instance.missed_tokens) if request_instance.missed_tokens else {"MED": [], "DIAG": [], "TREAT": []}
    except json.JSONDecodeError:
        return {"MED": [], "DIAG": [], "TREAT": []}

def add_wrong_tokens(id, tokens):
    request_instance = get_instance_by_id(Request, id)
    try:
        wrong_tokens = json.loads(request_instance.wrong_tokens) if request_instance.wrong_tokens else {"MED": [], "DIAG": [], "TREAT": []}
    except json.JSONDecodeError:
        wrong_tokens = {"MED": [], "DIAG": [], "TREAT": []}

    for category, new_tokens in tokens.items():
        if category in wrong_tokens:
            wrong_tokens[category].extend(new_tokens)
    request_instance.wrong_tokens = json.dumps(wrong_tokens)
    db.session.commit()

def get_wrong_tokens(id):
    request_instance = get_instance_by_id(Request, id)
    try:
        return json.loads(request_instance.wrong_tokens) if request_instance.wrong_tokens else {"MED": [], "DIAG": [], "TREAT": []}
    except json.JSONDecodeError:
        return {"MED": [], "DIAG": [], "TREAT": []}

def get_all_requests():
    requests = Request.query.all()
    result = []
    for req in requests:
        try:
            missed_tokens = json.loads(req.missed_tokens) if req.missed_tokens else {"MED": [], "DIAG": [], "TREAT": []}
        except json.JSONDecodeError:
            missed_tokens = {"MED": [], "DIAG": [], "TREAT": []}

        try:
            wrong_tokens = json.loads(req.wrong_tokens) if req.wrong_tokens else {"MED": [], "DIAG": [], "TREAT": []}
        except json.JSONDecodeError:
            wrong_tokens = {"MED": [], "DIAG": [], "TREAT": []}

        result.append({
            'id': req.id,
            'input_text': req.input_text,
            'missed_tokens': missed_tokens,
            'wrong_tokens': wrong_tokens,
            'generatedResponse': req.generatedResponse,
            'model': req.model,
            'timestamp': req.timestamp.isoformat() if req.timestamp else None
        })
    return result

class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    input_text = db.Column(db.String(255), nullable=False)
    missed_tokens = db.Column('missedTokens', db.Text, nullable=True)
    wrong_tokens = db.Column('wrongToken', db.Text, nullable=True)
    generatedResponse = db.Column(db.Text, nullable=True)
    model = db.Column(db.String, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Request {self.input_text}>'
