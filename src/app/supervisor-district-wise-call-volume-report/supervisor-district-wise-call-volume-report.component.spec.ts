import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorDistrictWiseCallVolumeReportComponent } from './supervisor-district-wise-call-volume-report.component';

describe('SupervisorDistrictWiseCallVolumeReportComponent', () => {
  let component: SupervisorDistrictWiseCallVolumeReportComponent;
  let fixture: ComponentFixture<SupervisorDistrictWiseCallVolumeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorDistrictWiseCallVolumeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorDistrictWiseCallVolumeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
