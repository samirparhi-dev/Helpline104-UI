import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-view-disease-summary-details',
  templateUrl: './view-disease-summary-details.component.html',
  styleUrls: ['./view-disease-summary-details.component.css']
})
export class ViewDiseaseSummaryDetailsComponent implements OnInit {
  diseaseName: any;
  summary: any;
  couldbedangerous: any;
  causes: any;
  dos_donts: any;
  symptoms_Signs: any;
  medicaladvice: any;
  riskfactors: any;
  treatment: any;
  self_care: any;
  investigations: any;
  currentLanguageSet: any;

  constructor(@Inject(MD_DIALOG_DATA) public input: any,
    private dialogRef: MdDialogRef<ViewDiseaseSummaryDetailsComponent>,
    private confirmationDialogsService: ConfirmationDialogsService,
    public HttpServices: HttpServices) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.assignSelectedLanguage();
    console.log(this.input.summaryDetails, "this.input");
    this.setSummaryDetails(this.input.summaryDetails);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  } 
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  setSummaryDetails(summaryDetails) {
    this.diseaseName = summaryDetails.diseaseName;
    this.summary = summaryDetails.summary.substring(1).replace(/\$/g, ',');
    this.couldbedangerous = summaryDetails.couldbedangerous.replace(/\$/g, '\n');
    this.causes = summaryDetails.causes.substring(1).replace(/\$/g, '\n');
    this.dos_donts = summaryDetails.dos_donts.substring(1).replace(/\$/g, '\n');
    this.symptoms_Signs = summaryDetails.symptoms_Signs.substring(1).replace(/\$/g, '\n');
    this.medicaladvice = summaryDetails.medicaladvice.substring(1).replace(/\$/g, '\n');
    this.riskfactors = summaryDetails.riskfactors.substring(1).replace(/\$/g, '\n');
    this.treatment = summaryDetails.treatment.substring(1).replace(/\$/g, '\n');
    this.self_care = summaryDetails.self_care.substring(1).replace(/\$/g, '\n');
    this.investigations = summaryDetails.investigations.substring(1).replace(/\$/g, '\n');
    console.log(this.medicaladvice, "this.input");
  }
  closeDialog() {
    this.dialogRef.close(this.input.summaryDetails);
    sessionStorage.setItem("diseaseClose","True");
  }
  closeCancelDialog()
  {
    sessionStorage.setItem("diseaseClose","False");
    this.dialogRef.close();
  }
}
