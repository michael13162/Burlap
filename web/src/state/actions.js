import * as coursesService from '../services/coursesService';
import {
  SET_COURSES,
} from './actionTypes';

export function getCourses() {
  return (dispatch) => {
    coursesService.getCourses()
    .then(courses => {
      dispatch({
        type: SET_COURSES,
        courses,
      });
    });
  };
}
