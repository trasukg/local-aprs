import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of, from } from 'rxjs';

import * as ConfigActions from './config.actions';
import { HostService } from '../host.service';

@Injectable()
export class ConfigEffects {

  loadHostConfig$ = createEffect(() => this.actions$.pipe(
    ofType(ConfigActions.loadHostConfig),
    concatMap(() => {
      this.hostService.request({ command: 'config?'})
      .then(response => {
        // self.config=response.config;
        // self.emit('updateConfig');
        // console.log("Got the config ")
        // Dispatch a 'configure' action.
        this.store.dispatch(ConfigActions.loadHostConfigSuccess({
          config: response.config}));
      })
      .catch(error => {
        this.store.dispatch(ConfigActions.loadHostConfigFailure({ error }));
      });
      return EMPTY;
    })), { dispatch: false });


  constructor(
    private actions$: Actions,
    private hostService: HostService,
    private store: Store<any>
  ) {}

}
