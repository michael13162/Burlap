import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';

import { getCourses } from '../state/actions';
import Course from '../models/Course';
import CourseAddModal from './CourseAddModal';

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
        <div style={styles.listWrapper}>
          <GridList
            cellHeight={180}
            cols={4}
            style={styles.list}
          >
            {this.props.courses.map(x => (
              <Link
                to={`/courses/${x.courseId}`}
                key={x.name}
              >
                <GridTile
                  title={x.name}
                  style={styles.tile}
                />
              </Link>
            ))}
          </GridList>
        </div>
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
    fontSize: '32px',
  },
  listWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  list: {
    width: '100%',
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
