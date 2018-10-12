import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPlaylists } from './reducers/playlists'
import Playlists from './components/playlists'
import Tracks from './components/tracks'
import TrackInfo from './components/trackinfo'
import TrackQueue from './components/trackQueue'
import { FaPlus } from 'react-icons/fa'

import './App.css';

const fetchPlaylists = () => {
  return fetch("/playlists", {'credentials':'include'}).then(data =>
    data.json()
  );
};


class App extends Component {
  state = {
    queueHidden: true,
    listenersHidden: true,
    loggedin: true
  };

  componentDidMount() {
      const { dispatch } = this.props;
      fetchPlaylists().then(playlists => ( dispatch(setPlaylists(playlists)) ));
  }

  toggleQueueHidden = () => {
    this.setState({queueHidden: !this.state.queueHidden});
  }

  toggleListenersHidden = () => {
    this.setState({listenersHidden: ! this.state.listenersHidden});
  }

  render() {
    return (

      <div className="App">
        <header className="App-header">
          <p className="App-title">Harmonize</p>
        </header>
        <div>
          { !this.state.loggedin &&
          <div className="landing-panel">
            <p className="app-description">
            Join the listening party!
            </p>
            <img className="landing-img" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f9f0fdc18a215ec725f8ca61dc6fcbdf&auto=format&fit=crop&w=3300&q=80"/>
            <a className= "login-button" href="https://accounts.spotify.com/en/authorize?client_id=e6723e026ea24e958ddb995bf8ce0c4c&response_type=code&redirect_uri=harmonize-app.herokuapp.com%2Fauthorize_success&scope=user-library-read%20user-modify-playback-state" > Connect to Spotify </a>
          </div>
          }
        </div>
        { this.state.loggedin &&
        <div>
            <div className="info-panel">
              <TrackInfo />
            </div>

            <div className="navigation-panel">

              <p className="nav-sub-header" onClick={this.toggleQueueHidden} >
                Queue
              </p>

              <div className={`queue-panel ${this.state.queueHidden ? "queue-hidden" : ""}`}>
                <TrackQueue />
              </div>

              <p className="nav-sub-header" onClick={this.toggleListenersHidden}>
                Listeners
              </p>

              <div className={`listeners-panel ${this.state.listenersHidden ? "listeners-hidden" : ""}`}>
              </div>

              <p className="nav-sub-header">
                Your Playlists
              </p>

              <div className="feed">
                <Playlists />
                <Tracks />
              </div>

            </div>

          </div>
          }

      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(null, mapDispatchToProps)(App);
