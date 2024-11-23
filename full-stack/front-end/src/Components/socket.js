import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
    });
}
return socket;
};

export const disconnectSocket = () => {
  if (socket) {
      socket.disconnect();
      socket = null;
  }
};

