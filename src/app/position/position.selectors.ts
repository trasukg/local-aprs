import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPosition from './position.reducer';

export const selectPositionState = createFeatureSelector<fromPosition.State>(
  fromPosition.positionFeatureKey
);

export const selectLastFix = createSelector(
  selectPositionState,
  state => state.lastFix
);
