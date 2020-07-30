import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsComponent } from './stations.component';
import { StationRecord } from '../StationRecord';

describe('StationsComponent', () => {
  let component: StationsComponent;
  let fixture: ComponentFixture<StationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be able to use a Map', () => {
    const stationsById: Map<string, StationRecord> = new Map();
    stationsById.set('VA3TSK', new StationRecord('VA3TSK'));
    stationsById.set('VA3ZZZ', new StationRecord('VA3ZZZ'));
    const ids = [];
    for (const key in stationsById) {
      if (stationsById.hasOwnProperty(key)) {
        ids.push(key);
      }
    }
    expect(ids.length).toBe(2);
  });
});
