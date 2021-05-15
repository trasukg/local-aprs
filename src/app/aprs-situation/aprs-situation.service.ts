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
import { HostService } from '../host.service';
import { EventEmitter } from 'events';
import { Store } from '@ngrx/store';
import * as AprsSituationActions from './aprs-situation.actions';
import * as ConfigActions from '../config/config.actions';
import * as fromConfig from '../config/config.selectors';
import * as fromAprs from './aprs-situation.selectors';

@Injectable()
export class AprsSituationService extends EventEmitter {

  config: any;

  aprsSituation: any;

  constructor(private hostService: HostService, private store: Store<any>) {
    super();
    const self = this;
    EventEmitter.apply(self);

    store.select(fromConfig.selectConfig).subscribe(next => {
      self.config = next;
    });

    store.select(fromAprs.selectAprsSituationState).subscribe(next => {
      self.aprsSituation = next;
    });

    // console.log("Beginning aprs-situation-service setup...")
    /* This could reasonably be an 'effect' rather than being implemented here. */
    hostService.on('connected', () => {
      // console.log("Got connected event.");
      // Dispatch a 'connected' event.
      store.dispatch(AprsSituationActions.connected());
    });


    hostService.on('disconnected', () => {
      // self.connected=false;
      // self.emit('update');

      // Reimplement to dispatch a "Disconnected" action.
      store.dispatch(AprsSituationActions.disconnected());
    });

    hostService.on('aprsData', packet => {
      // self.processPacket(packet);
      // self.calculateSummaries();
      // self.emit('update');

      // Reimplement to dispatch a packet-received action.
      // console.log("dispatching receivedPacket event");
      store.dispatch(AprsSituationActions.receivedPacket({ packet }));
    });

    const expireInterval = () =>  {
      if (self.config && self.config.standardPacketMinutesToLive) {
        return self.config.standardPacketMinutesToLive * 60 * 1000;
      } else {  // Default to 60 minutes.
        return 60 * 60 * 1000;
      }
    };


    const expirePackets = () => {
      const now = Date.now();
      const expiryTime = now - expireInterval();
      store.dispatch(AprsSituationActions.expirePacketsBefore({ before: expiryTime} ));
    };
    setInterval(expirePackets, 5000);

  }

  enableHost() {
    // console.log("Enabling the hostService");
    this.hostService.enable();
  }
}
