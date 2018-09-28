import React from 'react';
import { connect } from 'react-redux';

const Tracks = ({tracks}) => {
        // console.log(tracks)
        return(
            tracks ? 
            <div>
                {
                    tracks.map(track_info => 
                        {
                            return <Track key={track_info.track.id} track={track_info.track} />
                        })
                }
            </div>

            :

            <div> Loading </div>
        );
}

const Track = (track) => {
    return(
        <div key={track.id}> track </div>
    );
}

// map stuff
const mapStateToProps = state => {
    return {
        tracks: state.tracks.items
    }
}
const mapDispatchToProps = dispatch => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Tracks);