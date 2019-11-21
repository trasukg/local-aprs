import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHostConfig from './host-config.reducer';

export const selectHostConfigState = createFeatureSelector(
  fromHostConfig.hostConfigFeatureKey
);
