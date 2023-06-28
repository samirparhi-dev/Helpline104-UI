import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalAdviseReportComponent } from './medical-advise-report.component';

describe('MedicalAdviseReportComponent', () => {
  let component: MedicalAdviseReportComponent;
  let fixture: ComponentFixture<MedicalAdviseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalAdviseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalAdviseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
