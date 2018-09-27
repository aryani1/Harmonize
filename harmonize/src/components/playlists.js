import React from 'react';
import { connect } from 'react-redux';

const Playlists = ({playlists}) => {
    if (playlists)
        {
            return (
            <div>
                {
                    playlists.map(playlist => {
                        return( 
                            <Playlist key={playlist.id} playlist={playlist} />
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

const Playlist= ({playlist}) => {
    console.log(playlist.images[0].height)
    return(
        <div key={playlist.id} className="playlist" onClick = { () => fetchTracks(playlist) } >
            <img className="nav-img" src={playlist.images[0].url} height="60" width="60"/>
            <div>
                {playlist.name}
            </div>
        </div>
    )
}

const fetchTracks = playlist => {
    return fetch("http://127.0.0.1:5000/playlists/" + playlist.id).then(data =>
    data.json()
  );
}

const mapStateToProps = state => {
    console.log(state.playlists.items)
    return {
        playlists: state.playlists.items
    }
}

export default connect(mapStateToProps)(Playlists);