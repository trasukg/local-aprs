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
import {Location} from '@angular/common';
import {EventEmitter} from 'events';
import {WebSocketAprsDataEndpoint} from 'utils-for-aprs';


@Injectable()
export class HostService extends EventEmitter {

  private endpoint: WebSocketAprsDataEndpoint;
  private connected: boolean;

  constructor() {
    super();
    /* Create an endpoint based on the url in the location bar. */
    const host = window.location.host;
    // var wsUrl="ws://" + host + "/ws";
    const wsUrl = 'ws://' + 'localhost:3000' + '/ws';
    // console.log("Host service started up with web socket " + wsUrl );
    /* events will be executed in different context, so preserve 'this' */

    this.endpoint = new WebSocketAprsDataEndpoint(wsUrl);
    this.endpoint.on('connect', connection => {
      this.connected = true;
      this.emit('connected');
      // console.log("host service emitted connected event");
      connection.on('disconnect', () => {
        this.emit('disconnected');
      });
    });
    this.endpoint.on('aprsData', data => {
      this.emit('aprsData', data);
    });

  }

  enable() {
    this.endpoint.enable();
  }

  disable() {
    this.endpoint.disable();
  }

  request(request) {
    return this.endpoint.request(request);
  }
}
