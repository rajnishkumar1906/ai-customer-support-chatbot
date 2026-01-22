import { useEffect, useState } from "react";
import api from "../services/api";
import ChatBubble from "../components/ChatBubble";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(localStorage.getItem("conversationId"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    api.get(`/chat/history/${conversationId}`).then((res) => setMessages(res.data));
  }, [conversationId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((p) => [...p, { role: "user", content: input }]);
    setLoading(true);

    const res = await api.post("/chat/send", { conversationId, message: input });
    setConversationId(res.data.conversationId);
    localStorage.setItem("conversationId", res.data.conversationId);

    setMessages((p) => [...p, { role: "assistant", content: res.data.reply }]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-xl shadow flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <p className="text-gray-400">AI typing...</p>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-4 border-t flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Type a message..."
          />
          <button className="bg-blue-600 text-white px-6 rounded-lg">Send</button>
        </form>
      </div>
    </div>
  );
}
