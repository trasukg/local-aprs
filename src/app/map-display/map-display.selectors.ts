import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMapDisplay from './map-display.reducer';

export const selectMapDisplayState = createFeatureSelector<fromMapDisplay.State>(
  fromMapDisplay.mapDisplayFeatureKey
);
