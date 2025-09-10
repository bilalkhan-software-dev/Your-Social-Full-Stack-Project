import { api, APP_BASE_URL } from "../../config/api";
import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  LOGOUT,
  GET_FIND_USER_BY_ID_REQUEST,
  GET_FIND_USER_BY_ID_SUCCESS,
  GET_FIND_USER_BY_ID_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILURE,
  SEND_OTP_TO_EMAIL_REQUEST,
  SEND_OTP_TO_EMAIL_SUCCESS,
  SEND_OTP_TO_EMAIL_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
} from "./authActionType";

const handleError = (error) => {
  // Network error (no response)
  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      httpStatusCode: 0,
    };
  }

  // Server error response
  return {
    message: error.response.data?.message || "Request failed",
    httpStatusCode: error.response.status, // Actual HTTP status code
  };
};

const handleSuccess = (response) => {
  return {
    token: response.data.data?.token, // server dto handler token
    userDetails: response.data.data, // server dto handler user details
    message: response.data.message, // server handler message
    httpStatusCode: response.status, // http status code
    searchedUser: response.data.data, // server dto response
    forgotRequestEmailResponse: response.data.data, // server dto response
  };
};

export const loginUserAction = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(
      `${APP_BASE_URL}/auth/login`,
      credentials
    );

    const { token } = handleSuccess(response);
    if (token) {
      localStorage.setItem("jwt", token);
    }
    dispatch({ type: LOGIN_SUCCESS, payload: { token } });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({ type: LOGIN_FAILURE, payload: { message, httpStatusCode } });
    throw { message, httpStatusCode };
  }
};

// Register
export const registerUserAction = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(
      `${APP_BASE_URL}/auth/register`,
      userData
    );

    const { message, httpStatusCode } = handleSuccess(response);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: { message, httpStatusCode },
    });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({ type: REGISTER_FAILURE, payload: { message, httpStatusCode } });
    throw { message, httpStatusCode };
  }
};

export const sendOtpToEmail = (email) => async (dispatch) => {
  dispatch({ type: SEND_OTP_TO_EMAIL_REQUEST });
  try {
    const response = await axios.get(
      `${APP_BASE_URL}/auth/reset-password-request/${email}`
    );
  

    const { forgotRequestEmailResponse, message, httpStatusCode } =
      handleSuccess(response);
    if (forgotRequestEmailResponse) {
      localStorage.setItem("email", forgotRequestEmailResponse);
    }
    dispatch({
      type: SEND_OTP_TO_EMAIL_SUCCESS,
      payload: { email: forgotRequestEmailResponse, message, httpStatusCode },
    });

    return response.data.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: SEND_OTP_TO_EMAIL_FAILURE,
      payload: { message, httpStatusCode },
    });

    throw { message, httpStatusCode };
  }
};

export const verifyOtp = (otp, email) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const response = await axios.get(
      `${APP_BASE_URL}/auth/verify-otp/${otp}/${email}`
    );
  

    const { forgotRequestEmailResponse, message, httpStatusCode } =
      handleSuccess(response);
    dispatch({
      type: VERIFY_OTP_SUCCESS,
      payload: { email: forgotRequestEmailResponse, message, httpStatusCode },
    });

    return response.data.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: VERIFY_OTP_FAILURE,
      payload: { message, httpStatusCode },
    });

    throw { message, httpStatusCode };
  }
};

export const resetPassword = (requestData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const response = await axios.put(
      `${APP_BASE_URL}/auth/reset-password`,
      requestData
    );

    const { message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: { message, httpStatusCode },
    });
    localStorage.removeItem("email");
    return response.data.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: RESET_PASSWORD_FAILURE,
      payload: { message, httpStatusCode },
    });
    throw { message, httpStatusCode };
  }
};

// Get Profile
export const getProfileAction = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const response = await api.get("/user/profile");

    const { userDetails, message, httpStatusCode } = handleSuccess(response);

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: { user: userDetails, message, httpStatusCode },
    });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_PROFILE_FAILURE,
      payload: { message, httpStatusCode },
    });
    throw { message, httpStatusCode };
  }
};

// Get findUserById
export const getFindUserByIdAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_FIND_USER_BY_ID_REQUEST });
  try {
    const response = await api.get(`/user/${userId}`);

    const { userDetails, message, httpStatusCode } = handleSuccess(response);

    dispatch({
      type: GET_FIND_USER_BY_ID_SUCCESS,
      payload: { user: userDetails, message, httpStatusCode },
    });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_FIND_USER_BY_ID_FAILURE,
      payload: { message, httpStatusCode },
    });
    throw { message, httpStatusCode };
  }
};

// search user action
export const searchedUserAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const response = await api.get(`/user/search/${query}`);

    const { searchedUser, message, httpStatusCode } = handleSuccess(response);

    dispatch({
      type: SEARCH_USER_SUCCESS,
      payload: {
        searchedUser: searchedUser,
        message,
        httpStatusCode,
      },
    });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: SEARCH_USER_FAILURE,
      payload: { message, httpStatusCode },
    });
    throw { message, httpStatusCode };
  }
};

// Get follow User
export const getFollowUserAction = (userId) => async (dispatch) => {
  dispatch({ type: FOLLOW_USER_REQUEST });
  try {
    const response = await api.put(`/user/follow/${userId}`);

    const { userDetails, message, httpStatusCode } = handleSuccess(response);

    dispatch({
      type: FOLLOW_USER_SUCCESS,
      payload: { user: userDetails, message, httpStatusCode },
    });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: FOLLOW_USER_FAILURE,
      payload: { message, httpStatusCode },
    });
    throw { message, httpStatusCode };
  }
};

// Update Profile
export const updateProfileAction = (updateData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const response = await api.put("/user/update", updateData);

    const { userDetails, message, httpStatusCode } = handleSuccess(response);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: { user: userDetails, message, httpStatusCode },
    });

    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      payload: { message, httpStatusCode },
    });
    throw { message, httpStatusCode };
  }
};

// Logout
export const logoutAction = () => (dispatch) => {
  localStorage.removeItem("jwt");
  delete api.defaults.headers.Authorization;
  dispatch({ type: LOGOUT });
  return Promise.resolve();
};
