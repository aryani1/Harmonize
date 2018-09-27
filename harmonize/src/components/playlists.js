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
                            // <div key={playlist.id}> {playlist.name} </div> 
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
    return(
        <div> {playlist.name} </div>
    )
}

const mapStateToProps = state => {
    console.log(state.playlists.items)
    return {
        playlists: state.playlists.items
    }
}

export default connect(mapStateToProps)(Playlists);