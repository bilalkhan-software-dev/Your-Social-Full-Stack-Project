// postActions.js
import { api } from "../../config/api";
import {
  CREATE_POST_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  GET_ALL_POST_FAILURE,
  GET_ALL_POST_REQUEST,
  GET_ALL_POST_SUCCESS,
  GET_USER_POST_REQUEST,
  GET_USER_POST_SUCCESS,
  GET_USER_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_REQUEST,
  SAVED_POST_REQUEST,
  SAVED_POST_SUCCESS,
  SAVED_POST_FAILURE,
  GET_USER_SAVED_POST_REQUEST,
  GET_USER_SAVED_POST_SUCCESS,
  GET_USER_SAVED_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_FAILURE,
  DELETE_POST_SUCCESS,
  DELETE_POST_REQUEST,
  COMMENT_LIKE_REQUEST,
  COMMENT_LIKE_SUCCESS,
  COMMENT_LIKE_FAILURE,
} from "./postActionType";

const handleError = (error) => {
  // Network error
  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      httpStatusCode: 0,
    };
  }

  // Server error response
  return {
    message: error.response.data?.message || "Request Failed!",
    httpStatusCode: error.response.status,
  };
};

const handleSuccess = (response) => {
  return {
    post: response.data.data || null,
    comment: response.data.data || null,
    allPosts: response.data.data || [],
    userPosts: response.data.data || [],
    savedPosts: response.data.data || [],
    message: response.data.message || null,
    httpStatusCode: response.status,
  };
};

export const createPostAction = (postData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_REQUEST });
  try {
    const response = await api.post("/post/create", postData);

    const { post, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: CREATE_POST_SUCCESS,
      payload: {
        post: post,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: CREATE_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};
export const createCommentAction = (requestData) => async (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  try {
    const response = await api.post(
      `/comment/create/post/${requestData.postId}`,
      requestData.data
    );

    const { comment, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: CREATE_COMMENT_SUCCESS,
      payload: {
        comment: comment,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: CREATE_COMMENT_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};

export const likeCommentPostAction = (commentId) => async (dispatch) => {
  dispatch({ type: COMMENT_LIKE_REQUEST });
  try {
    const response = await api.put(`/comment/like/${commentId}`);

    const message = response.data.message;
    const likeCount = response.data.likeCount;

    dispatch({
      type: COMMENT_LIKE_SUCCESS,
      payload: {
        message,
        likeCount,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: COMMENT_LIKE_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};

export const likePostAction = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  try {
    const response = await api.put(`/post/like/${postId}`);

    const { post, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: LIKE_POST_SUCCESS,
      payload: {
        post: post,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: LIKE_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};

export const savePostAction = (postId) => async (dispatch) => {
  dispatch({ type: SAVED_POST_REQUEST });
  try {
    const response = await api.put(`/post/saved/${postId}`);

    const { post, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: SAVED_POST_SUCCESS,
      payload: {
        post: post,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: SAVED_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};

export const getAllUserPostAction = () => async (dispatch) => {
  dispatch({ type: GET_USER_POST_REQUEST });
  try {
    const response = await api.get("/post/user/all");

    const { userPosts, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: GET_USER_POST_SUCCESS,
      payload: {
        userPosts: userPosts,
        message: message,
        httpStatusCode: httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_USER_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};
export const getUserSavedPostAction = () => async (dispatch) => {
  dispatch({ type: GET_USER_SAVED_POST_REQUEST });
  try {
    const response = await api.get("/post/user/save/all");
    const { savedPosts, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: GET_USER_SAVED_POST_SUCCESS,
      payload: {
        savedPosts: savedPosts,
        message: message,
        httpStatusCode: httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_USER_SAVED_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};
export const getAllPostAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_POST_REQUEST });
  try {
    const response = await api.get("/post/all");
    const { allPosts, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: GET_ALL_POST_SUCCESS,
      payload: {
        allPosts: allPosts,
        message: message,
        httpStatusCode: httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_ALL_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};

export const deletePostAction = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST });
  try {
    const response = await api.delete(`/post/delete/${postId}`);

    dispatch({
      type: DELETE_POST_SUCCESS,
      payload: {
        postId,
        message: response.data.message,
        httpStatusCode: response.status,
      },
    });
    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: DELETE_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};

export const updatePostAction = (postId, postData) => async (dispatch) => {
  dispatch({ type: UPDATE_POST_REQUEST });
  try {
    const response = await api.put(`/post/update/${postId}`, postData);

    const { post, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: UPDATE_POST_SUCCESS,
      payload: {
        post,
        message,
        httpStatusCode,
      },
    });
    return response.data;
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: UPDATE_POST_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};
