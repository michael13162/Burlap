import axios from 'axios';
import File from '../models/File';

export function getFilesForCourse(courseId, query) {
  return new Promise((resolve, reject) => {
    const request = query ? axios.get(`courses/${courseId}/files?search=${query}`) : axios.get(`courses/${courseId}`);

    request
    .then(response => {
      resolve(response.data.map(x => File.fromApi(x)));
    })
    .catch(reject);
  });
}

export function uploadFiles(files, courseId) {
  return Promise.all(files.map(x => {
    const formData = new FormData();
    formData.append('file', x);

    return axios.post(`courses/${courseId}/files`, formData);
  }));
}
