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
import { Ro_104_Component } from './104-ro.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { CallerService } from '../services/common/caller.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Subject } from 'rxjs/Subject';

let component: Ro_104_Component;
let fixture: ComponentFixture<Ro_104_Component>;

const FakeDataService = {
  screens: '',
  callDisconnected: new Subject()
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
  params: Observable.of({
    'mobileNumber': '9988776655',
    'callerID': '272851722.64691632744'
  })
};

const providerForFakeRoutes = {
  provide: ActivatedRoute, useValue: fakeActivatedRoute
};

class FakeCallerServiceForServicesUp {
}

const providerForFakeCallerService = {
  provide: CallerService, useClass: FakeCallerServiceForServicesUp
};

function Initialize104roTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Ro_104_Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeConfirmationService,
        providerForFakeDataService, providerForFakeRouter, providerForFakeRoutes, providerForFakeCallerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ro_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}


describe('Ro_104_Component', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104roTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set Caller ID and Caller Number if we get data from route parameters', () => {
      component.ngOnInit();
      expect(component.callerNumber).toBe(9988776655);
      expect(component.callerID).toBe('272851722.64691632744');
    });

    it('should set screens, disableClosure, isNextHide after ngOninit', () => {
      component.ngOnInit();
      expect(component.screens).toBe('');
      expect(component.isNextHide).toBe(true);
      expect(component.disableClosure).toBe(false);
    });

  });
});
