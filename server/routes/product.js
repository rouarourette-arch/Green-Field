import express from "express";
import { deleteproduct, getAllproducts, updateproduct,getproductById, addproduct } from "../controllers/product.js";

const router = express.Router();

router.get("/", getAllproducts);
router.get("/:id",getproductById)
router.post("/", addproduct);
router.put("/:id", updateproduct);
router.delete("/:id", deleteproduct);

export default router;