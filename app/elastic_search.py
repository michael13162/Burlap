import requests
import json

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
    return parsed_json["_id"]

def get_courses():
    url =  url_base + "/{}/{}/{}".format("u_of_utah", "courses", "_search")

    headers = {"Content-Type" : "application/json"}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    parsed_json = json.loads(r.text)
    response_courses = parsed_json["hits"]["hits"]
    return [(course["_id"], course["_source"]["course_name"])
            for course in response_courses]

def delete_course(course_id):
    url =  url_base + "/{}".format(course_id)
    r = requests.delete(url)
    r.raise_for_status()

    url =  url_base + "/{}/{}/{}".format("u_of_utah", "courses", course_id)
    r = requests.delete(url)
    r.raise_for_status()

def create_document(course_id, file_name, file_id, text):
    data = {
        "file_name" : file_name,
        "text" : text
    }

    json_data = json.dumps(data)
    url =  url_base + "/{}/{}/{}".format(course_id, "documents", file_id)

    headers = {"Content-Type" : "application/json"}
    r = requests.put(url, headers=headers, data=json_data)
    r.raise_for_status()

def delete_document(course_id, file_id):
    url =  url_base + "/{}/{}/{}".format(course_id, "documents", file_id)

    r = requests.delete(url)
    r.raise_for_status()

def search(course_id, query):
    query = {
        "query": {
            "match": {
                "text": query
            }
        }
    }

    json_data = json.dumps(query)
    url =  url_base + "/{}/{}/{}".format(course_id, "documents", "_search")

    headers = {"Content-Type" : "application/json"}
    r = requests.get(url, headers=headers, data=json_data)
    r.raise_for_status()
