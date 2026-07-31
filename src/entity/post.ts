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

}