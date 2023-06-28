import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorBloodUrlComponent } from './supervisor-blood-url.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { dataService } from '../services/dataService/data.service';
import { BloodOnCallServices } from '../services/sioService/bloodOnCallServices.service';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


let component: SupervisorBloodUrlComponent;
let fixture: ComponentFixture<SupervisorBloodUrlComponent>;

const FakeBloodOnCallServices = {
  getBloodBankUrl(data) {
    return Observable.of({
      institutionID: '1',
      website: 'www.wipro.com'
    })
  }
}

const providerForFakeBloodOnCallServices = {
  provide: BloodOnCallServices, useValue: FakeBloodOnCallServices
};

const FakeDataService = {
  uname: 'piramil',
  uid: '1',
  Userdata: 'abc',
  current_service: { serviceID: '123' }
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};


function Initialize104TestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorBloodUrlComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: [providerForFakeBloodOnCallServices,
        providerForFakeDataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorBloodUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Supervisor-blood-url', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('Userdata and ServiceId should not be null or empty', () => {
      expect(component.agentData).not.toBe('');
      expect(component.providerServiceMapID).not.toBe('');
    });
    it('Checking the values of Userdata and ServiceId', () => {
      expect(component.agentData).toBe('abc');
      expect(component.providerServiceMapID).toBe('123');
    });
    it('Url should be hidden on oninit', () => {
      expect(component.show).toBeFalsy();
    });
    it('instituteID should not be null on oninit', () => {
      expect(component.instituteID).toBe('1');
      expect(component.instituteID).not.toBe('');
    });
    it('existing_bloodBankUrl should not be null on oninit', () => {
      expect(component.existing_bloodBankUrl).toBe('www.wipro.com');
      expect(component.existing_bloodBankUrl).not.toBe('');
    });
  });

});