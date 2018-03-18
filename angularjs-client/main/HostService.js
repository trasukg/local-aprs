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

var util=require('util');
var EventEmitter=require('events');
var WebSocketAprsDataEndpoint=require('utils-for-aprs').WebSocketAprsDataEndpoint;
var Promise=require('bluebird');

/*
This is a very low-level interface to the web socket host connection.
It acts as an event emitter to notify the client that a connection has been made
or broken,
and then notifies on every packet received.
*/

var HostService=function($location) {
  EventEmitter.apply(this);
  /* Create an endpoint based on the url in the location bar. */
  var wsUrl="ws://" + $location.host() + ":" + $location.port() + "/ws";
  /* events will be executed in different context, so preserve 'this' */

  var self=this;
  self.requestId=1;

  self.endpoint=new WebSocketAprsDataEndpoint(wsUrl);
  self.endpoint.on('connect', function(connection) {
    self.isConnected=true;
    self.emit('connected');
    connection.on('disconnect', function() {
      self.emit('disconnected');
    });
  });
  self.endpoint.on('aprsData', function(data) {
    self.emit('aprsData', data);
  });
  self.endpoint.enable();

  self.request=function(request) {
    return self.endpoint.request(request);
  };
};

util.inherits(HostService, EventEmitter);

module.exports=HostService;
