import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    HouseActions,
    SET_HOUSE
} from './house.actions';
import { House } from './house.model';
import * as fromRoot from '../app.reducer';

export interface HouseState {
    houses: House[];
}

export interface State extends fromRoot.State {
    house: HouseState;
}

const initialState: HouseState = {
    houses: [] = []
};

export function houseReducer(state = initialState, action: HouseActions) {
    switch (action.type) {
        case SET_HOUSE:
            return {
                ...state,
                houses: action.payload
            };
        default:
            return state;
    }
}
export const getHouseState = createFeatureSelector<HouseState>('house');
export const getHouses = createSelector(getHouseState,  (state: HouseState) => state.houses);
