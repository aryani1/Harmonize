export const setTracks = tracks => ({
  type: "FETCH_TRACKS",
  tracks
});

const trackReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_TRACKS":
      return action.tracks;
    default:
      return state;
  }
};

export default trackReducer;
