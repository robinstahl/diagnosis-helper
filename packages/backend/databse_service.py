from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

def add_instance(input_text, generated_response_in, model_name):
    new_entry = Request(
        input_text=input_text,
        generatedResponse=generated_response_in,
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
    missed_tokens = request_instance.missed_tokens or {"MED": [], "DIAG": [], "TREAT": []}

    for category, new_tokens in tokens.items():
        if category in missed_tokens:
            missed_tokens[category].extend([token for token in new_tokens if token])

    request_instance.missed_tokens = missed_tokens
    db.session.commit()

def get_missed_tokens(id):
    request_instance = get_instance_by_id(Request, id)
    return request_instance.missed_tokens or {"Keine Daten verfügbar"}

def add_wrong_tokens(id, tokens):
    request_instance = get_instance_by_id(Request, id)
    wrong_tokens = request_instance.wrong_tokens or {"MED": [], "DIAG": [], "TREAT": []}

    for category, new_tokens in tokens.items():
        if category in wrong_tokens:
            wrong_tokens[category].extend([token for token in new_tokens if token])

    request_instance.wrong_tokens = wrong_tokens
    db.session.commit()

def get_wrong_tokens(id):
    request_instance = get_instance_by_id(Request, id)
    return request_instance.wrong_tokens or {"Keine Daten verfügbar"}

def get_all_requests():
    requests = Request.query.all()
    result = []
    for req in requests:
        result.append({
            'id': req.id,
            'input_text': req.input_text,
            'missed_tokens': req.missed_tokens or {"MED": [], "DIAG": [], "TREAT": []},
            'wrong_tokens': req.wrong_tokens or {"MED": [], "DIAG": [], "TREAT": []},
            'generatedResponse': req.generatedResponse,
            'model': req.model,
            'timestamp': req.timestamp.isoformat() if req.timestamp else None
        })
    return result

class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    input_text = db.Column(db.String(255), nullable=False)
    missed_tokens = db.Column('missedTokens', db.JSON, nullable=True)
    wrong_tokens = db.Column('wrongToken', db.JSON, nullable=True)
    generatedResponse = db.Column(db.JSON, nullable=True)
    model = db.Column(db.String, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Request {self.input_text}>'
