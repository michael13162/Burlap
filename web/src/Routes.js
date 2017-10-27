import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CourseListScreen from './components/CourseListScreen';
import CourseScreen from './components/CourseScreen';

class Routes extends Component {
  render() {
    return (
      <div>
        <Route exact path="(/|/courses)" component={CourseListScreen} />
        <Route exact path="/courses/:courseId" component={CourseScreen} />
      </div>
    );
  };
}

export default Routes;
