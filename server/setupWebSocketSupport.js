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

var expressWs=require('express-ws');
var aprsUtils=require("utils-for-aprs");
var log4js=require('log4js');
var logger=log4js.getLogger('websockets');

var clientsCanConnectToSockets=function(ctx) {
  ctx.clients=[];
  expressWs(ctx.app, ctx.http, { wsOptions: { perMessageDeflate: false}});
  ctx.app.ws('/ws', function(ws, req) {
    logger.debug('Got a ws connection');
    ctx.clients.push(ws);
    ws.on('message', function(msg) {
      logger.debug('received a message', msg);
      msg=JSON.parse(msg);
      handleWSMessage(ctx, ws, msg);
    });
    ws.on('close', function() {
      logger.debug('Web socket closed by client');
      var index=ctx.clients.indexOf(ws);
      if (index>-1) {
        ctx.clients.splice(index, 1);
      }
    });
  });
}

var incomingPacketsGoToSocketClients=function(ctx) {
  ctx.aprsProcessor.on('aprsData', function(packet) {
    logger.debug("Sending to web sockets")
    ctx.clients.forEach(function(ws) {
      logger.debug("ws...");
      ws.send(JSON.stringify({ aprsData: packet}));
    });
  });
};

var handleWSMessage=function(ctx, ws, msg) {
  logger.debug("command=" + msg.command);
  if (msg.command=='config?') {
    ws.send(JSON.stringify({
      config: ctx.clientConfig,
      replyTo: msg.msgId
    }));
  } else if (msg.command=="packets?") {
    ws.send(JSON.stringify({
      packets: ctx.storedPackets,
      replyTo: msg.msgId
    }));
  }
}

var setupWebSocketSupport=function(ctx) {
  clientsCanConnectToSockets(ctx);
  incomingPacketsGoToSocketClients(ctx);
}

module.exports=setupWebSocketSupport;
