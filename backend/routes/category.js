import express from "express";
import { getAllcategorys, addcategory, deletecategory } from "../controllers/category.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllcategorys);
router.post("/", authMiddleware, roleMiddleware("admin"), addcategory);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deletecategory);

export default router;