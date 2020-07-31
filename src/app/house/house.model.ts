import { Roommate } from '../roommates/roommates.model';
import { Cost } from '../analytics/analytics.model';
import { PropertyManager } from '../property-manager/property-manager.model';

export interface House {
    id: string;
    userID?: string;
    name: string;
    address: string;
    rooms: [Room];
    roommates: [Roommate];
    costs: [Cost];
    notes: string;
    monthlyReturn: number;
    imageUrl: string;
    date?: Date;
}

export interface Room {
    id: string;
    userID?: string;
    imageUrl: string;
    price: number;
    rentedOut: boolean;
    rentedOutBy?: PropertyManager;
    roommate?: Roommate;
}
