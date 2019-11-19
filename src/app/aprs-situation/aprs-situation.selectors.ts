import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAprsSituation from './aprs-situation.reducer';

export const selectAprsSituationState = createFeatureSelector<fromAprsSituation.State>(
  fromAprsSituation.aprsSituationFeatureKey
);

export const selectRawPackets = createSelector(selectAprsSituationState,
  (aprsSituation: fromAprsSituation.State) => {
  return aprsSituation.rawPackets
});
