import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorDiseasesSummaryComponent } from './supervisor-diseases-summary.component';

describe('SupervisorDiseasesSummaryComponent', () => {
  let component: SupervisorDiseasesSummaryComponent;
  let fixture: ComponentFixture<SupervisorDiseasesSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorDiseasesSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorDiseasesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
