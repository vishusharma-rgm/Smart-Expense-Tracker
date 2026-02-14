// import express from 'express';
// import { setBudget, getBudgetStatus } from '../controllers/budget.controller.js';
// import protect from '../middleware/auth.middleware.js';

// const router = express.Router();

// router.post('/', protect, setBudget);
// router.get('/status', protect, getBudgetStatus);

// export default router;
import express from "express";
import { setBudget, getBudget } from "../controllers/budget.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBudget);
router.post("/", protect, setBudget);

export default router;
