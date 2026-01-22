import { useEffect, useState, useRef } from "react";
import api from "../services/api"; // ✅ FIXED (default import)
import ChatBubble from "../components/ChatBubble";
import { socket } from "../services/socket";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const id = localStorage.getItem("conversationId");
    if (id) setConversationId(id);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      if (conversationId) {
        socket.emit("joinConversation", conversationId);
      }
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      setLoading(false);
    });

    return () => {
      socket.off("connect");
      socket.off("newMessage");
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    api
      .get(`/chat/history/${conversationId}`)
      .then((res) => {
        setMessages(res.data);
        socket.emit("joinConversation", conversationId);
      })
      .catch((err) => console.error("Error loading history:", err));
  }, [conversationId]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const res = await api.post("/chat/send", {
        conversationId,
        message: currentInput,
      });

      if (!conversationId) {
        localStorage.setItem("conversationId", res.data.conversationId);
        setConversationId(res.data.conversationId);
        socket.emit("joinConversation", res.data.conversationId);
      }

      if (!socket.connected) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.reply,
            source: res.data.source,
            model: res.data.model,
          },
        ]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="ml-72 h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Customer Support Chat
            </h1>
            <p className="text-gray-600 mt-1">Ask me anything about our products and services</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative text-7xl">💬</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Start a conversation</h2>
              <p className="text-gray-600 mb-6">
                Ask me anything about our products, pricing, features, or support policies.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="px-4 py-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setInput("What are your pricing plans?")}>
                  💰 Pricing Plans
                </div>
                <div className="px-4 py-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setInput("What features do you offer?")}>
                  ✨ Features
                </div>
                <div className="px-4 py-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setInput("What is your refund policy?")}>
                  🔄 Refund Policy
                </div>
                <div className="px-4 py-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setInput("How can I get support?")}>
                  🆘 Support Help
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
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
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-50"></div>
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="px-8 py-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-4"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
            className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            <span>Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
