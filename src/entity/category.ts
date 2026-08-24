import GenericEntity from "./generic-entity";

export interface Category extends GenericEntity {
    name: string;
}

export const CategoryTableName = 'category';

export const CategoryQueries = {
    SELECT_ALL: `SELECT * FROM ${CategoryTableName} ORDER BY name ASC`,
}