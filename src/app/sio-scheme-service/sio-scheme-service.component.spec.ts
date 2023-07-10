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
import { SioSchemeServiceComponent } from './sio-scheme-service.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SchemeService } from '../services/sioService/sio-scheme.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';

let component: SioSchemeServiceComponent;
let fixture: ComponentFixture<SioSchemeServiceComponent>;


const FakeDataService = {
    current_service: { serviceID: '123' }
}

const providerForFakeDataService = {
    provide: dataService, useValue: FakeDataService
};
class FakeSchemeService {
    getSchemeList(data) {
        return Observable.of({
            data: [{
                RoleName: 'RO',
                RoleID: 12345
            }]
        })
    }
}

const providerForFakeSchemeService = {
    provide: SchemeService, useClass: FakeSchemeService
};


function Initialize104TestBed() {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SioSchemeServiceComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [Md2Module, FormsModule],
            providers: [providerForFakeSchemeService, providerForFakeDataService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SioSchemeServiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
}
describe('Sio-scheme-service', () => {

    fdescribe('When the component is getting loaded, then ngOninit', () => {

        Initialize104TestBed();

        it('should be created', () => {
            expect(component).toBeTruthy();
        });
        it('should be defined', () => {
            expect(component).toBeDefined();
        });
        it('checking the value of providerServiceMapID should not be null and shoul have some value username', () => {
            expect(component.providerServiceMapID).not.toBe('');
            expect(component.providerServiceMapID).toBe('123');
        });
        it('should set the schemeList after OnInit', () => {
            expect(component.schemeList).not.toBe('');
        });
        // it(' getServiceProviderID should be called after OnInit', () => {
        //   spyOn(component, 'getServiceProviderID');
        //   component.ngOnInit();
        //   expect(component.getServiceProviderID).toHaveBeenCalled;
        //   expect(component.providerServiceMapID).toBe('123');
        // });
        // it('getAllNotificationTypes method should be called after OnInit', () => {
        //   spyOn(component, 'getAllNotificationTypes');
        //   component.ngOnInit();
        //   expect(component.getAllNotificationTypes).toHaveBeenCalled;
        // });

        // it('Start Date Datetime picker entry block checking  ', fakeAsync(() => {
        //   spyOn(component, 'blockey');
        //   component.ngOnInit();
        //   const btn = fixture.debugElement.query(By.css('md2-datepicker'))
        //   btn.triggerEventHandler('keydown', null);
        //   fixture.detectChanges();
        //   tick();
        //   expect(component.blockey).toHaveBeenCalled();
        // }));
        // it('End Date Datetime picker entry block checking  ', fakeAsync(() => {
        //   spyOn(component, 'blockey');
        //   component.ngOnInit();
        //   const btn = fixture.debugElement.query(By.css('md2-datepicker'))
        //   btn.triggerEventHandler('keydown', null);
        //   fixture.detectChanges();
        //   tick();
        //   expect(component.blockey).toHaveBeenCalled();
        // }));

        // it('getNotifications method should be called on click of Serach Notification button', fakeAsync(() => {
        //   spyOn(component, 'getNotifications');
        //   component.ngOnInit();
        //   const btn = fixture.debugElement.query(By.css('#searchNotification'));
        //   fixture.detectChanges();
        //   btn.triggerEventHandler('click', null);
        //   tick();
        //   expect(component.getNotifications).toHaveBeenCalled();
        // }));
    });

});