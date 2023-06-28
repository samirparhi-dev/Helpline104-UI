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
