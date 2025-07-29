// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, authUser } from '../controllers/authController.js';
import { registerValidation } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/register',
  registerValidation,
  validateRequest,
  registerUser
);
router.post('/login', authUser);

export default router;
