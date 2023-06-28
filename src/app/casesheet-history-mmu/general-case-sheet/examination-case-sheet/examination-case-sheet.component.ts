import { Component, OnInit, Input } from '@angular/core';
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-examination-case-sheet',
  templateUrl: './examination-case-sheet.component.html',
  styleUrls: ['./examination-case-sheet.component.css']
})
export class ExaminationCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;

  visitCategory: any;
  @Input() visitCate : any;

  generalExamination: any;
  headToToeExamination: any;
  gastroIntestinalExamination: any;
  cardioVascularExamination: any;
  respiratorySystemExamination: any;
  centralNervousSystemExamination: any;
  musculoskeletalSystemExamination: any;
  genitoUrinarySystemExamination: any;
  obstetricExamination: any;
  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

  ngOnInit() { 
    // this.visitCategory = localStorage.getItem('caseSheetVisitCategory');
    this.currentLanguageSetValue();
  }
   

  ngOnChanges() {
    this.currentLanguageSetValue();
    this.visitCategory = this.visitCate;
    if (this.casesheetData && this.casesheetData.nurseData && this.casesheetData.nurseData.examination) {
      let examination = this.casesheetData.nurseData.examination;

      if (examination.generalExamination)
        this.generalExamination = examination.generalExamination;

      if (examination.headToToeExamination)
        this.headToToeExamination = examination.headToToeExamination;

      if (examination.cardiovascularExamination)
        this.cardioVascularExamination = examination.cardiovascularExamination;

      if (examination.respiratoryExamination)
        this.respiratorySystemExamination = examination.respiratoryExamination;

      if (examination.centralNervousExamination)
        this.centralNervousSystemExamination = examination.centralNervousExamination;

      if (examination.musculoskeletalExamination)
        this.musculoskeletalSystemExamination = examination.musculoskeletalExamination;

      if (examination.genitourinaryExamination)
        this.genitoUrinarySystemExamination = examination.genitourinaryExamination;

      if (examination.obstetricExamination)
        this.obstetricExamination = examination.obstetricExamination;

      if (examination.gastroIntestinalExamination)
        this.gastroIntestinalExamination = examination.gastroIntestinalExamination;
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
