import express from "express";
import { getIncome, addIncome, deleteIncome, updateIncome } from "../controllers/income.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getIncome);
router.post("/", protect, addIncome);
router.put("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);

export default router;
