import { Tennant } from '../tennant/tennant.model';
import { PropertyManager } from '../property-manager/property-manager.model';
import { Observable } from 'rxjs';

export interface Property {
    id: string;
    userId?: string;
    name: string;
    address: string;
    notes: string;
    price: number;
    imageUrl: string;
    rentedOut: boolean;
    tennants?: [Tennant];
    propertyManagers?: [PropertyManager];
    allTennants?: Observable<Tennant[]>;
    allPropertyManagers?: Observable<PropertyManager[]>;
    created?: Date;
    lastUpdated?: Date;
}