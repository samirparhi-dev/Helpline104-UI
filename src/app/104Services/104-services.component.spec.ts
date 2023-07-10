/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ServicesComponent } from './104-services.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { CallerService } from '../services/common/caller.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { AvailableServices } from '../services/common/104-services';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { FormsModule } from '@angular/forms';

let component: ServicesComponent;
let fixture: ComponentFixture<ServicesComponent>;

const FakeDataService = {
    userPriveliges: [{
        serviceName: '104',
        roles: [{
            serviceRoleScreenMappings: [{
                screen: {
                    screenName: 'Health_Advice'
                }
            }]
        }]
    }],
    Userdata: '',
    ipAddress: '',
    beneficiaryDataAcrossApp: {
        beneficiaryDetails: {
            i_beneficiary: {
                beneficiaryRegID : ''
            }
        }
    },
    current_service: {
        serviceID: ''
    }

}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const fakeRouter = {

};

const providerForFakeRouter = {
  provide: Router, useValue: fakeRouter
};

const fakeConfirmationService = {

}

const providerForFakeConfirmationService = {
  provide: ConfirmationDialogsService, useValue: fakeConfirmationService
}

const fakeActivatedRoute = {
};

const providerForFakeRoutes = {
  provide: ActivatedRoute, useValue: fakeActivatedRoute
};

class FakeCallerServiceForServicesUp {
}

const providerForFakeCallerService = {
  provide: CallerService, useClass: FakeCallerServiceForServicesUp
};

const FakeAvailableService = {
    getServices(data){
        return Observable.of([{
            subServiceName: ''
        }]);
    }
}

const providerForFakeAvailableService = {
  provide: AvailableServices, useValue: FakeAvailableService
};

const FakeCzentrixService = {
    getIpAddress(data){
        return Observable.of({
            agent_ip: 'hello'
        });
    },
    getTransferableCampaigns(data1,data2){
        return Observable.of({
            campaign: [{
                campaign_name : ''
            }]
        });
    }

}

const providerForFakeCzentrixService = {
  provide: CzentrixServices, useValue: FakeCzentrixService
};

function Initialize104servicesTestBed(){
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ FormsModule ],
      providers: [providerForFakeConfirmationService,
        providerForFakeDataService, providerForFakeRouter, providerForFakeRoutes, providerForFakeCallerService, providerForFakeAvailableService, providerForFakeCzentrixService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('ServicesComponent', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104servicesTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set agentData, providerServiceMapID to empty string & ipAddress="hello" after ngOninit', () => {
      component.ngOnInit();
      expect(component.agentData).toBe('');
      expect(component.ipAddress).toBe('hello');
      expect(component.requestObj.providerServiceMapID).toBe('');
    });

    it('checkHAOPrivilege() should be called after ngOninit', () => {
      spyOn(component, 'checkHAOPrivilege')
      component.ngOnInit();
      expect(component.checkHAOPrivilege).toHaveBeenCalled();
    });

    it('should set hasHAOPrivilege to true on component after ngOninit', () => {
      component.ngOnInit();
      expect(component.hasHAOPrivilege).toBe(true);
    });

    it('should set services to [{"subserviceName": ""}] and transferableCampaigns to {} on component after ngOninit', () => {
      component.ngOnInit();
      expect(component.services.length).toBe(1);
      expect(component.transferableCampaigns.length).toBe(1);
    });
  });
});