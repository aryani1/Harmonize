import React from 'react';
import { connect } from 'react-redux';
import { selectTrack } from '../reducers/currentTrack'

const Tracks = ({tracks, dispatch}) => {
        // console.log(tracks)
        return(
            tracks ?
            <div className="tracks">
                {
                    tracks.map(track_info =>
                        {
                            return <Track key={track_info.track.id} track={track_info.track} dispatch={dispatch}/>
                        })
                }
            </div>

            :

            <div> </div>
        );
}

const Track = ({track, dispatch}) => {
    console.log(track)
    return(
        <div className="track" key={track.id} onClick={() => playTrack(track).then(track =>
                                                             dispatch(selectTrack(track))
                                                      )}>
            {track.name}
        </div>
    );
}

const playTrack = (track) => {
    console.log('Play Track')
    return fetch("http://127.0.0.1:5000/play/"+track.uri, {'credentials':'include'}).then(_ =>
    track
    );
}

// map stuff
const mapStateToProps = state => {
  console.log(state)
    return {
        tracks: state.tracks.items
    }
}
const mapDispatchToProps = dispatch => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Tracks);
