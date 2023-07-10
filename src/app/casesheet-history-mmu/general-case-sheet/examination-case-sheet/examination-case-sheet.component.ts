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
