import express from "express";
import { getCart, addToCart, updateCartItemQuantity, removeCartItem } from "../controllers/Cart.js";
import { createOrderFromCart } from "../controllers/Order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItemQuantity);
router.delete("/item/:productId", removeCartItem);
router.post("/checkout", createOrderFromCart);

export default router;