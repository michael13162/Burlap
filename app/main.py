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
from cStringIO import StringIO
import io
import os
import cloud_vision as cv
import elastic_search as es
import docx2txt
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from os import listdir
from os.path import dirname, isfile, join
from flask import Flask, abort, render_template, request, Response, send_from_directory, url_for

app = Flask(__name__, static_folder='static')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
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

@app.route('/api/courses', methods=['GET', 'POST', 'DELETE'])
def courses():
    if request.method == 'GET':
        js = []
        for course in es.get_courses():
            js.append({ 'name' : course[1], 
                        'course_id' : course[0],
                        'type' : extract_extension(course[1])
                      })
        return Response(json.dumps(js),  mimetype='application/json')

    elif request.method == 'POST':
        course_name = request.get_json()['name']
        generated_id = es.create_course(course_name)
        js = {
                'name' : course_name,
                'course_id' : generated_id,
                'type' : extract_extension(course_name)
             }
        return Response(json.dumps(js),  mimetype='application/json')
    elif request.method == 'DELETE':
        course_id = request.get_json()['course_id']
        if es.delete_course(course_id):
            return ('', 204)
        else:
            return message_response(400, "Deleting course failed", "application/json")


@app.route('/api/courses/<course_id>/files', methods=['POST'])
def upload_file(course_id):
    if request.method == 'POST':
        if 'file' not in request.files:
            return message_response(400, "No file chosen", 'application/json')
        file = request.files['file']
        if file.filename == '':
            return message_response(400, "No file chosen", 'application/json')
        if file and allowed_file(file.filename):
            file_id = uuid.uuid4()
            file_path = os.path.join(app.static_folder, "files", str(file_id))
            if not os.path.exists(file_path):
                os.makedirs(file_path)
            file.save(join(file_path, file.filename))
            if file.mimetype == 'text/plain':
                text = read_txt_file(file_path, file.filename)
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received text file and uploaded to elasticsearch", "application/json")
            elif file.mimetype == 'application/pdf':
                text = read_pdf_file(file_path, file.filename)
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received pdf file and uploaded to elasticsearch", "application/json")
            elif file.mimetype == 'image/png':
                content = read_img_file(file_path, file.filename)
                text = ' '.join(cv.get_doc_text_strings(content))
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received png file and uploaded to elasticsearch", "application/json")
            elif file.mimetype == 'image/jpg':
                content = read_img_file(file_path, file.filename)
                text = ' '.join(cv.get_doc_text_strings(content))
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received png file and uploaded to elasticsearch", "application/json")
            elif file.mimetype == 'image/jpeg':
                content = read_img_file(file_path, file.filename)
                text = ' '.join(cv.get_doc_text_strings(content))
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received png file and uploaded to elasticsearch", "application/json")
            elif file.mimetype == 'image/bmp':
                content = read_img_file(file_path, file.filename)
                text = ' '.join(cv.get_doc_text_strings(content))
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received png file and uploaded to elasticsearch", "application/json")
            elif file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                text = read_docx_file(file_path, file.filename)
                images_path = os.path.join(file_path, "images")
                if os.path.exists(images_path):
                    files = [f for f in listdir(images_path) if isfile(join(images_path, f))]
                    image_bytes = read_img_file(images_path, files[0])
                    text += ' '
                    text += ' '.join(cv.get_doc_text_strings(image_bytes))
                es.create_document(course_id, file.filename, file_id, text)
                return message_response(201, "Received docx file and uploaded to elasticsearch", "application/json")
                pass
            else:
                return message_response(400, "Uploaded file has an unrecognized mimetype", 'application/json')
        else:
            return message_response(400, "Uploaded file does not have a supported extension", 'application/json')

@app.route('/api/files/<file_id>', methods=['GET'])
def get_file(file_id):
    if request.method == 'GET':
        path = os.path.join(app.static_folder, "files", str(file_id))
        if not os.path.exists(path):
            return message_response(400, "Specified file id does not exist", 'application/json')
        files = [f for f in listdir(path) if isfile(join(path, f))]
        if len(files) == 0:
            return message_response(400, "Server does not have a file with specified id", 'application/json')
        elif len(files) >= 2:
            return message_response(500, "Server has more than one file stored under specified id" , 'application/json')
        return send_from_directory(path, filename=files[0])

@app.route('/api/courses/<course_id>/files', methods=['GET'])
def search_files(course_id):
    search_string = request.args.get('search', default='', type = str)
    js = []
    for file_object in es.search(course_id, search_string):
        js.append({ 'name' : file_object[1], 
                    'course_id' : file_object[0],
                    'type' : extract_extension(file_object[1])
                  })
    return Response(json.dumps(js),  mimetype='application/json')

@app.route('/api/courses/<course_id>', methods=['GET'])
def get_all_files(course_id):
    js = []
    for file_object in es.get_course_files(course_id):
        js.append({ 'name' : file_object[1], 
                    'file_id' : file_object[0],
                    'type' : extract_extension(file_object[1])
                  })
    return Response(json.dumps(js),  mimetype='application/json')

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'bmp', 'mp4', 'docx'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_extension(filename):
    return filename.rsplit('.', 1)[1].lower()

def read_txt_file(file_path, file_name):
    return file(os.path.join(file_path, file_name), 'r').read()

def read_pdf_file(file_path, file_name):
    pagenums = set()
    output = StringIO()
    manager = PDFResourceManager()
    converter = TextConverter(manager, output, laparams=LAParams())
    interpreter = PDFPageInterpreter(manager, converter)
    infile = file(os.path.join(file_path, file_name), 'rb')
    for page in PDFPage.get_pages(infile, pagenums):
        interpreter.process_page(page)
    infile.close()
    converter.close()
    text = output.getvalue()
    output.close
    return text

def read_img_file(file_path, file_name):
    with io.open(os.path.join(file_path, file_name), 'rb') as image:
        content = image.read()
    return content

def read_docx_file(file_path, file_name):
    images_path = os.path.join(file_path, "images")
    if not os.path.exists(images_path):
        os.makedirs(images_path)
    text = docx2txt.process(os.path.join(file_path, file_name), images_path)
    return text

def message_response(status_code, message, mime_type):
    return Response("{'message':'" + message + "'}", status=status_code, mimetype=mime_type)

app.run(host='0.0.0.0', port=80, threaded=True)

