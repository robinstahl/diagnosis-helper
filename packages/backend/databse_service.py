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
        generatedResponse=[generated_response_str],  
        model=model_name,
        timestamp=datetime.now().astimezone()
    )
    db.session.add(new_entry)
    db.session.commit()
    return new_entry.id

def get_instance_by_id(model, id):
    return model.query.get(id)

def get_all_instances(model):
    return model.query.all()

class Request(db.Model):
    __tablename__ = 'requests'
    
    id = db.Column(db.Integer, primary_key=True)
    input_text = db.Column(db.String(255), nullable=False)
    missed_tokens = db.Column('missedTokens', ARRAY(db.String), nullable=True)
    wrong_tokens = db.Column('wrongToken', ARRAY(db.String), nullable=True)
    generatedResponse = db.Column(db.Text, nullable=True) 
    model = db.Column(db.String, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Request {self.input_text}>'
