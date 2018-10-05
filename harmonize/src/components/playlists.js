import React from 'react';
import { connect } from 'react-redux';
import { setTracks } from '../reducers/tracks'
import Tracks from './tracks'

// hei Aryan

const Playlists = ({playlists, dispatch}) => {
    if (playlists)
        {
            return (
                <div className="list-feed">
                    {
                        playlists.map(playlist => {
                            return(
                                <Playlist key={playlist.id} playlist={playlist} dispatch={dispatch}/>
                            )
                        })
                    }
                </div>
            )
        }
    else{
        return(<div></div>)
    }
}

const Playlist= ({playlist, dispatch}) => {
    return(
        <div key={playlist.id} className="playlist" onClick = { () => fetchTracks(playlist).then(tracks =>
                                                                      dispatch(setTracks(tracks))
                                                              )}>
            <img className="nav-img" src={playlist.images[0].url} height="60" width="60"/>
            <div>
                {playlist.name}
            </div>
            <div>
                <Tracks />
            </div>
        </div>
    )
}

const fetchTracks = (playlist) => {
    return fetch("http://127.0.0.1:5000/playlists/" + playlist.id, {'credentials':'include'}).then(data =>
    data.json()
  );
}

// mapStateToProps and mapDispatchToProps
const mapStateToProps = state => {
    return {
        playlists: state.playlists.items,
    }
}
const mapDispatchToProps = dispatch => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Playlists);
