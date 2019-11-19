import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as AprsSituationActions from './aprs-situation.actions';



@Injectable()
export class AprsSituationEffects {

  constructor(private actions$: Actions) {}

}
