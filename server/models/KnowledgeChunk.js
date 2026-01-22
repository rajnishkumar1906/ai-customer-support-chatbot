import mongoose from "mongoose";

const KnowledgeChunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  source: { type: String, required: false }, // Track which file the chunk came from
});

export default mongoose.model("KnowledgeChunk", KnowledgeChunkSchema);
