import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Counsellor_104_Component } from './104-counsellor.component';

describe('Counsellor_104_Component', () => {
  let component: Counsellor_104_Component;
  let fixture: ComponentFixture<Counsellor_104_Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Counsellor_104_Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Counsellor_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
