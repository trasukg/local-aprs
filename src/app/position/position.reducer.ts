import { Action, createReducer, on } from '@ngrx/store';
import * as PositionActions from './position.actions';

export const positionFeatureKey = 'position';

export interface State {
  enabled: boolean;
  error: any;
  lastFix: any;
}

export const initialState: State = {
  enabled: false,
  error: undefined,
  lastFix: undefined
};

const positionReducer = createReducer(
  initialState,

  on(PositionActions.enablePosition, state => {
    return {
      ...state,
      enabled: undefined,
      error: undefined
    }
  }),
  on(PositionActions.positionFailure, (state, {error}) => {
    return {
      ...state,
      enabled: false,
      error: error
    }
  }),
  on(PositionActions.reportPosition, (state, {position}) => {
    return {
      ...state,
      enabled: true,
      error: undefined,
      lastFix: position
    }
  }),


);

export function reducer(state: State | undefined, action: Action) {
  return positionReducer(state, action);
}
