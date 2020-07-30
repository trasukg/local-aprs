/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

import {StationRecord} from './StationRecord';
import {ax25utils} from 'utils-for-aprs';

export class StationProcessor {
  stationsById: Map<string, StationRecord> = new Map();

  public clear() {
    this.stationsById = new Map();
  }

  public processPacket(packet: any) {
    const stationId = ax25utils.addressToString(packet.source);
    // Lookup the station object for this packet
    let stationRecord = this.stationsById.get(stationId);
    // If none, create a new station record and store it.
    if (stationRecord === undefined) {
      // console.log("Creating a new station record for " + stationId);
      stationRecord = new StationRecord(stationId);
      this.stationsById.set(stationId, stationRecord);
    }
    // Add this packet into the station record.
    stationRecord.processPacket(packet);
  }
}
