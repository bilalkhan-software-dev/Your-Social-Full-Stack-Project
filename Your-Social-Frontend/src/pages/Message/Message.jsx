import {
  Avatar,
  Grid,
  IconButton,
  Tooltip,
  InputBase,
  CircularProgress,
  Box,
  useTheme,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import VideoCallIcon from "@mui/icons-material/VideocamRounded";
import AddIcCallIcon from "@mui/icons-material/CallRounded";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MenuIcon from "@mui/icons-material/Menu";
import SearchUser from "../../components/SearchUser/SearchUser";
import UserChatCard from "./UserChatCard";
import ChatMessage from "./ChatMessage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
  createMessageAction,
  getAllChatsOfTheUserAction,
  getAllMessageOfTheChatAction,
} from "../../Redux/Message/messageAction";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import { useFormik } from "formik";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {
  differenceInDays,
  format,
  isSameDay,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { getProfileAction } from "../../Redux/Auth/authAction";

const Message = () => {
  const [uploading, setUploading] = useState({
    image: false,
  });
  const [uploadProgress, setUploadProgress] = useState({
    image: 0,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [webSocketMessages, setWebSocketMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { message, auth } = useSelector((store) => store);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(getAllChatsOfTheUserAction());
  }, []);

  useEffect(() => {
    dispatch(getProfileAction());
  }, []);

  const messages = [...message.allMessages, ...webSocketMessages];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Web-Socket Configuration
  const [stompClient, setStompClient] = useState(null);
  useEffect(() => {
    const sock = new SockJS("http://localhost:8081/web-socket");
    const stomp = Stomp.over(sock);
    setStompClient(stomp);

    stomp.connect({}, onConnect, onError);

    return () => {
      if (stomp.connected) {
        stomp.disconnect();
      }
    };
  }, []);

  const onConnect = () => {
    console.log("Websocket connected");
  };

  const onError = (error) => {
    console.log("Failed to connect Websocket: ", error);
  };

  useEffect(() => {
    if (stompClient && auth.user && currentChat) {
      const subscription = stompClient.subscribe(
        `/user/${currentChat?.id}/private`,
        onMessageReceive
      );
      return () => subscription.unsubscribe();
    }
  }, [stompClient, currentChat?.id]);

  const sendMessageToServer = (newMessage) => {
    if (stompClient && newMessage) {
      stompClient.send(
        `/app/chat/${currentChat?.id.toString()}`,
        {},
        JSON.stringify(newMessage)
      );
    }
  };

  const onMessageReceive = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    setWebSocketMessages((prev) => [...prev, receivedMessage]);
  };

  const formik = useFormik({
    initialValues: { content: "", image: "" },
    onSubmit: async (values, { resetForm }) => {
      if (!currentChat?.id) return;

      const messageData = {
        chatId: currentChat.id,
        data: values,
      };

      try {
        await dispatch(
          createMessageAction({
            message: messageData,
            sendMessageToServer,
          })
        );
        resetForm();
        setImagePreview(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  });

  const handleChatUserClick = (chat) => {
    // currentChat("")
    setCurrentChat(chat);
    setWebSocketMessages([]);
    dispatch(getAllMessageOfTheChatAction(chat.id));
    if (isSmallScreen) {
      setShowSidebar(false);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading({ ...uploading, image: true });

    try {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      const url = await uploadToCloudinary(file, "image", (progress) =>
        setUploadProgress({ ...uploadProgress, image: progress })
      );

      formik.setFieldValue("image", url);
    } catch (error) {
      console.error("Image upload failed:", error);
      setImagePreview(null);
    } finally {
      setUploading({ ...uploading, image: false });
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    formik.setFieldValue("image", "");
  };

  const formatMessageDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (differenceInDays(new Date(), date) <= 7) return format(date, "EEEE");
    return format(date, "dd MMM, yyyy");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderSidebarContent = () => (
    <div className="h-full px-4 flex flex-col">
      <div className="flex items-center space-x-4 py-5">
        <Tooltip title="Back to home" arrow>
          <IconButton onClick={() => navigate("/")}>
            <WestIcon />
          </IconButton>
        </Tooltip>
        <h1 className="text-xl font-bold">Chats</h1>
      </div>
      <div className="py-3">
        <SearchUser />
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {message.allChats.length > 0 ? (
          message.allChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatUserClick(chat)}
              className={`cursor-pointer hover:bg-gray-100 rounded-lg ${
                currentChat?.id === chat.id ? "bg-gray-200 text-gray-950" : ""
              }`}
            >
              <UserChatCard chat={chat} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChatBubbleRoundedIcon sx={{ fontSize: 60, mb: 2 }} />
            <p>No chats found</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="h-screen w-full"
      style={{ backgroundColor: theme.palette.background.default }}
    >
      <Grid container className="h-full overflow-hidden">
        {/* Left sidebar - Drawer for mobile, regular for desktop */}
        {isSmallScreen ? (
          <Drawer
            anchor="left"
            open={showSidebar}
            onClose={() => setShowSidebar(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: "80%",
                maxWidth: 350,
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            {renderSidebarContent()}
          </Drawer>
        ) : (
          <Grid
            item
            xs={12}
            md={4}
            className="border-r w-full md:w-[20%] h-full"
            style={{ backgroundColor: theme.palette.background.paper }}
          >
            {renderSidebarContent()}
          </Grid>
        )}

        {/* Right chat area */}
        <Grid
          item
          xs={12}
          md={8}
          className="h-full flex flex-col w-full md:w-[80%]"
          style={{ backgroundColor: theme.palette.background.default }}
        >
          {currentChat ? (
            <div className="flex flex-col h-full">
              {/* Chat header */}
              <div
                className="flex justify-between items-center p-4 border-b"
                style={{ backgroundColor: theme.palette.background.paper }}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {isSmallScreen && (
                    <Tooltip title="Show chats" arrow>
                      <IconButton onClick={toggleSidebar}>
                        <MenuIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Go to profile" arrow>
                    <IconButton
                      onClick={() =>
                        navigate(
                          `/profile/${
                            auth.user?.id === currentChat.users[0].userId
                              ? currentChat.users[1].userId
                              : currentChat.users[0].userId
                          }`
                        )
                      }
                    >
                      <Avatar
                        src={
                          auth.user?.id === currentChat.users[0].userId
                            ? currentChat.users[1].image
                            : currentChat.users[0].image || ""
                        }
                      />
                    </IconButton>
                  </Tooltip>
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {auth.user?.id === currentChat.users[0].userId
                        ? currentChat.users[1].fullName
                        : currentChat.users[0].fullName || "Unknown user"}
                    </p>
                    <p className="text-xs text-gray-500">{"Online"}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Tooltip title="Voice call">
                    <IconButton aria-label="voice call">
                      <AddIcCallIcon className="text-gray-600 hover:text-blue-500" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Video call">
                    <IconButton aria-label="video call">
                      <VideoCallIcon className="text-gray-600 hover:text-blue-500" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar bg-gray-50 dark:bg-gray-900/100 bg-opacity-30"
                style={{
                  backgroundImage:
                    "url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')",
                  backgroundRepeat: "repeat",
                }}
              >
                {messages?.length > 0 ? (
                  messages.map((msg, index) => {
                    const showDate =
                      index === 0 ||
                      !isSameDay(
                        parseISO(msg.messageCreatedAt),
                        parseISO(messages[index - 1].messageCreatedAt)
                      );
                    return (
                      <React.Fragment key={`${msg.messageId}-${index}`}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <div className="bg-gray-200 text-xs text-gray-600 px-3 py-1 rounded-full">
                              {formatMessageDate(msg.messageCreatedAt)}
                            </div>
                          </div>
                        )}
                        <ChatMessage message={msg} />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    <p>No messages yet</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div
                className="sticky bottom-0 border-t bg-white p-3"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                }}
              >
                {imagePreview && (
                  <Box
                    sx={{
                      position: "relative",
                      mb: 2,
                      mx: 2,
                      display: "inline-block",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <IconButton
                      onClick={removeImagePreview}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "error.main",
                        color: "error.contrastText",
                        "&:hover": { backgroundColor: "error.dark" },
                      }}
                    >
                      ×
                    </IconButton>
                  </Box>
                )}
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      hidden
                    />
                    <Tooltip title="Attach file">
                      <IconButton
                        aria-label="add attachment"
                        onClick={handleSelectImage}
                        disabled={uploading.image}
                      >
                        {uploading.image ? (
                          <CircularProgress
                            size={24}
                            value={uploadProgress.image}
                          />
                        ) : (
                          <AttachFileIcon className="text-gray-600 hover:text-blue-500" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add emoji">
                      <IconButton aria-label="add emoji">
                        <EmojiEmotionsIcon className="text-gray-600 hover:text-blue-500" />
                      </IconButton>
                    </Tooltip>
                    <InputBase
                      fullWidth
                      name="content"
                      placeholder="Write a message..."
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "light"
                            ? "grey.100"
                            : "grey.800",
                        borderRadius: "50px",
                        px: 2,
                        py: 1,
                      }}
                      endAdornment={
                        <Tooltip title="Send message">
                          <IconButton
                            type="submit"
                            disabled={
                              !formik.values.content.trim() &&
                              !formik.values.image
                            }
                            sx={{ color: "primary.main" }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                      }
                    />
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col space-y-5 justify-center items-center bg-[#f0f2f5]">
              <ChatBubbleRoundedIcon
                sx={{
                  fontSize: 60,
                  color: "white",
                  bgcolor: "grey",
                  borderRadius: "50%",
                  p: 1,
                }}
              />
              <p className="text-xl font-semibold">No chat selected</p>
              <p className="text-gray-500">Select a chat to start messaging</p>
              {isSmallScreen && (
                <button
                  onClick={toggleSidebar}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Show Chats
                </button>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
