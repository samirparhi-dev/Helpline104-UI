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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlernateEmailModelComponent } from './alernate-email-model.component';
import { FormsModule } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MaterialModule } from '@angular/material';

let component: AlernateEmailModelComponent;
let fixture: ComponentFixture<AlernateEmailModelComponent>;

const FakeDialog = {
}

const providerForFakeDialog = {
  provide: MdDialog, useValue: FakeDialog
};

class FakeTokenClass {
}

const providerForFakeToken = {
  provide: MD_DIALOG_DATA, useClass: FakeTokenClass
};

class FakeDialogRefClass {
}

const providerForFakeDialogRef = {
  provide: MdDialogRef, useClass: FakeDialogRefClass
};

function InitializeAlternateEmailModelTestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlernateEmailModelComponent],
      imports: [FormsModule, MaterialModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [providerForFakeDialog, providerForFakeToken, providerForFakeDialogRef]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlernateEmailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}

describe('AlernateEmailModelComponent', () => {
  fdescribe('When the component is getting loaded, then ngOninit', () => {

    InitializeAlternateEmailModelTestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

  });
});
