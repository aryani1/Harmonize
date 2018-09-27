import { combineReducers } from 'redux';
import playlistReducer from './playlists';
import trackReducer from './tracks'

export default combineReducers({playlists: playlistReducer})