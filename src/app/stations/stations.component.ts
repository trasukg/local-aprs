import { Component, OnInit } from '@angular/core';
import {StationRecord} from '../aprs-situation/StationRecord';
import { Store } from '@ngrx/store';
import * as fromAprsSituation from '../aprs-situation/aprs-situation.selectors';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {

  constructor(private store: Store< any> ) {
  }

  stations$:Map<string, StationRecord>;

  get stationIds$():string[] {
    let stationIds: string[]=[];
    // console.log("reading " + this.stationsById.size + " values");
    // console.log('stationsById=' + this.stationsById);
    // console.log('  keys=' + this.stationsById.keys());
    stationIds=Array.from(this.stations$.keys());
    stationIds=stationIds.sort();
    // console.log("stationIds=" + JSON.stringify(stationIds));
    return stationIds;
  }

  ngOnInit() {
    this.store.select(fromAprsSituation.selectStations).subscribe(res => {
      this.stations$=res;
    });
  }

}
