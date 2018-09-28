import React from 'react';
import { connect } from 'react-redux';

const Tracks = (tracks) => {
        return(
            tracks ? 
            <div>
                {
                    tracks.map(track => 
                        {
                            return <Track track={track} />
                        }
                    )
                }
            </div>

            :

            <div> Loading </div>
        );
}

const Track = (track) => {
    return(
        <div> {track} </div>
    );
}

// map stuff
const mapStateToProps = state => {
    return {
        tracks: state.tracks
    }
}
const mapDispatchToProps = dispatch => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Playlists);