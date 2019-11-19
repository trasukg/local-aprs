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

import { Injectable } from '@angular/core';
import { HostService } from './host.service';
import { EventEmitter } from 'events';
import { Deduplicator } from './Deduplicator';
import { StationProcessor } from './StationProcessor';
import { StationRecord } from "./StationRecord";
import { Store } from '@ngrx/store';
import * as AprsSituationActions from './aprs-situation/aprs-situation.actions';
import * as HostConfigActions from './host-config/host-config.actions';
import * as fromHostConfig from './host-config/host-config.selectors';

@Injectable()
export class AprsSituationService extends EventEmitter {
  connected:boolean=false;

  // Raw packets, not deduplicated, in order of receipt.
  public rawPackets:any[]=[];

  // Station records, generated from the packets that we have.
  get stationsById():Map<string, StationRecord> {
    return this.stationProcessor.stationsById;
  }

  deduplicator:Deduplicator=new Deduplicator();

  private stationProcessor:StationProcessor=new StationProcessor();

  config:any;
  lastServerTime:number = 0;

  constructor(hostService: HostService, store: Store<any>) {
    super();
    var self=this;
    EventEmitter.apply(self);

    store.select(fromHostConfig.selectHostConfigState).subscribe(next => {
      self.config=next;
    });
    console.log("Beginning aprs-situation-service setup...")
    /* This could reasonable be an 'effect' rather than being implemented here. */
    hostService.on('connected', function() {
      self.connected=true;
      // Dispatch a 'connected' event.
      store.dispatch(AprsSituationActions.connected());
      /* Clear the stored packets. */
      /* Request the configuration. */
      console.log("Requesting the config")
      hostService.request({ command: "config?"}).then(function(response) {
        // self.config=response.config;
        // self.emit('updateConfig');
        console.log("Got the config ")
        // Dispatch a 'configure' action.
        store.dispatch(HostConfigActions.loadHostConfigsSuccess({ config: response.config}));
      })
      /* Request the server's cached packets. */
      .then(function() {
        return hostService.request({ command: "packets?"});
      })
      .then(function(response) {
        // Reimplement to dispatch a bulk-packet action.
        store.dispatch(AprsSituationActions.receivedInitialPackets(
          { packets: response.packets} ));

        // self.clearPackets();
        // response.packets.forEach(function(item) {
        //   self.processPacketWithoutUpdate(item);
        // });
        // self.calculateSummaries();
        // self.emit('update');
      });
    });

    hostService.on('disconnected', function() {
      // self.connected=false;
      // self.emit('update');

      // Reimplement to dispatch a "Disconnected" action.
      store.dispatch(AprsSituationActions.disconnected());
    });

    hostService.on('aprsData', function(packet) {
      // self.processPacket(packet);
      // self.calculateSummaries();
      // self.emit('update');

      // Reimplement to dispatch a packet-received action.
      store.dispatch(AprsSituationActions.receivedPacket({packet: packet}));
    });

    var expireInterval=function() {
      if (self.config && self.config.standardPacketMinutesToLive) {
        return self.config.standardPacketMinutesToLive*60*1000;
      } else {  // Default to 60 minutes.
        return 60*60*1000;
      }
    };

    var expireRawPackets=function(expiryTime) {
      var newPackets=self.rawPackets.filter(function(p) {
        return (p.receivedAt.getTime() >= expiryTime);;
      });
      self.rawPackets=newPackets;
    };

    var expireDeduplicatedPackets=function(expiryTime) {
      self.deduplicator.expirePacketsBefore(expiryTime);
    };

    var expirePackets=function() {
      var now=self.lastServerTime;
      var expiryTime=now - expireInterval();
      // expireRawPackets(expiryTime);
      // expireDeduplicatedPackets(expiryTime);

      // reimplement to dispatch a Timer event.
      store.dispatch(AprsSituationActions.expirePacketsBefore({ before: expiryTime} ));
    }
    setInterval(expirePackets,5000);

  };

  deduplicatedPackets() {
    return this.deduplicator.deduplicatedPackets;
  };

  /** Calculate the packet summaries, station lists, etc.
  */
  calculateSummaries() {
    this.stationProcessor.clear();
    for (let packet of this.deduplicatedPackets()) {
      this.stationProcessor.processPacket(packet);
    }
    //console.log("this.stationsById has " + this.stationsById.size + " entries");
  }
}
