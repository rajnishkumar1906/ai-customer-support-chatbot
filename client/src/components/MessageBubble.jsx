const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-lg text-sm leading-relaxed
        ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div>{message.content}</div>

        {!isUser && message.source && (
          <div className="mt-1 text-xs text-gray-500">
            Source: {message.source}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
