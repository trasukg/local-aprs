import { createAction, props } from '@ngrx/store';

export const loadMapDisplays = createAction(
  '[MapDisplay] Load MapDisplays'
);

export const loadMapDisplaysSuccess = createAction(
  '[MapDisplay] Load MapDisplays Success',
  props<{ data: any }>()
);

export const loadMapDisplaysFailure = createAction(
  '[MapDisplay] Load MapDisplays Failure',
  props<{ error: any }>()
);

export const setCenter = createAction(
  '[MapDisplay] Set Center',
  props<{ center: any }>()
);

export const setZoom = createAction(
  '[MapDisplay] Set Zoom',
  props<{ zoom: any }>()
);
