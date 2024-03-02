import {
  RECEIVE_CHATS,
  RECEIVE_CHAT_ERROR,
  SEND_CHATS,
  SEND_CHAT_ERROR,
  SOCKET_CONNECT,
} from '../types/chat.types';

const initialState = {
  allMessages: [],
  sendMessage: [],
  error: [],
  connected: false,
  socket: null,
};

/* istanbul ignore next */
const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_CHATS:
      console.log('action', action);
      return {
        ...state,
        allMessages: action.payload,
        connected: true,
        error: [],
      };
    case SEND_CHATS:
      return {
        ...state,
        sendMessage: action.payload,
        connected: true,
        error: [],
      };
    case SEND_CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
        connected: false,
        sendMessage: [],
      };
    case RECEIVE_CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
        connected: false,
        allMessages: [],
      };
    case SOCKET_CONNECT:
      return {
        ...state,
        error: null,
        socket: action.payload,
        connected: true,
      };
    default:
      return state;
  }
};

export default chatReducer;
