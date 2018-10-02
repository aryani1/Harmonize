import React from 'react';
import { connect } from 'react-redux';

const TrackInfo = ({track, dispatch}) => {
    let artists = 'asd'
    if (track){
        const n_artists = track.artists.length;
        console.log(n_artists)
        if (n_artists > 1) {
            artists = track.artists.reduce(get_artists)
        }else{
            artists = track.artists[0].name
        }
    }
    return(
        track ? 
        <div className="track-info">
            <img className="info-img" src={track.album.images[0].url}/>
            <p>{track.name}</p>
            <p>{artists}</p>
        </div>

        :

        <div>  </div>
    )
}


// Reducer for concatenating artist strings
const get_artists = (a, b) => a.name + ', ' + b.name

// mapStateToProps and mapDispatchToProps
const mapStateToProps = state => {
    console.log(state)
    return {
        track: state.currentTrack,
    }
}
const mapDispatchToProps = dispatch => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(TrackInfo);