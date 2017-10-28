import PropTypes from 'prop-types';

export default {
  fromApi: (response) => ({
    name: response.name,
    fileId: response.file_id,
    type: response.type,
  }),
  /*
  toApi: (file) => (FileReader stuff here?),
  */
  propTypes: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fileId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};
