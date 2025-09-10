import { api } from "../../config/api";
import {
  ALL_REEL_ACTION_FAILURE,
  ALL_REEL_ACTION_REQUEST,
  ALL_REEL_ACTION_SUCCESS,
  CREATE_REEL_ACTION_FAILURE,
  CREATE_REEL_ACTION_REQUEST,
  CREATE_REEL_ACTION_SUCCESS,
  DELETE_REEL_ACTION_FAILURE,
  DELETE_REEL_ACTION_REQUEST,
  DELETE_REEL_ACTION_SUCCESS,
  FETCH_USER_REEL_ACTION_FAILURE,
  FETCH_USER_REEL_ACTION_REQUEST,
  FETCH_USER_REEL_ACTION_SUCCESS,
} from "./reelActionType";

const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    // When backend server is stopped running
    return "Network error. Please check your connection.";
  } else {
    // Something happened in setting up the request
    return error.message;
  }
};

export const createReelAction = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_REEL_ACTION_REQUEST });

  try {
    const { data: response } = await api.post("/reel/create", formData);

    dispatch({
      type: CREATE_REEL_ACTION_SUCCESS,
      payload: {
        data: response.data,
        message: response.message || "Reel created successfully",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error);

    dispatch({
      type: CREATE_REEL_ACTION_FAILURE,
      payload: { error: message },
    });

    return { success: false, error: message };
  }
};

export const getAllUserReelAction = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_REEL_ACTION_REQUEST });

  try {
    const { data: response } = await api.get("/reel/user/all");
    dispatch({
      type: FETCH_USER_REEL_ACTION_SUCCESS,
      payload: {
        data: response.data,
        message: response.message || "User reels fetched successfully",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error);

    dispatch({
      type: FETCH_USER_REEL_ACTION_FAILURE,
      payload: { error: message },
    });

    return { success: false, error: message };
  }
};

export const getAllReelAction = () => async (dispatch) => {
  dispatch({ type: ALL_REEL_ACTION_REQUEST });

  try {
    const { data: response } = await api.get("/reel/all");
    dispatch({
      type: ALL_REEL_ACTION_SUCCESS,
      payload: {
        data: response.data,
        message: response.message || "All reels fetched successfully",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    const message = getErrorMessage(error);

    dispatch({
      type: ALL_REEL_ACTION_FAILURE,
      payload: { error: message },
    });

    return { success: false, error: message };
  }
};

export const deleteReelAction = (reelId) => async (dispatch) => {
  dispatch({ type: DELETE_REEL_ACTION_REQUEST });

  try {
    const { data: response } = await api.delete(`/reel/user/delete/${reelId}`);


    dispatch({
      type: DELETE_REEL_ACTION_SUCCESS,
      payload: {
        reelId,
        message: response.message || "Reel deleted successfully",
      },
    });

    return { success: true, reelId };
  } catch (error) {
    const message = getErrorMessage(error);

    dispatch({
      type: DELETE_REEL_ACTION_FAILURE,
      payload: { error: message },
    });

    return { success: false, error: message };
  }
};
