import { io } from 'socket.io-client';
import { createContext } from 'react';

export const socket = io(new URL(process.env.REACT_APP_BACKEND_URL).origin, {
  autoConnect: false,
  transports: ['websocket', 'polling', 'webtransport'],
  auth: {
    token: JSON.parse(localStorage.getItem('userCredentials') || null)?.token,
  },
});

export const socketContext = createContext();
