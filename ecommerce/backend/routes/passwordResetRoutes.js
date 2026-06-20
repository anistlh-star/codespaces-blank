//ecommerce/backend/routes/passwordResetRoutes.js
import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/request', requestPasswordReset);
router.post('/reset/:token', resetPassword);

export default router;