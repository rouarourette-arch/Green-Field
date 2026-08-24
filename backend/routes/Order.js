import express from "express";
import {
  createOrderFromCart,
  getUserOrders,
  getAdminOrders,
  getSellerOrders,
  updateOrderStatus,
  getOrderById
} from "../controllers/Order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/checkout", createOrderFromCart);

router.get("/my-orders", getUserOrders);
router.get("/admin", roleMiddleware("admin"), getAdminOrders);
router.get("/seller", roleMiddleware("seller"), getSellerOrders);
router.put("/:id/status", roleMiddleware("admin"), updateOrderStatus);
router.get("/:id", getOrderById);

export default router;