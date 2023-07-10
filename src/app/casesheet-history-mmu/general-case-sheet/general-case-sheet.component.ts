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


import { Component, OnInit, ViewChild, ElementRef, Inject, DoCheck } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { Location } from '@angular/common';
import { OtherHelplineService } from '../../services/caseSheetService/other-helpline.service';
import { ConfirmationDialogsService } from '../../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-general-case-sheet',
  templateUrl: './general-case-sheet.component.html',
  styleUrls: ['./general-case-sheet.component.css']
})
export class GeneralCaseSheetComponent implements OnInit, DoCheck {

  caseSheetData: any;
  visitCategory: any;

  printPagePreviewSelect = {
    caseSheetANC: true,
    caseSheetPNC: true,
    caseSheetHistory: true,
    caseSheetExamination: true,
  }
  assignSelectedLanguageValue: any;

  constructor(
    private location: Location, @Inject(MD_DIALOG_DATA) private data: any, private alertService: ConfirmationDialogsService, private otherHelpline : OtherHelplineService,
    private dialog: MdDialog, public dialogReff : MdDialogRef<GeneralCaseSheetComponent>,
    private httpServices: HttpServices) { }

  ngOnInit() {
    this.visitCategory = this.data.caseSheetVisitCategory;
    this.getCasesheetData(this.data);
  }

  casesheetSubs: any;
  getCasesheetData(data) {
    let obj ={
      "VisitCategory": data.caseSheetVisitCategory,
      "benFlowID": data.benFlowID,
      "beneficiaryRegID": data.beneficiaryRegID,
      "visitCode": data.visitCode
    }
    this.otherHelpline.getCasesheetData(obj, this.data.isTm)
      .subscribe(res => {
       
          this.caseSheetData = res;
          console.log('caseSheetData', this.caseSheetData);
       
      },
    (err) => {
      this.alertService.alert(err.errorMessage,'error');
    });
    }
  // selectPrintPage() {
  //   let mdDialogRef: MdDialogRef<PrintPageSelectComponent> = this.dialog.open(PrintPageSelectComponent, {
  //     width: '420px',
  //     disableClose: false,
  //     data: {printPagePreviewSelect: this.printPagePreviewSelect, visitCategory: this.visitCategory}
  //   });

  //   mdDialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.printPagePreviewSelect.caseSheetANC = result.caseSheetANC;
  //       this.printPagePreviewSelect.caseSheetPNC = result.caseSheetPNC;
  //       this.printPagePreviewSelect.caseSheetExamination = result.caseSheetExamination;
  //       this.printPagePreviewSelect.caseSheetHistory = result.caseSheetHistory;
  //     }
  //   });
  // }

  downloadCasesheet() {
    window.print();
  }

  goBack() {
    this.location.back();
  }

  goToTop() {
    window.scrollTo(0, 0);
  }
	 /*
   * JA354063 - Created on 27-07-2021
   */
   assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
    }
    ngDoCheck() {
    this.assignSelectedLanguage();
    }
    /* Ends*/
}
