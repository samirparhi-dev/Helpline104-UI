import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSheetCovidModalComponent } from './case-sheet-covid-modal.component';

describe('CaseSheetCovidModalComponent', () => {
  let component: CaseSheetCovidModalComponent;
  let fixture: ComponentFixture<CaseSheetCovidModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseSheetCovidModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSheetCovidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
