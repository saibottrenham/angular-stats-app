import { Observable } from 'rxjs';
import { Cost } from '../analytics/cost/cost.model';
import { Property } from '../property/property.model';

export interface PropertyGroup {
    id: string;
    userId?: string;
    name: string;
    notes: string;
    imageUrl: string;
    costs?: string[];
    properties?: string[];
    created?: Date;
    lastUpdated?: Date;
}