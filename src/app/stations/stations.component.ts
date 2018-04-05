import { Component, OnInit } from '@angular/core';
import {AprsSituationService} from '../aprs-situation.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {

  constructor(public aprsSituation:AprsSituationService) { }

  ngOnInit() {
  }

}
