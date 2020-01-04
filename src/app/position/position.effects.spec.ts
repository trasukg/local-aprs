import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PositionEffects } from './position.effects';

describe('PositionEffects', () => {
  let actions$: Observable<any>;
  let effects: PositionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PositionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<PositionEffects>(PositionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
