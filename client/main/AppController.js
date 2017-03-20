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

module.exports=function($scope, $mdSidenav, hostService) {
  this.rawPackets=[];
  /* Events may run in other context, so preserve 'this'. */
  var self=this;
  /* Display the left side navigation menu. */
  this.toggleList=function() {
    $mdSidenav('left').toggle();
  }

  this.connected=false;

  hostService.on('connected', function() {
    this.connected=true;
  });

  hostService.on('disconnected', function() {
    this.connected=false;
  });

  hostService.on('aprsData', function(packet) {
    console.log('got packet' + packet);
    self.rawPackets.push(packet);
  });
}
