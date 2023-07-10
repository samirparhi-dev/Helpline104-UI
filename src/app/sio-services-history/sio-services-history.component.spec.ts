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
// import { SioServicesHistoryComponent } from './sio-services-history.component';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ActivatedRoute, Params } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import { Md2Module } from 'md2';
// import { FormsModule } from "@angular/forms";
// import { SioService } from '../services/sioService/sio.service';
// import { dataService } from '../services/dataService/data.service';
// let component: SioServicesHistoryComponent;
// let fixture: ComponentFixture<SioServicesHistoryComponent>;

// class FakeSioService {
//     getSioHistoryData(data) {
//         return Observable.of({
//             data: 'success'
//         })
//     }

// }

// const providerForSioService = {
//     provide: SioService, useClass: FakeSioService
// };


// const FakeDataService = {
//     beneficiaryDataAcrossApp: [{
//         i_beneficiary: [{
//             beneficiaryRegID: '1'
//         }]
//     }]
// }

// const providerForFakeDataService = {
//     provide: dataService, useValue: FakeDataService
// };


// function Initialize104TestBed() {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [SioServicesHistoryComponent],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [Md2Module, FormsModule],
//             providers: [providerForSioService, providerForFakeDataService]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SioServicesHistoryComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
// }
// describe('Sio-history-components', () => {

//     fdescribe('When the component is getting loaded, then ngOninit', () => {

//         Initialize104TestBed();

//         it('should be created', () => {
//             expect(component).toBeTruthy();
//         });
//         it('should be defined', () => {
//             expect(component).toBeDefined();
//         });


//     });

// });
