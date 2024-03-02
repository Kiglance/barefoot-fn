import { io } from 'socket.io-client';
import { createContext } from 'react';

const baseURL = process.env.REACT_APP_BACKEND_URL;
export const socket = io(baseURL, {
  autoConnect: false,
  auth: {
    token: '',
  },
});

export const socketContext = createContext();
