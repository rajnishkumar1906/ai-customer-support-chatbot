function formatMarkdown(text) {
  if (!text) return "";

  let formatted = text;

  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  const lines = formatted.split("\n");
  const out = [];

  lines.forEach((line) => {
    if (/^###\s+/.test(line)) {
      out.push(`<h3 class="font-bold text-base mt-3 mb-2">${line.replace(/^###\s+/, "")}</h3>`);
    } else if (/^##\s+/.test(line)) {
      out.push(`<h2 class="font-bold text-lg mt-4 mb-2">${line.replace(/^##\s+/, "")}</h2>`);
    } else if (/^#\s+/.test(line)) {
      out.push(`<h1 class="font-bold text-xl mt-4 mb-2">${line.replace(/^#\s+/, "")}</h1>`);
    } else if (/^\d+\.\s+/.test(line)) {
      const num = line.match(/^\d+/)[0];
      out.push(`<div class="flex gap-2 mb-1"><span class="font-semibold">${num}.</span><span>${line.replace(/^\d+\.\s+/, "")}</span></div>`);
    } else if (/^[-•]\s+/.test(line)) {
      out.push(`<div class="flex gap-2 mb-1 ml-2"><span>•</span><span>${line.replace(/^[-•]\s+/, "")}</span></div>`);
    } else if (line.trim() === "") {
      out.push(`<div class="h-2"></div>`);
    } else {
      out.push(`<div class="mb-1">${line}</div>`);
    }
  });

  return out.join("");
}

export default function ChatBubble({ role, content }) {
  const isUser = role === "user";

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isUser && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-50"></div>
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-md ${isUser ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none" : "bg-white border rounded-tl-none"}`}>
          <div
            className="text-sm leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: isUser ? content : formatMarkdown(content) }}
          />
        </div>
        <span className="text-xs text-gray-400 mt-1">{time}</span>
      </div>

      {isUser && (
        <div className="relative">
          <div className="absolute inset-0 bg-gray-400 rounded-full blur-md opacity-50"></div>
          <div className="relative w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">You</span>
          </div>
        </div>
      )}
    </div>
  );
}
