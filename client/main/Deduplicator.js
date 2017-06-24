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

var ax25utils=require('utils-for-aprs').ax25utils;

var Deduplicator = function() {
  var depupeIndex=new Map();

  // This array holds the deduplicated packets in order of first receipt, for
  // display.
  this.clear=function() {
    this.deduplicatedPackets=[];

    /* Index to deduplicated packet.  Key is sender + message.  Note that the
    server has already interpreted the third-party header if there is one.
    */
    dedupeIndex=new Map();
  };

  this.clear();

  this.processPacket=function(packet) {
    var key=ax25utils.addressToString(packet.source).concat(packet.info);
    if (dedupeIndex[key] == undefined) {
      // Create a new packet record for this key.
      dedupeIndex[key]=packet;
      // Add the packet to the deduplicated packets.
      this.deduplicatedPackets.push(packet);
      /* Alert!!!!  Danger, Will Robinson!
        This is a little ugly!  One could argue that we should create a clone
        of the packet, by converting to JSON and then converting back.  But I
        can't think of any other uses for the packet, so it seems kind of silly to
        go to JSON and back.

        Users of packets should be aware that there _may_ be an array of
        duplicate receptions, but only if this happened to be the first packet
        received with that key.  i.e. it's only safe to use 'receptions' iff
        the packet was traversed through the 'deduplicatedPackets' array.
      */
      packet.receptions=[ packet ];
    } else {
      var originalPacket=dedupeIndex[key];
      originalPacket.receptions.push[packet];
    }
  };

  this.expirePacketsBefore=function(expiryTime) {
    var filter=(function(p) {
      //console.log("   " + p.receivedAt.getTime() + " " + expiryTime);
      return (p.receivedAt.getTime() >= expiryTime);;
    });
    newDeduplicatedPackets=[];
    for(var key in dedupeIndex){
      var packet=dedupeIndex[key];
      if (!filter(packet)) {
        dedupeIndex.delete(key);
      } else {
        newDeduplicatedPackets.push(packet);
      }
    }
    this.deduplicatedPackets=newDeduplicatedPackets;
  }
}

module.exports=Deduplicator;
