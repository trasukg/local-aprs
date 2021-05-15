import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { selectLastFix } from '../position/position.selectors';
import * as MapDisplayActions from './map-display.actions';
import { selectConfig } from '../config/config.selectors'
import { setCenter } from '../map-display/map-display.actions';
import { latLng } from 'leaflet';

@Injectable()
export class MapDisplayEffects {

  private config$ = this.store.select(selectConfig);
  private lastFix$ = this.store.select(selectLastFix);

  loadMapDisplays$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(MapDisplayActions.loadMapDisplays),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => MapDisplayActions.loadMapDisplaysSuccess({ data })),
          catchError(error => of(MapDisplayActions.loadMapDisplaysFailure({ error }))))
      )
    );
  });

  followPosition$ = createEffect( () => {
    return this.store.select(selectLastFix).pipe(
      withLatestFrom(this.config$),
      concatMap( ([lastFix, config]) => {
        console.log('followPosition got lastFix=' + JSON.stringify(lastFix));
        if (config.keepMapCenteredOnPosition) {
          return of(
            setCenter( {
              center: latLng(lastFix.coords.latitude, lastFix.coords.longitude ),
              isUserSourced: false
            })
          );
        } else {
          return EMPTY;
        }
      })
    )
  });

  // preventManualPositionChanges$ = createEffect( () => {
  //   return this.actions$.pipe(
  //     ofType(MapDisplayActions.setCenter),
  //     withLatestFrom(this.config$, this.lastFix$),
  //     concatMap(([action, config, lastFix]) => {
  //       if (action.isUserSourced && config.keepMapCenteredOnPosition) {
  //         return of(
  //           setCenter( {
  //             center: latLng(lastFix.coords.latitude, lastFix.coords.longitude ),
  //             isUserSourced: false
  //           })
  //         );
  //       } else {
  //         return EMPTY;
  //       }
  //     })
  //   );
  // });

  constructor(private actions$: Actions, private store: Store<any>) {}

}
