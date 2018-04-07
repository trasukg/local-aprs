import { Component, OnInit } from '@angular/core';
import {AprsSituationService} from '../aprs-situation.service';
import {StationRecord} from '../StationRecord';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {

  public aprsSituation:AprsSituationService=null;;

  constructor(aprsSituation:AprsSituationService) {
    this.aprsSituation=aprsSituation;
  }

  ngOnInit() {
  }

  get stationsById():Map<string, StationRecord> {
    return this.aprsSituation.stationsById;
  }

  get stationIds():string[] {
    let stationIds: string[]=[];
    // console.log("reading " + this.stationsById.size + " values");
    // console.log('stationsById=' + this.stationsById);
    // console.log('  keys=' + this.stationsById.keys());
    stationIds=Array.from(this.stationsById.keys());
    stationIds=stationIds.sort();
    // console.log("stationIds=" + JSON.stringify(stationIds));
    return stationIds;
  }

}
