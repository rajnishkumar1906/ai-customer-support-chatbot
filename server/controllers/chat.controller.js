import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { addToQueue } from "../queue/llmQueue.js";
import { ragAnswer } from "../services/rag.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    const convo =
      conversationId ||
      (await Conversation.create({}))._id;

    await Message.create({
      conversationId: convo,
      role: "user",
      content: message,
    });

    const history = await Message.find({
      conversationId: convo,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("role content")
      .lean();

    const formattedHistory = history
      .reverse()
      .slice(0, -1) // Exclude current message
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const result = await addToQueue(() =>
      ragAnswer(message, formattedHistory)
    );

    const assistantMessage = await Message.create({
      conversationId: convo,
      role: "assistant",
      content: result.reply,
      source: result.source,
      model: result.model,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(convo.toString()).emit("newMessage", {
        role: "assistant",
        content: result.reply,
        source: result.source,
        model: result.model,
        createdAt: assistantMessage.createdAt,
      });
    }

    res.json({
      conversationId: convo,
      reply: result.reply,
      source: result.source,
      model: result.model,
    });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: "Server error" });
  }
};
