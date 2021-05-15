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

import { ax25utils } from 'utils-for-aprs';

export class Deduplicator {
  private dedupeIndex: Map<string, any>;
  deduplicatedPackets: Array<any> = [];

  constructor() {
    this.dedupeIndex = new Map();
  }

  clear() {
    this.deduplicatedPackets = [];

    /* Index to deduplicated packet.  Key is sender + message.  Note that the
    server has already interpreted the third-party header if there is one.
    */
    this.dedupeIndex = new Map();

  }

  processPacket(packet, deduplicationTimeSpan) {
    // Shallow copy is enough; we're not changing the data, just adding to it.
    packet = { ...packet };

    const key = ax25utils.addressToString(packet.source).concat(packet.info);
    if (this.dedupeIndex.get(key) === undefined) {
      // Create a new packet record for this key.
      this.dedupeIndex.set(key, [ packet] );
      // Add the packet to the deduplicated packets.
      this.deduplicatedPackets.push(packet);
      packet.duplicates = [];
    } else {
      /* At this point, we have a set of packets that match the header and info,
      and we need to see if the new packet should be added to the latest, or added
      on its own as a new dedupe-set.

      Note that by definition, there will only ever be zero or one packet set that is within
      the deduplication time span.  This is because a new dedupe set is created only
      when the previous set is out of the dedupe time span.  So there's no need
      to sort the dedupe sets, we can just look for one that is inside the dedupe time span.
      */
      const dedupeSets = this.dedupeIndex.get(key);
      for(let i in dedupeSets) {
        let p = dedupeSets[i]
        if ((packet.receivedAt.getTime() - p.receivedAt.getTime()) <= deduplicationTimeSpan) {
          p.duplicates.push(packet);
          return;
        }
      }
      dedupeSets.push(packet);
      this.deduplicatedPackets.push(packet);
      packet.duplicates = [];
    }
  }

  expirePacketsBefore(expiryTime) {
    function filter(p) {
      return (p.receivedAt.getTime() >= expiryTime);
    }

    const newDeduplicatedPackets = [];
    for (const key of Array.from(this.dedupeIndex.keys())){
      const packet = this.dedupeIndex.get(key);
      if (!filter(packet)) {
        this.dedupeIndex.delete(key);
      } else {
        newDeduplicatedPackets.push(packet);
      }
    }
    this.deduplicatedPackets = newDeduplicatedPackets;
  }

}
