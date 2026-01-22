import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { sendMessage, getHistory } from "../services/api";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(
    localStorage.getItem("conversationId")
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId) {
      getHistory(conversationId).then((res) =>
        setMessages(res.data)
      );
    }
  }, []);

  const handleSend = async (text) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);
    setLoading(true);

    const res = await sendMessage({
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

        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default Chat;
