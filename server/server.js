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

var aprsUtils=require("utils-for-aprs");
var APRSProcessor=aprsUtils.APRSProcessor;
var SocketKISSFrameEndpoint=aprsUtils.SocketKISSFrameEndpoint;
var express=require('express');
var log4js=require('log4js');
var hbs=require('express-hbs');
var ax25utils=aprsUtils.ax25utils;
var tncSimulator=aprsUtils.tncSimulator;
var theWebServerSupportsOAuth2=require('./oauth2-support');
var logger=log4js.getLogger('main');
var expressWs=require('express-ws');
var path=require('path');
var process=require('process');

var ctx={};
ctx.config=require("../config.json");

loggingIsDoneThroughLog4js(ctx);

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
theresAWebServer(ctx);
theWebServerSupportsOAuth2(ctx);
clientsCanConnectToSockets(ctx);
incomingPacketsGoToSocketClients(ctx);
clientsCanDownloadThePacketStoreThroughRESTfulAPI(ctx);
clientsCanSeeThePackets(ctx);
theWebServerHandlesErrors(ctx);

function theWebServerHandlesErrors(ctx) {
  var errorHandler=function(err, req, res, next) {
    logger.debug(err);
    res.status(500).json({ error: err })
  };
  ctx.app.use(errorHandler)
}

function theresAStorageAreaForPackets(ctx) {
  ctx.storedPackets=[];
}

function theAPRSProcessorProcessesPacketData(ctx) {
  ctx.aprsProcessor=new APRSProcessor();
  ctx.aprsProcessor.on('aprsData', function(data) {
    logger.debug(data);
  });
}

function packetsComeFromTheRadio(ctx) {
  var logger=log4js.getLogger('tnc');
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

var bodyParser=require('body-parser');

function theresAWebServer(ctx) {
  ctx.app = express();
  ctx.http = require('http').Server(ctx.app);
  //var serveStatic=require('serve-static');

  hbs.registerHelper('address', function(address) {
    return ax25utils.addressToString(address);
  });
  hbs.registerHelper('path', function(address) {
    return ax25utils.repeaterPathToString(address);
  });
  // Setup Handlebars templates.
  ctx.app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, "views", "partials"),
    layoutsDir: path.join(__dirname, "views", "layouts")
  }));
  ctx.app.set('view engine', 'hbs');
  ctx.app.set('views', path.join(__dirname, 'views'));
  console.log("static files in '" + path.join(process.cwd(),"built-web") + "'")
  ctx.app.use(express.static( path.join(process.cwd(),"built-web"),
    { dotfiles: 'deny', index: 'index.html'}));
  ctx.app.get('/', function(req,res) {
    res.redirect('index.html');
  });
  ctx.http.listen(3000, function(){
    console.log('listening on *:3000');
  });
}

function theWebServerSupportsOAuth2(ctx) {

}

function incomingPacketsGetTimestamped(ctx) {
  ctx.aprsProcessor.on('aprsData', function(packet) {
    packet.receivedAt=new Date();
  });
}

function incomingPacketsGoToStorage(ctx) {
  ctx.storedPackets=[];
  ctx.aprsProcessor.on('aprsData', function(packet) {
    ctx.storedPackets.push(packet);
  });
}

/** Note to self:  In the fullness of time, we will switch to just having an
instance of the AprsEngine here, so it won't be cut/pasted code so much.
*/
var EXPIRE_INTERVAL=ctx.config.standardPacketMinutesToLive*60*1000;

function storedPacketsExpireAfterSomeTime(ctx) {
  var expirePackets=function() {
    var now=new Date().getTime();
    var expiryTime=now - EXPIRE_INTERVAL;
    while(ctx.storedPackets.length>0 && ctx.storedPackets[0].receivedAt.getTime() < expiryTime) {
      ctx.storedPackets.shift();
    }
  }
  setInterval(expirePackets,5000);
}

function userWantsSimulationMode() {
  return (process.argv[2]=='simulate');
}

function clientsCanDownloadThePacketStoreThroughRESTfulAPI(ctx) {
  var router=express.Router();
  router.get("/recent-packets", function(req,res) {
    res.json(ctx.storedPackets);
  });
  ctx.app.use("/api", router);
}

function loggingIsDoneThroughLog4js() {
  log4js.configure('log-config.json');
  logger.debug("logging system setup.");
}

function packetsWithErrorsGetLogged(ctx) {
  var logger=log4js.getLogger('aprs');
  ctx.aprsProcessor.on('error', function(err, frame) {
    logger.error("Got error on received frame." + err);
    logger.debug(frame);
  });
}

function clientsCanSeeThePackets(ctx) {
  ctx.app.get("/s/index.html", function(req, res) {
    res.render('index', { packets: ctx.storedPackets });
  });
}

function packetsComeFromSampleFrames(ctx) {
  var testPackets=require("./node_modules/utils-for-aprs/spec/sample-frames.js").sampleFrames;
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

function clientsCanConnectToSockets(ctx) {
  ctx.clients=[];
  expressWs(ctx.app, ctx.http, { wsOptions: { perMessageDeflate: false}});
  ctx.app.ws('/ws', function(ws, req) {
    logger.debug('Got a ws connection');
    ctx.clients.push(ws);
    ws.on('message', function(msg) {
      logger.debug('received a message', msg);
      msg=JSON.parse(msg);
      handleWSMessage(ws, msg);
    });
    ws.on('close', function() {
      var index=ctx.clients.indexOf(ws);
      if (index>-1) {
        ctx.clients.splice(index, 1);
      }
    });
  });
}

function incomingPacketsGoToSocketClients(ctx) {
  ctx.aprsProcessor.on('aprsData', function(packet) {
    logger.debug("Sending to web sockets")
    ctx.clients.forEach(function(ws) {
      logger.debug("ws...");
      ws.send(JSON.stringify({ aprsData: packet}));
    });
  });
};

function handleWSMessage(ws, msg) {
  logger.debug("command=" + msg.command);
  if (msg.command=='config?') {
    ws.send(JSON.stringify({
      config: ctx.config,
      replyTo: msg.msgId
    }));
  } else if (msg.command=="packets?") {
    ws.send(JSON.stringify({
      packets: ctx.storedPackets,
      replyTo: msg.msgId
    }));
  }
}
