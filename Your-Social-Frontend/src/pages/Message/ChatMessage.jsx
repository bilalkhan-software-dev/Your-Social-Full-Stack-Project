import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import  myLogo  from "../../assets/login logo.jpg";

const ChatMessage = ({ message }) => {
  const { auth } = useSelector((store) => store);
  const isSender = auth.user?.id === message.messageUserDetails?.userId;
  const hasAttachment = message.image;
  const messageTime = message.messageCreatedAt
    ? format(parseISO(message.messageCreatedAt), "h:mm a")
    : null;

  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} my-1 px-2`}
      aria-live="polite"
    >
      <div
        className={`max-w-xs p-2 rounded-2xl shadow-sm ${
          isSender
            ? "bg-gray-800 text-white rounded-tr-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        {hasAttachment && (
          <div className="mb-2 overflow-hidden rounded-t-lg">
            <img
              className="w-full h-48 object-cover"
              src={message.image}
              alt={message.content || "Chat attachment"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = { myLogo };
              }}
            />
          </div>
        )}

        {message.content && (
          <p className="break-words mb-1 text-sm">{message.content}</p>
        )}

        {messageTime && (
          <p
            className={`text-[10px] ${
              isSender ? "text-blue-100" : "text-gray-950/100"
            }`}
          >
            {messageTime}
          </p>
        )}
      </div>
    </div>
  );
};
export default ChatMessage;
