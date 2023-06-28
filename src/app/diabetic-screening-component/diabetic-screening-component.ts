import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { dataService } from "../services/dataService/data.service"
import { DiseaseScreeningService } from "../services/screening/diseaseScreening.service";
import { CaseSheetService } from '../services/caseSheetService/caseSheet.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CallServices } from '../services/callservices/callservice.service';
import { Observable, Subject } from 'rxjs/Rx';
import { log } from 'util';
import { UtilityService } from '../services/common/utility.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

declare var jQuery: any;
@Component({
    selector: 'diabetic-screening-component',
    templateUrl: './diabetic-screening-component.html',
    styleUrls: ['./diabetic-screening-component.css'],

})
export class DiabeticScreeningComponent implements OnInit {

    @Input() screeningServiceName: any;

    beneficiaryDetails: any;
    screeningService_selected: any;
    riskFactors: any;
    showTable: any = false;
    beneficiaryRegID: any;
    current_role: any;
    benHistoryID: any;
    screenName: any = "diabetic";
    diabeticQuestionTypeId: any;
    diabeticRiskFactorsQuestionTypeId: any;
    showRiskFactors: any = false;
    ipAddress: any;
    transferableCampaigns: any = [];
    questionTypeConfigForm: FormGroup = new FormGroup({});
    ticks: any;
    timeRemaining: any = 30;
    validCallID: any;
    disableFlag: boolean = true;
    isValid: boolean = true;
    actionByHao: any;

    Questions: any;
    Answers: any;
    questionTypeID: any;
    saved_successfully: any;
    transfered_successfully: any;
    age: any;
    firstName: any;
    lastName: any;
    gender: any;
    assignSelectedLanguageValue: any;

    constructor(private saved_data: dataService, private screeningService: DiseaseScreeningService,
        public dialog: MdDialog,
        private caseSheetService: CaseSheetService,
        private alerMesage: ConfirmationDialogsService,
        private czentrixServices: CzentrixServices,
        public router: Router,
        private utilityService: UtilityService,
        private _callServices: CallServices,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        public httpServices:HttpServices) {
        this.beneficiaryDetails = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
        this.screeningService_selected = this.saved_data.screeningService_selected;
        this.screeningService.getQuestionTypes().subscribe(response => this.getQuestionTypeSuccessHandeler(response));

        if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
            this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
        }
        else if (this.saved_data.benRegID) {
            this.beneficiaryRegID = this.saved_data.benRegID;
        }

    }
    diabeticQuestions: FormGroup = new FormGroup({});


    ngOnInit() {



        this.current_role = this.saved_data.current_role;



        if (this.ipAddress == undefined) {
            console.log("fetch ipAddress");
            this.czentrixServices.getIpAddress(this.saved_data.agentID).subscribe((response) => { this.ipSuccessHandler(response) }, (err) => {
                this.alerMesage.alert(err.errorMessage, 'error');
            });
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
        // this.getCampaigns();
        // this.getTransferableCampaigns()

        this.getValidCallTypeID(this.saved_data.current_service.serviceID);

        this.saved_data.sendBMI.subscribe((data) => {
            this.populateBMI(data);

        });

        this.saved_data.sendRoutine.subscribe((data) => {
            this.populateRoutine(data);

        });
        this.assignSelectedLanguage();
    }
    ngDoCheck() {
        this.assignSelectedLanguage();
      }
    populateBMI(data) {
        this.weight = data.weight;
        this.height = data.height;
        this.obesity = data.obesity;
    }
    populateRoutine(data) {
        for (var i = 0; i < this.riskFactors.length; i++) {
            let form ={};
            if (this.riskFactors[i].questionDesc == data.question) {
                if(data.id=='Yes') {
                form[this.riskFactors[i].questionID] = [this.riskFactors[i].m_104QuestionScore[0].answer, Validators.required];
                }
                else if(data.id == 'No'){
                    form[this.riskFactors[i].questionID] = [this.riskFactors[i].m_104QuestionScore[1].answer, Validators.required];
                }
                else if(data.id =='NA'){
                    form[this.riskFactors[i].questionID] = [this.riskFactors[i].m_104QuestionScore[2].answer, Validators.required];
                }
            }
            this.diabeticQuestions.patchValue(form);        
        }
    }
    getQuestionTypeSuccessHandeler(response) {
        this.disableFlag = true;
        console.log("*QUESTION TYPES*", response);
        for (let i = 0; i < response.length; i++) {
            if (response[i].questionType === "Diabetic") {
                this.diabeticQuestionTypeId = response[i].questionTypeID;
            }
            if (response[i].questionType === "Diabetic-Risk Factors") {
                this.diabeticRiskFactorsQuestionTypeId = response[i].questionTypeID;
            }
        }

        this.getDiabeticscreeningQuestions(this.diabeticQuestionTypeId);
        this.getDiabeticscreeningQuestions(this.diabeticRiskFactorsQuestionTypeId);
    }
    //    ngOnChanges(){
    //        console.log("screeningServiceName"+this.screeningServiceName);
    //        if(this.screeningServiceName!=undefined){
    //             this.screenName=this.screeningServiceName.split("-")[1];
    //             this.getDiabeticscreeningQuestions(this.screeningServiceName);
    //        }
    //    }
    requestObj: any = {};
    BMI: any;
    obesity: any;
    weight: any='';
    height: any='';
    getDiabeticscreeningQuestions(questionTypeID) {
        //console.log(screeningServiceName)
        this.requestObj = {};
        this.requestObj.questionTypeID = questionTypeID;
        this.requestObj.providerServiceMapID = this.saved_data.current_service.serviceID;


        let res = this.screeningService.getQuestionsList(this.requestObj).subscribe(response => { this.successHandler(questionTypeID, response) },
            (err) => {
                this.alerMesage.alert(err.errorMessage, 'error');
            }
        );
    }

    formObj = {};
    successHandler(questionTypeID, response) {
        if (questionTypeID == this.diabeticQuestionTypeId) {
            this.Questions = response;
            for (let i = 0; i < this.Questions.length; i++) {
                this.Questions[i].m_104QuestionScore.sort(function (a, b) {
                    return a.iD - b.iD;
                });
            }
             
            for (var i = 0; i < this.Questions.length; i++) {

                this.formObj['Q-' + this.Questions[i].questionID] = ['', Validators.required];
            //    console.log(this.formObj['Q-' + this.Questions[i].questionID]);
                if (this.Questions[i].question == "Age") {

                    if (this.age < 35)
                        this.formObj['Q-' + this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[0].score, Validators.required];
                    else if (this.age >= 35 && this.age <= 49)
                        this.formObj['Q-' + this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[1].score, Validators.required];
                    else if (this.age > 49)
                        this.formObj['Q-' + this.Questions[i].questionID] = [this.Questions[i].m_104QuestionScore[2].score, Validators.required];

                }
            }
            console.log("formObj", this.formObj);
            this.questionTypeConfigForm = this.fb.group(this.formObj);
            console.log(this.questionTypeConfigForm.value);
            this.questionTypeConfigForm.statusChanges.subscribe(
                (status) => {
                    if (status == "VALID") {
                        this.disableFlag = false;
                    }
                    else {
                        this.disableFlag = true;
                    }
                    console.log(status, "status");
                }
            );
            this.cdr.detectChanges();
        } else if (questionTypeID == this.diabeticRiskFactorsQuestionTypeId) {
            this.riskFactors = response;
            let form ={}
            // sorting risk factor answers based on iD
            for (let i = 0; i < this.riskFactors.length; i++) {

                this.riskFactors[i].m_104QuestionScore.sort(function (a, b) {
                    return a.iD - b.iD;
                });
            
            form[this.riskFactors[i].questionID] = ["", Validators.required];

            }
            console.log(form, 'form created');
            this.diabeticQuestions = this.fb.group(form);

        }

    }

    ipSuccessHandler(response) {
        this.ipAddress = response.agent_ip;
    }

    getDiabeticscreeningAnswers(questionID) {
        this.requestObj = {};
        this.requestObj.questionID = questionID;

        let res = this.screeningService.getAnswersList(this.requestObj).subscribe(response => this.Answers = response);
    }

    diabeticScreeningResult = "";
    checkStatus(values) {
        console.log("form Values:", values);
        let totalscore = 0;

        for (let question of this.Questions) {

            let value = values["Q-" + question.m_104QuestionScore[0].questionID];
            if (!isNaN(value)) {
                totalscore = totalscore + parseInt(value);
            }

        }
        if (totalscore <= 30) {
            this.diabeticScreeningResult = this.assignSelectedLanguageValue.yourScoreIs + totalscore + this.assignSelectedLanguageValue.lowRiskLifestyleAndDietaryChanges;
            this.alerMesage.alert(this.diabeticScreeningResult);
        } else if (totalscore >= 30 && totalscore <= 50) {
            this.diabeticScreeningResult = this.assignSelectedLanguageValue.yourScoreIs + totalscore + this.assignSelectedLanguageValue.mediumRiskTransferToMo;
            this.alerMesage.alert(this.diabeticScreeningResult);
        } else if (totalscore >= 50) {
            this.diabeticScreeningResult = this.assignSelectedLanguageValue.yourScoreIs + totalscore + this.assignSelectedLanguageValue.highRiskTransferToMo;
            this.alerMesage.alert(this.diabeticScreeningResult);
        }
        // let dialogReff = this.dialog.open(DiabeticScreeningModel, {
        //     // height: '180px',
        //     width: '420px',
        //     disableClose: true,
        //     data: {
        //         "diabetic_screening_result": this.diabeticScreeningResult,
        //         "ipAddress": this.ipAddress,
        //         "current_language_set": this.current_language_set
        //     }
        // });

        // dialogReff.afterClosed().subscribe(response => {
        //     console.log("POST MODAL CLOSING", response);

        //     if (response == 'cancel') {
        //         // cancel
        //     }
        //     else {

        //         this.showRemarks()

        //     }
        // });

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
    saveCaseSheetData(action: any) {

        this.caseSheetObj = {};
        this.caseSheetObj.beneficiaryRegID = this.beneficiaryRegID;
        this.caseSheetObj.diseaseSummary = this.screenName;
        this.caseSheetObj.actionByHAO = action;
        this.caseSheetObj.deleted = false;
        this.caseSheetObj.createdBy = this.saved_data.Userdata.userName;

        let lastname = this.lastName ? this.lastName : "";
        this.caseSheetObj.patientName = this.firstName + " " + lastname;
        this.caseSheetObj.patientAge = this.age;
        this.caseSheetObj.patientGenderID = this.gender;

        let data = JSON.stringify(this.caseSheetObj);
        this.caseSheetService.saveCaseSheetData(data).subscribe((response) => {
            this.benHistoryID = response.benHistoryID
            this.alerMesage.alert(this.assignSelectedLanguageValue.savedSuccessfully, 'success');
            this.showRiskFactors = false;
            this.weight = "";
            this.height = "";
            this.obesity = "";
            this.riskFactors = [];
            this.actionByHao = "";
            this.saved_data.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

            this.screeningService.getQuestionTypes().subscribe(response => this.getQuestionTypeSuccessHandeler(response));
        }
            , (err) => {
                this.alerMesage.alert(err.status, 'error');
            });
    }

    @Input() current_language: any;
    current_language_set: any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'

    ngOnChanges() {
       
    }

    /*EDITOR: DIAMOND KHANNA,29 sep 2017*/
    getValidCallTypeID(providerServiceMapID) {
        const requestObject = { 'providerServiceMapID': providerServiceMapID };
        this._callServices.getCallTypes(requestObject).subscribe(response => {
            console.log(response);

            try {
                this.validCallID = response.filter(function (item) {
                    // console.log(item.callGroupType);
                    return item.callGroupType.toLowerCase() === 'valid'
                })[0].callTypes.filter(function (previousData) {
                    // console.log(previousData.callType);
                    return previousData.callType.toLowerCase().indexOf('valid') != -1
                })[0].callTypeID;
            } catch (err) {
                //  this.showAlert('Please configure RO campaign.');
                return undefined;
            }


            console.log('valid call id', this.validCallID);
        }, (err) => {

        });

    }


    // showRemarks() {
    //     let remarksGiven;
    //     remarksGiven = '';
    //     this.alerMesage.remarks('Please Enter Remarks').subscribe((response) => {
    //         if (response) {
    //             remarksGiven = response;
    //         } else {
    //             remarksGiven = 'call transfered';
    //         }
    //         this.closeCall(remarksGiven);
    //     }, (err) => { });
    //     this.startCallWraupup();

    // }

    // startCallWraupup() {
    //     let timer = Observable.timer(2000, 1000);
    //     timer.subscribe(t => {
    //         this.ticks = (this.timeRemaining - t);
    //         if (t == this.timeRemaining) {
    //             // this.closeCall();
    //             this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
    //         }
    //     });
    // }

    closeCall(remarks) {
        let requestObj: any = {};
        if (this.saved_data.benCallID) {
            requestObj.benCallID = this.saved_data.benCallID;
        }
        else {
            requestObj.benCallID = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
        }
        requestObj.callType = 'valid';
        requestObj.callTypeID = this.validCallID.toString();;
        requestObj.beneficiaryRegID = this.beneficiaryRegID
        requestObj.remarks = remarks;
        requestObj.isFollowupRequired = false;
        requestObj.prefferedDateTime = undefined
        requestObj.providerServiceMapID = this.saved_data.current_service.serviceID;
        requestObj.createdBy = this.saved_data.Userdata.userName;
        requestObj.fitToBlock = "false";
        requestObj.endCall = false;

        this._callServices.closeCall(requestObj).subscribe((response) => {
            if (response) {
                this.alerMesage.alert(this.assignSelectedLanguageValue.callTransferredSuccessfully, 'success');
                this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
            }
        }, (err) => {
            this.alerMesage.alert(err.status, 'error');

        });
    }
    checkValid(data: any) {

        this.isValid = false;
    }
    valueSelected(question,id) {
        if(question.questionDesc == "UI Constant - Diabetic Stress") {
            this.saved_data.sendRoutine.next({
                id: id.value,
                question: "UI Constant - BP Stress"
            });
        }
        if(question.questionDesc == "UI Constant - Diabetic Alcohol History") {
            this.saved_data.sendRoutine.next({
                question: "UI Constant - BP Alcohol History",
                id: id.value
            });
        }
    }
     /*
  * JA354063 - Created on 20-07-2021
  */
 assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}

@Component({
    selector: 'diabetic-screening-response',
    templateUrl: './diabetic-screening-response-modal.html',
})
export class DiabeticScreeningModel {
    assignSelectedLanguageValue: any;

    constructor( @Inject(MD_DIALOG_DATA) public data: any,
        public dialog: MdDialog,
        public dialogReff: MdDialogRef<DiabeticScreeningModel>,
        public czentrixServices: CzentrixServices,
        private saved_data: dataService,
        public httpServices:HttpServices) { }

    ngOnInit() {
        this.getTransferableCampaigns(this.data.ipAddress);
      this. assignSelectedLanguage();
    }
    ngDoCheck() {
        this.assignSelectedLanguage();
      }

    transferableCampaigns: any;

    transferCallToMOCampaign() {

        // commented by Diamond Khanna,5 june 2018


        // this.czentrixServices.transferToCampaign(this.saved_data.agentID, this.data.ipAddress, this.getCampaignName('mo')).subscribe((response) => {

        //     console.log("transferToCampaign response: " + JSON.stringify(response));

        //     if (response.status == "SUCCESS") {
        //         this.dialogReff.close();
        //     }

        // }, (err) => {
        //     console.log('Error in getCampaigns', err);
        // })
    }

    getCampaignName(role) {
        if (this.transferableCampaigns.length > 0) {
            return (this.transferableCampaigns.filter(function (item) {
                console.log("campaign_name: " + item.campaign_name + " role: " + role);
                return item.campaign_name.toLowerCase().indexOf(role) != -1
            })[0].campaign_name);
        } else
            console.log("No Campaigns");
    }

    getTransferableCampaigns(ipAddress) {

        this.czentrixServices.getTransferableCampaigns(this.saved_data.agentID, ipAddress).subscribe((response) => {
            console.log("getTransferableCampaigns: " + JSON.stringify(response));

            this.transferableCampaigns = response.campaign;

            console.log("transferableCampaigns: " + JSON.stringify(this.transferableCampaigns));

        }, (err) => {
            console.log('Error in getTransferableCampaigns', err.errorMessage);
        })
    }
     /*
  * JA354063 - Created on 20-07-2021
  */
 assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}


        /*ends*/
