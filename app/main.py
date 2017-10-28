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

# [START app]
import logging
import json
from os import listdir
from os.path import isfile, join

# [START imports]
from flask import Flask, abort, render_template, request, send_from_directory, Response
# [END imports]

# [START create_app]
app = Flask(__name__, static_folder='static')
# [END create_app]

###############################################
# Start of form code (unrelated to application)
###############################################

# [START form]
@app.route('/form')
def form():
    return render_template('form.html')
# [END form]

# [START submitted]
@app.route('/submitted', methods=['POST'])
def submitted_form():
    name = request.form['name']
    email = request.form['email']
    site = request.form['site_url']
    comments = request.form['comments']

    # [END submitted]
    # [START render_template]
    return render_template(
        'submitted_form.html',
        name=name,
        email=email,
        site=site,
        comments=comments)
    # [END render_template]

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500
# [END app]

#############################################
# End of form code (unrelated to application)
#############################################

@app.route('/api/courses', methods=['GET', 'POST'])
def courses():
    if request.method == 'GET':
        js = [
               { 'name' : 'get_test_name',
                 'course_id' : 'get_test_course_id', 
                 'thumbnail' : 'get_test_thumbnail'},
               { 'name' : 'get_test_name',
                 'course_id' : 'get_test_course_id', 
                 'thumbnail' : 'get_test_thumbnail'
               }
             ]
        return Response(json.dumps(js),  mimetype='application/json')
    elif request.method == 'POST':
        js = [ { 'name' : 'post_test_name',
                 'course_id' : 'post_test_course_id', 
                 'thumbnail' : 'post_test_thumbnail'
             } ]
        return Response(json.dumps(js),  mimetype='application/json')

@app.route('/api/courses/<course_id>/files', methods=['POST'])
def upload_file(course_id):
    return abort(418)

@app.route('/api/files/<file_id>', methods=['GET'])
def get_files(file_id):
    path = app.static_folder + '\\files\\' + file_id
    files = [f for f in listdir(path) if isfile(join(path, f))]
    if len(files) == 0:
        return abort(404)
    elif len(files) >= 2:
        return abort(500)
    return send_from_directory(path, filename=files[0])

@app.route('/api/courses/<course_id>/files?search=<search_string>', methods=['GET'])
def search_files(course_id, search_string):
    print(course_id)
    print(search_string)
    return abort(418)

