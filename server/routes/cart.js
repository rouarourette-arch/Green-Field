const express = require("express");
const router = express.Router();
import { getCart, addToCart, updateQuantity, removeFromCart, checkout } from "../controllers/Cart.js";

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateQuantity);
router.delete("/item/:productId", removeFromCart);
router.post("/checkout", checkout);

module.exports = router;