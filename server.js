
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
var serialport=require('serialport');
var SerialPort=serialport.SerialPort;

theresAStorageAreaForPackets();
packetsComeFromTheRadio();
unlessWereInSimulationMode(packetsComeFromTheRadio);
incomingPacketsGetTimestamped();
incomingPacketsGoToStorage();
//incomingPacketsGetDigipeated();
storedPacketsExpireAfter60Minutes();
theresAWebServer();
//theresASocketDotIOServer();
//clientsCanConnectToSockets();
//incomingPacketsGoToSocketClients();
clientsCanDownloadThePacketStoreThroughRESTfulAPI();

function theresAStorageAreaForPackets() {
  storedPackets=[];
}

function packetsComeFromTheRadio() {
  port=new SerialPort(process.argv[2],
  {
    baudrate: 1200,
    parser: aprsUtils.framing.tncFrameParser()
  } );
  // On open, install a handler that passes data to the aprsProcessor.
  port.on('open', function() {
    console.log("Port opened");
    aprsProcessor=new APRSProcessor();

    port.on('data', function(data) {
      aprsProcessor.data(data);
    });
  });
}

function theresAWebServer() {
  app = require('express')();
  http = require('http').Server(app);

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
}

function setupSocketDotIOServer() {
  io=require('socket.io')(http);
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}

function incomingPacketsGetTimestamped() {
  aprsProcessor.on('aprsPacket', function() {
    packet.receivedAt=new Date();
  });
}

function incomingPacketsGoToStorage() {
  aprsProcessor.on('aprsPacket', function(packet) {
    storedPackets.push(packet);
  });
}

var EXPIRE_INTERVAL=60*60*1000;

function storedPacketsExpireAfter60Minutes() {
  var expirePackets=function() {
    var now=new Date().getTime();
    var expiryTime=now - EXPIRE_INTERVAL;
    while(storedPackets && storedPackets[0].receivedAt.getTime() < expiryTime) {
      storedPackets.shift();
    }
  }
  setInterval(expirePackets,5000);
}

function unlessWereInSimulationMode(realMode) {
  if (process.argv[2]=='simulate') {
    // Setup to use the last 100 or so simulated packets over the previous hour.
    console.log("Entering simulation mode...");
  } else {
    realMode();
  }
}
