import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioEpidemicOutbreakServiceComponent } from './sio-epidemic-outbreak-service.component';

describe('SioEpidemicOutbreakServiceComponent', () => {
  let component: SioEpidemicOutbreakServiceComponent;
  let fixture: ComponentFixture<SioEpidemicOutbreakServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioEpidemicOutbreakServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioEpidemicOutbreakServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
