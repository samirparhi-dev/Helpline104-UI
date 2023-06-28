import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorComplaintDetailReportComponent } from './supervisor-complaint-detail-report.component';

describe('SupervisorComplaintDetailReportComponent', () => {
  let component: SupervisorComplaintDetailReportComponent;
  let fixture: ComponentFixture<SupervisorComplaintDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorComplaintDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorComplaintDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
