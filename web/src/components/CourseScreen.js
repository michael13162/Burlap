import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { List, ListItem } from 'material-ui/List';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import IconButton from 'material-ui/IconButton';

import Course from '../models/Course';
import { spacing, titleSize, listMaxWidth, listBorder, borderGrey } from '../styles/constants';
import { getCourses } from '../state/actions';
import { getFilesForCourse, uploadFiles } from '../services/filesService';
import { apiUrl } from '../config';

class CourseScreen extends Component {
  state = {
    fileSearch: '',
    files: null,
  };

  componentDidMount() {
    this.props.dispatch(getCourses());

    this.loadFiles();
  }

  loadFiles = () => {
    getFilesForCourse(this.props.match.params.courseId)
    .then(x => {
      this.setState({
        files: x,
      });
    });
  }

  handleDrop = (files) => {
    uploadFiles(files, this.props.match.params.courseId)
    .then(() => {
      setTimeout(() => {
        this.loadFiles();
      }, 500); // server has some sort of delay before reporting the file
    });
  }

  renderDownloadButton = (fileId, name) => {
    return (
      <IconButton>
        <FileDownload />
      </IconButton>
    );
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
            rightIconButton={this.renderDownloadButton(x.fileId, x.name)}
            containerElement={
              <a
                target="_blank"
                href={`${apiUrl}files/${x.fileId}`}
              />
            }
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
