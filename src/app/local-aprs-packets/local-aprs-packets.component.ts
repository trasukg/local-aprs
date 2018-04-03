import { Component, OnInit } from '@angular/core';
import {AprsSituationService} from '../aprs-situation.service';

@Component({
  selector: 'app-local-aprs-packets',
  templateUrl: './local-aprs-packets.component.html',
  styleUrls: ['./local-aprs-packets.component.css'],
})
export class LocalAprsPacketsComponent implements OnInit {

  constructor(public aprsSituation:AprsSituationService) { }

  ngOnInit() {
  }

}
