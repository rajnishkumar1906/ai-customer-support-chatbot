import fs from "fs";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { embedText } from "./embedding.service.js";

const CHUNK_SIZE = 400;

const text = fs.readFileSync("knowledge-base.txt", "utf-8");

const chunks = text
  .split("\n")
  .map(t => t.trim())
  .filter(Boolean);

(async () => {
  await KnowledgeChunk.deleteMany();

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);

    await KnowledgeChunk.create({
      text: chunk,
      embedding,
    });
  }

  console.log("✅ Knowledge base ingested:", chunks.length);
  process.exit(0);
})();
