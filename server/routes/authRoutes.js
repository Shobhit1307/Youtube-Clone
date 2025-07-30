// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, authUser, updateProfile } from '../controllers/authController.js';
import { registerValidation } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',
  registerValidation,
  validateRequest,
  registerUser
);
router.post('/login', authUser);
router.put('/profile', protect, updateProfile);


export default router;
