import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {AprsSituationService} from '../aprs-situation/aprs-situation.service';
import {StationRecord} from '../aprs-situation/StationRecord';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.css']
})
export class StationDetailComponent implements OnInit {

  station: StationRecord;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aprsSituation: AprsSituationService
  ) { }

  ngOnInit() {
    let stationId = this.route.snapshot.paramMap.get('stationId');

    this.station = this.aprsSituation.stationsById.get(stationId);
  }

}
