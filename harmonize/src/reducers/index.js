import { combineReducers } from "redux";
import playlistReducer from "./playlists";
import trackReducer from "./tracks";
import currentTrackReducer from "./currentTrack";
import trackListReducer from "./trackList";
import queueReducer from "./trackQueue"

export default combineReducers({
  playlists: playlistReducer,
  tracks: trackReducer,
  currentTrack: currentTrackReducer,
  trackList: trackListReducer,
  queue: queueReducer
});
