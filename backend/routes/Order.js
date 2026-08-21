import express from "express";
import { createOrderFromCart, getUserOrders } from "../controllers/Order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";   

const router = express.Router();


router.use(authMiddleware);

router.post("/checkout", createOrderFromCart);
router.get("/my-orders", getUserOrders);

module.exports = router;