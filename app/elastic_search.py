import requests
import json
import traceback
import sys

url_base = 'http://localhost:9200'

def create_course(course_name):
    data = {
        "course_name": course_name
    }

    json_data = json.dumps(data)
    url =  url_base + "/{}/{}/".format("u_of_utah", "courses")

    headers = {"Content-Type" : "application/json"}
    r = requests.post(url, headers=headers, data=json_data)
    r.raise_for_status()
    parsed_json = json.loads(r.text)
    course_id = parsed_json["_id"].lower()

    url = url_base + "/{}".format(course_id)
    r = requests.put(url)
    r.raise_for_status()
    return course_id

def get_courses():
    url =  url_base + "/{}/{}/{}".format("u_of_utah", "courses", "_search")

    r = requests.get(url)
    r.raise_for_status()
    parsed_json = json.loads(r.text)
    response_courses = parsed_json["hits"]["hits"]
    return [(course["_id"], course["_source"]["course_name"])
            for course in response_courses]

def delete_course(course_id):
    url =  url_base + "/{}".format(course_id.lower())
    r = requests.delete(url)
    try:
        r.raise_for_status()
    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return False

    url =  url_base + "/{}/{}/{}".format("u_of_utah", "courses", course_id)
    r = requests.delete(url)
    try:
        r.raise_for_status()
    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return False
    return True

def create_document(course_id, file_name, file_id, text):
    data = {
        "file_name" : file_name,
        "text" : text
    }

    json_data = json.dumps(data)
    url =  url_base + "/{}/{}/{}".format(course_id.lower(), "documents", file_id)

    headers = {"Content-Type" : "application/json"}
    r = requests.put(url, headers=headers, data=json_data)
    try:
        r.raise_for_status()
    except:
        return False
    return True

def delete_document(course_id, file_id):
    url =  url_base + "/{}/{}/{}".format(course_id.lower(), "documents", file_id)

    r = requests.delete(url)
    try:
        r.raise_for_status()
    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return False
    return True

def search(course_id, query):
    query = {
        "query": {
            "match": {
                "text": query
            }
        }
    }

    json_data = json.dumps(query)
    url =  url_base + "/{}/{}/{}".format(course_id.lower(), "documents", "_search")

    headers = {"Content-Type" : "application/json"}
    r = requests.get(url, headers=headers, data=json_data)
    r.raise_for_status()
    parsed_json = json.loads(r.text)
    response_docs = parsed_json["hits"]["hits"]
    docs = [(doc["_id"].lower(), doc["_source"]["file_name"], float(doc["_score"]))
            for doc in response_docs]
    return [doc for doc in docs if doc[2] > .1]

def get_course_files(course_id):
    url =  url_base + "/{}/{}/{}".format(course_id.lower(), "documents", "_search")

    r = requests.get(url)
    r.raise_for_status()
    parsed_json = json.loads(r.text)
    response_docs = parsed_json["hits"]["hits"]
    return [(doc["_id"].lower(), doc["_source"]["file_name"])
            for doc in response_docs]
