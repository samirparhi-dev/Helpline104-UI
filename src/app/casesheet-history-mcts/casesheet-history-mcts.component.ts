import { Component, OnInit, Input, OnChanges, Inject, DoCheck } from '@angular/core';
import { OtherHelplineService } from '../services/caseSheetService/other-helpline.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MdDialog } from '@angular/material';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-casesheet-history-mcts',
  templateUrl: './casesheet-history-mcts.component.html',
  styleUrls: ['./casesheet-history-mcts.component.css']
})
export class CasesheetHistoryMctsComponent implements OnInit, DoCheck, OnChanges {

  @Input() benRegID: any;

  currentLanguageSet: any;

  constructor(private helplineCasesheet: OtherHelplineService, private alertService: ConfirmationDialogsService, private dialog: MdDialog,public HttpServices: HttpServices) { }

  callHistory = [];

  ngOnInit() {
    this.currentLanguageSetValue();
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  ngDoCheck() {
    this.currentLanguageSetValue();
  }    

  ngOnChanges() {
    this.currentLanguageSetValue();
    if (this.benRegID) {
      let obj = {
        'beneficiaryRegID': this.benRegID
      }
      this.helplineCasesheet.getMctsCallHistory(obj).subscribe(res => {
        this.successHandler(res);
      },
        (err) => {
          if (err.errorMessage) {
            this.alertService.alert(err.errorMessage, 'error');
          }
          else {
            this.alertService.alert(this.currentLanguageSet.serviceIsNotAvailable)

          }
        });
    }
  }

  successHandler(res) {
    this.callHistory = res;
  }

  openDialog(callDetailID) {
    let obj = {
      'callDetailID': callDetailID
    }
    this.helplineCasesheet.getMctsCallResponse(obj).subscribe(res => {
      this.successHandler2(res);
    },
      (err) => {
        this.alertService.alert(err.errorMessage, 'error');
      })
  }
  successHandler2(response) {
    if (response) {
      let callQADialog = this.dialog.open(CallQComponent, {
        width: 0.8 * window.innerWidth + "px",
        panelClass: 'dialog-width',
        // height:"500px",
        data: {
          "qarows": response
        }
      })
    }
  }
}

@Component({
  selector: 'app-call-q',
  templateUrl: './call-q.component.html'
})
export class CallQComponent implements OnInit {

  qarows: any;

  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogReff: MdDialogRef<CallQComponent>,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.qarows = this.data.qarows;
    this.currentLanguageSetValue();
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  ngDoCheck() {
    this.currentLanguageSetValue();
  }    

}
