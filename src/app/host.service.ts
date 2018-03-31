import { Injectable } from '@angular/core';
import {Location} from '@angular/common';
import {EventEmitter} from 'events';
import {WebSocketAprsDataEndpoint} from 'utils-for-aprs';


@Injectable()
export class HostService extends EventEmitter {

  private endpoint: WebSocketAprsDataEndpoint;
  private connected: boolean;

  constructor(location: Location) {
    super();
    /* Create an endpoint based on the url in the location bar. */
    var host=window.location.host;
    var wsUrl="ws://" + host + "/ws";
    console.log("Host service started up with web socket " + wsUrl );
    /* events will be executed in different context, so preserve 'this' */

    var self=this;

    self.endpoint=new WebSocketAprsDataEndpoint(wsUrl);
    self.endpoint.on('connect', function(connection) {
      self.connected=true;
      self.emit('connected');
      connection.on('disconnect', function() {
        self.emit('disconnected');
      });
    });
    self.endpoint.on('aprsData', function(data) {
      self.emit('aprsData', data);
    });
  self.endpoint.enable();

  }

  request(request) {
    return this.endpoint.request(request);
  };
}
