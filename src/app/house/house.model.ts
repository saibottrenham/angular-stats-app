import { Roommate } from '../roommates/roommates.model';
import { Cost } from '../analytics/analytics.model';
import { PropertyManager } from '../property-manager/property-manager.model';

export interface House {
    id: string;
    userId?: string;
    name: string;
    address: string;
    rooms: [Room];
    costs: [Cost];
    notes: string;
    imageUrl: string;
    created?: Date;
    lastUpdated?: Date;
}

export interface Room {
    id: string;
    userID?: string;
    imageUrl: string;
    price: number;
    lastUpdated: Date;
    rentedOut: boolean;
    rentedOutBy?: [PropertyManager];
    roommate?: [Roommate];
}
