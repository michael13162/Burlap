import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <Routes />
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
