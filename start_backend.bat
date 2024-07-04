@echo off
cd packages\backend

set PYTHONUNBUFFERED=1
set FLASK_ENV=development
set FLASK_APP=api.py
set FLASK_DEBUG=1

call venv\Scripts\activate
flask run --host=0.0.0.0 --port=3030
