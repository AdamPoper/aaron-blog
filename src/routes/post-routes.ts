import { Router } from 'express';
import { PostController } from '../controller/post-controller';
import authMiddleware from '../middleware/auth-middleware';

const router = Router();

router.post('/create', authMiddleware, PostController.createPost);
router.get('/get', PostController.getPosts);

export default router;
