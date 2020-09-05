import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-aprs-map',
  templateUrl: './aprs-map.component.html',
  styleUrls: ['./aprs-map.component.scss'],
})
export class AprsMapComponent implements OnInit {

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 7,
    center: latLng([ 46.879966, -121.726909 ])
  };

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  zoom = 8;
  center = latLng([ 46.879966, -121.726909 ]);


}
