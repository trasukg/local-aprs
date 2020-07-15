import { Component, OnInit } from '@angular/core';
import {StationRecord} from '../aprs-situation/StationRecord';
import { Store } from '@ngrx/store';
import * as fromAprsSituation from '../aprs-situation/aprs-situation.selectors';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent implements OnInit {

  constructor(private store: Store< any> ) {
  }

  stations$ = this.store.select(fromAprsSituation.selectStations);
  stationIds$ = this.store.select(fromAprsSituation.stationIds);
  stationBearings$ = this.store.select(fromAprsSituation.stationBearings);

  ngOnInit() {

  }

}
