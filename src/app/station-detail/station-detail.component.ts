import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAprsSituation from '../aprs-situation/aprs-situation.selectors';
import {StationRecord} from '../aprs-situation/StationRecord';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.css']
})
export class StationDetailComponent implements OnInit {

  public station$: StationRecord=undefined;
  stationBearings$ = this.store.select(fromAprsSituation.stationBearings);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store< any>
  ) { }

  ngOnInit() {
    let stationId = this.route.snapshot.paramMap.get('stationId');
    console.log("Getting station details for " + stationId);
    this.store.select(
      fromAprsSituation.selectStation(), { stationId: stationId })
      .subscribe(res => {
      this.station$=res;
    });
  }

}
