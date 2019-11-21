import { Action, createReducer, on } from '@ngrx/store';
import * as AprsSituationActions from './aprs-situation.actions';

export const aprsSituationFeatureKey = 'aprsSituation';

export interface State {
  rawPackets: any[],
  deduplicatedPackets: any[],
  lastServerTime: number
}

export const initialState: State = {
  rawPackets: [],
  deduplicatedPackets: [],
  lastServerTime: 0
};

function ensurePacketReceivedAtIsDate(packet){
    /* Convert the receivedAt value to a date if necessary. */
    if (! (packet.receivedAt instanceof Date)) {
      return {
        ...packet,
        receivedAt: new Date(packet.receivedAt)
      }
    } else {
      return packet;
    }
}

function processPacket(aprsSituation: State, packet) {
  packet=ensurePacketReceivedAtIsDate(packet);
  aprsSituation.rawPackets.push(packet);
  aprsSituation.lastServerTime=Math.max(aprsSituation.lastServerTime,
    packet.receivedAt.getTime());

  // I suspect that the deduplications and summaries might be best
  // done as selectors.
  //calculateSummaries(state);
}

const aprsSituationReducer = createReducer(
  initialState,

  on(AprsSituationActions.receivedPacket,
    function(aprsSituation, { packet }):State {
      console.log('receivedPacket');
      let start=Date.now();
      // Since state is immutable, we need to copy the list of packets.
      let newSituation:State = {
        rawPackets: [],
        deduplicatedPackets: [],
        lastServerTime: 0
      };
      aprsSituation.rawPackets.map(packet => {
        processPacket(newSituation, packet);
      });
      processPacket(newSituation, packet);
      let time=Date.now() - start;
      console.log("  now have " + newSituation.rawPackets.length + " (" + time + "ms)");
      return newSituation;
    }
  ),
  on(AprsSituationActions.receivedInitialPackets,
    function(aprsSituation, { packets }) {
      console.log('receivedInitialPackets', packets)
      // Since state is immutable, we need to copy the list of packets.
      let newSituation:State = {
        rawPackets: [],
        deduplicatedPackets: [],
        lastServerTime: 0
      };
      packets.map(packet => {
        processPacket(newSituation, packet);
    });
    return  newSituation
  })

);

export function reducer(state: State | undefined, action: Action) {
  return aprsSituationReducer(state, action);
}
