export interface BaseModel {
    id: string;
    name: string;
    userId?: string;
    selected?: boolean;
    imageUrl?: string;
    created?: Date;
    lastUpdated?: Date;
}