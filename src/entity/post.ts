import GenericEntity from '../entity/generic-entity';

export interface Post extends GenericEntity {
    title: string;
    content: string;
    slug: string;
    post_status: PostStatus;
    created_at: number;
    updated_at: number;
}

export type PostStatus = 'draft' | 'posted';

export const PostTableName = 'post';

export const PostQueries = {
    SELECT_ALL: `SELECT * FROM ${PostTableName} ORDER BY created_at DESC`,
    SELECT_BY_SLUG: `SELECT * FROM ${PostTableName} WHERE slug = ?`,
    SELECT_BY_STATUS: `SELECT * FROM ${PostTableName} WHERE post_status = ? ORDER BY created_at DESC`,
    SELECT_COUNT: `SELECT COUNT(*) as count FROM ${PostTableName}`,
    SELECT_COUNT_BY_STATUS: `SELECT COUNT(*) as count FROM ${PostTableName} WHERE post_status = ?`,
}