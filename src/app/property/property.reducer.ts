import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    PropertyActions,
    SET_PROPERTY
} from './property.actions';
import { Property } from './property.model';
import * as fromRoot from '../app.reducer';

export interface PropertyState {
    properties: Property[];
}

export interface State extends fromRoot.State {
    property: PropertyState;
}

const initialState: PropertyState = {
    properties: [] = []
};

export function propertyReducer(state = initialState, action: PropertyActions) {
    switch (action.type) {
        case SET_PROPERTY:
            return {
                ...state,
                properties: action.payload
            };
        default:
            return state;
    }
}
export const getPropertyState = createFeatureSelector<PropertyState>('property');
export const getProperties = createSelector(getPropertyState,  (state: PropertyState) => state.properties);
