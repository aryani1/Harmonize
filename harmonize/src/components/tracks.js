import React from 'react';
import { connect } from 'react-redux';
import { selectTrack } from '../reducers/currentTrack';
import { FaMusic } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';

const Tracks = props => {
        let tracks = props.tracks
        let dispatch = props.dispatch
        let currentTrack = props.currentTrack
        let handlePlayTrack = props.handlePlayTrack
        return(
            tracks ?
            <div className="tracks">
                {
                    tracks.map(track_info =>
                        {
                            return <Track key={track_info.track.id} track={track_info.track} handlePlayTrack={handlePlayTrack}
                            currentTrack={currentTrack}/>
                        })
                }
            </div>

            :

            <div> </div>
        );
}

const Track = ({track, handlePlayTrack, currentTrack}) => {
  const isCurrent = currentTrack && (currentTrack.id == track.id)
    return(
        <div className={"track " + (isCurrent ? 'currentTrack' : '') } key={track.id} onClick={() => handlePlayTrack(track)}>
           { isCurrent ?
           (<p className="current-track"> <FaPlay/> </p>)
           :
            (<p className="note"> <FaMusic/> </p>)
           } {track.name}
        </div>
    );
}

export const playTrack = (track, trackList) => {
    // console.log(getTracksUri(trackList))
    return fetch("http://127.0.0.1:5000/play/"+track.uri, {
        method: 'POST',
        credentials:'include',
        body: JSON.stringify(getTracksUri(trackList))
    }).then(_ =>
    track
    );
}

const getTracksUri = tracks => {
    var trackIDs = []
    tracks.map(trackInfo => {
        trackIDs.push(trackInfo.track.uri)
    })
    return trackIDs
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
export default connect(null, mapDispatchToProps)(Tracks);
