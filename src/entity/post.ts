import GenericEntity from '../entity/generic-entity';

export interface Post extends GenericEntity {
    title: string;
    content: string;
    slug: string;
    created_at: number;
    updated_at: number;
}

export const PostTableName = 'post';

export const PostQueries = {
    SELECT_ALL: `SELECT * FROM ${PostTableName} ORDER BY created_at DESC`,
    SELECT_BY_SLUG: `SELECT * FROM ${PostTableName} WHERE slug = ?`,
}