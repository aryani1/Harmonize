export const appendTracks = trackList => ({
    type: "APPEND_TRACKS",
    trackList
});

const trackListReducer = (state=[], action) => {
    switch(action.type){
        case "APPEND_TRACKS":
            return [...state, action.trackList]
        default:
            return state;
    }
}

export default trackListReducer;