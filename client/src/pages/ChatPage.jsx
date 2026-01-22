import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import ChatBubble from "../components/ChatBubble";
import { socket } from "../services/socket";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(localStorage.getItem("conversationId"));
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      setMessages((p) => [...p, msg]);
      setLoading(false);
    });
    return () => socket.off("newMessage");
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    api.get(`/chat/history/${conversationId}`).then((res) => setMessages(res.data));
    socket.emit("joinConversation", conversationId);
  }, [conversationId]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setMessages((p) => [...p, { role: "user", content: input }]);
    setLoading(true);

    const res = await api.post("/chat/send", { conversationId, message: input });
    if (!conversationId) {
      localStorage.setItem("conversationId", res.data.conversationId);
      setConversationId(res.data.conversationId);
    }
    setInput("");
  };

  return (
    <div className="ml-72 h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && <p className="text-gray-400">AI typing...</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-6 border-t bg-white flex gap-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-xl px-6 py-4"
          placeholder="Type your message..."
        />
        <button className="px-8 py-4 bg-blue-600 text-white rounded-xl">Send</button>
      </form>
    </div>
  );
}
