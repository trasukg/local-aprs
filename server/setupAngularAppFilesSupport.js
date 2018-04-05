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

var path=require('path');
var express=require('express');

const staticFilesAreInDist=function(ctx) {
  ctx.serverHomePath=path.join(process.cwd(),"dist")
  console.log("static files in '" + ctx.serverHomePath + "'")
  ctx.app.use(express.static( ctx.serverHomePath,
    { dotfiles: 'deny', index: 'index.html'}));
  ctx.app.get('/', function(req,res) {
    res.redirect('index.html');
  });

}

const allOtherPathsGotoIndexDotHtml = function(ctx) {
  // Catch all other routes and return the index file
  ctx.app.get('*', (req, res) => {
    res.sendFile(path.join(ctx.serverHomePath,"index.html"));
  });
};

const setupAngularAppFilesSupport=function(ctx) {
  staticFilesAreInDist(ctx);
  allOtherPathsGotoIndexDotHtml(ctx);
};

module.exports=setupAngularAppFilesSupport;
