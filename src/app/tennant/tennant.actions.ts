import { Action } from '@ngrx/store';
import { Tennant } from './tennant.model';

export const SET_TENNANT = '[Tennant] Set tennants';

export class SetTennant implements Action {
    readonly type = SET_TENNANT;

    constructor(public payload: Tennant[]) {}
}

export type TennantActions = SetTennant;
