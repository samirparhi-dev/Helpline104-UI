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


import { Component, OnInit } from '@angular/core';
import { MdButtonModule, MdCheckboxModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { selectedSymp } from '../cdss/selectedSymp';

import { questionSymp } from '../cdss/questionSymp';

import { CDSSService } from '../services/cdssService/cdss.service';

import { ResultFormat } from '../cdss/Result';

import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

import { FormControl } from '@angular/forms';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';



@Component({
  selector: 'app-algo-component',
  templateUrl: './algo-component.component.html',
  styleUrls: ['./algo-component.component.css'],
  providers: [CDSSService]
})

export class AlgoComponentComponent implements OnInit {
  formattedResult1: any[];
  data: selectedSymp;
  emergencyQuest: any;
  questionid: string[];
  questions: questionSymp;
  ChiefComplaint: string[] = []
  result: ResultFormat[];
  formattedResult: any;
  title: any;

 
  currentLanguageSet: any;
  settings: { hideSubHeader: boolean; actions: boolean; columns: { Disease: { title: string; }; selected: { title: string; }; percentage: { title: string; }; Information: { title: string; }; DoDonts: { title: string; }; SelfCare: { title: string; }; Action: { title: string; }; }; };

  constructor(private _httpService: CDSSService,
    public HttpServices: HttpServices) {

  }

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;


  ngOnInit() {

  this.assignSelectedLanguage();

 

    this.data = new selectedSymp();
    this.questionid = [];

    this.getChiefComplaint();

    this.filteredOptions = this.myControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.ChiefComplaint.slice());


  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;

    this.setTitles();
	  }

  setTitles()
    {
      this.settings = {
        hideSubHeader: true,
        actions: false,
        columns: {
    
          Disease: {
            title: this.currentLanguageSet.disease
          },
          selected: {
            title: this.currentLanguageSet.userinput
          },
          percentage: {
            title: this.currentLanguageSet.percentage
          },
          Information: {
            title: this.currentLanguageSet.information
    
          },
          DoDonts: {
            title: this.currentLanguageSet.doDonts,
          },
          SelfCare: {
            title: this.currentLanguageSet.selfcare
          },
          Action: {
            title: this.currentLanguageSet.action
          }
        }
      };
    }

  filter(val: string): string[] {
    return this.ChiefComplaint.filter(symptom => new RegExp(`^${val}`, 'gi').test(symptom));
  }

  getChiefComplaint() {
    //console.log("getSymptom method called");
    // this._httpService.getChiefComplaints().subscribe(any => this.ChiefComplaint = any);

    //console.log(this.symptoms);

  }

  getQuestions() {
    console.log(this.questions)
    this.questionid = [];
    this._httpService.getQuestions(this.data).subscribe(any => this.questions = any);
    
    console.log(JSON.stringify(this.questions));
    //document.getElementById("Questions").focus();
  }

  getNextSet(value: any, id: any) {
    if (value) {

      confirm(this.currentLanguageSet.emergencyQuestionSelectedDoYouWantTransfer);
    }
    var questionSelected = {};
    questionSelected["complaintId"] = this.questions.id;
    questionSelected["selected"] = id;

    this._httpService.getAnswer(questionSelected).subscribe(any => this.assignresult(any));

  }

  assignresult(val: any) {
    this.result = val;

    console.log(val)

  }

  toggle(element: any, value: any) {

    console.log(value);
    if (element.selected == undefined) {
      element.selected = [];
    }
    var index = element.selected.indexOf(value);
    // console.log(this.questionid + ":" + index + ":" + value);
    if (index < 0) {
      element.selected.push(value);

    } else {
      element.selected.splice(index, 1);

    }
    //  console.log(this.questionid);
  }

  getresult() {


    this.formattedResult = new LocalDataSource( JSON.parse(JSON.stringify(this.result)));
    for (let index = 0; index < this.formattedResult.data.length; index++) {
      let selected = this.formattedResult.data[index].selected;
      let per=0;
      if (selected != undefined && selected.length != 0) {
        this.formattedResult.data[index].selected.sort(this.sortn);
        per = this.formattedResult.data[index].selected.length / this.formattedResult.data[index].Symptoms.length;
        per = Math.round(per * 1000) / 1000;
        
      } 
        this.formattedResult.data[index].percentage = per;
      


      //  this.formattedResult.data


    }
    // this.formattedResult.data.selected.sort();
    this.formattedResult1 = JSON.parse(JSON.stringify(this.formattedResult.data));
    this.formattedResult.load(this.formattedResult.data);


  }

sortn(a,b){
  return a - b}

 
}
