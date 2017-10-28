import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';

import { getCourses } from '../state/actions';
import Course from '../models/Course';
import CourseAddModal from './CourseAddModal';
import { spacing, listMaxWidth, listBorder, titleSize } from '../styles/constants';

class CourseListScreen extends Component {
  componentDidMount() {
    this.props.dispatch(getCourses());
  }

  render() {
    return (
      <div style={styles.screenWrapper}>
        <h1 style={styles.title}>
          Courses
        </h1>
        <List style={styles.list}>
          {this.props.courses.map(x => (
            <ListItem
              key={x.courseId}
              primaryText={x.name}
              containerElement={<Link to={`/courses/${x.courseId}`} />}
            />
          ))}
        </List>
        <CourseAddModal />
      </div>
    );
  }
}

const styles = {
  screenWrapper: {
    display: 'relative',
  },
  title: {
    fontSize: titleSize,
    padding: spacing,
  },
  list: {
    maxWidth: listMaxWidth,
    border: listBorder,
    marginLeft: spacing,
    marginRight: spacing,
  },
  tile: {
    backgroundColor: '#663399',
  },
};

CourseListScreen.propTypes = {
  courses: PropTypes.arrayOf(Course.propTypes),
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  courses: state.courses,
});

export default connect(mapStateToProps)(CourseListScreen);
