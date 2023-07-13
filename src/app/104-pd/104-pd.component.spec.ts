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
import { Pd_104_Component } from './104-pd.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { CallerService } from '../services/common/caller.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Subject } from 'rxjs/Subject';

let component: Pd_104_Component;
let fixture: ComponentFixture<Pd_104_Component>;

const FakeDataService = {
  current_campaign: '',
  screens: '',
  userPriveliges: [
    {
      roles: [
        {
          RoleName: 'CO'
        }
      ],
      serviceName: '104'
    }
  ],
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

function Initialize104pdTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Pd_104_Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeConfirmationService,
        providerForFakeDataService, providerForFakeRouter]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pd_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('Pd_104_Component', () => {


  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104pdTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set current_campaign to empty string after ngOninit', () => {
      component.ngOnInit();
      expect(component.current_campaign).toBe('');
    });

    it('checkMOPrivilege() should be called after ngOninit', () => {
      spyOn(component, 'checkMOPrivilege')
      component.ngOnInit();
      expect(component.checkMOPrivilege).toHaveBeenCalled();
    });

    it('should set MO Privilege to true on component after ngOninit', () => {
      component.ngOnInit();
      expect(component.hasMOPrivilege).toBe(true);
    });

  });

});
