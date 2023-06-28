import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodOnCallDetailedReportComponent } from './blood-on-call-detailed-report.component';

describe('BloodOnCallDetailedReportComponent', () => {
  let component: BloodOnCallDetailedReportComponent;
  let fixture: ComponentFixture<BloodOnCallDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodOnCallDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodOnCallDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
