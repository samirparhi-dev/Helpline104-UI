import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SioOutboundProviderComponent } from './sio-outbound-provider.component';

describe('SioOutboundProviderComponent', () => {
  let component: SioOutboundProviderComponent;
  let fixture: ComponentFixture<SioOutboundProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SioOutboundProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SioOutboundProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
