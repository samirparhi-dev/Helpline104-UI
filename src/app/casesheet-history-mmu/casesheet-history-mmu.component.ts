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


import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { OtherHelplineService } from '../services/caseSheetService/other-helpline.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MdDialog } from '@angular/material';
import { GeneralCaseSheetComponent } from '../casesheet-history-mmu/general-case-sheet/general-case-sheet.component';
import { CancerCaseSheetComponent } from '../casesheet-history-mmu/cancer-case-sheet/cancer-case-sheet.component';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-casesheet-history-mmu',
  templateUrl: './casesheet-history-mmu.component.html',
  styleUrls: ['./casesheet-history-mmu.component.css']
})
export class CasesheetHistoryMmuComponent implements OnInit {

@Input() benRegID: any;
  @Input() isTm:boolean;
  currentLanguageSet: any;

  constructor(private helplineCasesheet: OtherHelplineService, private alertService: ConfirmationDialogsService, private dialog: MdDialog,
    private httpServices:HttpServices) { }

  historyOfMMU = [];

  ngOnInit() {
    this.assignSelectedLanguage();

  }
  ngOnChanges() {
    if (this.benRegID) {
      let obj = {
        'beneficiaryRegID': this.benRegID
      }
    //   this.historyOfMMU = [
    //     {
    //         "benFlowID": 976,
    //         "beneficiaryRegID": 137,
    //         "visitCode": 30004400001922,
    //         "VisitReason": "New Chief Complaint",
    //         "VisitCategory": "New Chief Complaint",
    //         "benVisitNo": 1,
    //         "benVisitDate": "Aug 8, 2018 4:48:34 PM"
    //     },
    //     {
    //         "benFlowID": 987,
    //         "beneficiaryRegID": 137,
    //         "visitCode": 30004300001930,
    //         "VisitReason": "Follow Up",
    //         "VisitCategory": "Follow Up",
    //         "benVisitNo": 2,
    //         "benVisitDate": "Aug 9, 2018 11:16:53 AM"
    //     },
    //     {
    //         "benFlowID": 998,
    //         "beneficiaryRegID": 137,
    //         "visitCode": 30004400001938,
    //         "VisitReason": "Follow Up",
    //         "VisitCategory": "Follow Up",
    //         "benVisitNo": 3,
    //         "benVisitDate": "Aug 10, 2018 11:57:58 AM"
    //     }
    // ]
    
    this.helplineCasesheet.getTmOrMmuBenCasesheet(obj,this.isTm).subscribe(res => {
        this.successHandler(res);
      },
        (err) => {
          if (err.errorMessage) {
            this.alertService.alert(err.errorMessage, 'error');
          }
          else {
            this.alertService.alert(this.currentLanguageSet.serviceIsNotAvailable)
          }
        })
    }
  }
  successHandler(res) {
    this.historyOfMMU = res;
  }
  openDialog(value){
    if (value.VisitCategory) {
      switch (value.VisitCategory) {
        case 'Cancer Screening':
          // this.CancerScreening = true;
          let dialogReff = this.dialog.open(CancerCaseSheetComponent, {
            // height: '620px',
           // width: 0.8 * window.innerWidth + "px",
         
           panelClass: 'panelC',
            disableClose: true,
            data: {
              'caseSheetVisitCategory': value.VisitCategory,
              "benFlowID": value.benFlowID,
              "beneficiaryRegID": value.beneficiaryRegID,
              "visitCode": value.visitCode,
              "isTm": this.isTm
            }
          });
          break;

        case 'General OPD (QC)':
        case 'General OPD':
        case 'NCD care':
        case 'PNC':
        case 'ANC':
          // this.General = true;
          let dialogReff2 = this.dialog.open(GeneralCaseSheetComponent, {
            // height: '620px',
            //width: 0.8 * window.innerWidth + "px",
            panelClass: 'panelC',
            disableClose: true,
            data: {
              'caseSheetVisitCategory': value.VisitCategory,
              "benFlowID": value.benFlowID,
              "beneficiaryRegID": value.beneficiaryRegID,
              "visitCode": value.visitCode,
              "isTm": this.isTm
            }
          });
          break;

        // default:
        //   this.QC = false;
        //   this.NCDScreening = false;
        //   this.CancerScreening = false;
        //   this.General = false;
        //   break;
      }
    }
    else {
      this.alertService.alert(this.currentLanguageSet.visitCategoryNotFound);
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
 
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
}
