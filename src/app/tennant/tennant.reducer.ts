import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    TennantActions,
    SET_TENNANT
} from './tennant.actions';
import { Tennant } from './tennant.model';
import * as fromRoot from '../app.reducer';

export interface TennantState {
    tennants: Tennant[];
}

export interface State extends fromRoot.State {
    tennant: TennantState;
}

const initialState: TennantState = {
    tennants: [] = []
};

export function tennantReducer(state = initialState, action: TennantActions) {
    switch (action.type) {
        case SET_TENNANT:
            return {
                ...state,
                tennants: action.payload
            };
        default:
            return state;
    }
}
export const getTennantState = createFeatureSelector<TennantState>('tennant');
export const getTennants = createSelector(getTennantState,  (state: TennantState) => state.tennants);
