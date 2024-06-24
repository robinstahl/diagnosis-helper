#!/bin/bash
cd backend
export PYTHONUNBUFFERED=1
export FLASK_ENV=development
export FLASK_APP=api.py
export FLASK_DEBUG=1
source venv/bin/activate
flask run --host=0.0.0.0 --port=3030
