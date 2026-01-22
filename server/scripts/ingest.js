import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { embedText } from "../services/embedding.service.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHUNK_SIZE = 400;

const ingestKnowledgeBase = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    const dataDir = path.join(__dirname, "../data");
    const files = fs.readdirSync(dataDir).filter((file) => file.endsWith(".txt"));

    if (files.length === 0) {
      console.error("❌ No .txt files found in data directory");
      process.exit(1);
    }

    console.log(`📁 Found ${files.length} knowledge base file(s): ${files.join(", ")}`);

    let allChunks = [];

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      console.log(`\n📄 Processing file: ${file}`);
      
      const text = fs.readFileSync(filePath, "utf-8");

      const chunks = text
        .split(/\n\s*\n/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .map((chunk) => ({
          text: chunk,
          source: file,
        }));

      console.log(`   Found ${chunks.length} chunks in ${file}`);
      allChunks.push(...chunks);
    }

    console.log(`\n📚 Total chunks across all files: ${allChunks.length}`);

    await KnowledgeChunk.deleteMany();
    console.log("🗑️  Cleared existing knowledge chunks");

    for (let i = 0; i < allChunks.length; i++) {
      const chunkData = allChunks[i];
      console.log(`Processing chunk ${i + 1}/${allChunks.length} (from ${chunkData.source})...`);

      try {
        const embedding = await embedText(chunkData.text);

        await KnowledgeChunk.create({
          text: chunkData.text,
          embedding,
          source: chunkData.source,
        });

        console.log(`✅ Processed chunk ${i + 1}`);
      } catch (err) {
        console.error(`❌ Error processing chunk ${i + 1}:`, err.message);
      }
    }

    const finalCount = await KnowledgeChunk.countDocuments();
    console.log(`\n✅ Knowledge base ingestion complete!`);
    console.log(`📊 Total chunks in database: ${finalCount}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error ingesting knowledge base:", err);
    process.exit(1);
  }
};

ingestKnowledgeBase();