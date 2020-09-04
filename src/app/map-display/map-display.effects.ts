import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as MapDisplayActions from './map-display.actions';



@Injectable()
export class MapDisplayEffects {

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



  constructor(private actions$: Actions) {}

}
