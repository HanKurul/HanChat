import io from "socket.io-client";

let socket;
let username;
let userpicture;

/*
 * localhost:5000
 * https://dark-chat-22.herokuapp.com/
 */

 /*eslint-disable */
const LOCALENDPOINT = "localhost:5000";
const ENDPOINT = "https://dark-chat-22.herokuapp.com/";
  /*eslint-enable */
export const GetSocket = () => {
  if (!socket) {
    console.log("Socket Inited");
    socket = io(ENDPOINT);
  }

  return socket;
};

export const GlobalGetUserName = () => {
  return username;
};

export const GlobalSetUserName = (un) => {
  username = un;
};

export const GlobalGetUserPic = () => {
  return userpicture;
};

export const GlobalSetUserPic = (un) => {
  userpicture = un;
};
