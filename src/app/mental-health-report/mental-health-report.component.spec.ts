import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthReportComponent } from './mental-health-report.component';

describe('MentalHealthReportComponent', () => {
  let component: MentalHealthReportComponent;
  let fixture: ComponentFixture<MentalHealthReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentalHealthReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentalHealthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
