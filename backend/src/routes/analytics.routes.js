import express from 'express';
import {
  monthlySummary,
  categoryBreakdown,
  monthlyTrend
} from '../controllers/analytics.controller.js';
import {protect} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/summary', protect, monthlySummary);
router.get('/categories', protect, categoryBreakdown);
router.get('/trend', protect, monthlyTrend);

export default router;
