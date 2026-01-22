import express from "express";
import { getAnalytics, getConversationLogs } from "../controllers/analytics.controller.js";

const router = express.Router();
router.get("/summary", getAnalytics);
router.get("/conversations", getConversationLogs);
export default router;
