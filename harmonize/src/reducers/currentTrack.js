const initialState = null;

export const selectTrack = track => ({
  type: "SELECT_TRACK",
  track
});

const currentTrackReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_TRACK":
      return Object.assign({}, state, action.track);
    default:
      return state;
  }
};

export default currentTrackReducer;
