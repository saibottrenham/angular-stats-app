import { Action } from '@ngrx/store';
import { PropertyGroup } from './property-group.model';

export const SET_PROPERTY_GROUP = '[PropertyGroup] Set PropertyGroup';

export class SetPropertyGroup implements Action {
    readonly type = SET_PROPERTY_GROUP;

    constructor(public payload: PropertyGroup[]) {}
}

export type PropertyGroupActions = SetPropertyGroup;
