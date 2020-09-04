import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromConfig from './config.reducer';

export const selectConfigState = createFeatureSelector(
  fromConfig.configFeatureKey
);
