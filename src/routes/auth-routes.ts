import express from 'express';
import authController from '../controller/auth-controller';
import authMiddleware from '../middleware/auth-middleware';

const router = express.Router();

router.get('/check', authMiddleware, authController.checkAuthentication);

export default router;