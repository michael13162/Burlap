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
