import { Injectable } from '@angular/core';
import { HostService } from './host.service';
import { EventEmitter } from 'events';
import { Deduplicator } from './Deduplicator';

@Injectable()
export class AprsSituationService extends EventEmitter {
  connected:boolean=false;

  // Raw packets, not deduplicated, in order of receipt.
  rawPackets:any[]=[];

  deduplicator:Deduplicator=new Deduplicator();

  config:any;
  lastServerTime:number = 0;

  constructor(hostService: HostService) {
    super();
    var self=this;
    EventEmitter.apply(self);

    hostService.on('connected', function() {
      self.connected=true;
      /* Clear the stored packets. */
      /* Request the configuration. */
      hostService.request({ command: "config?"}).then(function(response) {
        self.config=response.config;
        self.emit('updateConfig');
      })
      /* Request the server's cached packets. */
      .then(function() {
        return hostService.request({ command: "packets?"});
      })
      .then(function(response) {
        self.clearPackets();
        response.packets.forEach(function(item) {
          self.processPacketWithoutUpdate(item);
        });
        self.calculateSummaries();
        self.emit('update');
      });
    });

    hostService.on('disconnected', function() {
      self.connected=false;
      self.emit('update');
    });

    hostService.on('aprsData', function(packet) {
      self.processPacket(packet);
      self.calculateSummaries();
      self.emit('update');
    });

    var expireInterval=function() {
      if (self.config && self.config.standardPacketMinutesToLive) {
        return self.config.standardPacketMinutesToLive*60*1000;
      } else {  // Default to 60 minutes.
        return 60*60*1000;
      }
    };

    var expireRawPackets=function(expiryTime) {
      var newPackets=self.rawPackets.filter(function(p) {
        return (p.receivedAt.getTime() >= expiryTime);;
      });
      self.rawPackets=newPackets;
    };

    var expireDeduplicatedPackets=function(expiryTime) {
      self.deduplicator.expirePacketsBefore(expiryTime);
    };

    var expirePackets=function() {
      var now=self.lastServerTime;
      var expiryTime=now - expireInterval();
      expireRawPackets(expiryTime);
      expireDeduplicatedPackets(expiryTime);
    }
    setInterval(expirePackets,5000);

  };

  processPacket(packet) {
    this.processPacketWithoutUpdate(packet);

    this.calculateSummaries();
    this.emit('update');
  }

  processPacketWithoutUpdate(packet) {
    this.ensurePacketReceivedAtIsDate(packet);
    this.rawPackets.push(packet);
    this.deduplicator.processPacket(packet);
    this.lastServerTime=Math.max(this.lastServerTime, packet.receivedAt.getTime());
  };

  clearPackets() {
    this.rawPackets=[];
    this.lastServerTime=0;
    this.deduplicator.clear();
  };

  deduplicatedPackets() {
    return this.deduplicator.deduplicatedPackets;
  };

  /** Calculate the packet summaries, station lists, etc.
  */
  calculateSummaries() {

  }

  ensurePacketReceivedAtIsDate(packet) {
    /* Convert the receivedAt value to a date if necessary. */
    if (! (packet.receivedAt instanceof Date)) {
      packet.receivedAt=new Date(packet.receivedAt);
    }

  }
}
