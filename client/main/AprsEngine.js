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

/*
This is the main aprs engine.  It handles maintenance of all the data that
the various views want to present.
*/

var EventEmitter=require('events');
var util=require('util');

var AprsEngine=function(hostService) {
  var self=this;
  EventEmitter.apply(self);

  var connected=false;
  var rawPackets=[];

  var processPacketWithoutUpdate=function(packet) {
    /* Note to self! Need to de-dupe here... */
    rawPackets.push(packet);
    /* Convert the receivedAt value to a date if necessary. */
    if (! (packet.receivedAt instanceof Date)) {
      packet.receivedAt=new Date(packet.receivedAt);
    }
    self.lastServerTime=Math.max(self.lastServerTime, packet.receivedAt.getTime());
  };

  var processPacket=function(packet) {
    processPacketWithoutUpdate(packet);

    calculateSummaries();
    self.emit('update');
  }

  self.connected=function() {
    return connected;
  };

  self.rawPackets=function() {
    return rawPackets;
  };

  self.lastServerTime=0;

  hostService.on('connected', function() {
    this.connected=true;
    /* Clear the stored packets. */
    /* Request the configuration. */
    hostService.request({ command: "config?"}).then(function(response) {
      self.config=response.config;
      self.emit('updateConfig');
    });
    /* Request the server's cached packets. */
    hostService.request({ command: "packets?"}).then(function(response) {
      //console.log("in hostService.onConnected, packets=" + JSON.stringify(response.packets));
      console.log("Got a new set of packets... Processing...");
      clearPackets();
      response.packets.forEach(function(item) {
        processPacketWithoutUpdate(item);
      });
      calculateSummaries();
      console.log('   ...done');
      self.emit('update');
    });
  });

  hostService.on('disconnected', function() {
    connected=false;
    self.emit('update');
  });

  hostService.on('aprsData', function(packet) {
    console.log('got packet' + packet);
    processPacket(packet);
    self.emit('update');
  });

  var clearPackets=function() {
    rawPackets=[];
    self.lastServerTime=0;
  };

  var expireInterval=function() {
    if (self.config && self.config.standardPacketMinutesToLive) {
      return self.config.standardPacketMinutesToLive*60*1000;
    } else {  // Default to 60 minutes.
      return 60*60*1000;
    }
  };

  var expirePackets=function() {
    var expiredCount=0;
    var now=self.lastServerTime;
    var expiryTime=now - expireInterval();
    console.log("lastServerTime is " + new Date(now) + ", expiryTime is "
      + new Date(expiryTime));
    var newPackets=rawPackets.filter(function(p) {
      //console.log("   " + p.receivedAt.getTime() + " " + expiryTime);
      return (p.receivedAt.getTime() >= expiryTime);;
    });
    expiredCount=rawPackets.length-newPackets.length;
    rawPackets=newPackets;
    // while(packets.length>0 && packets[0].receivedAt.getTime() < expiryTime) {
    //   expiredCount++;
    //   packets.shift();
    // }
    console.log("Expired " + expiredCount + " packets.");
  }
  setInterval(expirePackets,5000);

  /** Calculate the packet summaries, station lists, etc.
  */
  var calculateSummaries=function() {

  }
};

util.inherits(AprsEngine, EventEmitter);

module.exports=AprsEngine;
