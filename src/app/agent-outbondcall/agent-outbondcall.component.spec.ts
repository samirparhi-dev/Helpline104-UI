import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AgentOutbondcallComponent } from './agent-outbondcall.component';
import { dataService } from '../services/dataService/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

let component: AgentOutbondcallComponent;
let fixture: ComponentFixture<AgentOutbondcallComponent>;

const FakeDataService = {
  Userdata: ''
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const fakeRouter = {

};

const providerForFakeRouter = {
  provide: Router, useValue: fakeRouter
};

function InitializeAgentOutboundCallTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgentOutbondcallComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        providerForFakeDataService, providerForFakeRouter]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentOutbondcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('AgentOutbondcallComponent', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    InitializeAgentOutboundCallTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set data to empty string after ngOninit', () => {
      component.ngOnInit();
      expect(component.data).toBe('');
    });

  });
});
