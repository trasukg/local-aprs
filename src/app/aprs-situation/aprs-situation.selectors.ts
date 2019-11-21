import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAprsSituation from './aprs-situation.reducer';
import { Deduplicator } from './Deduplicator';
import { StationProcessor } from './StationProcessor';

export const selectAprsSituationState = createFeatureSelector<fromAprsSituation.State>(
  fromAprsSituation.aprsSituationFeatureKey
);

export const selectRawPackets = createSelector(selectAprsSituationState,
  (aprsSituation: fromAprsSituation.State) => {
  return aprsSituation.rawPackets
});

export const selectDeduplicatedPackets = createSelector(selectAprsSituationState,
  (aprsSituation: fromAprsSituation.State) => {
    let deduplicator=new Deduplicator();
    aprsSituation.rawPackets.map(packet => deduplicator.processPacket(packet))
  return deduplicator.deduplicatedPackets;
});

export const selectStations = createSelector(selectDeduplicatedPackets,
  (packets) => {
    let stationProcessor=new StationProcessor();
    packets.map(packet => stationProcessor.processPacket(packet))
  return stationProcessor.stationsById;
});
