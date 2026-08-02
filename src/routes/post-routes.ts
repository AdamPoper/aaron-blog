import { Router } from 'express';
import { PostController } from '../controller/post-controller';

const router = Router();

router.post('/create', PostController.createPost);
router.get('/get', PostController.getPosts);

export default router;
