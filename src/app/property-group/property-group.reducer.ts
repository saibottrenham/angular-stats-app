import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    PropertyGroupActions,
    SET_PROPERTY_GROUP
} from './property-group.actions';
import { PropertyGroup } from './property-group.model';
import * as fromRoot from '../app.reducer';

export interface PropertyGroupState {
    propertyGroups: PropertyGroup[];
}

export interface State extends fromRoot.State {
    propertyGroup: PropertyGroupState;
}

const initialState: PropertyGroupState = {
    propertyGroups: [] = []
};

export function propertyGroupReducer(state = initialState, action: PropertyGroupActions) {
    switch (action.type) {
        case SET_PROPERTY_GROUP:
            return {
                ...state,
                propertyGroups: action.payload
            };
        default:
            return state;
    }
}
export const getPropertyGroupState = createFeatureSelector<PropertyGroupState>('propertyGoup');
export const getPropertyGroups = createSelector(getPropertyGroupState,  (state: PropertyGroupState) => state.propertyGroups);
