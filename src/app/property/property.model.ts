import { BaseModel } from '../shared/common-model';

export interface Property extends BaseModel {
    address: string;
    notes: string;
    tennants?: string[];
    propertyManagers?: string[];
    costs?: string[];
}