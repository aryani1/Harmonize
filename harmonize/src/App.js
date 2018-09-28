import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPlaylists } from './reducers/playlists'

import Playlists from './components/playlists'

import './App.css';

const fetchPlaylists = () => {
  return fetch("http://127.0.0.1:5000/playlists").then(data =>
    data.json()
  );
};

class App extends Component {
  componentDidMount() {
      const { dispatch } = this.props;
      fetchPlaylists().then(playlists => ( dispatch(setPlaylists(playlists)) ));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Harmonize</h1>
        </header>
        <div className="divider">
          <div className="info-panel">
            
          </div>

          <div className="navigation-panel">
            <p className="App-intro">
              Playlists
            </p>  
            <Playlists />
          </div>

        </div> 

      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
});


export default connect(null, mapDispatchToProps)(App);