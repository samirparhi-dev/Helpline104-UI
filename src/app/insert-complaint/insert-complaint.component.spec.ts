import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertComplaintComponent } from './insert-complaint.component';

describe('InsertComplaintComponent', () => {
  let component: InsertComplaintComponent;
  let fixture: ComponentFixture<InsertComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
