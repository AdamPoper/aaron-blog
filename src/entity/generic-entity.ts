export default interface GenericEntity {
    id: number;
    created_at: number;
    updated_at: number;
}

export function createEntity<T extends GenericEntity>(entity: Partial<T>): T {
    const timestamp = Date.now();
    return {
        ...entity,
        created_at: timestamp,
        updated_at: timestamp,
    } as T;
}