import React from "react";
import {GlobalGetUserName} from "../../../Socket.js";

import "../NewChat.css";

const Messages = ({ messages }) => {
  /* Set Current Room ID */

  if (!messages)
		return (<div></div>);

  if (messages.length === 0)
		return (<div></div>);
  
  return (
        <ul>
          {messages.map((message, i) => (

            <li key={i} className={`${message.Sender === GlobalGetUserName() ? "mine" : ""}`}>
              <div className="itemcontainer">
                
                <div className="imagecontainer">
                  <img src="http://emilcarlsson.se/assets/harveyspecter.png" />
                </div>

               <div className="mgscointainer">       
                  <div className="info"> {message.Sender} at {new Date(message.createdAt).getHours()}:{new Date(message.createdAt).getMinutes()} </div>
                  <div className="msg">{message.Message}</div>
                </div>
      
              </div>
            </li>
          ))}
        </ul> 
  );
};

export default Messages;
