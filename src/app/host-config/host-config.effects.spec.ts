import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { HostConfigEffects } from './host-config.effects';

describe('HostConfigEffects', () => {
  let actions$: Observable<any>;
  let effects: HostConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HostConfigEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<HostConfigEffects>(HostConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
