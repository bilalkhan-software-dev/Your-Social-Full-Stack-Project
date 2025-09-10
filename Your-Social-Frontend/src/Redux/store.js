import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/authReducers";
import { postReducer } from "./Post/postReducer";
import { messageReducer } from "./Message/messageReducer";
import { reelReducer } from "./Reel/reelReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  message: messageReducer,
  reel: reelReducer,
  // Add other reducers here
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
