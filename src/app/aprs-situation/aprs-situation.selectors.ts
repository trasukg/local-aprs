import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAprsSituation from './aprs-situation.reducer';
import { Deduplicator } from './Deduplicator';
import { StationProcessor } from './StationProcessor';
import { Haversine } from '../haversine-position';
import * as fromPosition from '../position/position.selectors';
import { selectConfig } from '../config/config.selectors';

export const selectAprsSituationState = createFeatureSelector<fromAprsSituation.State>(
  fromAprsSituation.aprsSituationFeatureKey
);

export const selectRawPackets = createSelector(selectAprsSituationState,
  (aprsSituation: fromAprsSituation.State) => {
  return aprsSituation.rawPackets;
});

export const selectDeduplicatedPackets = createSelector(
  selectAprsSituationState,
  selectConfig,
  (aprsSituation: fromAprsSituation.State, config) => {
    const deduplicator = new Deduplicator();
    aprsSituation.rawPackets.map(packet => deduplicator.processPacket(packet, config.deduplicationTimeSpan));
    return deduplicator.deduplicatedPackets;
});

export const selectStations = createSelector(selectDeduplicatedPackets,
  (packets) => {
    const stationProcessor = new StationProcessor();
    packets.map(packet => stationProcessor.processPacket(packet));
    return stationProcessor.stationsById;
});

export const stationIds = createSelector(selectStations,
  (stations) => {
    let stationIdsArray = Array.from(stations.keys());
    stationIdsArray = stationIdsArray.sort();
    return stationIdsArray;
});

export const selectStation = () => createSelector(
  selectStations,
  (stations, props) => stations.get(props.stationId)
);

export const stationBearings = createSelector(
  selectStations, stationIds, fromPosition.selectPositionState,
  (stations, ids, currentPosition) => {
    if (!currentPosition.lastFix) { return {}; }
    const ret = {};
    const haversine = new Haversine({
      lat: currentPosition.lastFix.coords.latitude,
      lng: currentPosition.lastFix.coords.longitude
    });
    ids.forEach(stationId => {
      const station = stations.get(stationId);
      // console.log('stationBearings: stationId=' + stationId + ' station.position=' + JSON.stringify(station.position));
      if (station.position) {
        const pt = {
          lat: station.position.coords.latitude, lng: station.position.coords.longitude
        };
        const distance = haversine.getDistance(pt);
        const bearing = haversine.getBearing(pt);
        ret[stationId] = { bearing, distance };
        // console.log('... -> ' + JSON.stringify(ret[stationId]));
      }
    });
    return ret;
  }
);
