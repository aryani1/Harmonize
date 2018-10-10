export const setPlaylists = playlists => ({
  type: "FETCH_PLAYLISTS",
  playlists
});

const playlistReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_PLAYLISTS":
      return action.playlists;
    default:
      return state;
  }
};

export default playlistReducer;
