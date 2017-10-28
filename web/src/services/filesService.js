import axios from 'axios';
import File from '../models/File';

export function getFilesForCourse(courseId) {
  return new Promise((resolve, reject) => {
    axios.get(`courses/${courseId}`)
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
