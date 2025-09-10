// import { comment } from "postcss";
// import {
//   CREATE_POST_REQUEST,
//   CREATE_POST_SUCCESS,
//   CREATE_POST_FAILURE,
//   GET_ALL_POST_REQUEST,
//   GET_ALL_POST_SUCCESS,
//   GET_ALL_POST_FAILURE,
//   GET_USER_POST_REQUEST,
//   GET_USER_POST_SUCCESS,
//   GET_USER_POST_FAILURE,
//   LIKE_POST_REQUEST,
//   LIKE_POST_SUCCESS,
//   LIKE_POST_FAILURE,
//   CREATE_COMMENT_SUCCESS,
//   CREATE_COMMENT_REQUEST,
//   SAVED_POST_REQUEST,
//   GET_USER_SAVED_POST_REQUEST,
//   GET_USER_SAVED_POST_SUCCESS,
//   GET_USER_SAVED_POST_FAILURE,
//   SAVED_POST_SUCCESS,
//   SAVED_POST_FAILURE
// } from "./postActionType";


// const initialState = {
//   post: null,
//   newComment: null,
//   allPosts: [],
//   userPosts: [],
//   savedPosts: [],
//   comments: [],
//   loading: false,
//   error: null,
//   message: null
// };

// export const postReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case CREATE_POST_REQUEST:
//     case GET_ALL_POST_REQUEST:
//     case GET_USER_POST_REQUEST:
//     case LIKE_POST_REQUEST:
//     case CREATE_COMMENT_REQUEST:
//     case SAVED_POST_REQUEST:
//     case GET_USER_SAVED_POST_REQUEST:
//       return {
//         ...state,
//         loading: true,
//         error: null,
//         message: null
//       };

//     case CREATE_POST_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         post: action.payload.post,
//         allPosts: [action.payload.post, ...state.allPosts],
//         userPosts: [action.payload.post, ...state.userPosts],
//         message: action.payload.message,
//         error: null
//       };

//     // In postReducer.js
//     case CREATE_COMMENT_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         message: action.payload.message,
//         newComment: action.payload.comment,
//       };


//     case LIKE_POST_SUCCESS:
//       const updatedAllPosts = state.allPosts.map(post =>
//         post.postId === action.payload.post.postId ? {
//           ...post,
//           isLiked: !post.isLiked, // toggle like status
//           postLikesCount: post.isLiked ?
//             post.postLikesCount - 1 :
//             post.postLikesCount + 1
//         } : post
//       );


//       const updatedUserPosts = state.userPosts.map(post =>
//         post.postId === action.payload.post.postId ? {
//           ...post,
//           isLiked: !post.isLiked, // toggle like status
//           postLikesCount: post.isLiked ?
//             post.postLikesCount - 1 :
//             post.postLikesCount + 1
//         } : post
//       );
//       const updatedUserSavedPosts = state.savedPosts.map(post =>
//         post.postId === action.payload.post.postId ? {
//           ...post,
//           isLiked: !post.isLiked, // toggle like status
//           postLikesCount: post.isLiked ?
//             post.postLikesCount - 1 :
//             post.postLikesCount + 1
//         } : post
//       );

//       return {
//         ...state,
//         loading: false,
//         post: action.payload.post,
//         allPosts: updatedAllPosts,
//         userPosts: updatedUserPosts,
//         savedPosts: updatedUserSavedPosts,
//         message: action.payload.message,
//         error: null
//       };


//     case SAVED_POST_SUCCESS:
//       const updateAllPosts = state.allPosts.map(post =>
//         post.postId === action.payload.post.postId ? {
//           ...post,
//           isSaved: !post.isSaved, // toggle like status
//           savesCount: post.isSaved ?
//             post.savesCount - 1 :
//             post.savesCount + 1
//         } : post
//       );


//       const updateUserPosts = state.userPosts.map(post =>
//         post.postId === action.payload.post.postId ? {
//           ...post,
//           isSaved: !post.isSaved, // toggle like status
//           savesCount: post.isSaved ?
//             post.savesCount - 1 :
//             post.savesCount + 1
//         } : post
//       );
//       const updateUserSavedPosts = state.savedPosts.map(post =>
//         post.postId === action.payload.post.postId ? {
//           ...post,
//           isSaved: !post.isSaved, // toggle like status
//           postLikesCount: post.isSaved ?
//             post.savesCount - 1 :
//             post.savesCount + 1
//         } : post
//       );

//       return {
//         ...state,
//         loading: false,
//         post: action.payload.post,
//         allPosts: updateAllPosts,
//         userPosts: updateUserPosts,
//         savedPosts: updateUserSavedPosts,
//         message: action.payload.message,
//         error: null
//       };

//     case GET_ALL_POST_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         allPosts: action.payload.allPosts,
//         comments: action.payload.allPosts.comments,
//         message: action.payload.message
//       };

//     case GET_USER_POST_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         userPosts: action.payload.userPosts,
//         comment: action.payload.userPosts.comments,
//         message: action.payload.message
//       };


//     case GET_USER_SAVED_POST_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         savedPosts: action.payload.savedPosts,
//         comment: action.payload.savedPosts.comments,
//         message: action.payload.message
//       };

//     case CREATE_POST_FAILURE:
//     case GET_ALL_POST_FAILURE:
//     case GET_USER_POST_FAILURE:
//     case LIKE_POST_FAILURE:
//     case SAVED_POST_FAILURE:
//     case GET_USER_SAVED_POST_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload.message,
//         message: action.payload.message
//       };

//     default:
//       return state;
//   }
// };