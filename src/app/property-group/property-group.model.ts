import { Observable } from 'rxjs';
import { Cost } from '../analytics/cost/cost.model';
import { Property } from '../property/property.model';

export interface PropertyGroup {
    id: string;
    userId?: string;
    name: string;
    notes: string;
    imageUrl: string;
    costs?: [Cost];
    properties?: [Property];
    allCosts?: Observable<Cost[]>;
    allProperties?: Observable<Property[]>;
    created?: Date;
    lastUpdated?: Date;
}