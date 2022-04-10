import { Tennant } from '../tennant/tennant.model';
import { PropertyManager } from '../property-manager/property-manager.model';
import { Observable } from 'rxjs';
import { BaseModel } from '../shared/common-model';

export interface Property extends BaseModel {
    address: string;
    notes: string;
    price: number;
    rentedOut: boolean;
    tennants?: string[];
    propertyManagers?: string[];
}