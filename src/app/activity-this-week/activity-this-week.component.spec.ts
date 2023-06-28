import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivityThisWeekComponent } from './activity-this-week.component';
import { dataService } from '../services/dataService/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

let component: ActivityThisWeekComponent;
let fixture: ComponentFixture<ActivityThisWeekComponent>;

const FakeDataService = {
   current_role: '',
   current_campaign: '' 
}

const providerForFakeDataService = {
  provide: dataService, useValue: FakeDataService
};

const fakeRouter = {

};

const providerForFakeRouter = {
  provide: Router, useValue: fakeRouter
};

function InitializeActivityThisWeekTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityThisWeekComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        providerForFakeDataService, providerForFakeRouter]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityThisWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('ActivityThisWeekComponent', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    InitializeActivityThisWeekTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set role to empty string after ngOninit', () => {
      component.ngOnInit();
      expect(component.role).toBe('');
    });

  });
});
