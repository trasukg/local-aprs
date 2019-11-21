import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { AprsSituationService } from './aprs-situation.service';
import * as AprsSituationActions from './aprs-situation.actions';


@Injectable()
export class AprsSituationEffects {

  constructor(private actions$: Actions, private aprsSituationService: AprsSituationService) {}

  loadHostConfigs$ = createEffect(() => this.actions$.pipe(
    ofType(AprsSituationActions.enableHostConnection),
      tap(action => this.aprsSituationService.enableHost())
    ), { dispatch: false });
}
