import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaoImrMmrInformationComponent } from './hao-imr-mmr-information.component';

describe('HaoImrMmrInformationComponent', () => {
  let component: HaoImrMmrInformationComponent;
  let fixture: ComponentFixture<HaoImrMmrInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaoImrMmrInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaoImrMmrInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
