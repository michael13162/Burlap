import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import {
  BrowserRouter,
  Route,
  Link,
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          </div>
          <Link to="/">
            <RaisedButton label="Home" />
          </Link>
          <Link to="/foo">
            Foo
          </Link>

          <Route exact path="/" component={Home} />
          <Route exact path="/foo" component={Foo} />
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        home
      </div>
    );
  }
}

class Foo extends Component {
  render() {
    return (
      <div>
        foo
      </div>
    );
  }
}

export default App;
