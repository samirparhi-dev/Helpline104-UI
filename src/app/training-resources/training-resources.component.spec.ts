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


import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingResourcesComponent } from './training-resources.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { dataService } from '../services/dataService/data.service';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MdDialog } from '@angular/material';
import { MaterialModule, MdGridListModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
let component: TrainingResourcesComponent;
let fixture: ComponentFixture<TrainingResourcesComponent>;

const FakeDataService = {
  current_roleID: '1',
  current_service: '1'
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};



class fakeNotificationService {
  getNotificationTypes(data) {
    return Observable.of({
      'data': [{
        'notificationType': 'KM',
        'kmConfig': [{
          'notificationTypeID': '1'
        }]
      }]
    })
  }
  getKMs(data) {
    return Observable.of({
      'data': [{
        'notification': 'KM'
      }]
    })
  }
}

const providerForFakeNotificationService = {
  provide: NotificationService, useClass: fakeNotificationService
}
class fakeDashboardHttpServices {

}

const providerForFakeDashboardHttpServices = {
  provide: DashboardHttpServices, useClass: fakeDashboardHttpServices
}
class fakeMdDialog {

}

const providerForFakefakeMdDialog = {
  provide: MdDialog, useClass: fakeMdDialog
}


function Initialize104coTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingResourcesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeDashboardHttpServices,
        providerForFakeDataService, providerForFakeNotificationService, providerForFakefakeMdDialog]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('Training-resources', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104coTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('component should be defined', () => {
      expect(component).toBeDefined();
    });

    it('should set roleID and serviceId to empty strings after ngOninit', () => {
      component.ngOnInit();
      expect(component.roleID).toBe('1');
      expect(component.service).toBe('1');
    });
    it('getKmFiles should be called after OnInit', () => {
      spyOn(component, 'getKmFiles')
      component.ngOnInit();
      expect(component.getKmFiles).toHaveBeenCalled();
    });
    it('kmClicked should be called on Click event', fakeAsync(() => {
      spyOn(component, 'kmClicked')
      let href = fixture.debugElement.query(By.css('a'));
      href.nativeElement.click();
      tick();
      fixture.detectChanges();
      expect(component.kmClicked).toHaveBeenCalled();
      expect(href.nativeElement.getAttribute('href')).not.toBe('');
    }));

  });
});

