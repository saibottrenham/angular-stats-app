import { Roommates } from '../roommates/roommates.model';
import { Cost } from '../analytics/analytics.model';

export interface House {
    id: string;
    userID?: string;
    name: string;
    address: string;
    rooms: [Room];
    roommates: [Roommates];
    costs: [Cost];
    notes: string;
    monthlyReturn: number;
    date?: Date;
}

export interface Room {
    id: string;
    userID?: string;
}
