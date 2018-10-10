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
    return(
        <div className="track" key={track.id} onClick={() => handlePlayTrack(track)}>
           {currentTrack && (currentTrack.id == track.id) ?
           (<p className="note"> <FaPlay/> </p>)
           :
            (<p className="note"> <FaMusic/> </p>)
           } {track.name}
        </div>
    );
}

export const playTrack = (track, trackList) => {
    return fetch("http://127.0.0.1:5000/play/"+track.uri, {'credentials':'include'}).then(_ =>
    track
    );
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
