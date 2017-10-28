import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import defaultState from './defaultState';
import {
  SET_COURSES,
} from './actionTypes';

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_COURSES:
      return {
        ...state,
        courses: action.courses,
      };
    default:
      return state;
  }
}

export default createStore(rootReducer, applyMiddleware(thunk));
