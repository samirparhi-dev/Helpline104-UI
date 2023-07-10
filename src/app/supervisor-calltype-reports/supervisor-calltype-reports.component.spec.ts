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


// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { SupervisorCalltypeReportsComponent } from './supervisor-calltype-reports.component';
// import { SupervisorCallTypeReportService } from '../services/supervisorServices/supervisor-calltype-reports-service.service';
// import { dataService } from '../services/dataService/data.service';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ActivatedRoute, Params } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import { Md2Module } from 'md2';
// import { FormsModule } from "@angular/forms";
// import { MaterialModule, MdSelectModule } from '@angular/material';
// import { ɵAnimationEngine } from '@angular/animations/browser';
// import { NoopAnimationsModule, ɵAnimationRendererFactory } from '@angular/platform-browser/animations';

// let component: SupervisorCalltypeReportsComponent;
// let fixture: ComponentFixture<SupervisorCalltypeReportsComponent>;

// class FakeSupervisorCallTypeReportService {
//   getCallTypes(data) {
//     return Observable.of([{

//       'callType': '1',
//       'uname': 'pirami',
//       'status': 'yes',
//       'supervisor': 'yes',
//       'valid': 'yes',
//       'count': '1'

//     }])
//   }
//   filterCallList(data) {
//     return Observable.of([{

//       'callType': '1',
//       'uname': 'pirami',
//       'status': 'yes',
//       'supervisor': 'yes',
//       'valid': 'yes',
//       'count': '1'

//     }])
//   }
// }
// const ProviderForFakeSupervisorCallTypeReportService = {
//   provide: SupervisorCallTypeReportService, useClass: FakeSupervisorCallTypeReportService
// }
// const FakeDataService = {
//   current_service: { serviceID: '123' }
// }
// const ProviderForFakeDataService = {
//   provide: dataService, useValue: FakeDataService
// }
// function Initializetestbed() {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [SupervisorCalltypeReportsComponent],
//       schemas: [NO_ERRORS_SCHEMA],
//       imports: [Md2Module, FormsModule, MaterialModule, MdSelectModule],
//       providers: [ProviderForFakeSupervisorCallTypeReportService, ProviderForFakeDataService]

//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SupervisorCalltypeReportsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

// }
// describe('SupervisorCalltypeReportsComponent', () => {
//   fdescribe('When the component get initiated', () => {
//     Initializetestbed();
//     it('should be created', () => {
//       expect(component).toBeTruthy();
//     });
//     it('should be defined', () => {
//       expect(component).toBeDefined();
//     });
//   });
// });
