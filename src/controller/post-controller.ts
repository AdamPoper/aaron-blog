import { Request, Response } from 'express';
import { Persistence } from '../persistence/persistence';
import { Post, PostTableName } from '../entity/post';
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
}
