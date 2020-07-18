import { PropertyManager } from '../property-manager/property-manager.model';

export interface Cost {
    id: string;
    userID?: string;
    type: 'one-time' | 'weekly' | 'monthly';
    amount: number;
    paidBy: PropertyManager;
}
