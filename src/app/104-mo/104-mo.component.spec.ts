import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Mo_104_Component } from './104-mo.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { CallerService } from '../services/common/caller.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { Subject } from 'rxjs/Subject';

let component: Mo_104_Component;
let fixture: ComponentFixture<Mo_104_Component>;

const FakeDataService = {
  current_campaign: '',
  screens: '',
  userPriveliges: [
    {
      roles: [
        {
          RoleName: 'CO'
        }
      ],
      serviceName: '104'
    }
  ],
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

function Initialize104moTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Mo_104_Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeConfirmationService,
        providerForFakeDataService, providerForFakeRouter, providerForFakeRoutes, providerForFakeCallerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mo_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('Mo_104_Component', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104moTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set screens and current_campaign to empty strings after ngOninit', () => {
      component.ngOnInit();
      expect(component.screens).toBe('');
      expect(component.current_campaign).toBe('');
    });

    it('checkCOPrivilege() should be called after ngOninit', ()  =>  {
      spyOn(component,  'checkCOPrivilege')
      component.ngOnInit();
      expect(component.checkCOPrivilege).toHaveBeenCalled();
    });

    it('should set CO Privilege to true on component after ngOninit', () => {
      component.ngOnInit();
      expect(component.hasCOPrivilege).toBe(true);
    });

  });
});
