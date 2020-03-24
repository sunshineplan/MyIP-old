#!/usr/bin/python3
# -*- coding: utf-8 -*-

import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

API = 'https://api.ipdata.co/{}?api-key=YOUR_API_KEY'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/query')
def query():
    remote = request.remote_addr
    ip = request.args.get('ip', '')
    if ip == '':
        respone = requests.get(API.format(remote))
    else:
        respone = requests.get(API.format(ip))
    return jsonify(respone.json()), respone.status_code


if __name__ == '__main__':
    app.run()
