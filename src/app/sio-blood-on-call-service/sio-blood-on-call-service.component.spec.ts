import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioBloodOnCallServiceComponent } from './sio-blood-on-call-service.component';

describe('SioBloodOnCallServiceComponent', () => {
  let component: SioBloodOnCallServiceComponent;
  let fixture: ComponentFixture<SioBloodOnCallServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioBloodOnCallServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioBloodOnCallServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
