import { Action, createReducer, on } from '@ngrx/store';
import * as MapDisplayActions from './map-display.actions';

export const mapDisplayFeatureKey = 'mapDisplay';

export interface State {

}

export const initialState: State = {

};


export const reducer = createReducer(
  initialState,

  on(MapDisplayActions.loadMapDisplays, state => state),
  on(MapDisplayActions.loadMapDisplaysSuccess, (state, action) => state),
  on(MapDisplayActions.loadMapDisplaysFailure, (state, action) => state),

);

