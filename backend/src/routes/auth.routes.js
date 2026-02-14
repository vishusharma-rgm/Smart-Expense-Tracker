import express from 'express';
import { registerUser, loginUser, changePassword, requestPasswordReset, resetPassword, testEmail } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/test-email', testEmail);

export default router;
