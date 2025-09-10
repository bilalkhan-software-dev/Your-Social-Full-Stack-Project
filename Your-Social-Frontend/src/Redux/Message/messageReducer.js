import { LOGOUT } from "../Auth/authActionType";
import {
  CREATE_CHAT_FAILURE,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_MESSAGE_FAILURE,
  CREATE_MESSAGE_REQUEST,
  CREATE_MESSAGE_SUCCESS,
  GET_ALL_CHATS_FAILURE,
  GET_ALL_CHATS_REQUEST,
  GET_ALL_CHATS_SUCCESS,
  GET_MESSAAGE_BY_ID_FAILURE,
  GET_MESSAAGE_BY_ID_REQUEST,
  GET_MESSAAGE_BY_ID_SUCCESS,
} from "./messageActionType";

const initialState = {
  chat: null,
  allChats: [],
  newMessage: null,
  allMessages: [],
  loading: false,
  error: null,
  message: null,
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MESSAGE_REQUEST:
    case CREATE_CHAT_REQUEST:
    case GET_ALL_CHATS_REQUEST:
    case GET_MESSAAGE_BY_ID_REQUEST:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        newMessage: action.payload.newMessage,
        message: action.payload.message,
        loading: false,
      };

    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chat: action.payload.chat,
        allChats: [action.payload.chat, ...state.allChats],
        message: action.payload.message,
        error: null,
      };

    case GET_ALL_CHATS_SUCCESS:
      return {
        ...state,
        allChats: action.payload.allChats,
        message: action.payload.message,
        loading: false,
        error: null,
      };

    case GET_MESSAAGE_BY_ID_SUCCESS:
      return {
        ...state,
        allMessages: action.payload.allMessages,
        message: action.payload.message,
        error: null,
        loading: false,
      };

    case CREATE_MESSAGE_FAILURE:
    case CREATE_CHAT_FAILURE:
    case GET_ALL_CHATS_FAILURE:
    case GET_MESSAAGE_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
