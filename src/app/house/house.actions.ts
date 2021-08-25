import { Action } from '@ngrx/store';
import { House } from './house.model';

export const SET_HOUSE = '[House] Set Houses';

export class SetHouse implements Action {
    readonly type = SET_HOUSE;

    constructor(public payload: House[]) {}
}

export type HouseActions = SetHouse;
