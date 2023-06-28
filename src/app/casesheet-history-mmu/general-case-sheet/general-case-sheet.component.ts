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
