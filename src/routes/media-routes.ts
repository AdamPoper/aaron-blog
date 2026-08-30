import { Router } from 'express';
import { MediaController } from '../controller/media-controller';
import authMiddleware from '../middleware/auth-middleware';
import upload from '../middleware/upload-middleware';

const router = Router();

router.post('/upload', authMiddleware, upload.single('image'), MediaController.uploadImage);

export default router;
