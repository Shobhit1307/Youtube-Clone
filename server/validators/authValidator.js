import { body } from 'express-validator';

export const registerValidation = [
  body('username', 'Username is required').notEmpty(),
  body('email', 'Valid email is required').isEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('At least one uppercase')
    .matches(/[a-z]/).withMessage('At least one lowercase')
    .matches(/\d/).withMessage('At least one number')
    .matches(/[@$!%*?&]/).withMessage('At least one special character'),
];
