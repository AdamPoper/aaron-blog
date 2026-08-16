import { Request, Response } from 'express';
import { Persistence } from '../persistence/persistence';
import { Post, PostQueries, PostStatus, PostTableName } from '../entity/post';

type PostStatusFilter = PostStatus | 'all';
const POST_STATUS_FILTERS: PostStatusFilter[] = ['draft', 'posted', 'all'];
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
        const { title, content, post_status } = req.body;

        if (!title || !content) {
            res.status(400).json({ error: 'title and content are required' });
            return;
        }

        const post = createEntity<Post>({
            title,
            content,
            post_status,
            slug: slugify(title),
        });

        const [result] = await Persistence.persistEntity<Post>(PostTableName, post);
        res.status(201).json({ id: result.insertId, ...post });
    }

    static async getPosts(req: Request, res: Response): Promise<void> {
        const pageSize = Number(req.query.pageSize) || 10;
        const pageNumber = Number(req.query.pageNumber) || 0;
        const status = (req.query.status as PostStatusFilter) || 'all';

        if (pageSize < 1 || pageNumber < 0) {
            res.status(400).json({ error: 'pageSize must be >= 1 and pageNumber must be >= 0' });
            return;
        }

        if (!POST_STATUS_FILTERS.includes(status)) {
            res.status(400).json({ error: "status must be 'draft', 'posted', or 'all'" });
            return;
        }

        const query = status === 'all' ? PostQueries.SELECT_ALL : PostQueries.SELECT_BY_STATUS;
        const countQuery = status === 'all' ? PostQueries.SELECT_COUNT : PostQueries.SELECT_COUNT_BY_STATUS;
        const args = status === 'all' ? undefined : [status];

        const posts = await Persistence.selectEntitiesByNamedQueryPaged<Post>(
            query,
            pageSize,
            pageNumber,
            args
        );
        const total = await Persistence.selectCountByNamedQuery(countQuery, args);

        res.status(200).json({ pageSize, pageNumber, total, posts });
    }

    static async getPostBySlug(req: Request, res: Response): Promise<void> {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ error: 'Invalid post slug' });
            return;
        }

        const post = await Persistence.selectEntityByNamedQuery<Post>(PostQueries.SELECT_BY_SLUG, [slug]);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.status(200).json(post);
    }

    static async updatePost(req: Request, res: Response): Promise<void> {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ error: 'Invalid post slug' });
            return;
        }

        const existing = await Persistence.selectEntityByNamedQuery<Post>(PostQueries.SELECT_BY_SLUG, [slug]);
        if (!existing) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const { title, content, post_status } = req.body;

        if (post_status !== undefined && post_status !== 'draft' && post_status !== 'posted') {
            res.status(400).json({ error: "post_status must be 'draft' or 'posted'" });
            return;
        }

        const update: Partial<Post> = { id: existing.id, updated_at: Date.now() };
        if (title !== undefined) {
            update.title = title;
            update.slug = slugify(title);
        }
        if (content !== undefined) update.content = content;
        if (post_status !== undefined) update.post_status = post_status;

        if (Object.keys(update).length <= 2) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }

        await Persistence.updateEntity<Post>(PostTableName, update);
        const updated = await Persistence.selectEntityById<Post>(PostTableName, existing.id);
        res.status(200).json(updated);
    }
}
