import { Action, createReducer, on } from '@ngrx/store';
import * as HostConfigActions from './host-config.actions';

export const hostConfigFeatureKey = 'hostConfig';


export const initialState = {

};

const hostConfigReducer = createReducer(
  initialState,

  on(HostConfigActions.loadHostConfigsSuccess, (state, action) => action.config),

);

export function reducer(state: any | undefined, action: Action) {
  return hostConfigReducer(state, action);
}
