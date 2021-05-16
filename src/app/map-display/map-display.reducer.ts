import { Action, createReducer, on } from '@ngrx/store';
import { latLng } from 'leaflet';
import * as MapDisplayActions from './map-display.actions';

export const mapDisplayFeatureKey = 'mapDisplay';

export interface State {
  center: any,
  zoom: number
}

export const initialState: State = {
  center: latLng([ 46.879966, -91.726909 ]),
  zoom: 12
};


export const reducer = createReducer(
  initialState,
  on(MapDisplayActions.setCenter, (state, { center }) => {
    return {
      ...state,
      center
    };
  }),
  on(MapDisplayActions.loadMapDisplays, state => state),
  on(MapDisplayActions.loadMapDisplaysSuccess, (state, action) => state),
  on(MapDisplayActions.loadMapDisplaysFailure, (state, action) => state),
  on(MapDisplayActions.setZoom, (state, { zoom }) => {
    return {
      ...state,
      zoom
    };
  })
);
