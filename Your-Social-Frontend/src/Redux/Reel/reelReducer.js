import { LOGOUT } from "../Auth/authActionType";
import { CREATE_COMMENT_REQUEST } from "../Post/postActionType";
import {
  ALL_REEL_ACTION_FAILURE,
  ALL_REEL_ACTION_REQUEST,
  ALL_REEL_ACTION_SUCCESS,
  CREATE_REEL_ACTION_FAILURE,
  CREATE_REEL_ACTION_SUCCESS,
  DELETE_REEL_ACTION_FAILURE,
  DELETE_REEL_ACTION_REQUEST,
  DELETE_REEL_ACTION_SUCCESS,
  FETCH_USER_REEL_ACTION_FAILURE,
  FETCH_USER_REEL_ACTION_REQUEST,
  FETCH_USER_REEL_ACTION_SUCCESS,
} from "./reelActionType";

const initialState = {
  loading: false,
  error: null,
  message: null,
  allReels: [],
  userReels: [],
  reel: null,
};

export const reelReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COMMENT_REQUEST:
    case FETCH_USER_REEL_ACTION_REQUEST:
    case ALL_REEL_ACTION_REQUEST:
    case DELETE_REEL_ACTION_REQUEST:
      return {
        ...state,
        message: null,
        error: null,
        loading: true,
      };

    case CREATE_REEL_ACTION_SUCCESS:
      return {
        ...state,
        reel: action.payload.data,
        allReels: [action.payload.data, ...state.allReels],
        userReels: [action.payload.data, ...state.userReels],
        message: action.payload.message,
        loading: false,
        error: null,
      };

    case DELETE_REEL_ACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        error: null,
        userReels: state.userReels.filter(
          (reel) => reel._id !== action.payload.reelId
        ),
        allReels: state.allReels.filter(
          (reel) => reel._id !== action.payload.reelId
        ),
      };

    case FETCH_USER_REEL_ACTION_SUCCESS:
      return {
        ...state,
        userReels: action.payload.data,
        message: action.payload.message,
        loading: false,
        error: null,
      };
    case ALL_REEL_ACTION_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        error: null,
        allReels: action.payload.data,
        loading: false,
      };

    case CREATE_REEL_ACTION_FAILURE:
    case FETCH_USER_REEL_ACTION_FAILURE:
    case ALL_REEL_ACTION_FAILURE:
    case DELETE_REEL_ACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        message: null,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
