import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorReportsComponent } from './supervisor-reports.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { ConfigService } from "../services/config/config.service";

let component: SupervisorReportsComponent;
let fixture: ComponentFixture<SupervisorReportsComponent>;

const FakeDataService = {
    uname: 'piramil', loginKey: 'piramil'
}

const providerForFakeDataService = {
    provide: dataService, useValue: FakeDataService
};


const fakeConfirmationDialogsService = {

}

const providerForFakeConfirmationService = {
    provide: ConfirmationDialogsService, useValue: fakeConfirmationDialogsService
}
const fakeConfigService = {
    getTelephonyServerURL() {
        return 'http://10.201';
    }
}

const providerForFakeConfigService = {
    provide: ConfigService, useValue: fakeConfigService
}

function Initialize104coTestBed() {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SupervisorReportsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [providerForFakeConfirmationService,
                providerForFakeDataService, providerForFakeConfigService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SupervisorReportsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
}

describe('Supervisor-reports', () => {

    fdescribe('When the component is getting loaded, then ngOninit', () => {

        Initialize104coTestBed();

        it('should be created', () => {
            expect(component).toBeTruthy();
        });
        it('should be defined', () => {
            expect(component).toBeDefined();
        });
        it('should set screens and current_campaign to empty strings after ngOninit', () => {

            expect(component.reportsURL).not.toBe('');
        });

    });
});
