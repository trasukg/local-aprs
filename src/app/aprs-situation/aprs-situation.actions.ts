import { createAction, props } from '@ngrx/store';

export const enableHostConnection = createAction(
  '[Packet] Enable Host Connection'
);

export const receivedPacket = createAction(
  '[Packet] Receive',
  props<{ packet: any }>()
);

export const loadInitialPackets = createAction(
  '[Packet] Load Initial Packets'
);

export const receivedInitialPackets = createAction(
  '[Packet] Receive Initial Packets',
  props<{ packets: any[] }>()
);

export const connected = createAction(
  '[Packet] Connected'
);

export const disconnected = createAction(
  '[Packet] Disconnected'
);

export const receivedConfig = createAction(
  '[Packet] Received Configuration',
  props<{ config: any }>()
);

export const expirePacketsBefore = createAction(
  '[packet] Expire Packets',
  props<{ before: number }>()
);
