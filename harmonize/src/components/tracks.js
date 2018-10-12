import React from "react";
import { connect } from "react-redux";
import { selectTrack } from "../reducers/currentTrack";
import { FaMusic } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

const Tracks = props => {
  let tracks = props.tracks;
  let currentTrack = props.currentTrack;
  let handlePlayTrack = props.handlePlayTrack;
  return tracks ? (
    <div className="tracks">
      {tracks.map((track_info, index) => {
        return (
          <Track
            key={track_info.track.id}
            track={track_info.track}
            handlePlayTrack={handlePlayTrack}
            currentTrack={currentTrack}
            index = {index}
          />
        );
      })}
    </div>
  ) : (
    <div> </div>
  );
};

const Track = ({ track, handlePlayTrack, currentTrack, index }) => {
  const isCurrent = currentTrack && currentTrack.id == track.id;
  let artists = "asd";
  if (track) {
    const n_artists = track.artists.length;
    if (n_artists > 1) {
      artists = track.artists.reduce(get_artist, '');
    } else {
      artists = track.artists[0].name;
    }
  }
  return (
    <div
      className={"track " + (isCurrent ? "currentTrack" : "")}
      key={track.id}
      onClick={() => handlePlayTrack(track, index)}
    >
      {isCurrent ? (
        <p className="playing">
          {" "}
          <FaPlay />{" "}
        </p>
      ) : (
        <p className="note">
          {" "}
          <FaMusic />{" "}
        </p>
      )}{" "}
      {track.name}
      <p className="artist-name-playlist">
        {artists}
      </p>
    </div>
  );
};

export const playTrack = (track, trackList) => {
  return fetch("/play/" + track.uri, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(getTracksUri(trackList))
  }).then(_ => track);
};

const getTracksUri = tracks => {
  var trackIDs = [];
  tracks.map(trackInfo => {
    trackIDs.push(trackInfo.track.uri);
  });
  return trackIDs;
};

// Reducer for concatenating artist strings
const get_artists = (a, b) => a.name + ", " + b.name;
function get_artist(acc, artist) {
  if(acc == ''){
    acc += artist.name;
  }else {
    acc+= ", " + artist.name
  }
  return acc
}


// map stuff
// const mapStateToProps = state => {
//     return {
//         tracks: state.tracks.items
//     }
// }
const mapDispatchToProps = dispatch => ({
  dispatch
});
export default connect(
  null,
  mapDispatchToProps
)(Tracks);
