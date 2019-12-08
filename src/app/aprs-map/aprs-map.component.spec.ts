import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprsMapComponent } from './aprs-map.component';
import { Store, StoreModule } from '@ngrx/store';

describe('AprsMapComponent', () => {
  let component: AprsMapComponent;
  let fixture: ComponentFixture<AprsMapComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ AprsMapComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprsMapComponent);
    component = fixture.componentInstance;
    store = TestBed.get<Store>(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
