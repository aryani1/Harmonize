import { combineReducers } from 'redux';
import playlistReducer from './playlists.js';

export default combineReducers({playlists: playlistReducer})