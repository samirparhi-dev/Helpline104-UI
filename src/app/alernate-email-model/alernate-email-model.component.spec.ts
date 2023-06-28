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
