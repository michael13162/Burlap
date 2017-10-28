import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';

import { spacing } from '../styles/constants';

class CourseAddModal extends Component {
  state = {
    open: false,
    courseName: '',
  };

  handleCancel = () => {
    this.setState({
      open: false,
      courseName: '',
    });
  };

  handleChange = (e) => {
    this.setState({
      courseName: e.target.value,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
      courseName: '',
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCancel}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={this.state.courseName.length === 0}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <FloatingActionButton
          style={styles.fab}
          onClick={this.handleClick}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title="Create Course"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleCancel}
        >
          <TextField
            value={this.state.courseName}
            floatingLabelText="Course name"
            onChange={this.handleChange}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: spacing,
    left: spacing,
  }
}

export default CourseAddModal;
