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

export function createCourse(course) {
  return (dispatch) => {
    coursesService.createCourse(course)
    .then(() => {
      setTimeout(() => {
        dispatch(getCourses());
      }, 1000);
    });
  };
}
