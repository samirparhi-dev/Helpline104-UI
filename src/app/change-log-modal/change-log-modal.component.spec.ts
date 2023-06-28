import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogModalComponent } from './change-log-modal.component';

describe('ChangeLogModalComponent', () => {
  let component: ChangeLogModalComponent;
  let fixture: ComponentFixture<ChangeLogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
