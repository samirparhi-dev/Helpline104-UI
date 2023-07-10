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


// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { SurveyorCalltypeReportsComponent } from './surveyor-calltype-reports.component';
// import { ActivatedRoute, Params } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import { CallerService } from '../services/common/caller.service';
// import { dataService } from '../services/dataService/data.service';
// import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
// import { Router } from '@angular/router';
// import { CzentrixServices } from './../services/czentrix/czentrix.service';
// import { SupervisorCallTypeReportService } from '../services/supervisorServices/supervisor-calltype-reports-service.service';
// import { Md2Module } from 'md2';
// import { FormsModule } from "@angular/forms";
// import { MdDialog, MdDialogRef } from '@angular/material';

// let component: SurveyorCalltypeReportsComponent;
// let fixture: ComponentFixture<SurveyorCalltypeReportsComponent>;

// const FakeConfirmationDialogsService = {

// }

// const providerForFakeConfirmationDialogsService = {
//     provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
// };

// const FakeCzentrixServices = {

// }

// const providerForFakeCzentrixServices = {
//     provide: CzentrixServices, useValue: FakeCzentrixServices
// };
// const fakeActivatedRoute = {

// };
// const providerForFakeRoutes = {
//     provide: Router, useValue: fakeActivatedRoute
// };
// const FakeSupervisorCallTypeReportService = {
//     getCallTypes(data) {
//         return Observable.of([{

//             callGroupType: 'valid',
//             callTypes: [
//                 {

//                     callType: 'wwwwww',
//                     callTypeID: '1'

//                 }
//             ]
//         }]);
//     }
// }

// const providerForFakeSupervisorCallTypeReportService = {
//     provide: SupervisorCallTypeReportService, useValue: FakeSupervisorCallTypeReportService
// };


// const FakeDataService = {
//     current_service: { serviceID: '123' }
// }

// const providerForFakeDataService = {
//     provide: dataService, useValue: FakeDataService
// };
// const FakeMdDialog = {

// }

// const providerForFakeMdDialog = {
//     provide: MdDialog, useValue: FakeMdDialog
// };

// function Initialize104TestBed() {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [SurveyorCalltypeReportsComponent],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [Md2Module, FormsModule],
//             providers: [providerForFakeConfirmationDialogsService, providerForFakeCzentrixServices,
//                 providerForFakeRoutes, providerForFakeSupervisorCallTypeReportService,
//                 providerForFakeDataService, providerForFakeMdDialog]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SurveyorCalltypeReportsComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
// }
// describe('Surveyor-calltype-reports-components', () => {

//     fdescribe('When the component is getting loaded, then ngOninit', () => {

//         Initialize104TestBed();

//         it('should be created', () => {
//             expect(component).toBeTruthy();
//         });
//     });

// });