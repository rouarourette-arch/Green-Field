import express from "express";
import { createOrderFromCart, handleStripeWebhook } from "../controllers/Order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create-checkout-session", authMiddleware, createOrderFromCart);
router.post("/webhook", handleStripeWebhook);
export default router;
