import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import axios from 'axios';

class CourseScreen extends Component {
  handleDrop = (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    axios.post(`courses/${this.props.match.params.courseId}/files`, formData);
  }

  render() {
    return (
      <div>
        Course Screen with {this.props.match.params.courseId}
        <Dropzone onDropAccepted={this.handleDrop}>
          <p>Drag and drop files here.</p>
        </Dropzone>
      </div>
    );
  }
}

CourseScreen.propTypes = {
  match: PropTypes.object.isRequired,
};

export default CourseScreen;
