import { retrieveChunks } from "./retrieve.service.js";
import { generateLLM } from "./openrouter.service.js";

export const ragAnswer = async (query, history) => {
  const contextChunks = await retrieveChunks(query);

  if (contextChunks.length === 0) {
    try {
      const messages = [
      {
        role: "system",
        content: "You are a helpful customer support assistant. Provide well-structured, concise answers. Use headings and lists to organize information clearly. NEVER use asterisk symbols (*) in your responses. Keep answers brief (2-3 sentences for simple questions, structured lists for detailed information).",
      },
        ...(history || []),
        { role: "user", content: query },
      ];

      const result = await generateLLM(messages);
      return {
        reply: result.reply,
        source: "ai-fallback",
        model: result.model,
      };
    } catch (err) {
      return {
        reply: "I apologize, but I don't have that information in my knowledge base. Please contact our support team for assistance.",
        source: "none",
        model: "none",
      };
    }
  }

  const messages = [
    {
      role: "system",
      content: `You are a customer support assistant. Use ONLY the following knowledge to answer questions. Process and structure the information clearly:
- Use bullet points or numbered lists for features, plans, or steps
- Use headings to organize sections
- NEVER use asterisk symbols (*) in your responses
- Keep answers concise but well-structured
- Organize information logically (e.g., plans, pricing, features grouped together)
- Only use information from the knowledge base provided below

Knowledge base:
${contextChunks.join("\n\n")}`,
    },
    ...history,
    { role: "user", content: query },
  ];

  const result = await generateLLM(messages);

  return {
    reply: result.reply,
    source: "knowledge-base",
    model: result.model,
  };
};
