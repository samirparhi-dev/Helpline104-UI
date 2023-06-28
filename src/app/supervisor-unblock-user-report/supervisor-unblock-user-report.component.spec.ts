import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorUnblockUserReportComponent } from './supervisor-unblock-user-report.component';

describe('SupervisorUnblockUserReportComponent', () => {
  let component: SupervisorUnblockUserReportComponent;
  let fixture: ComponentFixture<SupervisorUnblockUserReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorUnblockUserReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorUnblockUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
