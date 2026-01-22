import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversationLogs = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const conversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await Message.find({
          conversationId: conv._id,
        })
          .sort({ createdAt: 1 })
          .select("role content source model createdAt")
          .lean();

        return {
          id: conv._id,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          messageCount: messages.length,
          messages,
        };
      })
    );

    res.json({
      conversations: conversationsWithDetails,
      total: await Conversation.countDocuments(),
    });
  } catch (err) {
    console.error("Error in getConversationLogs:", err);
    res.status(500).json({ error: "Failed to fetch conversation logs" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const conversations = await Conversation.countDocuments();
    const messages = await Message.countDocuments();
    const ragResponses = await Message.countDocuments({
      source: "knowledge-base",
    });
    const totalUserMessages = await Message.countDocuments({
      role: "user",
    });
    const totalAssistantMessages = await Message.countDocuments({
      role: "assistant",
    });

    const modelStats = await Message.aggregate([
      { $match: { model: { $exists: true, $ne: null } } },
      { $group: { _id: "$model", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentConversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const conversationsWithMessageCount = await Promise.all(
      recentConversations.map(async (conv) => {
        const msgCount = await Message.countDocuments({
          conversationId: conv._id,
        });
        return {
          id: conv._id,
          createdAt: conv.createdAt,
          messageCount: msgCount,
        };
      })
    );

    res.json({
      conversations,
      messages,
      ragResponses,
      totalUserMessages,
      totalAssistantMessages,
      modelStats: modelStats.map((m) => ({
        model: m._id,
        count: m.count,
      })),
      recentConversations: conversationsWithMessageCount,
    });
  } catch (err) {
    console.error("Error in getAnalytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
