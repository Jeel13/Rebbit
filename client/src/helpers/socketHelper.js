import { io } from 'socket.io-client';

import { isLoggedIn } from './authHelper';

import { BASE_URL } from '../config';

export let socket;

export const initiateSocketConnection = () => {
  const user = isLoggedIn();

  socket = io.connect(BASE_URL, {
    auth: {
      token: user && user.token,
    },
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
