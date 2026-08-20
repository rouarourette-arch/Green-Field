const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware pour vérifier le JWT/Cookie

// Toutes les routes du panier nécessitent d'être connecté
router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateQuantity);
router.delete("/item/:productId", cartController.removeFromCart);
router.post("/checkout", cartController.checkout);

module.exports = router;