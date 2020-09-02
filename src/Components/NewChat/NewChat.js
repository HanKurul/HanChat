import React, { useEffect, useState,useRef } from "react";
import { Redirect } from "react-router-dom";
import Rooms from "./ChatComponents/Rooms";
import Contacts from "./ChatComponents/Contacts";
import Messages from "./ChatComponents/Messages";
import "./NewChat.css";
import {
  GlobalGetUserName,
  GlobalGetUserPic,
  GetSocket,
} from "../../Socket.js";

//useRef define Global var
//useState enter a func as param 1 it will only run it once

const NewChat = () => {
  const [message, setMessage] = useState("");
  const [CurrentRoom, SetCR] = useState({});
  const [CurrentRoomMessages, SetCRM] = useState([]);
  const [RoomsBar, setRoomsBar] = useState([]);
  const PageMessage = useRef()
  /*On Mount */
  useEffect(() => {
   
    GetSocket().emit("RoomBasicInfos", ({ data, error }) => {
      if (data) {
        setRoomsBar(data);
    
        if (data[0]._id) 
          EnterRoom("",data[0]);
      }
    });

    GetSocket().on("roomlastmessage", (newLastMessageInfo) => {
      setRoomsBar((prevRoomsBar) => {
        const newroomsbar = [...prevRoomsBar];
        const result = newroomsbar.findIndex(
          ({ _id }) => _id === newLastMessageInfo._id
        );

        if (result !== -1) 
        {
          newroomsbar[result].LastMessage = newLastMessageInfo.LastMessage;
          newroomsbar[result].LastSender = newLastMessageInfo.LastSender;
        }
     
        return newroomsbar;
      });
    });

    GetSocket().on("newmessage", (newmessage) => {
      SetCRM((CurrentRoomMessages) => [...CurrentRoomMessages, newmessage]);
    });

    console.log("Successfully Inited");

  }, []);

  useEffect(() => {
    if (PageMessage.current)
      PageMessage.current.scrollTop = Number.MAX_SAFE_INTEGER
  }, [CurrentRoomMessages]);

  /* Do this when we change CurrentRoom */
  const EnterRoom = (OldRoomName,NewRoom) => {
    /* Get CurrentRoom Old Messages*/

    GetSocket().emit(
      "EnterRoom",
      {
        RoomName: NewRoom.RoomName,
        OldRoomName: OldRoomName,
        RoomId: NewRoom._id,
        UserName: GlobalGetUserName(),
      },
      ({ error, data }) => {
        if (error) console.error(data);
        else if (data) {
          /* Change Our CurrentRoommessages*/
          SetCR(NewRoom);
          SetCRM(data);
          console.warn("Left: " + OldRoomName + " And Succesfully Joined: " + NewRoom.RoomName);
        }
      }
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message) return;

    const req = {
      RoomId: CurrentRoom._id,
      RoomName: CurrentRoom.RoomName,
      Msg: { Sender: GlobalGetUserName(), Message: message , createdAt: new Date()},
    };

    /* Put Our New Message to our base*/
    SetCRM((CurrentRoomMessages) => [...CurrentRoomMessages, req.Msg]);

    /* Send New Message to Server*/
    GetSocket().emit("SendMessageToRoom", req, ({ error, data }) => {
      if (error)  
        console.error(data);
      else if (data) {
        setMessage("");
        console.warn(data);
      }
    }); 
  };

   /* Page is refreshed by F5 go back to login*/
  if (!GlobalGetUserName()) {
    return <Redirect to={`/`} />;
  }


  return (
    <div>
      <div className="frame-container">
        <div className="frame">
          <div className="sidepanel">
            <div className="top">
              <div className="imagecontainer">
                <img src={GlobalGetUserPic()} />
              </div>

              <div className="bannercontainer">
                <button>
                  <i className="fa fa-id-card" aria-hidden="true"></i>
                  <span>{GlobalGetUserName()}</span>
                </button>
              </div>
            </div>

            <Rooms
              RoomsBar={RoomsBar}
              CurrentRoom={CurrentRoom}
              EnterRoom={EnterRoom}
            />

        
            <div className="buttons">
              <div className="buttonscontainer">
                <button>
                  <i className="fa fa-user-plus fa-fw" aria-hidden="true"></i>
                  <span>Create Room</span>
                </button>
              </div>

              <div className="buttonscontainer">
                <button>
                  <i className="fa fa-cog fa-fw" aria-hidden="true"></i>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          <div className="main">
           
            <div className="roominfo">
              <img src={CurrentRoom.icon} />
              <p>{CurrentRoom.RoomName}</p>
            </div>
            
            
            <div ref={PageMessage} className={"messages"}>     
              <Messages messages={CurrentRoomMessages}></Messages>      
            </div>

            <div className="message-input">
              <div className="inputfield">
                <input type="text" placeholder="Write your message..."
                value={message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                 />
              </div>

              <div className="sendbutton">
                <button onClick={e => sendMessage(e)}>
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="mainbody">
      <div id="frame">
        <div id="sidepanel">
          <div id="search">
            <img id="profile-img" src={GlobalGetUserPic()} alt="" />
            <input type="text" placeholder="Search contacts..." />
          </div>
        
            <Rooms
              RoomsBar={RoomsBar}
              CurrentRoom={CurrentRoom}
              EnterRoom={EnterRoom}
            />
    
          <Contacts></Contacts>

          <div id="bottom-bar">
            <button id="addcontact">
              <i className="fa fa-globe fa-fw" aria-hidden="true"></i>{" "}
              <span>Add Room</span>
            </button>
            <button id="settings">
              <i className="fa fa-id-card" aria-hidden="true"></i>
              <span>{GlobalGetUserName()}</span>
            </button>
          </div>
        </div>

        <div className="content">
          <div className="contact-profile">
            <img src={CurrentRoom.icon} alt="" />
            <p>{CurrentRoom.RoomName}</p>
          </div>
      
          <Messages messages={CurrentRoomMessages}></Messages>       

          <div className="message-input">
            <div className="wrap">
              <input
                type="text"
                placeholder="Write your message..."
                value={message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
              />
              <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
              <button className="submit" onClick={e => sendMessage(e)}>
                <i className="fa fa-paper-plane" aria-hidden="true" ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
