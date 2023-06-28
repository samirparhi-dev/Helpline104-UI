// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { grievanceComponent } from './grievance.component';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ActivatedRoute, Params } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import { Router } from '@angular/router';
// import { Md2Module } from 'md2';
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { FeedbackService } from '../services/supervisorServices/Feedbackservice.service';
// import { dataService } from '../services/dataService/data.service';
// import { MdMenuTrigger, MdDatepicker } from '@angular/material';
// import { CustomValidators } from 'ng2-validation';
// import { MessageBag, ValidationMessagesService } from 'ng2-custom-validation';
// import { CoFeedbackService } from '../services/coService/co_feedback.service';
// import { AlernateEmailModelComponent } from './../alernate-email-model/alernate-email-model.component'
// import { MdDialog } from '@angular/material';
// import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
// import { HttpModule, Http } from '@angular/http';

// let component: grievanceComponent;
// let fixture: ComponentFixture<grievanceComponent>;

// class FakeFeedbackService {
//     getFeedbackStatuses(data) {
//         return Observable.of({
//             message: 'success'
//         })
//     }
//     getEmailStatuses(data) {
//         return Observable.of({
//             message: 'success'
//         })
//     }
//     getFeedback(data) {
//         return Observable.of({
//             message: 'success'
//         })
//     }
// }


// const providerForFakeFeedbackService = {
//     provide: FeedbackService, useClass: FakeFeedbackService
// };
// const FakeDataService = {
//     uname: 'piramil',
//     current_service: { serviceID: '123' }
// }

// const providerForFakeDataService = {
//     provide: dataService, useValue: FakeDataService
// };
// const FakeCoFeedbackService = {

// }

// const providerForCoFeedbackService = {
//     provide: CoFeedbackService, useValue: FakeCoFeedbackService
// };
// const FakeMdDialog = {

// }

// const providerForFakeMdDialog = {
//     provide: MdDialog, useValue: FakeMdDialog
// };
// const FakeConfirmationDialogsService = {

// }

// const providerForFakeConfirmationDialogsService = {
//     provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
// };

// function Initialize104TestBed() {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [grievanceComponent],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [Md2Module, FormsModule, ReactiveFormsModule],
//             providers: [providerForFakeConfirmationDialogsService, providerForFakeDataService,
//                 providerForCoFeedbackService]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(grievanceComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
// }
// describe('grievance', () => {

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