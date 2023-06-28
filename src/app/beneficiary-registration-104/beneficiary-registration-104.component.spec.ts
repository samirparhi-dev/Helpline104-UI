import { async, ComponentFixture,ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { BeneficiaryRegistration104Component } from './beneficiary-registration-104.component';

describe('BeneficiaryRegistration104Component', () => {
  let component: BeneficiaryRegistration104Component;
  let fixture: ComponentFixture<BeneficiaryRegistration104Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ BeneficiaryRegistration104Component ],
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryRegistration104Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  
});
