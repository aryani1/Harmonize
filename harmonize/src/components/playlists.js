import React from 'react';
import { connect } from 'react-redux';

const Playlists = ({playlists}) => {
    if (playlists)
        {
            console.log('showing playlists')
            return (
            <div>
                {
                    playlists.map(playlist => {
                        return(<div key={playlist.id}> {playlist.name} </div>)
                    })
                }
            </div>
        )
    }
    else{
        return(<div></div>)
    }
}

const Playlist= ({}) => {
    
}

const mapStateToProps = state => {
    console.log(state.playlists.items)
    return {
        playlists: state.playlists.items
    }
}

export default connect(mapStateToProps)(Playlists);