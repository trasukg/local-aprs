import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { latLng, tileLayer } from 'leaflet';
import { selectCenter, selectZoom } from '../map-display/map-display.selectors';
import { setCenter, setZoom } from '../map-display/map-display.actions';

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
    ]
  };

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  zoom$ = this.store.select(selectZoom);

  center$ = this.store.select(selectCenter);

  mapMove(event) {
    console.log('mapMove(' + JSON.stringify(event.sourceTarget.center) + ')');
  }

  zoomChange(zoom) {
    console.log('mapZoomChange(' + zoom + ')');
    this.store.dispatch(setZoom({ zoom, isUserSourced: true }));
  }

  centerChange(center) {
    console.log('mapCenterChange(' + center + ')');
    this.store.dispatch(setCenter({ center, isUserSourced: true }))
  }
}
