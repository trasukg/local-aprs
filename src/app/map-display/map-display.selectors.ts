import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMapDisplay from './map-display.reducer';

export const selectMapDisplayState = createFeatureSelector<fromMapDisplay.State>(
  fromMapDisplay.mapDisplayFeatureKey
);

export const selectCenter = createSelector(
  selectMapDisplayState,
  state => state.center
);

export const selectZoom = createSelector(
  selectMapDisplayState,
  state => state.zoom
);
