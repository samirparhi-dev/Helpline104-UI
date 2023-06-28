import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioFoodSafetyServiceComponent } from './sio-food-safety-service.component';

describe('SioFoodSafetyServiceComponent', () => {
  let component: SioFoodSafetyServiceComponent;
  let fixture: ComponentFixture<SioFoodSafetyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioFoodSafetyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioFoodSafetyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
