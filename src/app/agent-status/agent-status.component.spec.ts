import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AgentStatusComponent } from './agent-status.component';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from "../services/config/config.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

let component: AgentStatusComponent;
let fixture: ComponentFixture<AgentStatusComponent>;

const FakeDataService = {
  uname: 'uname',
  loginKey: 'loginKey'
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const FakeConfigService = {
  getTelephonyServerURL() {
    return 'My Telephony URL ';
  }
}

const providerForConfigService = {
  provide: ConfigService, useValue: FakeConfigService
};

const FakeSanitizer = {
  bypassSecurityTrustResourceUrl(data) {
    return data;
  },
  sanitize(data1, data2) {
    return data2;
  }
};

const providerForFakeSanitizer = {
  provide: DomSanitizer, useValue: FakeSanitizer
};

function InitializeAgentStatusTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgentStatusComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        providerForFakeDataService, providerForConfigService, providerForFakeSanitizer]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}


describe('AgentStatusComponent', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    InitializeAgentStatusTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set agentStausScreenURL after ngOninit', () => {
      component.ngOnInit();
      expect(component.agentStausScreenURL).toBe('My Telephony URL remote_login.php?username=uname&key=loginKey');
    });

  });
});
