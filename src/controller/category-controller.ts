import { Request, Response } from 'express';
import { Persistence } from '../persistence/persistence';
import { Category, CategoryQueries, CategoryTableName } from '../entity/category';
import { Post, PostQueries, PostTableName } from '../entity/post';
import { createEntity } from '../entity/generic-entity';

export class CategoryController {

    static async getCategories(req: Request, res: Response): Promise<void> {
        const categories = await Persistence.selectEntitiesByNamedQuery<Category>(CategoryQueries.SELECT_ALL);
        res.status(200).json(categories);
    }

    static async createCategory(req: Request, res: Response): Promise<void> {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ error: 'name is required' });
            return;
        }

        const category = createEntity<Category>({ name });

        const [result] = await Persistence.persistEntity<Category>(CategoryTableName, category);
        res.status(201).json({ id: result.insertId, ...category });
    }

    static async deleteCategory(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);

        if (isNaN(id) || id < 1) {
            res.status(400).json({ error: 'Invalid category ID' });
            return;
        }

        const category = await Persistence.selectEntityById<Category>(CategoryTableName, id);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }

        await Persistence.transactional(async () => {
            const posts = await Persistence.selectEntitiesByNamedQuery<Post>(
                PostQueries.SELECT_BY_CATEGORY_ID,
                [id]
            );

            for (const post of posts) {
                await Persistence.updateEntity<Post>(PostTableName, { id: post.id, category_id: null });
            }

            await Persistence.deleteEntity<Category>(CategoryTableName, id);
        });

        res.status(200).json(category);
    }
}
