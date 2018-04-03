import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAprsPacketsComponent } from './local-aprs-packets.component';

describe('LocalAprsPacketsComponent', () => {
  let component: LocalAprsPacketsComponent;
  let fixture: ComponentFixture<LocalAprsPacketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAprsPacketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAprsPacketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
