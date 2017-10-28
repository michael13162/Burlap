import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { List, ListItem } from 'material-ui/List';

import Course from '../models/Course';
import { spacing, titleSize, listMaxWidth, listBorder, borderGrey } from '../styles/constants';
import { getCourses } from '../state/actions';

class CourseScreen extends Component {
  componentDidMount() {
    this.props.dispatch(getCourses());
  }

  handleDrop = (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    axios.post(`courses/${this.props.match.params.courseId}/files`, formData);
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
          <List style={styles.list}>
            {[1, 2, 3].map(x => (
              <ListItem
                key={x}
                primaryText={x}
              />
            ))}
          </List>
          <Dropzone
            onDropAccepted={this.handleDrop}
            style={styles.dropzone}
          >
            <p>Drag and drop files here.</p>
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
  }
};

const mapStateToProps = (state, props) => ({
  course: state.courses.find(x => x.courseId === props.match.params.courseId),
});

export default connect(mapStateToProps)(CourseScreen);
