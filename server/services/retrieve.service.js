import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { embedText } from "./embedding.service.js";

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

export const retrieveChunks = async (query) => {
  const queryEmbedding = await embedText(query);

  const chunks = await KnowledgeChunk.find();

  const scored = chunks.map(c => ({
    text: c.text,
    source: c.source || "unknown",
    score: cosineSimilarity(queryEmbedding, c.embedding),
  }));

  return scored
    .filter(s => s.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // Increased to top 5 for better context
    .map(s => s.text);
};
