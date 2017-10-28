import axios from 'axios';
import Course from '../models/Course';

export function getCourses() {
  return new Promise((resolve, reject) => {
    axios.get('courses')
    .then(response => {
      resolve(response.data.map(x => Course.fromApi(x)));
    })
    .catch(reject);
  });
}

export function createCourse(course) {
  return new Promise((resolve, reject) => {
    axios.post('courses', Course.toApi(course))
    .then(resolve)
    .catch(reject);
  });
}
