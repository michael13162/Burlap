import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    return (
      <AppBar
        title="Burlap"
        showMenuIconButton={false}
      />
    );
  }
}

export default Header;
