import React from 'react'
import { connect } from "react-redux";
import trackinfo from './trackinfo';
import { IoIosMusicalNotes } from 'react-icons/io';

const TrackQueue = ({queue}) => {
    return(
        <div className="track-queue" >
            {
                queue.map(trackInfo => {
                    const { track } = trackInfo
                    return <div className="queue-track" key={track.id}>
                      <p className="queue-note">
                        {" "}
                        <IoIosMusicalNotes />{" "}
                      </p>
                     {track.name}
                     </div>
                })
            }
        </div>
    )
}
// mapStateToProps and mapDispatchToProps
const mapStateToProps = state => {
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
