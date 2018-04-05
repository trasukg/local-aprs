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

import {ax25utils} from 'utils-for-aprs';

export class StationRecord {
  public packets:any[]=[];
  public position:any = null;
  public track:any[]=[];
  public comment:any=null;
  public weather:any=null;
  public status:string='';
  public lastHeardAt:Date=null;

  constructor(public stationId:string) {

  }

  public processPacket(packet:any) {
    var packetFrom=ax25utils.addressToString(packet.source);
    if (! (packetFrom === this.stationId)) {
      // We were handed a packet for a different station.
      console.log("Station record for " + this.stationId + " got packet for "
        + packetFrom);
      return;
    }
    //console.log("Adding " + packet.receivedAt + " to log for "
    //  + packetFrom + ", status=" + packet.status);
    this.packets.push(packet);
    if (packet.receivedAt) {
      this.lastHeardAt=packet.receivedAt;
    }
    if (packet.position) {
      this.position=packet.position;
      this.track.push(packet.position);
    }
    if (packet.comment) {
      this.comment=packet.comment;
    }
    if (packet.weather) {
      this.weather=packet.weather;
    }
    if (packet.statusText) {
      //console.log("Got a status!!!!!!!!");
      this.status=packet.statusText;
    }
  }
}
