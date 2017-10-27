import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';

import './styles/reset.css';
import Routes from './Routes';
import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <Header />
            <Routes />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
