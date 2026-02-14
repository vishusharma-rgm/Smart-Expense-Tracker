
import express from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controller.js';
import {protect} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

export default router;
