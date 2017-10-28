import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { List, ListItem } from 'material-ui/List';

import Course from '../models/Course';
import { spacing, titleSize, listMaxWidth, listBorder, borderGrey } from '../styles/constants';
import { getCourses } from '../state/actions';
import { getFilesForCourse } from '../services/filesService';

class CourseScreen extends Component {
  state = {
    fileSearch: '',
    files: null,
  };

  componentDidMount() {
    this.props.dispatch(getCourses());

    getFilesForCourse(this.props.match.params.courseId)
    .then(x => {
      this.setState({
        files: x,
      });
    });
  }

  handleDrop = (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    axios.post(`courses/${this.props.match.params.courseId}/files`, formData);
  }

  renderFiles = () => {
    const { files } = this.state;
    if (files === null) {
      return (
        <p style={styles.noFiles}>
          No files.
        </p>
      );
    }

    return (
      <List style={styles.list}>
        {files.map(x => (
          <ListItem
            key={x.fileId}
            primaryText={x.name}
          />
        ))}
      </List>
    );
  }

  render() {
    if (this.props.course === undefined) {
      return null;
    }

    const { name } = this.props.course;

    return (
      <div>
        <h1 style={styles.title}>
          {name}
        </h1>
        <div style={styles.bodyWrapper}>
          {this.renderFiles()}
          <Dropzone
            onDropAccepted={this.handleDrop}
            style={styles.dropzone}
          >
            <p>Drag and drop files to upload.</p>
          </Dropzone>
        </div>
      </div>
    );
  }
}

CourseScreen.propTypes = {
  match: PropTypes.object.isRequired,
  course: Course.propTypes,
};

const styles = {
  title: {
    fontSize: titleSize,
    padding: spacing,
  },
  bodyWrapper: {
    marginLeft: spacing,
  },
  list: {
    maxWidth: listMaxWidth,
    border: listBorder,
    marginBottom: spacing,
  },
  dropzone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: listMaxWidth,
    height: '96px',
    marginBottom: spacing,
    border: `3px dashed ${borderGrey}`,
  },
  noFiles: {
    marginBottom: spacing,
  },
};

const mapStateToProps = (state, props) => ({
  course: state.courses.find(x => x.courseId === props.match.params.courseId),
});

export default connect(mapStateToProps)(CourseScreen);
