import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorSchemeComponent } from './supervisor-uploadSchemes.component';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { SchemeService } from '../services/sioService/sio-scheme.service';
import { ConfigService } from "../services/config/config.service";
import { DomSanitizer, SafeResourceUrl, By } from '@angular/platform-browser';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
let component: SupervisorSchemeComponent;
let fixture: ComponentFixture<SupervisorSchemeComponent>;

const FakeConfirmationDialogsService = {

}

const providerForFakeConfirmationDialogsService = {
    provide: ConfirmationDialogsService, useValue: FakeConfirmationDialogsService
};

const FakeConfigService = {

}

const providerForFakeConfigService = {
    provide: ConfigService, useValue: FakeConfigService
};
const fakeDomSanitizer = {

};
const providerForFakeDomSanitizer = {
    provide: DomSanitizer, useValue: fakeDomSanitizer
};
const FakeSchemeService = {
    getSchemeList(data) {
        return Observable.of([{
            name: 'piramil'
        }]);
    }
}

const providerForFakeSchemeService = {
    provide: SchemeService, useValue: FakeSchemeService
};


const FakeDataService = {
    uname: 'piramil',
    uid: '1',
    userdata: 'abc',
    current_service: { serviceID: '123' }
}

const providerForFakeDataService = {
    provide: dataService, useValue: FakeDataService
};


function Initialize104TestBed() {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SupervisorSchemeComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [Md2Module, FormsModule],
            providers: [providerForFakeConfirmationDialogsService, providerForFakeConfigService,
                providerForFakeSchemeService,
                // providerForFakeDomSanitizer,
                providerForFakeDataService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SupervisorSchemeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
}
describe('Supervisor-upload-schemes', () => {

    fdescribe('When the component is getting loaded, then ngOninit', () => {

        Initialize104TestBed();

        it('should be created', () => {
            expect(component).toBeTruthy();
        });
        it('should be defined', () => {
            expect(component).toBeDefined();
        });
        it('should set the ProviderServiceId after OnInit userId username', () => {
            expect(component.userId).toBe('1');
            expect(component.createdBy).toBe('piramil');
        });
        it('should set the ProviderServiceId after OnInit', () => {
            expect(component.userId).toBe('1');
            expect(component.createdBy).toBe('piramil');
            expect(component.providerServiceMapID).toBe('123');
        });
        it('checking status of submit button', () => {
            expect(component.invalid_file_flag).toBe(false);
        });
        it('onSubmit should not  be called on submit Click event when till the valid data provided', (() => {
            component.create = true;
            component.invalid_file_flag = true;
            spyOn(component, 'onSubmit');
            let button = fixture.debugElement.nativeElement.querySelector('button');
            button.click();
            fixture.whenStable().then(() => {
                expect(component.onSubmit).not.toHaveBeenCalled();
            });
        }));


    });

});