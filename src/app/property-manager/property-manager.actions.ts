import { Action } from '@ngrx/store';
import { PropertyManager } from './property-manager.model';

export const SET_PROPERTY_MANAGER = '[PropertyManager] Set Property Managers';

export class SetPropertyManager implements Action {
    readonly type = SET_PROPERTY_MANAGER;

    constructor(public payload: PropertyManager[]) {}
}

export type PropertyManagerActions = SetPropertyManager;
