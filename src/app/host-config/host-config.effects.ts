import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as HostConfigActions from './host-config.actions';



@Injectable()
export class HostConfigEffects {

  loadHostConfigs$ = createEffect(() => this.actions$.pipe(
    ofType(HostConfigActions.loadHostConfigs),
    concatMap(() =>
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      EMPTY.pipe(
        map(config => HostConfigActions.loadHostConfigsSuccess({ config })),
        catchError(error => of(HostConfigActions.loadHostConfigsFailure({ error }))))
    )
  ));



  constructor(private actions$: Actions) {}

}
