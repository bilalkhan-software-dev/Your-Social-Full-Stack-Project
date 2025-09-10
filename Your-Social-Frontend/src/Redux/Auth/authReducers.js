import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  LOGOUT,
  GET_FIND_USER_BY_ID_REQUEST,
  FOLLOW_USER_REQUEST,
  GET_FIND_USER_BY_ID_SUCCESS,
  FOLLOW_USER_SUCCESS,
  GET_FIND_USER_BY_ID_FAILURE,
  FOLLOW_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILURE,
  SEND_OTP_TO_EMAIL_REQUEST,
  VERIFY_OTP_REQUEST,
  RESET_PASSWORD_REQUEST,
  SEND_OTP_TO_EMAIL_SUCCESS,
  VERIFY_OTP_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  SEND_OTP_TO_EMAIL_FAILURE,
  VERIFY_OTP_FAILURE,
  RESET_PASSWORD_FAILURE,
} from "./authActionType";

const initialState = {
  token: null,
  user: null,
  searchedUser: [],
  loading: false,
  error: null,
  findUser: null,
  forgotEmailResponse: null,
  message: null,
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    // Combined request cases
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case GET_FIND_USER_BY_ID_REQUEST:
    case FOLLOW_USER_REQUEST:
    case SEARCH_USER_REQUEST:
    case SEND_OTP_TO_EMAIL_REQUEST:
    case VERIFY_OTP_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, message: null };

    case GET_PROFILE_REQUEST:
      return { ...state, loading: true, error: null, message: null };

    // Authentication success cases
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: payload.token,
        message: payload.message,
        error: null,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload.message,
        error: null,
      };

    // OTP and password reset cases
    case SEND_OTP_TO_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotEmailResponse: payload.email,
        message: payload.message,
        error: null,
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload.message,
        error: null,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload.message,
        forgotEmailResponse: null,
        error: null,
      };

    // Profile related cases
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.user,
        message: payload.message,
        error: null,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.user,
        message: payload.message,
        error: null,
      };

    // User search and follow cases
    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        searchedUser: payload.searchedUser,
        error: null,
      };

    case GET_FIND_USER_BY_ID_SUCCESS:
    case FOLLOW_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        findUser: payload.user,
        message: payload.message,
        error: null,
      };

    // Combined failure cases
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload?.message || "Authentication failed",
        message: null,
      };

    case SEND_OTP_TO_EMAIL_FAILURE:
    case VERIFY_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        forgotEmailResponse: null,
        error: payload?.message || "OTP operation failed. Please try again.",
        message: null,
      };

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          payload?.message || "Password reset failed. Please try again later.",
        message: null,
      };

    case SEARCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        searchedUser: [],
        error: payload?.message || "User search failed",
      };

    case GET_PROFILE_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload?.message || "Profile operation failed",
        message: payload?.message || null,
      };

    case GET_FIND_USER_BY_ID_FAILURE:
    case FOLLOW_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload?.message || "User operation failed",
        message: payload?.message || null,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
