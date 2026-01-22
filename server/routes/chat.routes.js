import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import Message from "../models/Message.js";

const router = express.Router();

router.post("/send", sendMessage);

router.get("/history/:id", async (req, res) => {
  try {
    const msgs = await Message.find({
      conversationId: req.params.id,
    })
      .sort({ createdAt: 1 })
      .select("role content source model createdAt -_id");

    res.json(msgs);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch conversation history" });
  }
});

export default router;
