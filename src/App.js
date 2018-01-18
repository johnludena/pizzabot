import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount = ()=>{
    console.log('Component Did Mount');
  };

  componentWillMount = ()=>{
    console.log('Component Will Mount');
  };

  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload. Voila!
        </p>

        <p>Test paragraph.</p>
      </div>
    );
  };
}

export default App;
