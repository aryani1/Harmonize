export const setQueue = (tracks) => ({
  type:'SET_QUEUE',
  tracks
})

const queueReducer = (state=[], action) => {
  switch(action.type){
    case "SET_QUEUE":
      return action.tracks
    default: 
      return state
  }
}

export default queueReducer;