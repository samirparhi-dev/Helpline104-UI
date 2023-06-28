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
