import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorCallQualityReportComponent } from './supervisor-call-quality-report.component';

describe('SupervisorCallQualityReportComponent', () => {
  let component: SupervisorCallQualityReportComponent;
  let fixture: ComponentFixture<SupervisorCallQualityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorCallQualityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorCallQualityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
