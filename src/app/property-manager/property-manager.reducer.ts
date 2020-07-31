import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    PropertyManagerActions,
    SET_PROPERTY_MANAGER
} from './property-manager.actions';
import { PropertyManager } from './property-manager.model';
import * as fromRoot from '../app.reducer';

export interface PropertyManagerState {
    propertyManagers: PropertyManager[];
}

export interface State extends fromRoot.State {
    propertyManager: PropertyManagerState;
}

const initialState: PropertyManagerState = {
    propertyManagers: [] = []
};

export function propertyManagerReducer(state = initialState, action: PropertyManagerActions) {
    switch (action.type) {
        case SET_PROPERTY_MANAGER:
            return {
                ...state,
                propertyManagers: action.payload
            };
        default:
            return state;
    }
}
export const getPropertyManagerState = createFeatureSelector<PropertyManagerState>('propertyManager');
export const getPropertyManagers = createSelector(getPropertyManagerState,  (state: PropertyManagerState) => state.propertyManagers);
