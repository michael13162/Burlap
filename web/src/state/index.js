import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import defaultState from './defaultState';

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        foo: state.foo + 1,
      };
    default:
      return state;
  }
}

export default createStore(rootReducer, applyMiddleware(thunk));
