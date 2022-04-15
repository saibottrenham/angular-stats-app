import { BaseModel } from "../shared/common-model";

export interface PropertyGroup extends BaseModel {
    notes: string;
    costs?: string[];
    properties?: string[];
}