import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setPlaylists } from './reducers/playlists'
import Playlists from './components/playlists'
import Tracks from './components/tracks'
import TrackInfo from './components/trackinfo'

import './App.css';

const fetchPlaylists = () => {
  return fetch("http://127.0.0.1:5000/playlists", {'credentials':'include'}).then(data =>
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
          <p className="App-title">Harmonize</p>
        </header>

          <div className="info-panel">
            <TrackInfo />
          </div>

          <div className="navigation-panel">

            <p className="queue-nav">
              Queue
            </p>

            <div className="queue-panel"></div>

            <p className="playlist-nav">
              Your Playlists
            </p>

            <div className="feed">
              <Playlists />
              <Tracks />
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
