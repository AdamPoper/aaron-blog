import { Router } from 'express';
import { PostController } from '../controller/post-controller';

const router = Router();

router.post('/create', PostController.createPost);

export default router;
