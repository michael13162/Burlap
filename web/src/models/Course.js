import PropTypes from 'prop-types';

export default {
  fromApi: (response) => ({
    name: response.name,
    courseId: response.course_id,
    thumbnail: response.thumbnail,
  }),
  toApi: (course) => ({
    name: course.name,
  }),
  propTypes: PropTypes.shape({
    name: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }),
};
