import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalVivahComponent } from './bal-vivah.component';

describe('BalVivahComponent', () => {
  let component: BalVivahComponent;
  let fixture: ComponentFixture<BalVivahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalVivahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalVivahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
