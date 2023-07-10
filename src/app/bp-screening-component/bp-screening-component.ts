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


import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { DiseaseScreeningService } from "../services/screening/diseaseScreening.service";
import { dataService } from '../services/dataService/data.service';
import { CaseSheetService } from '../services/caseSheetService/caseSheet.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
declare var jQuery: any;
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../services/common/utility.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";


@Component({
    selector: 'bp-screening-component',
    templateUrl: './bp-screening-component.html',
    styleUrls: ['./bp-screening-component.css']
})
export class BPScreeningComponent implements OnInit {
    actionByHao: any;
    beneficiaryDetails: any;
    screeningService_selected: any;
    riskFactors: any;
    showTable: any = false;
    BMI: any;
    obesity: any;
    beneficiaryRegID: any;
    current_role: any;
    screenName: any = 'Hyper Tension';
    bpQuestionTypeId: any;
    benHistoryID: any;
    weight: any='';
    height: any='';
    saved_successfully: any;
    firstName: any;
    lastName: any;
    gender: any;
    age: any;
    agentData: any;
    currentLanguageSet: any;
    
    constructor(private saved_data: dataService, private utilityService: UtilityService, private screeningService: DiseaseScreeningService,
        private caseSheetService: CaseSheetService, private fb: FormBuilder, private alertMessage: ConfirmationDialogsService, private cdr: ChangeDetectorRef,  public HttpServices: HttpServices) {
        this.beneficiaryDetails = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
        this.screeningService_selected = this.saved_data.screeningService_selected;
        // this.bpQuestionTypeId = this.saved_data.bpQuestionTypeId;
    }
    Questions: any[];
    Answers: any;
    questionTypeID: any;
    bpQuestions: FormGroup = new FormGroup({});
    ngOnInit() {
        this.currentLanguageSetValue();
        //this.HttpServices.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
        this.screeningService.getQuestionTypes().subscribe(response => this.getQuestionTypeSuccessHandeler(response));

        this.current_role = this.saved_data.current_role;
        if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
            this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
        }
        else if(this.saved_data.benRegID){
            this.beneficiaryRegID = this.saved_data.benRegID;
          }

        if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
            this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
            this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
            this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
            this.age = this.utilityService.calculateAge(this.beneficiaryDetails.i_beneficiary.dOB);
        }
        else {
            this.firstName = this.saved_data.firstName;
            this.lastName = this.saved_data.lastName;
            this.gender = this.saved_data.gender;
            this.age = this.saved_data.age;
        }
        this.saved_data.sendBMI.subscribe((data) => {
            this.populateBMI(data);
          
       
          });
          this.agentData = this.saved_data.Userdata;

          this.saved_data.sendRoutine.subscribe((data) => {
            this.populateRoutine(data);

        });
    }

    currentLanguageSetValue() {
        const getLanguageJson = new SetLanguageComponent(this.HttpServices);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }
      ngDoCheck() {
        this.currentLanguageSetValue();
      }
      
    populateRoutine(data) {
        for (var i = 0; i < this.Questions.length; i++) {
            let form ={};
            if (this.Questions[i].questionDesc == data.question) {
                if(data.id=='Yes') {
                form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[0].answer, Validators.required];
                }
                else if(data.id == 'No'){
                    form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[1].answer, Validators.required];
                }
                else if(data.id =='NA'){
                    form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[2].answer, Validators.required];
                }
            }
            this.bpQuestions.patchValue(form);            
        }
    }
    populateBMI(data) {
        this.weight = data.weight;
        this.height = data.height;
        this.obesity = data.obesity;
    }
    getQuestionTypeSuccessHandeler(response) {
        let a, b, c;
        console.log('*QUESTION TYPES*', response);
        for (let i = 0; i < response.length; i++) {
            if (response[i].questionType === 'BP') {
                this.bpQuestionTypeId = response[i].questionTypeID;
            }

        }


        this.getBpscreeningQuestions(this.bpQuestionTypeId);
    }
    //    ngOnChanges(){
    //        console.log("screeningServiceName"+this.screeningServiceName);
    //        if(this.screeningServiceName!=undefined){
    //             this.screenName=this.screeningServiceName.split("-")[1];
    //             this.getDiabeticscreeningQuestions(this.screeningServiceName);
    //        }
    //    }
    requestObj: any = {};
    getBpscreeningQuestions(questionTypeID) {
        //console.log(screeningServiceName)
        this.requestObj = {};
        this.requestObj.questionTypeID = questionTypeID;
        this.requestObj.providerServiceMapID = this.saved_data.current_service.serviceID;


        let res = this.screeningService.getQuestionsList(this.requestObj).subscribe(response => this.successHandler(questionTypeID, response));
    }
    tempArray: Array<any> = [];
    successHandler(questionTypeID, response) {
        // console.log("Get questions response: " + JSON.stringify(response));
        this.Questions = response;

        this.sortQuestionAnswers();
    }

    sortQuestionAnswers() {
        let form = {}
        for (let i = 0; i < this.Questions.length; i++) {

            this.Questions[i].m_104QuestionScore.sort(function (a, b) {
                return a.iD - b.iD;
            });

            form[this.Questions[i].questionID] = ["", Validators.required];
            if (this.Questions[i].question == "Gender") {

                if (this.gender == "1")
                    form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[0].answer, Validators.required];
                else if (this.gender == "2")
                    form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[1].answer, Validators.required];

            }

            if (this.Questions[i].question == "Age; Men > 30, Women> 50") {

                if (this.age > 30 && this.gender == '1' || this.age > 50 && this.gender == '2')
                    form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[0].answer, Validators.required];
                else
                    form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[1].answer, Validators.required];

            }
            if(this.Questions[i].question == "Pregnancy ?" && this.gender == "1") {
                form[this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[2].answer, Validators.required];
            }
        }
        console.log(form);
        this.bpQuestions = this.fb.group(form);
        this.cdr.detectChanges();
    }

    getDiabeticscreeningAnswers(questionID) {
        this.requestObj = {};
        this.requestObj.questionID = questionID;

        let res = this.screeningService.getAnswersList(this.requestObj).subscribe(response => {this.Answers = response},
        (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
        });
    }

    claculateBMI(weight, height) {
        if (weight != undefined && height != undefined) {
            // BMI = x KG / (y M * y M)
            this.BMI = weight / ((height * 0.025) * (height * 0.025));
            if (this.BMI > 25) {
                this.obesity = 'Yes';
                this.saved_data.sendBMI.next({
                    "weight" : weight,
                    "height" : height,
                    "obesity" : this.obesity
                });
            }
            else if (this.BMI < 25 && this.BMI > 0) {
                this.obesity = 'No';
                this.saved_data.sendBMI.next({
                    "weight" : weight,
                    "height" : height,
                    "obesity" : this.obesity
                });
            }
            else {
                this.obesity = 'NA';
                this.saved_data.sendBMI.next({
                    "weight" : weight,
                    "height" : height,
                    "obesity" : this.obesity
                });
            }
        }
    }

    caseSheetObj: any = {};
    saveCaseSheetData(actionByHao: any) {

        this.caseSheetObj = {};
        this.caseSheetObj.beneficiaryRegID = this.beneficiaryRegID;
        this.caseSheetObj.diseaseSummary = this.screenName;
        this.caseSheetObj.actionByHAO = actionByHao;
        this.caseSheetObj.deleted = false;
        this.caseSheetObj.createdBy = this.agentData.userName;

        let lastname = this.lastName ? this.lastName : "";
        this.caseSheetObj.patientName = this.firstName + " " + lastname;
        this.caseSheetObj.patientAge = this.age;
        this.caseSheetObj.patientGenderID = this.gender;

        let data = JSON.stringify(this.caseSheetObj);
        this.caseSheetService.saveCaseSheetData(data).subscribe((response) => {
            this.benHistoryID = response.benHistoryID
            this.alertMessage.alert(this.currentLanguageSet.savedSuccessfully, 'success');
            //   this.Questions = [];
            this.screeningService.getQuestionTypes().subscribe(res => this.getQuestionTypeSuccessHandeler(res));
            this.obesity = undefined;
            this.weight = "";
            this.height = "";
            this.saved_data.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

        }, (err) => {
            this.alertMessage.alert(err.status, 'error');
        });
    }

   

    ngOnChanges() {
      
    }
    valueSelected(question,id) {
        if(question.questionDesc == "UI Constant - BP Stress") {
            this.saved_data.sendRoutine.next({
                id: id.value,
                question : "UI Constant - Diabetic Stress"
            });
        }
        if(question.questionDesc == "UI Constant - BP Alcohol History") {
            this.saved_data.sendRoutine.next({
                question: "UI Constant - Diabetic Alcohol History",
                id: id.value
            });
        }
    }
}