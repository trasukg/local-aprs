import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AprsSituationEffects } from './aprs-situation.effects';

describe('AprsSituationEffects', () => {
  let actions$: Observable<any>;
  let effects: AprsSituationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AprsSituationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<AprsSituationEffects>(AprsSituationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
