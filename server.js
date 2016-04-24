
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
var express=require('express');
var log4js=require('log4js');
var hbs=require('express-hbs');
var ax25utils=aprsUtils.ax25utils;

var config=require("./config.json");
var packetProcessingFunctions=[];
var aprsProcessor;
var storedPackets;
var app;
var http;

var logger=log4js.getLogger('main');

loggingIsDoneThroughLog4js();
theresAStorageAreaForPackets();
packetsComeFromTheRadio();
unlessWereInSimulationMode(packetsComeFromTheRadio);
incomingPacketsGetTimestamped();
incomingPacketsGoToStorage();
packetsWithErrorsGetLogged();
//incomingPacketsGetDigipeated();
storedPacketsExpireAfter60Minutes();
theresAWebServer();
//theresASocketDotIOServer();
//clientsCanConnectToSockets();
//incomingPacketsGoToSocketClients();
clientsCanDownloadThePacketStoreThroughRESTfulAPI();
clientsCanSeeThePackets();

function theresAStorageAreaForPackets() {
  storedPackets=[];
}

function packetsComeFromTheRadio() {
  var logger=log4js.getLogger('tnc');
  aprsProcessor=new APRSProcessor();
  aprsProcessor.on('aprsData', function(data) {
    logger.debug(data);
  });
  port=new SerialPort(config["tnc-port"],
  {
    baudrate: config["tnc-baud"],
    parser: aprsUtils.framing.tncFrameParser()
  } );
  // On open, install a handler that passes data to the aprsProcessor.
  port.on('open', function() {
    logger.info("Port opened: " + config["tnc-port"] + " at " +
      config["tnc-baud"] + " baud");
    port.on('data', function(data) {
      logger.debug('Received packet');
      aprsProcessor.data(data);
    });
  });
}

var bodyParser=require('body-parser');

function theresAWebServer() {
  app = express();
  http = require('http').Server(app);
  var serveStatic=require('serve-static');

  hbs.registerHelper('address', function(address) {
    return ax25utils.addressToString(address);
  });
  hbs.registerHelper('path', function(address) {
    return ax25utils.repeaterPathToString(address);
  });
  // Setup Handlebars templates.
  app.engine('hbs', hbs.express4({
    partialsDir: __dirname + "/views/partials",
    layoutsDir: __dirname + "/views/layouts"
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');
  app.use(serveStatic('static', { dotfiles: 'deny'}));
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
  aprsProcessor.on('aprsData', function(packet) {
    packet.receivedAt=new Date();
  });
}

function incomingPacketsGoToStorage() {
  aprsProcessor.on('aprsData', function(packet) {
    storedPackets.push(packet);
  });
}

var EXPIRE_INTERVAL=60*60*1000;

function storedPacketsExpireAfter60Minutes() {
  var expirePackets=function() {
    var now=new Date().getTime();
    var expiryTime=now - EXPIRE_INTERVAL;
    while(storedPackets.length>0 && storedPackets[0].receivedAt.getTime() < expiryTime) {
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

function clientsCanDownloadThePacketStoreThroughRESTfulAPI() {
  var router=express.Router();
  router.get("/recent-packets", function(req,res) {
    res.json(storedPackets);
  });
  app.use("/api", router);
}

function loggingIsDoneThroughLog4js() {
  log4js.configure('log-config.json');
  logger.debug("logging system setup.");
}

function packetsWithErrorsGetLogged() {
  var logger=log4js.getLogger('aprs');
  aprsProcessor.on('error', function(err, frame) {
    logger.error("Got error on received frame." + err);
    logger.debug(frame);
  });
}

function clientsCanSeeThePackets() {
  app.get("/index.html", function(req, res) {
    res.render('index', { packets: storedPackets });
  });
}
