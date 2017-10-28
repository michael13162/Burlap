import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { List, ListItem } from 'material-ui/List';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import { blue500, red500 } from 'material-ui/styles/colors';
import Doc from 'material-ui/svg-icons/action/description';
import Image from 'material-ui/svg-icons/image/image';
import Pdf from 'material-ui/svg-icons/image/picture-as-pdf';
import Tv from 'material-ui/svg-icons/hardware/tv';

import Course from '../models/Course';
import { spacing, titleSize, listMaxWidth, listBorder, borderGrey } from '../styles/constants';
import { getCourses } from '../state/actions';
import { getFilesForCourse, uploadFiles } from '../services/filesService';
import { apiUrl } from '../config';
import { debounce } from 'lodash';

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
    getFilesForCourse(this.props.match.params.courseId, this.state.fileSearch)
    .then(x => {
      this.setState({
        files: x,
      });
    });
  }

  doSearch = debounce(() => {
    this.loadFiles();
  }, 100, {
    leading: false,
    trailing: true,
  });

  handleChange = (e) => {
    this.setState({
      fileSearch: e.target.value,
    }, this.doSearch);
  };

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

  renderFileIcon = (type) => {
    switch (type) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'bmp':
        return <Image color={red500} />;
      case 'mp4':
        return <Tv />;
      case 'pdf':
        return <Pdf />;
      case 'txt':
      case 'docx':
      default:
        return <Doc color={blue500} />
    }
  }

  renderFiles = () => {
    const { files } = this.state;
    if (files === null || files.length === 0) {
      return (
        <p style={styles.noFiles}>
          No files match '{this.state.fileSearch}'. Upload some!
        </p>
      );
    }

    return (
      <List style={styles.list}>
        {files.map(x => (
          <ListItem
            key={x.fileId}
            primaryText={x.name}
            leftIcon={this.renderFileIcon(x.type)}
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

  renderSearch = () => {
    return (
      <TextField
        value={this.state.fileSearch}
        floatingLabelText="Search files"
        onChange={this.handleChange}
        style={styles.search}
      />
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
          {this.renderSearch()}
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
  search: {
    marginBottom: spacing,
  },
};

const mapStateToProps = (state, props) => ({
  course: state.courses.find(x => x.courseId === props.match.params.courseId),
});

export default connect(mapStateToProps)(CourseScreen);
