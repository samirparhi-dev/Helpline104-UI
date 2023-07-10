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
