import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgoComponentComponent } from './algo-component.component';

describe('AlgoComponentComponent', () => {
  let component: AlgoComponentComponent;
  let fixture: ComponentFixture<AlgoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
