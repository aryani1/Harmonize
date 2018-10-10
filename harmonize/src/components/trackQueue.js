import React from 'react'
import { connect } from "react-redux";
import trackinfo from './trackinfo';
const TrackQueue = ({queue}) => {
    console.log(queue)
    return(
        <div>
            {
                queue.map(trackInfo => {
                    const { track } = trackInfo
                    return <div key={track.id}>
                     {track.name}
                     </div>
                })
            }
        </div>
    )
}
// mapStateToProps and mapDispatchToProps
const mapStateToProps = state => {
    console.log(state)
    return {
      queue:state.queue
    };
  };
  const mapDispatchToProps = dispatch => ({
    dispatch
  });
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(TrackQueue);
