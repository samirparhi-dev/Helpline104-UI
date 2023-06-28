import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioInformationServiceComponent } from './sio-information-service.component';

describe('SioInformationServiceComponent', () => {
  let component: SioInformationServiceComponent;
  let fixture: ComponentFixture<SioInformationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioInformationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioInformationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
