import express from "express";
import { resetUserData } from "../controllers/reset.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, resetUserData);

export default router;
