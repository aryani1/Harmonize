import React from 'react';
import { connect } from 'react-redux';

const TrackInfo = ({track, dispatch}) => {
    let artists = 'asd'
    if (track){
        const n_artists = track.artists.length;
        if (n_artists > 1) {
            artists = track.artists.reduce(get_artists)
        }else{
            artists = track.artists[0].name
        }
    }
    return(
        track ?
        <div className="track-info">
            <div className="track-info-header">
                <div className="info-img duotone">
                    <img src={track.album.images[0].url}/>
                </div>
            </div>
            <div className="track-info-name">
                <div className="track-name">
                  <h2>{track.name}</h2>
                </div>
                <div className="artist-name">
                  <h3>{artists}</h3>
                </div>
            </div>
        </div>

        :

        <div>  </div>
    )
}


// Reducer for concatenating artist strings
const get_artists = (a, b) => a.name + ', ' + b.name

// mapStateToProps and mapDispatchToProps
const mapStateToProps = state => {
    return {
        track: state.currentTrack,
    }
}
const mapDispatchToProps = dispatch => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(TrackInfo);
