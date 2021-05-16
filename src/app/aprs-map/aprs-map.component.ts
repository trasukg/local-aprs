import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import * as fromMapDisplay from '../map-display/map-display.selectors';
import { setCenter, setZoom }  from '../map-display/map-display.actions';

@Component({
  selector: 'app-aprs-map',
  templateUrl: './aprs-map.component.html',
  styleUrls: ['./aprs-map.component.scss'],
})
export class AprsMapComponent implements AfterViewInit {

  constructor(private store: Store<any>) { }

  center$ = this.store.select(fromMapDisplay.selectCenter);
  zoom$ = this.store.select(fromMapDisplay.selectZoom);
  mapDisplayState$ = this.store.select(fromMapDisplay.selectMapDisplayState);

  private map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.mapDisplayState$.subscribe( state => {
      this.map.setView(state.center, state.zoom);
    });

    this.map.on('zoom', event => {
      const zoom = this.map.getZoom();
      this.store.dispatch(setZoom({ zoom }));
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
