import { api } from "../../config/api";
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

const handleError = (error) => {
  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      httpStatusCode: 0,
    };
  }

  // Sever error response
  return {
    message: error.response.data.message || "Request Failed!",
    httpStatusCode: error.response.status,
  };
};

const handleSuccess = (response) => {
  return {
    newMessage: response.data.data || null,
    allMessages: response.data.data || [],
    allChats: response.data.data || [],
    chat: response.data.data || null,
    message: response.data.message || null,
    httpStatusCode: response.data.status || 0,
  };
};

// Create message action
export const createMessageAction = (requestData) => async (dispatch) => {
  dispatch({ type: CREATE_MESSAGE_REQUEST });

  try {
    const response = await api.post(
      `/message/create/chat/${requestData.message.chatId}`,
      requestData.message.data
    );
    console.log("Message Response: ", response);
    if (response.data.status !== "success") {
      throw {
        response: {
          data: {
            message: response.data.message || "Sending Message Failed!",
            status: response.status,
          },
        },
      };
    }

    const { newMessage, message, httpStatusCode } = handleSuccess(response);
    requestData.sendMessageToServer(newMessage);
    dispatch({
      type: CREATE_MESSAGE_SUCCESS,
      payload: {
        newMessage: newMessage,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: CREATE_MESSAGE_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw error;
  }
};

// Create chat action
export const createChatAction = (chatRequest) => async (dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });

  try {
    const response = await api.post("/chat/create", chatRequest);
    console.log("Crate Chat Response: ", response);

    if (response.data.status !== "success") {
      throw {
        response: {
          data: {
            message: response.data.message || "Failed to create chat",
            status: response.status,
          },
        },
      };
    }

    const { chat, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: CREATE_CHAT_SUCCESS,
      payload: {
        chat: chat,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: CREATE_CHAT_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw error;
  }
};

// Get all message of the chat if user loggedin action
export const getAllMessageOfTheChatAction = (chatId) => async (dispatch) => {
  dispatch({ type: GET_MESSAAGE_BY_ID_REQUEST });

  try {
    const response = await api.get(`/message/chat/${chatId}`);
    const { allMessages, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: GET_MESSAAGE_BY_ID_SUCCESS,
      payload: {
        allMessages: allMessages,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_MESSAAGE_BY_ID_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw error;
  }
};

// Get all chat of the user action
export const getAllChatsOfTheUserAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CHATS_REQUEST });

  try {
    const response = await api.get("/chat/user/all");
    const { allChats, message, httpStatusCode } = handleSuccess(response);
    dispatch({
      type: GET_ALL_CHATS_SUCCESS,
      payload: {
        allChats: allChats,
        message,
        httpStatusCode,
      },
    });
  } catch (error) {
    const { message, httpStatusCode } = handleError(error);
    dispatch({
      type: GET_ALL_CHATS_FAILURE,
      payload: {
        message,
        httpStatusCode,
      },
    });
    throw { message, httpStatusCode };
  }
};
