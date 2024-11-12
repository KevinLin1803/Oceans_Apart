import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER);
  }
  return socket;
};
