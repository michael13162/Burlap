import axios from 'axios';

export function getCourses() {
  axios.get('courses')
  .then(response => {
    console.log(response);
  });
}
