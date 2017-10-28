import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CourseListScreen from './CourseListScreen';
import CourseScreen from './CourseScreen';

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
