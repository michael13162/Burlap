import React, { Component } from 'react';

class CourseScreen extends Component {
  render() {
    return (
      <div>
        Course Screen with {this.props.match.params.courseId}
      </div>
    );
  }
}

export default CourseScreen;
