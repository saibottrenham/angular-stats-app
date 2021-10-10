import { Action } from '@ngrx/store';
import { Cost } from './cost.model';

export const SET_COST = '[Cost] Set Cost';

export class SetCost implements Action {
    readonly type = SET_COST;

    constructor(public payload: Cost[]) {}
}

export type CostActions = SetCost;
