import { combineReducers } from 'redux';
import playlistReducer from './playlists';
import trackReducer from './tracks'
import currentTrackReducer from './currentTrack'

export default combineReducers({playlists: playlistReducer, tracks: trackReducer,
                                currentTrack : currentTrackReducer})