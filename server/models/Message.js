import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: String,
    source: String,
    model: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
