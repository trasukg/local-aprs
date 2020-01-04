import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';

import * as PositionActions from './position.actions';



@Injectable()
export class PositionEffects {

  watchId = -1;

  reportPosition(geopos) {
    // GeoLocationPosition isn't actually a JavaScript object, so we can't just
    // use it.  Need to copy its values specifically.
    let coords= {
      latitude: geopos.coords.latitude,
      longitude: geopos.coords.longitude,
      altitude: geopos.coords.altitude,
      accuracy: geopos.coords.accuracy,
      altitudeAccuracy: geopos.coords.altitudeAccuracy,
      heading: geopos.coords.heading,
      speed: geopos.coords.speed
    }
    let pos={ coords: coords, timestamp: geopos.timestamp };
    console.log("Got position: " + JSON.stringify(pos, undefined, 2));
    this.store.dispatch(PositionActions.reportPosition({position: pos }));
  };

  enablePosition$ = createEffect(() => this.actions$.pipe(
    ofType(PositionActions.enablePosition),
    concatMap((action: Action) => {
      if (navigator.geolocation == undefined) {
        return of(PositionActions.positionFailure({ error: { err: 2, message: 'Geolocation not available.'}}));
      }
      if(this.watchId !== -1) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = -1;
      }
      this.watchId = navigator.geolocation.watchPosition(
        pos => this.reportPosition(pos),
        err => {
          this.store.dispatch(PositionActions.positionFailure({ error: err }));
        });
      /*
        watchPosition() only calls back when the position changes - it doesn't
        give us an initial update.  So do a getCurrentPosition call now.
      */
      console.log("Getting current position...")
      navigator.geolocation.getCurrentPosition(
        pos => this.reportPosition(pos),
        err => this.store.dispatch(PositionActions.positionFailure({ error: err}))
      );
      return EMPTY;
    })
  ));

  disablePosition$ = createEffect(() => this.actions$.pipe(
    ofType(PositionActions.disablePosition),
    concatMap(() => {
      if(this.watchId !== -1) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = -1;
        return of(PositionActions.disablePositionSuccess());
      }
    })
  ));

  constructor(private actions$: Actions, private store: Store<any>) {}

}
