import express from "express";
import { getAllcategorys, addcategory, deletecategory} from "../controllers/car.js";

const router = express.Router();

router.get("/", getAllcategorys);
router.post("/", addcategory);
router.delete("/:id", deletecategory);

export default router;