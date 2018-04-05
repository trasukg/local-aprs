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

/* This is the main entry point and setup file for the client application.
*/
'use strict';
var app = require('angular').module('local_aprs_client');

app.service('hostService', require('./HostService'));
app.service('aprsEngine', require('./AprsEngine'));
app.controller('AppController', require('./AppController'));
app.filter('toTNC2form', require('./toTNC2FormFilter'));
app.filter('ssidForm', require('./ssidFormFilter'));
app.filter('formatRoute', require('./routeFormatFilter'));
app.filter('formatReceptions', require('./receptionsFormatFilter'));
