import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesheetHistoryMctsComponent } from './casesheet-history-mcts.component';

describe('CasesheetHistoryMctsComponent', () => {
  let component: CasesheetHistoryMctsComponent;
  let fixture: ComponentFixture<CasesheetHistoryMctsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesheetHistoryMctsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesheetHistoryMctsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
