import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
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
      console.log("Socket connected");
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

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      localStorage.removeItem("conversationId");
      setConversationId(null);
      setMessages([]);
      socket.off("joinConversation");
    }
  };

  return (
    <div className="ml-72 h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="relative flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Customer Support Chat</h1>
                <p className="text-blue-100 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  AI-powered assistant ready to help
                </p>
              </div>
              <button
                onClick={clearChat}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </span>
              </button>
            </div>
          </div>

          {conversationId && (
            <div className="px-6 py-2 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200/50">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-gray-700 font-medium">Active</span>
                </div>
                <span className="text-gray-400">•</span>
                <code className="text-xs font-mono text-gray-600 bg-white px-2.5 py-1 rounded-lg">
                  {conversationId.toString().substring(0, 12)}...
                </code>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/30">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 rounded-full shadow-2xl">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome to AI Support
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Ask me anything about our services, pricing, features, or support!
                </p>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  source={m.source}
                  model={m.model}
                />
              ))}

              {loading && (
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-50"></div>
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-lg border border-gray-100 max-w-md">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-150"></span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 border-t border-gray-200/50 bg-gradient-to-r from-white to-blue-50/30 p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none bg-white shadow-sm transition-all text-sm"
                  placeholder="Type your message... (Press Enter to send)"
                  rows={1}
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                  disabled={loading}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 bottom-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2.5 rounded-lg disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
