import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { surveyor_104_Component } from './104-surveyor.component';


let component: surveyor_104_Component;
let fixture: ComponentFixture<surveyor_104_Component>;


function Initialize104surveyorTestBed(){
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ surveyor_104_Component ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(surveyor_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('surveyor_104_Component', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104surveyorTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });
});
