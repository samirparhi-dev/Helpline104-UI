import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Sio_104_Component } from './104-sio.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { CallerService } from '../services/common/caller.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Subject } from 'rxjs/Subject';

let component: Sio_104_Component;
let fixture: ComponentFixture<Sio_104_Component>;

const FakeDataService = {
  current_campaign: '',
  callDisconnected: new Subject()
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const fakeRouter = {

};

const providerForFakeRouter = {
  provide: Router, useValue: fakeRouter
};

const fakeConfirmationService = {

}

const providerForFakeConfirmationService = {
  provide: ConfirmationDialogsService, useValue: fakeConfirmationService
}

const fakeActivatedRoute = {
};

const providerForFakeRoutes = {
  provide: ActivatedRoute, useValue: fakeActivatedRoute
};

class FakeCallerServiceForServicesUp {
}

const providerForFakeCallerService = {
  provide: CallerService, useClass: FakeCallerServiceForServicesUp
};

function Initialize104roTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Sio_104_Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeConfirmationService,
        providerForFakeDataService, providerForFakeRouter, providerForFakeRoutes, providerForFakeCallerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sio_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('Sio_104_Component', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104roTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set current_campaign after ngOninit', () => {
      component.ngOnInit();
      expect(component.current_campaign).toBe('');
    });

  });
});
