import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDetailComponent } from './station-detail.component';

describe('StationDetailComponent', () => {
  let component: StationDetailComponent;
  let fixture: ComponentFixture<StationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
