import React  from 'react'
import classNames from "classnames";

const Rooms = ({RoomsBar,EnterRoom,CurrentRoom}) => {

	/* Set Current Room ID */
	const OnRoomClicked = (CurrentRoom,newRoom) => 
	{
		if (CurrentRoom._id !== newRoom._id)
		{
			console.log("Entering " + newRoom.RoomName)
			EnterRoom(CurrentRoom.RoomName,newRoom);
		}	
	}

	if (!RoomsBar)
		return (<div></div>);

	if (RoomsBar.length === 0)
		return (<div></div>);

    return (
      <div className="rooms">
        <ul>
          {RoomsBar.map((room, i) => (
            <li
              key={room._id}
              onClick={(e) => OnRoomClicked(CurrentRoom, room)}
              className={CurrentRoom._id === room._id ? "activeroom" :""} 
			  >
              <div className="itemcontainer">
              
			   <div className="imagecontainer">
                  <img src={room.icon} />
                </div>

                <div className="bannercontainer">
                  <div className="name">{room.RoomName}</div>
                  <div className="preview">{room.LastSender}:{room.LastMessage}</div>
                </div>

              </div>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default Rooms;