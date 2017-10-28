import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';

import './services/startup';
import './styles/appStyler';
import Routes from './components/Routes';
import Header from './components/Header';
import { Provider } from 'react-redux';
import store from './state';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <MuiThemeProvider>
            <div>
              <Header />
              <Routes />
            </div>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
