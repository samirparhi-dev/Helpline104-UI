import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiseaseSummaryContentsComponent } from './view-disease-summary-contents.component';

describe('ViewDiseaseSummaryContentsComponent', () => {
  let component: ViewDiseaseSummaryContentsComponent;
  let fixture: ComponentFixture<ViewDiseaseSummaryContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiseaseSummaryContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiseaseSummaryContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
