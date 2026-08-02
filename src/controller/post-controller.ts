import { Request, Response } from 'express';
import { Persistence } from '../persistence/persistence';
import { Post, PostQueries, PostTableName } from '../entity/post';
import { createEntity } from '../entity/generic-entity';

function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export class PostController {

    static async createPost(req: Request, res: Response): Promise<void> {
        const { title, content, publish_at } = req.body;

        if (!title || !content) {
            res.status(400).json({ error: 'title and content are required' });
            return;
        }

        const post = createEntity<Post>({
            title,
            content,
            slug: slugify(title),
        });

        const [result] = await Persistence.persistEntity<Post>(PostTableName, post);
        res.status(201).json({ id: result.insertId, ...post });
    }

    static async getPosts(req: Request, res: Response): Promise<void> {
        const pageSize = Number(req.query.pageSize) || 10;
        const pageNumber = Number(req.query.pageNumber) || 0;

        if (pageSize < 1 || pageNumber < 0) {
            res.status(400).json({ error: 'pageSize must be >= 1 and pageNumber must be >= 0' });
            return;
        }

        const posts = await Persistence.selectEntitiesByNamedQueryPaged<Post>(
            PostQueries.SELECT_ALL,
            pageSize,
            pageNumber
        );

        res.status(200).json({ pageSize, pageNumber, posts });
    }
}
