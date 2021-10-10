import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    CostActions,
    SET_COST
} from './cost.actions';
import { Cost } from './cost.model';
import * as fromRoot from '../../app.reducer';

export interface CostState {
    costs: Cost[];
}

export interface State extends fromRoot.State {
    cost: CostState;
}

const initialState: CostState = {
    costs: [] = []
};

export function costReducer(state = initialState, action: CostActions) {
    switch (action.type) {
        case SET_COST:
            return {
                ...state,
                costs: action.payload
            };
        default:
            return state;
    }
}
export const getCostState = createFeatureSelector<CostState>('cost');
export const getCosts = createSelector(getCostState, (state: CostState) => state.costs);
