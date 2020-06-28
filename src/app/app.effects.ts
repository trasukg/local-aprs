import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as appActions from './app.actions';
import * as fromPosition from './position/position.actions';
import * as fromAprsSituation from './aprs-situation/aprs-situation.actions';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private store: Store<any>) {}

  startup$ = createEffect(() => this.actions$.pipe(
    ofType(appActions.startupApplication),
    mergeMap( action => of(
      fromAprsSituation.enableHostConnection(),
      fromPosition.enablePosition()
    ))
  ));
}
