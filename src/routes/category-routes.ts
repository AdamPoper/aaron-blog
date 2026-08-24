import { Router } from 'express';
import { CategoryController } from '../controller/category-controller';
import authMiddleware from '../middleware/auth-middleware';

const router = Router();

router.get('/', CategoryController.getCategories);
router.post('/create', authMiddleware, CategoryController.createCategory);
router.delete('/:id', authMiddleware, CategoryController.deleteCategory);

export default router;
