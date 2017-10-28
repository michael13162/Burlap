import * as coursesService from '../services/coursesService';

export function getCourses() {
  return (dispatch) => {
    coursesService.getCourses()
    .then(courses => {
      debugger;
    });
  };
}
