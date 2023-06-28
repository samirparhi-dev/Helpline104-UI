import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorQualityReportComponent } from './supervisor-quality-report.component';

describe('SupervisorQualityReportComponent', () => {
  let component: SupervisorQualityReportComponent;
  let fixture: ComponentFixture<SupervisorQualityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorQualityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorQualityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
