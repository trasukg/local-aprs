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
  This is a very low-level interface to the web socket host connection.
  It acts as an event emitter to notify the client that a connection has been made
  or broken,
  and then notifies on every packet received.
*/

var aprsEngine=function(hostService) {

    var connected=false;
    var rawPackets=[];

    this.connected=function() {
      return connected;
    }

    this.rawPackets=function() {
      return rawPackets;
    }
    
    hostService.on('connected', function() {
      connected=true;
    });

    hostService.on('disconnected', function() {
      connected=false;
    });

    hostService.on('aprsData', function(packet) {
      console.log('got packet' + packet);
      rawPackets.push(packet);
    });
};

module.exports=aprsEngine;
