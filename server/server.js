#!/usr/bin/env node

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

var setupIncomingPacketSupport=require("./setupIncomingPacketSupport");
var setupWebServer=require("./setupWebServer");
var setupWebSocketSupport=require("./setupWebSocketSupport");
var setupAngularAppFilesSupport=require("./setupAngularAppFilesSupport");
var log4js=require('log4js');
var logger=log4js.getLogger('main');
var process=require('process');

var ctx={};
ctx.config=require("../config.json");
ctx.clientConfig = require('../client-config.json');

loggingIsDoneThroughLog4js(ctx);

setupIncomingPacketSupport(ctx);
setupWebServer(ctx);
// Note that we have to put web socket path in before the static files, or
// opening "/ws" will be a file rather than the web socket.
setupWebSocketSupport(ctx);
setupAngularAppFilesSupport(ctx);

function loggingIsDoneThroughLog4js() {
  log4js.configure('log-config.json');
  logger.debug("logging system has been setup.");
}
