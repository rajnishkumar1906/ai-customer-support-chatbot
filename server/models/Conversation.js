import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
