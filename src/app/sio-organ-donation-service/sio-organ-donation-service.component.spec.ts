import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioOrganDonationServiceComponent } from './sio-organ-donation-service.component';

describe('SioOrganDonationServiceComponent', () => {
  let component: SioOrganDonationServiceComponent;
  let fixture: ComponentFixture<SioOrganDonationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioOrganDonationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioOrganDonationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
