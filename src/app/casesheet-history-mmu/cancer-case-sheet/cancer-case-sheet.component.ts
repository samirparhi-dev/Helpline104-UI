import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChild, Input, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialogRef, MdDialog, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from './../../services/dialog/confirmation.service';
import { OtherHelplineService } from '../../services/caseSheetService/other-helpline.service';
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-cancer-case-sheet',
  templateUrl: './cancer-case-sheet.component.html',
  styleUrls: ['./cancer-case-sheet.component.css']
})
export class CancerCaseSheetComponent implements OnInit {

  printPagePreviewSelect = {
    caseSheetHistory: true,
    caseSheetExamination: true,
  }

  visitCategory: string;
  isTm:boolean;

  currentLanguageSet: any;


  constructor(

    private dialog: MdDialog, public dialogReff: MdDialogRef<CancerCaseSheetComponent>,
    private location: Location, @Inject(MD_DIALOG_DATA) private data: any,
    private route: ActivatedRoute, private otherHelpline: OtherHelplineService,
    private confirmationService: ConfirmationDialogsService,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
    this.visitCategory = this.data.caseSheetVisitCategory;
    this.isTm = this.data.isTm;
    
    // this.getCurrentRole();
    this.getCaseSheetData(this.data);
  }

  // ngOnDestroy() {
  //   if (this.caseSheetSubs)
  //     this.caseSheetSubs.unsubscribe();

  //   localStorage.removeItem('currentRole');
  // }

  // getCaseSheetDataVisit = {
  //   benVisitID: localStorage.getItem('caseSheetVisitID'),
  //   benRegID: localStorage.getItem('caseSheetBeneficiaryRegID'),
  //   benFlowID: localStorage.getItem('caseSheetBenFlowID')
  // }

  // oncologistRemarks: any;
  // getCurrentRole() {
  //   let currentRole = localStorage.getItem('currentRole');
  //   if (currentRole && currentRole === 'Oncologist') {
  //     this.oncologistRemarks = true;
  //   }
  // }

  caseSheetData: any;
  caseSheetDiagnosisData: any;
  caseSheetSubs: any;
  getCaseSheetData(data) {
    let obj = {
      "VisitCategory": data.caseSheetVisitCategory,
      "benFlowID": data.benFlowID,
      "beneficiaryRegID": data.beneficiaryRegID,
      "visitCode": data.visitCode
    }
    // this.casesheetSubs = 
    this.otherHelpline.getCasesheetData(obj,this.isTm)
      .subscribe(res => {
      
          this.caseSheetData = res;
          console.log('caseSheetData', this.caseSheetData);
      });
  }


  // getOncologistRemarks() {
  //   let value = undefined;
  //   if (this.caseSheetDiagnosisData && this.caseSheetDiagnosisData.provisionalDiagnosisOncologist) {
  //     value = this.caseSheetDiagnosisData.provisionalDiagnosisOncologist;
  //   }

  //   this.confirmationService.editRemarks('Oncologist Observation', value)
  //     .subscribe(result => {
  //       if (result) {
  //         if (!this.caseSheetDiagnosisData) {
  //           this.caseSheetDiagnosisData = {};
  //         }
  //         result = result.slice(0, result.lastIndexOf('.'));
  //         this.caseSheetDiagnosisData.provisionalDiagnosisOncologist = result;
  //         this.saveOncologistRemarks(result);
  //       }
  //     });
  // }

  // saveOncologistRemarks(result) {
  //   this.doctorService.postOncologistRemarksforCancerCaseSheet(result,
  //     this.getCaseSheetDataVisit.benVisitID,
  //     this.getCaseSheetDataVisit.benRegID)
  //     .subscribe((res) => {
  //       if (res.statusCode == 500 || res.statusCode == 5000) {
  //         this.confirmationService.alert(res.errorMessage, 'error');
  //       } else if (res.statusCode == 200) {
  //         if (this.caseSheetData && this.caseSheetData.doctorData) {
  //           this.caseSheetData = {
  //             ...this.caseSheetData,
  //             doctorData: {
  //               ...this.caseSheetData.doctorData,
  //               diagnosis: {
  //                 ...this.caseSheetData.doctorData.diagnosis,
  //                 provisionalDiagnosisOncologist: result
  //               }
  //             }
  //           }
  //         }
  //         this.confirmationService.alert(res.data.response, 'success');
  //       }
  //     })
  // }

  // selectPrintPage() {
  //   let mdDialogRef: MdDialogRef<PrintPageSelectComponent> = this.dialog.open(PrintPageSelectComponent, {
  //     width: '420px',
  //     disableClose: false,
  //     data: { printPagePreviewSelect: this.printPagePreviewSelect, visitCategory: this.visitCategory }
  //   });

  //   mdDialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.printPagePreviewSelect.caseSheetExamination = result.caseSheetExamination;
  //       this.printPagePreviewSelect.caseSheetHistory = result.caseSheetHistory;
  //     }
  //   });
  // }

  printPage() {
    window.print();
  }

  goToTop() {
    window.scrollTo(0, 0);
  }

  goBack() {
    this.location.back();
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
