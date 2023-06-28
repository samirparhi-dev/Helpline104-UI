import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioServicesComponent } from './sio-services.component';

describe('SioServicesComponent', () => {
  let component: SioServicesComponent;
  let fixture: ComponentFixture<SioServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
