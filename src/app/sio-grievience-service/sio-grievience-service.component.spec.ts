import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioGrievienceServiceComponent } from './sio-grievience-service.component';

describe('SioGrievienceServiceComponent', () => {
  let component: SioGrievienceServiceComponent;
  let fixture: ComponentFixture<SioGrievienceServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioGrievienceServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioGrievienceServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
