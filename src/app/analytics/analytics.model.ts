import { PropertyManager } from '../property-manager/property-manager.model';

export interface Cost {
    id: string;
    userId?: string;
    type: 'one-time' | 'weekly' | 'monthly';
    amount: number;
    propertyManager: PropertyManager;
    created: Date;
    lastUpdated: Date
}
