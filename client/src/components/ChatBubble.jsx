function formatMarkdown(text) {
  if (!text) return '';
  
  let formatted = text;

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*/g, '');
  
  const lines = formatted.split('\n');
  const processed = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.match(/^#+\s+/)) {
      if (line.match(/^###\s+/)) {
        processed.push(`<h3 class="font-bold text-base mt-3 mb-2">${line.replace(/^###\s+/, '')}</h3>`);
      } else if (line.match(/^##\s+/)) {
        processed.push(`<h2 class="font-bold text-lg mt-4 mb-2">${line.replace(/^##\s+/, '')}</h2>`);
      } else if (line.match(/^#\s+/)) {
        processed.push(`<h1 class="font-bold text-xl mt-4 mb-2">${line.replace(/^#\s+/, '')}</h1>`);
      } else {
        processed.push(`<div class="mb-2">${line}</div>`);
      }
    } else if (line.match(/^\d+\.\s+/)) {
      processed.push(`<div class="flex gap-2 mb-1"><span class="font-semibold">${line.match(/^\d+/)[0]}.</span><span>${line.replace(/^\d+\.\s+/, '')}</span></div>`);
    } else if (line.match(/^[-•]\s+/)) {
      processed.push(`<div class="flex gap-2 mb-1 ml-2"><span>•</span><span>${line.replace(/^[-•]\s+/, '')}</span></div>`);
    } else if (line.trim() === '') {
      processed.push('<div class="h-2"></div>');
    } else {
      processed.push(`<div class="mb-1">${line}</div>`);
    }
  }
  
  return processed.join('');
}

export default function ChatBubble({ role, content, source, model }) {
  const isUser = role === "user";
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isUser && (
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-50"></div>
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none"
              : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <div 
            className="text-sm leading-relaxed break-words prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: isUser ? content : formatMarkdown(content) }}
          />
        </div>

        {!isUser && (
          <div className="mt-1.5 text-xs text-gray-400 px-1">{time}</div>
        )}

        {isUser && (
          <div className="mt-1.5 text-xs text-gray-400 px-1">{time}</div>
        )}
      </div>

      {isUser && (
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-md opacity-50"></div>
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">You</span>
          </div>
        </div>
      )}
    </div>
  );
}
