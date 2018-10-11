import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setPlaylists } from './reducers/playlists'
import Playlists from './components/playlists'
import Tracks from './components/tracks'
import TrackInfo from './components/trackinfo'
import TrackQueue from './components/trackQueue'

import './App.css';

const fetchPlaylists = () => {
  return fetch("/playlists", {'credentials':'include'}).then(data =>
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

            <div className="queue-panel">
              <TrackQueue />
            </div>

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
