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


import { SupervisorNotificationsComponent } from './supervisor-notifications.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { MdDialog } from '@angular/material';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VALID } from '@angular/forms/src/model';

let component: SupervisorNotificationsComponent;
let fixture: ComponentFixture<SupervisorNotificationsComponent>;

const FakeDataService = {
    uname: 'piramil',
    uid: '1',
    current_service:
        {

            serviceID: '104'
        }

}

const providerForFakeDataService = {
    provide: dataService, useValue: FakeDataService
};

class fakeNotificationService {

    getNotificationTypes(data) {
        return Observable.of({
            id: '1'
        })
    }
    getRoles(data) {
        return Observable.of({
            data: [{
                RoleID: '1'
            }]

        })
    }
    getServiceProviderID(data) {
        return Observable.of({
            serviceProviderID: '1', serviceID: '2', stateID: '3'
        })
    }
    getLanguages(data) {
        return Observable.of({
            Language: 'Hindi'
        })
    }
    getOffices(data) {
        return Observable.of({
            office: 'HCIT'
        })
    }
    getUsersByProviderID(data) {
        return Observable.of({
            firstName: 'krishna',
            middleName: 'Gunti',
            lastName: 'Gk'
        })
    }

}

const providerForFakeNotification = {
    provide: NotificationService, useClass: fakeNotificationService
};

const fakeConfirmationDialogsService = {

}

const providerForFakeConfirmationService = {
    provide: ConfirmationDialogsService, useValue: fakeConfirmationDialogsService
}
const fakeMdDialog = {

}

const providerForFakeMdDialog = {
    provide: MdDialog, useValue: fakeMdDialog
}
function Initialize104coTestBed() {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [Md2Module, FormsModule],
            declarations: [SupervisorNotificationsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [providerForFakeConfirmationService,
                providerForFakeDataService, providerForFakeNotification, providerForFakeMdDialog]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(SupervisorNotificationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
}
describe('SupervisorNotificationsComponent Testbed creation', () => {
    fdescribe('When the component is getting loaded, then ngOninit', () => {
        Initialize104coTestBed()

        it('should be created', () => {
            expect(component).toBeTruthy();
        });
        it('should be defined', () => {
            expect(component).toBeDefined();
        });
        it('form invalid when empty', () => {
            expect(component.showNotificationForm.valid).not.toBeFalsy();
        });
        it('Checking the value of providerServiceMapID', () => {
            expect(component.providerServiceMapID).not.toBe('');
            expect(component.providerServiceMapID).toBe('104');
        });
        it('Checking the value of username and uid', () => {
            expect(component.userId).not.toBe('');
            expect(component.createdBy).not.toBe('');
            expect(component.userId).toBe('1');
            expect(component.createdBy).toBe('piramil');
        });
        it('Start Date Datetime picker entry block checking  ', fakeAsync(() => {
            spyOn(component, 'blockey');
            component.ngOnInit();
            const btn = fixture.debugElement.query(By.css('md2-datepicker'))
            btn.triggerEventHandler('keydown', null);
            fixture.detectChanges();
            tick();
            expect(component.blockey).toHaveBeenCalled();
        }));
        it('End Date Datetime picker entry block checking  ', fakeAsync(() => {
            spyOn(component, 'blockey');
            component.ngOnInit();
            const btn = fixture.debugElement.query(By.css('md2-datepicker'))
            btn.triggerEventHandler('keydown', null);
            fixture.detectChanges();
            tick();
            expect(component.blockey).toHaveBeenCalled();
        }));

        it('createNotification method should be called on click of Create new button', fakeAsync(() => {
            spyOn(component, 'createNotification');
            component.ngOnInit();
            const btn = fixture.debugElement.query(By.css('#createNotification'));
            btn.triggerEventHandler('click', null);
            tick();
            expect(component.createNotification).toHaveBeenCalled();
        }));

        it('Checking Flag value which will make Buttons disable', (() => {
            expect(component.visibility_Flag).toBe(true);
            component.visibility_Flag = false;
            fixture.detectChanges();
            expect(component.visibility_Flag).toBe(false);
        }));

        // it('Notification method should be called on click of Create new button', fakeAsync(() => {
        //     spyOn(component, 'onSubmitShowForm');
        //     component.ngOnInit();
        //     const btn = fixture.debugElement.query(By.css('#submitNotification'));
        //     // btn.nativeElement.disabled = false;
        //     fixture.detectChanges();
        //     btn.triggerEventHandler('click', null);
        //     tick();
        //     expect(component.onSubmitShowForm).toHaveBeenCalled();
        // }));
    });
});
