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

/* This module provides a function that configures the oauth2 support, so the
client application can authenticate itself and get an access token.
*/

var log4js=require('log4js');
var logger=log4js.getLogger('main');
var express=require('express');
var hbs=require('express-hbs');
var aprsUtils=require("utils-for-aprs");
var ax25utils=aprsUtils.ax25utils;
var path=require('path');

var theresAWebServer=function(ctx) {
  ctx.app = express();
  ctx.http = require('http').Server(ctx.app);

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
  const serverHomePath=path.join(process.cwd(),"dist")
  console.log("static files in '" + serverHomePath + "'")
  ctx.app.use(express.static( serverHomePath,
    { dotfiles: 'deny', index: 'index.html'}));
  ctx.app.get('/', function(req,res) {
    res.redirect('index.html');
  });
  ctx.http.listen(3000, function(){
    console.log('listening on *:3000');
  });
};

var theWebServerHandlesErrors=function(ctx) {
  var errorHandler=function(err, req, res, next) {
    logger.debug(err);
    res.status(500).json({ error: err })
  };
  ctx.app.use(errorHandler)
};

function clientsCanDownloadThePacketStoreThroughRESTfulAPI(ctx) {
  var router=express.Router();
  router.get("/recent-packets", function(req,res) {
    res.json(ctx.storedPackets);
  });
  ctx.app.use("/api", router);
};

var clientsCanSeeThePackets=function(ctx) {
  ctx.app.get("/s/index.html", function(req, res) {
    res.render('index', { packets: ctx.storedPackets });
  });
};

const allOtherPathsGotoIndexDotHtml = function(ctx) {
  // Catch all other routes and return the index file
  ctx.app.get('*', (req, res) => {
    res.sendFile(path.join(serverHomePath,"index.html"));
  });
};

const iconFontsAreAvailable=function(ctx) {
  const iconPath=path.join(process.cwd(),'node_modules', 'material-design-icons',
    'iconfont');
  ctx.app.use('/iconfont', express.static( iconPath ));
};

var setupWebServer=function(ctx) {
  theresAWebServer(ctx);
  clientsCanDownloadThePacketStoreThroughRESTfulAPI(ctx);
  clientsCanSeeThePackets(ctx);
  iconFontsAreAvailable(ctx);
  allOtherPathsGotoIndexDotHtml(ctx);
  theWebServerHandlesErrors(ctx);
};

module.exports=setupWebServer;
