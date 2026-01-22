import { useEffect, useState } from "react";
import api from "../services/api";
import ChatBubble from "../components/ChatBubble";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(
    localStorage.getItem("conversationId")
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId) {
      api.get(`/chat/history/${conversationId}`).then((res) =>
        setMessages(res.data)
      );
    }
  }, [conversationId]);

  const handleSend = async (text) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);
    setLoading(true);

    const res = await api.post("/chat/send", {
      conversationId,
      message: text,
    });

    setConversationId(res.data.conversationId);
    localStorage.setItem(
      "conversationId",
      res.data.conversationId
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.data.reply,
        source: res.data.source || res.data.model,
      },
    ]);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-xl shadow flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">
              AI Customer Support
            </h1>
            <p className="text-xs text-green-600">
              ● Online
            </p>
          </div>
          <a
            href="/analytics"
            className="text-sm text-blue-600 hover:underline"
          >
            Analytics
          </a>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              role={msg.role}
              content={msg.content}
              source={msg.source}
              model={msg.model}
            />
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.message.value;
              if (input.trim()) {
                handleSend(input);
                e.target.message.value = "";
              }
            }}
            className="flex gap-4"
          >
            <input
              type="text"
              name="message"
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
