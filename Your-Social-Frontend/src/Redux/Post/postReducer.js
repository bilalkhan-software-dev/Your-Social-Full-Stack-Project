import { LOGOUT } from "../Auth/authActionType";
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  GET_ALL_POST_REQUEST,
  GET_ALL_POST_SUCCESS,
  GET_ALL_POST_FAILURE,
  GET_USER_POST_REQUEST,
  GET_USER_POST_SUCCESS,
  GET_USER_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  SAVED_POST_REQUEST,
  SAVED_POST_SUCCESS,
  SAVED_POST_FAILURE,
  GET_USER_SAVED_POST_REQUEST,
  GET_USER_SAVED_POST_SUCCESS,
  GET_USER_SAVED_POST_FAILURE,
  DELETE_POST_SUCCESS,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_REQUEST,
  DELETE_POST_REQUEST,
  UPDATE_POST_FAILURE,
  COMMENT_LIKE_REQUEST,
  COMMENT_LIKE_SUCCESS,
  COMMENT_LIKE_FAILURE,
  CREATE_COMMENT_FAILURE,
} from "./postActionType";

// Helper functions
const togglePostLike = (post) => ({
  ...post,
  isLiked: !post.isLiked,
  postLikesCount: post.isLiked
    ? post.postLikesCount - 1
    : post.postLikesCount + 1,
});

const addCommentToPost = (post, comment) => ({
  ...post,
  comments: [...post.comments, comment],
  commentsCount: post.commentsCount + 1,
});

const initialState = {
  post: null,
  newComment: null,
  allPosts: [],
  commentLikeMessage: null,
  userPosts: [],
  savedPosts: [],
  loading: false,
  error: null,
  message: null,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request cases
    case CREATE_POST_REQUEST:
    case GET_ALL_POST_REQUEST:
    case GET_USER_POST_REQUEST:
    case LIKE_POST_REQUEST:
    case CREATE_COMMENT_REQUEST:
    case SAVED_POST_REQUEST:
    case GET_USER_SAVED_POST_REQUEST:
    case UPDATE_POST_REQUEST:
    case DELETE_POST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case COMMENT_LIKE_REQUEST:
      return {
        ...state,
        message: null,
        error: null,
        loading: true,
        commentLikeMessage: null,
        newComment: null,
      };

    // Success cases
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload.post,
        allPosts: [action.payload.post, ...state.allPosts],
        userPosts: [action.payload.post, ...state.userPosts],
        message: action.payload.message,
        error: null,
      };

    case CREATE_COMMENT_SUCCESS:
      const updatedPostsWithComment = state.allPosts.map((post) =>
        post.postId === action.payload.postId
          ? addCommentToPost(post, action.payload.comment)
          : post
      );

      const updatedUserPostsWithComment = state.userPosts.map((post) =>
        post.postId === action.payload.postId
          ? addCommentToPost(post, action.payload.comment)
          : post
      );

      const updatedSavedPostsWithComment = state.savedPosts.map((post) =>
        post.postId === action.payload.postId
          ? addCommentToPost(post, action.payload.comment)
          : post
      );

      return {
        ...state,
        loading: false,
        newComment: action.payload.comment,
        allPosts: updatedPostsWithComment,
        userPosts: updatedUserPostsWithComment,
        savedPosts: updatedSavedPostsWithComment,
        message: action.payload.message,
        error: null,
      };

    case LIKE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload.post,
        allPosts: state.allPosts.map((post) =>
          post.postId === action.payload.post.postId
            ? togglePostLike(post)
            : post
        ),
        userPosts: state.userPosts.map((post) =>
          post.postId === action.payload.post.postId
            ? togglePostLike(post)
            : post
        ),
        savedPosts: state.savedPosts.map((post) =>
          post.postId === action.payload.post.postId
            ? togglePostLike(post)
            : post
        ),
        message: action.payload.message,
        error: null,
      };

    case COMMENT_LIKE_SUCCESS:
      return {
        ...state,
        loading: false,
        commentLikeMessage: action.payload.message,
        error: null,
      };

    case SAVED_POST_SUCCESS:
      const updatedAllPosts = state.allPosts.map((post) =>
        post.postId === action.payload.post.postId
          ? {
              ...post,
              isSaved: !post.isSaved,
              savesCount: post.isSaved
                ? post.savesCount - 1
                : post.savesCount + 1,
            }
          : post
      );

      const updatedUserPosts = state.userPosts.map((post) =>
        post.postId === action.payload.post.postId
          ? {
              ...post,
              isSaved: !post.isSaved,
              savesCount: post.isSaved
                ? post.savesCount - 1
                : post.savesCount + 1,
            }
          : post
      );

      let updatedSavedPosts = [...state.savedPosts];
      if (action.payload.post.isSaved) {
        // If post was saved, add it to savedPosts
        updatedSavedPosts = [action.payload.post, ...updatedSavedPosts];
      } else {
        // If post was unsaved, remove it from savedPosts
        updatedSavedPosts = updatedSavedPosts.filter(
          (post) => post.postId !== action.payload.post.postId
        );
      }

      return {
        ...state,
        loading: false,
        post: action.payload.post,
        allPosts: updatedAllPosts,
        userPosts: updatedUserPosts,
        savedPosts: updatedSavedPosts,
        message: action.payload.message,
        error: null,
      };

    case GET_ALL_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        allPosts: action.payload.allPosts,
        message: action.payload.message,
        error: null,
      };

    case GET_USER_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        userPosts: action.payload.userPosts,
        message: action.payload.message,
        error: null,
      };

    case GET_USER_SAVED_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        savedPosts: action.payload.savedPosts,
        message: action.payload.message,
        error: null,
      };

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        allPosts: state.allPosts.filter(
          (post) => post.postId !== action.payload.postId
        ),
        userPosts: state.userPosts.filter(
          (post) => post.postId !== action.payload.postId
        ),
        savedPosts: state.savedPosts.filter(
          (post) => post.postId !== action.payload.postId
        ),
        message: action.payload.message,
        error: null,
      };

    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload.post,
        allPosts: state.allPosts.map((post) =>
          post.postId === action.payload.post.postId
            ? action.payload.post
            : post
        ),
        userPosts: state.userPosts.map((post) =>
          post.postId === action.payload.post.postId
            ? action.payload.post
            : post
        ),
        savedPosts: state.savedPosts.map((post) =>
          post.postId === action.payload.post.postId
            ? action.payload.post
            : post
        ),
        message: action.payload.message,
        error: null,
      };

    case LOGOUT:
      return initialState;

    // Failure cases
    case CREATE_POST_FAILURE:
    case GET_ALL_POST_FAILURE:
    case GET_USER_POST_FAILURE:
    case LIKE_POST_FAILURE:
    case CREATE_COMMENT_FAILURE:
    case SAVED_POST_FAILURE:
    case GET_USER_SAVED_POST_FAILURE:
    case UPDATE_POST_FAILURE:
    case COMMENT_LIKE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        message: null,
      };

    default:
      return state;
  }
};
