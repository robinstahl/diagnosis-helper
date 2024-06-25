import time
import spacy
import torch
import torch.nn.functional as F

from tinybrollt_service import process_text as tinybrollt_process_text
from gelectralarge_service import process_text as gelectralarge_process_text
from databse_service import add_instance,get_instance_by_id,init_db

from flask import Flask, jsonify,request

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://diagnosis_user:password@localhost:3031/diagnosis_helper'


init_db(app)

@app.route('/test')
def test():
    add_instance("test",{"test":"test"},"test")
    return {"hallo":"Hallo"}

@app.route('/classifyText/TinyBrollt', methods=['GET'])
def classify_text_tinybrollt():
    text = request.args.get('text', default='', type=str)
    erg = tinybrollt_process_text(text)
    id =  add_instance(text,erg,"TinyBrollt")
    return jsonify({"id": id,"model": "TinyBrollt", "data": erg})

@app.route('/classifyText/GelectraLarge', methods=['GET'])
def classify_text_gelectralarge():
    text = request.args.get('text', default='', type=str)
    erg = gelectralarge_process_text(text)
    id = add_instance(erg,"GelectraLarge")
    return jsonify({"id": id,"model":"GelectraLarge", "data": erg})

#@app.route('/database/missedToken') #GET und PUT
#@app.route('/database/wrongToken')  #GET und PUT



if __name__ == '__main__':
    app.run(debug=True)
