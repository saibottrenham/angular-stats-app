import { Action } from '@ngrx/store';
import { Property } from './property.model';

export const SET_PROPERTY = '[Property] Set Properties';

export class SetProperty implements Action {
    readonly type = SET_PROPERTY;

    constructor(public payload: Property[]) {}
}

export type PropertyActions = SetProperty;
