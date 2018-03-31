import { TestBed, inject } from '@angular/core/testing';

import { AprsSituationService } from './aprs-situation.service';

describe('AprsSituationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AprsSituationService]
    });
  });

  it('should be created', inject([AprsSituationService], (service: AprsSituationService) => {
    expect(service).toBeTruthy();
  }));
});
