# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import json
import uuid
import os
import cloud_vision as cv
import elastic_search as es
from os import listdir
from os.path import dirname, isfile, join
from flask import Flask, abort, render_template, request, Response, send_from_directory, url_for

app = Flask(__name__, static_folder='static')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

###############################################
# Start of form code (unrelated to application)
###############################################

@app.route('/form')
def form():
    return render_template('form.html')

@app.route('/submitted', methods=['POST'])
def submitted_form():
    name = request.form['name']
    email = request.form['email']
    site = request.form['site_url']
    comments = request.form['comments']

    return render_template(
        'submitted_form.html',
        name=name,
        email=email,
        site=site,
        comments=comments)

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500

#############################################
# End of form code (unrelated to application)
#############################################

@app.route('/')
def index():
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post action="/api/courses/aaaaa/files" enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''

@app.route('/api/courses', methods=['GET', 'POST'])
def courses():
    if request.method == 'GET':
        '''
        js = [
               { 'name' : 'get_test_name',
                 'course_id' : 'get_test_course_id', 
                 'thumbnail' : 'get_test_thumbnail'},
               { 'name' : 'get_test_name',
                 'course_id' : 'get_test_course_id', 
                 'thumbnail' : 'get_test_thumbnail'
               }
             ]
        '''
        js = []
        for course in es.get_courses():
            js.append({ 'name' : course[1], 
                        'course_id' : course[0],
                        'thumbnail' : 'TODO use actual thumbnail'
                      })
        return Response(json.dumps(js),  mimetype='application/json')

    elif request.method == 'POST':
        '''
        js = [ { 'name' : 'post_test_name',
                 'course_id' : 'post_test_course_id', 
                 'thumbnail' : 'post_test_thumbnail'
             } ]
        '''
        generated_id = es.create_course(request.data)
        js = {
                'name' : request.data,
                'course_id' : generated_id,
                'thumbnail' : 'TODO use actual thumbnail'
             }
        return Response(json.dumps(js),  mimetype='application/json')

@app.route('/api/courses/<course_id>/files', methods=['POST'])
def upload_file(course_id):
    if request.method == 'POST':
        if 'file' not in request.files:
            return response(400, "No file chosen", 'application/json')
        file = request.files['file']
        if file.filename == '':
            return response(400, "No file chosen", 'application/json')
        if file and allowed_file(file.filename):
            file_id = uuid.uuid4()
            file_path = app.static_folder + '\\files\\' + str(file_id)
            if not os.path.exists(file_path):
                os.makedirs(file_path)
            file.save(join(file_path, file.filename))
            print(file)
            return response(201, "Successfully uploaded file to server", 'application/json')

@app.route('/api/files/<file_id>', methods=['GET'])
def get_file(file_id):
    if request.method == 'GET':
        path = app.static_folder + '\\files\\' + file_id
        if not os.path.exists(file_path):
            return response(400, "Specified file id does not exist", 'application/json')
        files = [f for f in listdir(path) if isfile(join(path, f))]
        if len(files) == 0:
            return response(400, "Server does not have a file with specified id", 'application/json')
        elif len(files) >= 2:
            return response(500, "Server has more than one file stored under specified id" , 'application/json')
        return send_from_directory(path, filename=files[0])

@app.route('/api/courses/<course_id>/files?search=<search_string>', methods=['GET'])
def search_files(course_id, search_string):
    js = []
    for file in es.search(course_id, search_string):
        js.append({ 'name' : course[1], 
                    'course_id' : course[0],
                    'thumbnail' : 'TODO use actual thumbnail'
                  })
    return Response(json.dumps(js),  mimetype='application/json')

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def response(status_code, message, mime_type):
    return Response("{'message':" + message + "}", status=status_code, mimetype=mime_type)

