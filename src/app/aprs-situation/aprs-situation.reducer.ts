import { Action, createReducer, on } from '@ngrx/store';
import * as AprsSituationActions from './aprs-situation.actions';

export const aprsSituationFeatureKey = 'aprsSituation';

export interface State {
  rawPackets: any[];
  lastServerTime: number;
  connected: boolean;
}

export const initialState: State = {
  rawPackets: [],
  lastServerTime: 0,
  connected: false
};

function ensurePacketReceivedAtIsDate(packet){
    /* Convert the receivedAt value to a date if necessary. */
    if (! (packet.receivedAt instanceof Date)) {
      return {
        ...packet,
        receivedAt: new Date(packet.receivedAt)
      };
    } else {
      return packet;
    }
}

function processPacket(aprsSituation: State, packet) {
  packet = ensurePacketReceivedAtIsDate(packet);
  aprsSituation.rawPackets.push(packet);
  aprsSituation.lastServerTime = Math.max(aprsSituation.lastServerTime,
    packet.receivedAt.getTime());

  // Deduplication, summaries, etc are done as selectors.
}

const aprsSituationReducer = createReducer(
  initialState,

  on(AprsSituationActions.receivedPacket,
    (aprsSituation, { packet }): State => {
      // console.log('receivedPacket');
      const start = Date.now();
      // Since state is immutable, we need to copy the list of packets.
      const newSituation: State = {
        ...aprsSituation,
        rawPackets: [],
        lastServerTime: 0
      };
      aprsSituation.rawPackets.map(rawPacket => {
        processPacket(newSituation, rawPacket);
      });
      processPacket(newSituation, packet);
      // const time = Date.now() - start;
      // console.log("  now have " + newSituation.rawPackets.length + " (" + time + "ms)");
      return newSituation;
    }
  ),
  on(AprsSituationActions.expirePacketsBefore,
    (aprsSituation, { before }) => {
      // console.log('expirePacketsBefore');
      const start = Date.now();
      // Since state is immutable, we need to copy the list of packets.
      const newSituation: State = {
        ...aprsSituation,
        rawPackets: [],
        lastServerTime: 0
      };
      aprsSituation.rawPackets.map(packet => {
        if (packet.receivedAt.getTime() >= before) {
          processPacket(newSituation, packet);
        }
      });
      // console.log("  now have " + newSituation.rawPackets.length);
      return newSituation;
    }
  ),
  on(AprsSituationActions.receivedInitialPackets,
    (aprsSituation, { packets }) => {
      // console.log('receivedInitialPackets', packets)
      // Since state is immutable, we need to copy the list of packets.
      const newSituation: State = {
        ...aprsSituation,
        rawPackets: [],
        lastServerTime: 0,
      };
      packets.map(packet => {
        processPacket(newSituation, packet);
      });
      return  newSituation;
    }
  ),
  on(AprsSituationActions.connected,
    aprsSituation => {
      // console.log('connected')
      // Since state is immutable, we need to copy the list of packets.
      const newSituation: State = {
        ...aprsSituation,
        rawPackets: [],
        lastServerTime: 0,
        connected: true
      };
      aprsSituation.rawPackets.map(packet => {
        processPacket(newSituation, packet);
      });
      return  newSituation;
    }
  ),
  on(AprsSituationActions.disconnected,
    aprsSituation => {
      // console.log('disconnected')
      // Since state is immutable, we need to copy the list of packets.
      const newSituation: State = {
        ...aprsSituation,
        rawPackets: [],
        lastServerTime: 0,
        connected: false
      };
      aprsSituation.rawPackets.map(packet => {
        processPacket(newSituation, packet);
      });
      return  newSituation;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return aprsSituationReducer(state, action);
}
