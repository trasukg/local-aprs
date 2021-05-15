import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import { EMPTY, of, from } from 'rxjs';
import { AprsSituationService } from './aprs-situation.service';
import * as AprsSituationActions from './aprs-situation.actions';
import * as ConfigActions from '../config/config.actions';
import { HostService } from '../host.service';

@Injectable()
export class AprsSituationEffects {

  constructor(
    private actions$: Actions,
    private aprsSituationService: AprsSituationService,
    private hostService: HostService,
    private store: Store<any>
  ) {}

  enableHostConnection$ = createEffect(() => this.actions$.pipe(
    ofType(AprsSituationActions.enableHostConnection),
      tap(action => this.aprsSituationService.enableHost())
    ), { dispatch: false });

  /*
    On connection, load the config and the initial packets.
  */
  hostConnected$ = createEffect(() => this.actions$.pipe(
    ofType(AprsSituationActions.connected),
    concatMap(() => of(
      ConfigActions.loadHostConfig(),
      AprsSituationActions.loadInitialPackets()
    )))
  );

  loadInitialPackets$ = createEffect(() => this.actions$.pipe(
    ofType(AprsSituationActions.loadInitialPackets),
    concatMap(() => {
      this.hostService.request({ command: 'packets?'})
      .then(response => {
        // Reimplement to dispatch a bulk-packet action.
        this.store.dispatch(AprsSituationActions.receivedInitialPackets(
          { packets: response.packets} ));

        // self.clearPackets();
        // response.packets.forEach(function(item) {
        //   self.processPacketWithoutUpdate(item);
        // });
        // self.calculateSummaries();
        // self.emit('update');
      });
      return EMPTY;
    })), { dispatch: false }
  );

}


// /* Request the server's cached packets. */
// .then( () => {
//   return ;
// })

// );
