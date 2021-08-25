import { Tennant } from '../tennants/tennants.model';
import { PropertyManager } from '../property-manager/property-manager.model';

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
    created?: Date;
    lastUpdated?: Date;
}