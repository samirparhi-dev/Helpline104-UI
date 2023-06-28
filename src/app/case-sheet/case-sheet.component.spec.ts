import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CaseSheetComponent } from './case-sheet.component';

import { SearchService } from '../services/searchBeneficiaryService/search.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CaseSheetService } from '../services/caseSheetService/caseSheet.service';
import { SnomedService } from '../services/snomedService/snomed-service.service';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { CDSSService } from '../services/cdssService/cdss.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { UtilityService } from '../services/common/utility.service';
import { OutboundListnerService } from './../services/common/outboundlistner.service';
import { AvailableServices } from '../services/common/104-services';

import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterialModule, MdGridListModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';


let component: CaseSheetComponent;
let fixture: ComponentFixture<CaseSheetComponent>;

class FakeCaseSheetService {

}

const providerForFakeCaseSheetService = {
  provide: CaseSheetService, useValue: FakeCaseSheetService
};

class FakeSnowMedService {

}

const providerForFakeSnowMedService = {
  provide: SnomedService, useValue: FakeSnowMedService
};


const fakeDataService = {
  'current_campaign': 'INBOUND',
  'current_role': '',
  'outboundBenID': '12345',
  'beneficiaryDataAcrossApp': {
    'beneficiaryDetails': {
      'i_beneficiary': {
        'firstName': 'Diamond',
        'lastName': 'Khanna',
        'm_gender': {
          'genderID': '3'
        },
        'dOB': '2014-02-10T00:00:00.000Z'
      }
    }
  }
}

const providerForfakeDataService = {
  provide: dataService, useValue: fakeDataService
};


class FakeUtilityService {
  calculateAge(date) {
    return '24';
  }
}

const providerForFakeUtilityService = {
  provide: UtilityService, useClass: FakeUtilityService
};

class FakeSearchService {
  retrieveRegHistory(registrationNo) {
    return Observable.of([{
      'age': '22',
      'firstName': 'Diamond',
      'lastName': 'Khanna',
      'm_gender': {
        'genderID': '3'
      }
    }])
  }
}

const providerForFakeSearchService = {
  provide: SearchService, useClass: FakeSearchService
};


class FakeConfirmationDialogsService {

}

const providerForFakeConfirmationDialogsService = {
  provide: ConfirmationDialogsService, useClass: FakeConfirmationDialogsService
};

class FakeCDSSservice { }

const providerForFakeCDSSservice = {
  provide: CDSSService, useClass: FakeCDSSservice

};

class FakeOutboundListnerService { };

const providerForFakeOutboundListnerService = {
  provide: OutboundListnerService, useClass: FakeOutboundListnerService

}

class FakeAvailableService { };

const providerForFakeAvailableService = {
  provide: AvailableServices, useClass: FakeAvailableService

}




describe('CaseSheetComponent', () => {

  let dataServiceInstance: dataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseSheetComponent],
      imports: [FormsModule, MaterialModule, MdGridListModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForfakeDataService,
        providerForFakeUtilityService,
        providerForFakeSearchService,
        providerForFakeCaseSheetService,
        providerForFakeSnowMedService,
        providerForFakeConfirmationDialogsService,
        providerForFakeCDSSservice,
        providerForFakeOutboundListnerService,
        providerForFakeAvailableService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataServiceInstance = TestBed.get(dataService);
  });

  fdescribe('case sheet on init ()', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should call function benDataInboundPopulationg() if campaign is INBOUND', fakeAsync(() => {
      spyOn(component, 'benDataInboundPopulationg');
      component.ngOnInit();
      expect(component.benDataInboundPopulationg).toHaveBeenCalled();
      expect(component.firstName).toBe('Diamond');
      expect(component.age).toBe('24');
    }));

    it('should call API to get beneficiary details if campaign is OUTBOUND', () => {
      dataServiceInstance.current_campaign = 'OUTBOUND';
      component.ngOnInit();
      expect(component.firstName).toBe('Diamond');
      expect(component.age).toBe('22');
    });
  })
});
