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

var aprsEngine=function(hostService) {

  var connected=false;
  var rawPackets=[];

  var processPacket=function(packet) {
    rawPackets.push(packet);
  };

  this.connected=function() {
    return connected;
  };

  this.rawPackets=function() {
    return rawPackets;
  };

  hostService.on('connected', function() {
    this.connected=true;
    /* Clear the stored packets. */
    /* Request the configuration. */
    hostService.request({ command: "config?"}).then(function(response) {
      this.config=response.config;
    });
    /* Request the server's cached packets. */
    hostService.request({ command: "packets?"}).then(function(response) {
      console.log("in hostService.onConnected, packets=" + JSON.stringify(response.packets));
      response.packets.forEach(function(item) {
        processPacket(item);
      });
    });
  });

  hostService.on('disconnected', function() {
    connected=false;
  });

  hostService.on('aprsData', function(packet) {
    console.log('got packet' + packet);
    processPacket(packet);
  });
};

module.exports=aprsEngine;
