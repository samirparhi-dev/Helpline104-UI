import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Helpline_104_Component } from './104.component';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CallerService } from '../services/common/caller.service';
import { dataService } from '../services/dataService/data.service';


let component: Helpline_104_Component;
let fixture: ComponentFixture<Helpline_104_Component>;

const fakeActivatedRoute = {
  params: Observable.of({
    'mobileNumber': '9988776655',
    'callerID': '272851722.64691632744'
  })
};

const providerForFakeRoutes = {
  provide: ActivatedRoute, useValue: fakeActivatedRoute
};


class FakeCallerServiceForServicesUp {
  getBeneficiaryByCallID(data) {
    return Observable.of({
      'i_beneficiary': {
        'beneficiaryRegID': '1001'
      }
    })
  }
}

class FakeCallerServiceForServicesDown {
  getBeneficiaryByCallID(data) {
    return Observable.throw(new Error('Some thing went wrong'));
  }
}

const providerForFakeCallerService = {
  provide: CallerService, useClass: FakeCallerServiceForServicesUp
};

const FakeDataService = {
  current_role: 'RO',
  current_campaign: 'INBOUND',
  beneficiaryDataAcrossApp: {}
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

function Initialize104TestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Helpline_104_Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeRoutes,
        providerForFakeCallerService,
        providerForFakeDataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Helpline_104_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('Helpline_104_Component', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set Caller ID and Caller Number if we get data from route parameters', () => {
      component.ngOnInit();
      expect(component.callerNumber).toBe(9988776655);
      expect(component.callerID).toBe('272851722.64691632744');
    });

    it('should call getBeneficiaryByCallID() if current role is not Supervisor and campaign is Inbound', () => {
      spyOn(component, 'getBeneficiaryByCallID');
      component.current_role = 'RO';
      component.ngOnInit();
      expect(component.getBeneficiaryByCallID).toHaveBeenCalled();
    });

  });

});
