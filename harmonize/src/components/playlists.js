import React from "react";
import { connect } from "react-redux";
import { setTracks } from "../reducers/tracks";
import { selectTrack } from "../reducers/currentTrack";
import { playTrack } from "./tracks";
import Tracks from "./tracks";

const Playlists = ({ playlists, dispatch, currentTrack }) => {
  if (playlists) {
    return (
      <div className="list-feed">
        {playlists.map(playlist => {
          return (
            <PlaylistComponent
              key={playlist.id}
              playlist={playlist}
              dispatch={dispatch}
              currentTrack={currentTrack}
            />
          );
        })}
      </div>
    );
  } else {
    return <div />;
  }
};

// const Playlist = ({ playlist, dispatch }) => {
//   return (
//     <div
//       key={playlist.id}
//       className="playlist"
//       onClick={() =>
//         fetchTracks(playlist).then(tracks => dispatch(setTracks(tracks)))
//       }
//     >
//       <div className="playlist-titlecard">
//         <img
//           className="nav-img"
//           src={playlist.images[0].url}
//           height="60"
//           width="60"
//         />
//         <div className="playlist-name">{playlist.name}</div>
//       </div>
//       <div>
//         <Tracks />
//       </div>
//     </div>
//   );
// };

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playlist: props.playlist, tracks: [], dispatch: props.dispatch };
    this.playEvent = this.playEvent.bind(this);
  }

  componentDidMount() {
    fetchTracks(this.state.playlist).then(tracks => {
      // tracks.items is an array of all the tracks for a playlist
      this.updateTracks(tracks.items);
    });
  }

  updateTracks(tracks) {
    this.setState({
      tracks: tracks
    });
  }

  playEvent(track) {
    const playlistTracks = this.state.tracks
    this.state.dispatch(selectTrack(track));
    playTrack(track, playlistTracks);
  }
    render() {
      const { playlist, tracks } = this.state;
      const { currentTrack } = this.props;
      return(
        <div key={playlist.id} className="playlist" >
            <div className="playlist-titlecard">
                <div className="nav-img nav-duotone">
                    <img src={playlist.images[0].url}/>
                </div>
                <div className="playlist-name" >
                    {playlist.name}
                </div>
            </div>
            <div>
              <Tracks
              tracks={tracks}
              currentTrack={currentTrack}
              handlePlayTrack={this.playEvent}
              />
            </div>
        </div>
        )
    }
}

const fetchTracks = playlist => {
  return fetch("http://127.0.0.1:5000/playlists/" + playlist.id, {
    credentials: "include",
  }).then(data => data.json());
};

// mapStateToProps and mapDispatchToProps
const mapStateToProps = state => {
  console.log(state)
  return {
    playlists: state.playlists.items,
    currentTrack: state.currentTrack
  };
};
const mapDispatchToProps = dispatch => ({
  dispatch
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlists);
