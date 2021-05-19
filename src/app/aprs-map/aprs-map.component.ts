import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import * as fromMapDisplay from '../map-display/map-display.selectors';
import { setCenter, setZoom }  from '../map-display/map-display.actions';
import { selectStations } from '../aprs-situation/aprs-situation.selectors';

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
  stations$ = this.store.select(selectStations);

  private map;
  private markerLayers = L.layerGroup();

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
    this.markerLayers.addTo(this.map);

    this.mapDisplayState$.subscribe( state => {
      this.map.setView(state.center, state.zoom);
    });

    this.stations$.subscribe( stations => {
      this.updateFromStationsList(stations);
    });

    this.map.on('zoom', event => {
      const zoom = this.map.getZoom();
      this.store.dispatch(setZoom({ zoom }));
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private stationLayerMap = new Map();

  private updateFromStationsList(stations) {
    this.markerLayers.clearLayers();
    stations.forEach(station => {
      if (station.position) {
        let iconStr = '';
        if (station.position.symbolTableId) {
          const symbol = station.position.symbolTableId + station.position.symbolId;
          iconStr = this.getAPRSSymbolImageTag(symbol)
          // console.log("iconStr for " + station.stationId + ", symbol " + symbol + " is " + iconStr);
        }
        const icon = L.divIcon({
          className: 'station-icon',
          html: iconStr + '<div class=station-text >' + station.stationId + '</div>'
        });
        L.marker(
          [station.position.coords.latitude, station.position.coords.longitude],
          { icon }
        ).addTo(this.markerLayers);
      }
    });
  }

  // private translation = [
  //   '!"#$%&\'()*+,-./0', '123456789:;<=>?@', 'ABCDEFGHIJKLMNOP', 'QRSTUVWXYZ[\\]^_`', 'abcdefghijklmnop', 'qrstuvwxyz{|}~'
  // ];

  /**
  * Returns address of symbol in tables or false if not found
  *
  * @param {string} symbol
  * @return {array|boolean} address in tables or false
  * */
  private getAPRSSymbolAddress(symbol) {
    let overlay = undefined;
    const tableSymbol = symbol.charAt(0);
    const search = symbol.charAt(1);
    let table;
    if (tableSymbol === '/') {
      table = 0;
    } else if (tableSymbol === '\\') {
      table = 1;
    } else {
      table = 1;
      overlay = tableSymbol;
    }
    const translation = [
      '!"#$%&\'()*+,-./0', '123456789:;<=>?@', 'ABCDEFGHIJKLMNOP', 'QRSTUVWXYZ[\\]^_`', 'abcdefghijklmnop', 'qrstuvwxyz{|}~'
    ];
    for (let row = 0; row < translation.length; row++) {
      const rowData = translation[row];
      for (let col = 0; col < rowData.length; col++) {
        if (rowData[col] === search) {
          const ret = [table, row, col, overlay];
          return ret;
        }
      }
    }
    return undefined;
  }

  /**
  * Returns <i> tag with propper classes for given address, or false if the address is not correctly provided
  *
  * @param {array} address
  * @param {number} size grid size, either 24, 48, 64 or 128
  * @return {string|boolean} image tag or false on failure
  * */
  private getAPRSSymbolImageTagByAddress(address, size = 24) {
    if (typeof address === 'undefined' || !Array.isArray(address) || address.length !== 4) {
      return undefined;
    }
    let ret = "<i class='aprs-table" + address[0] + "-" + size + " aprs-address-" + size + "-" + address[1] + "-" + address[2] + "'></i>";
    // In case of overlay, add a second icon.
    if (address[3]) {
      let [overlayTable, overlayRow, overlayCol] = this.getAPRSSymbolAddress('/' + address[3]);
      ret = ret + "<i class='aprs-overlay" + "-" + size + " aprs-address-" + size + "-" + overlayRow + "-" + overlayCol + "'></i>";
    }
    return ret;
  }

  /**
  * Either you can get image tag generated by passing symbol only (such as "/["), or you can get the image tag by providing its address
  *
  * @param {string} symbol
  * @param {number} size
  * @return {string|boolean} image tag, if address was found, false otherwise
  * */
  private getAPRSSymbolImageTag(symbol, size = 24) {
    const address = this.getAPRSSymbolAddress(symbol);
    return this.getAPRSSymbolImageTagByAddress(address, size);
  }
}
