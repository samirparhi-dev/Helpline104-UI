import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Supervisor_104_Component } from './104-supervisor.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

let component: Supervisor_104_Component;
let fixture: ComponentFixture<Supervisor_104_Component>;

const fakeRouter = {

};

const providerForFakeRouter = {
  provide: Router, useValue: fakeRouter
};

function Initialize104supervisorTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Supervisor_104_Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeRouter]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Supervisor_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('Supervisor_104_Component', () => {
  
  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104supervisorTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });
});
