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

var aprsUtils=require("utils-for-aprs");
var APRSProcessor=aprsUtils.APRSProcessor;
var SocketKISSFrameEndpoint=aprsUtils.SocketKISSFrameEndpoint;
var log4js=require('log4js');
var testPackets=require("./sample-frames").sampleFrames;
var tncSimulator=aprsUtils.tncSimulator;
var process=require('process');

var logger=log4js.getLogger('incoming');

var theresAStorageAreaForPackets=function(ctx) {
  ctx.storedPackets=[];
}

var theAPRSProcessorProcessesPacketData=function(ctx) {
  ctx.aprsProcessor=new APRSProcessor();
  ctx.aprsProcessor.on('aprsData', function(data) {
    logger.debug(data);
  });
}

var packetsComeFromTheRadio=function(ctx) {
  //Create the endpoint
  ctx.endpoint=new SocketKISSFrameEndpoint();
  ctx.endpoint.host=ctx.config["kiss-host"];
  ctx.endpoint.port=ctx.config["kiss-port"];

  // On open, install a handler that passes data to the aprsProcessor.
  ctx.endpoint.on('connect', function(connection) {
    logger.info("Connected to port " + ctx.endpoint.port);
    connection.on('data', function(frame) {
      ctx.aprsProcessor.data(frame);
    });
    connection.on('disconnect', function() {
      logger.info('Lost connection');
    });
  });
  ctx.endpoint.enable();
}

var userWantsSimulationMode=function() {
  return (process.argv[2]=='simulate');
}

var incomingPacketsGetTimestamped=function(ctx) {
  ctx.aprsProcessor.on('aprsData', function(packet) {
    packet.receivedAt=new Date();
  });
}

var incomingPacketsGoToStorage=function(ctx) {
  ctx.storedPackets=[];
  ctx.aprsProcessor.on('aprsData', function(packet) {
    ctx.storedPackets.push(packet);
  });
}
/** Note to self:  In the fullness of time, we will switch to just having an
instance of the AprsEngine here, so it won't be cut/pasted code so much.
*/

var expirePackets=function(ctx, expireInterval) {
  var now=new Date().getTime();
  var expiryTime=now - expireInterval;
  while(ctx.storedPackets.length>0 && ctx.storedPackets[0].receivedAt.getTime() < expiryTime) {
    ctx.storedPackets.shift();
  }
}

var storedPacketsExpireAfterSomeTime=function(ctx) {
  var expireInterval=ctx.config.standardPacketMinutesToLive*60*1000;

  setInterval(() => expirePackets(ctx, expireInterval),5000);
}

var packetsWithErrorsGetLogged=function(ctx) {
  ctx.aprsProcessor.on('error', function(err, frame) {
    logger.error("Got error on received frame." + err);
    logger.debug(frame);
  });
}

function packetsComeFromSampleFrames(ctx) {

  testPackets=testPackets.filter(function(packet) {
    return (packet.length>0);
  });
  // Start by feeding in 50 packets at 10/s, then feed in 1 per second.
  var currentPacket=0;
  var packetSource=function() {
    var packetBuffer=new Buffer(testPackets[currentPacket]);
    currentPacket++;
    if (currentPacket>=testPackets.length) {
      currentPacket=0;
    }
    return packetBuffer;
  }
  tncSimulator(packetSource,function(data) {
    try {
      ctx.aprsProcessor.data(data);
    } catch(err) {
      console.log(err);
    }
  }, 10, 5, 1/30);
}

module.exports=function(ctx) {
  //The packet handling needs to be setup before packets start coming.
  theresAStorageAreaForPackets(ctx);
  theAPRSProcessorProcessesPacketData(ctx);
  incomingPacketsGetTimestamped(ctx);
  incomingPacketsGoToStorage(ctx);
  packetsWithErrorsGetLogged(ctx);
  //incomingPacketsGetDigipeated(ctx);
  storedPacketsExpireAfterSomeTime(ctx);
  if(userWantsSimulationMode(ctx)) {
    packetsComeFromSampleFrames(ctx);
  } else {
    packetsComeFromTheRadio(ctx);
  }
}
