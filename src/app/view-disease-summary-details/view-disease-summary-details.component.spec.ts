import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiseaseSummaryDetailsComponent } from './view-disease-summary-details.component';

describe('ViewDiseaseSummaryDetailsComponent', () => {
  let component: ViewDiseaseSummaryDetailsComponent;
  let fixture: ComponentFixture<ViewDiseaseSummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiseaseSummaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiseaseSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
