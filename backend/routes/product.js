import express from "express";
import { deleteproduct, getAllproducts, updateproduct, getproductById, addproduct, getSellerProducts } from "../controllers/product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllproducts);
router.get("/mine", authMiddleware, roleMiddleware("seller"), getSellerProducts);
router.get("/:id",getproductById)
router.post("/", authMiddleware, roleMiddleware("seller", "admin"), addproduct);
router.put("/:id", authMiddleware, roleMiddleware("seller", "admin"), updateproduct);
router.delete("/:id", authMiddleware, roleMiddleware("seller", "admin"), deleteproduct);

export default router;