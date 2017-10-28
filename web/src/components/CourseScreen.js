import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CourseScreen extends Component {
  render() {
    return (
      <div>
        Course Screen with {this.props.match.params.courseId}
      </div>
    );
  }
}

CourseScreen.propTypes = {
  match: PropTypes.object.isRequired,
};

export default CourseScreen;
