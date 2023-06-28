import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesheetHistoryMmuComponent } from './casesheet-history-mmu.component';

describe('CasesheetHistoryMmuComponent', () => {
  let component: CasesheetHistoryMmuComponent;
  let fixture: ComponentFixture<CasesheetHistoryMmuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesheetHistoryMmuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesheetHistoryMmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
