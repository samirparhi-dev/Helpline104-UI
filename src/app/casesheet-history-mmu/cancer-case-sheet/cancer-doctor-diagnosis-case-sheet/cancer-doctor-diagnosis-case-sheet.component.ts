import { Component, OnInit, Input } from '@angular/core';
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'cancer-doctor-diagnosis-case-sheet',
  templateUrl: './cancer-doctor-diagnosis-case-sheet.component.html',
  styleUrls: ['./cancer-doctor-diagnosis-case-sheet.component.css']
})
export class CancerDoctorDiagnosisCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;

  beneficiaryDetails: any;
  currentVitals: any;
  caseSheetDiagnosisData: any;
  date: any;
  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
    let t = new Date();
    this.date = t.getDate() + "/" + t.getMonth() + "/" + t.getFullYear();
  }

  ngOnChanges() {
    this.currentLanguageSetValue();
    console.log(this.casesheetData);

    if (this.casesheetData) {
      if (this.casesheetData.BeneficiaryData)
        this.beneficiaryDetails = this.casesheetData.BeneficiaryData;

      if (this.casesheetData.nurseData && this.casesheetData.nurseData.currentVitals)
        this.currentVitals = this.casesheetData.nurseData.currentVitals;

      if (this.casesheetData.doctorData && this.casesheetData.doctorData.diagnosis)
        this.caseSheetDiagnosisData = this.casesheetData.doctorData.diagnosis;
    }

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
