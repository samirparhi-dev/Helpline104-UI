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


import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { SearchService } from '../services/searchBeneficiaryService/search.service';
import { FoodSafetyServices } from '../services/sioService/foodSafetyService.service';
//import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { UtilityService } from '../services/common/utility.service';
import { RegisteredBeneficiaryModal104 } from '../beneficiary-registration-104/beneficiary-registration-104.component';
import { LocationService } from '../services/common/location.service';
import { FeedbackTypes } from '../services/common/feedbacktypes.service';
import { CallServices } from '../services/callservices/callservice.service';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { HttpServices } from "../services/http-services/http_services.service";

import { NgForm } from '@angular/forms';
import { SetLanguageComponent } from 'app/set-language.component';
declare var jQuery: any;

@Component({
  selector: 'app-sio-food-safety-service',
  templateUrl: './sio-food-safety-service.component.html',
  styleUrls: ['./sio-food-safety-service.component.css']
})
export class SioFoodSafetyServiceComponent implements OnInit {

  //  showComplaintForm = false;
  showTable = true;
  commonData:Array<any> = [];
  beneficiaryDetails: any;
  beneficiaryRegID: any;
  firstName: any;
  lastName: any;
  gender: any = "";
  age: any = "";
  foodSafetyComplaint: any;
  foodSafetyComplaints: any;
  districts: any;
  district: any = "";
  taluk: any = "";
  cityVillageName: any = "";
  myDatepicker = '';
  foodSafetyComplaintID: any;
  diarrhea: any = '0';
  abdominalPain: any = '0';
  chillsRigors: any = '0';
  giddiness: any = '0';
  dehydration: any = '0';
  rashes: any = '0';
  vomiting: any = '0';
  consumedFood: any = '0';
  complaintType: any = "";
  patientIs: any = "self";
  whatTypeOfFood: any;
  foodConsumedFrom: any;
  associatedSymptoms: any;
  is_a_healthcare_worker: any = "yes";
  historyOfDiet: any;
  maxDate: Date;
  remarks: any;
  count: any;
  page1: any = true;
  // page2: any = false;
  agentData: any;
  today: Date;
  fromWhen: Date;
  disableRadio: boolean = false;
  feedbackTypeID: any;
  outboundRequestID: any;
  fSComplaintID: any;
  //search
  filteredFeedbackList: any;
  filterTerm;
  searchType:any = "ComplaintID";
	viewALL: any = true;
	current_role: any;
	minLength: number = 1;
	maxLength: number = 30;

  @ViewChild('foodSafetyComplaintForm') foodSafetyComplaintForm: NgForm;


  complaintTypesArray: any = [
    { 'complaintType': 'Adulteration' },
    { 'complaintType': 'Mid-Day Meal' },
    { 'complaintType': 'Function Meal' },
    { 'complaintType': 'Hotel Related' }];

  subDistricts: any = [];
  villages: any = [];
  outboundReq: boolean = false;
  minDate: Date;
  dateOfOutbound: any;
  currentCampaign: any;
  providerServiceMapID: any;
  currentLanguageSet: any;

  constructor(public searchBenData: SearchService,
    public commonAppData: dataService,
    private _smsService: SmsTemplateService,
    public dialog: MdDialog, private _callServices: CallServices,
    private foodSafetyServices: FoodSafetyServices,
    private alertMesage: ConfirmationDialogsService,
    private utilityService: UtilityService, private _feedbackTypes: FeedbackTypes,
    private location: LocationService,public HttpServices: HttpServices) {
    this.beneficiaryDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    this.agentData = this.commonAppData.Userdata;
  }

  ngOnInit() {
   this.assignSelectedLanguage();
    this.providerServiceMapID = this.commonAppData.current_service.serviceID;

    this.currentCampaign = this.commonAppData.current_campaign;
    this.dateOfOutbound = new Date();
    this.minDate = new Date();
    this.fromWhen = new Date();
    this.today = new Date();
    this.maxDate = this.today;
    this.outboundRequestID = this.commonAppData.outboundRequestID;

    this.searchBenData.getCommonData().subscribe(response => this.commonData = this.successHandeler(response));

    if (this.currentCampaign == 'INBOUND') //During OUTBOUND THESE WILL BE CALLED ONE AFTER THE OTHER
    {
      this.location.getDistricts(this.commonAppData.current_stateID_based_on_role).subscribe(response => this.districts = this.districtsuccessHandeler(response));
      this._feedbackTypes.getFeedbackTypeID(this.commonAppData.current_service.serviceID).subscribe(response => this.getFeedbackTypeIDSuccessHandeler(response));
    }

    if (this.currentCampaign == 'INBOUND' && this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
      this.benDataInboundPopulationg();
      this.getFoodSafetyComplaints();
    }
    else if (this.currentCampaign == 'INBOUND' && this.commonAppData.benRegID ) {
      this.beneficiaryRegID = this.commonAppData.benRegID;
      this.benDataInboundPopulationg();
      this.getFoodSafetyComplaints();
      // this case will execute in hybridHAO case
    } 
    else if (this.currentCampaign == 'OUTBOUND') {
      this.beneficiaryRegID = this.commonAppData.outboundBenID;
      this.showTable = false;
      //  this.showComplaintForm = true;
      let obj = {
        "beneficiaryRegID": this.commonAppData.outboundBenID
      }
      if(this.commonAppData.outboundBenID !=undefined)
      {
        this.searchBenData.retrieveRegHistory(obj)
        .subscribe(response => this.benDataOnBenIDSuccess(response));
      }
     
    }
    this.nameFlag = false;
    this.genderFlag = false;
    this.ageFlag = false;
    this.current_role = this.commonAppData.current_role;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  benDataInboundPopulationg() {
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
      this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
      this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
      this.age = this.utilityService.calculateAge(this.beneficiaryDetails.i_beneficiary.dOB);
    }
    else if (this.commonAppData.benRegID) {
      this.firstName = this.commonAppData.firstName;
      this.lastName = this.commonAppData.lastName;
      this.gender = this.commonAppData.gender;
      this.age = this.commonAppData.age;
    }
  }
  benDataOnBenIDSuccess(response) {
    this.firstName = response[0].firstName;
    this.lastName = response[0].lastName;
    this.gender = response[0].m_gender.genderID;
    this.age = this.utilityService.calculateAge(response[0].dOB);
  }
  getFeedbackTypeIDSuccessHandeler(response) {
    //  console.log("FEEDBACK ID TYPE ***###***", JSON.stringify(response));
    for (let i = 0; i < response.length; i++) {
      if (response[i].feedbackTypeName === "Foodsafety Complaints") {
        this.feedbackTypeID = response[i].feedbackTypeID;
      }
    }
    if (this.currentCampaign == 'OUTBOUND') {
      this.commonAppData.serviceAvailed.next(true); // no need to avail any service in OUTBOUND, so sending true
      this.getFoodSafetyOutboundHistory();
    }
  }
  getFoodSafetyOutboundHistory() {
    this.foodSafetyServices.getFoodSafetyComplaintsByBenID({ "requestID": this.outboundRequestID }).subscribe(res => this.outboundHistorySuccess(res),
      (err) => {
        this.alertMesage.alert(this.currentLanguageSet.errorInFetchingFoodSafetyHistory, 'error');
      });
  }
  preventTyping(e: any) {
    if (e.keyCode === 9) {

      return true;

    } else {

      return false;

    }
  }

  getSubDistrict(districtID) {
    this.searchBenData.getSubDistricts(districtID).subscribe(response => this.getSubDistrictSuccessHandeler(response));
  }

  getSubDistrictSuccessHandeler(response) {
    this.subDistricts = response;
    //  console.log("********SUBDISTRICT", this.subDistricts);
  }

  getVillage(subDistrictID) {
    this.searchBenData.getVillages(subDistrictID).subscribe(response => this.getVillageSuccessHandeler(response));
  }

  getVillageSuccessHandeler(response) {
    this.villages = response;
    //  console.log("********VILLAGES", this.villages);
  }

  //Purpose: Backward navigation to the registration form
  capturePrimaryInfo(val: any) {
    this.page1 = true;
    //    this.page2 = false;
  }
  //Purpose: Forward navigation to the registration form
  captureOtherInfo() {
    this.page1 = false;
    //   this.page2 = true;
  }

  showHistory() {
    this.showTable = true;
    //  this.showComplaintForm = false;
    this.filterTerm = "";
    this.viewALL = true;
    this.searchType = "ComplaintID";
    this.minLength = 1;
    this.maxLength = 30;
    this.filteredFeedbackList = this.data;
  }
  disableFlag: boolean = true;
  patientDetails(val: any) {
    if (val == "self") {
      this.benDataInboundPopulationg();
      this.nameFlag = false;
      this.genderFlag = false;
      this.ageFlag = false;
      this.disableFlag = true;
      this.diarrhea = '0';
      this.abdominalPain = '0';
      this.chillsRigors = '0';
      this.giddiness = '0';
      this.dehydration = '0';
      this.rashes = '0';
      this.vomiting = '0';
      this.consumedFood = '0';

    }
    if (val == "other") {
      this.firstName = "";
      this.lastName = "";
      this.gender = "";
      this.age = "";
      this.ageFlag = true;
      this.nameFlag = true;
      this.genderFlag = true;
      this.disableFlag = false;
      this.diarrhea = '0';
      this.abdominalPain = '0';
      this.chillsRigors = '0';
      this.giddiness = '0';
      this.dehydration = '0';
      this.rashes = '0';
      this.vomiting = '0';
      this.consumedFood = '0';

    }
  }
  foodSafetyObj: any = {};
  saveFoodSafetyComplaint(values: any) {
    this.foodSafetyObj = {};
    this.foodSafetyObj.associatedSymptoms = values.associatedSymptoms;
    this.foodSafetyObj.beneficiaryRegID = this.beneficiaryRegID;
    this.foodSafetyObj.foodConsumedFrom = values.foodConsumedFrom;
    if (values.fromWhen != null) {
      this.foodSafetyObj.fromWhen = new Date((values.fromWhen) - 1 * (values.fromWhen.getTimezoneOffset() * 60 * 1000)).toJSON();
    }
    this.foodSafetyObj.historyOfDiet = values.historyOfDiet;
    this.foodSafetyObj.isAbdominalPain = this.abdominalPain;
    this.foodSafetyObj.isChillsOrRigors = this.chillsRigors;
    this.foodSafetyObj.isDehydration = this.dehydration;
    this.foodSafetyObj.isDiarrhea = this.diarrhea;
    this.foodSafetyObj.isFoodConsumed = this.consumedFood;
    this.foodSafetyObj.isGiddiness = this.giddiness;
    this.foodSafetyObj.isRashes = this.rashes;
    this.foodSafetyObj.isVomiting = this.vomiting;
    this.foodSafetyObj.remarks = values.remarks ? values.remarks.trim() : null;
    this.foodSafetyObj.typeOfFood = values.whatTypeOfFood;
    this.foodSafetyObj.typeOfRequest = values.complaintType
    this.foodSafetyObj.createdBy = this.agentData.userName;
    this.foodSafetyObj.serviceID = this.commonAppData.current_service.serviceID;
    this.foodSafetyObj.districtID = values.district;
    this.foodSafetyObj.districtBlockID = values.taluk ? values.taluk : undefined;
    this.foodSafetyObj.villageID = values.cityVillageName ? values.cityVillageName : undefined;
    this.foodSafetyObj.feedbackTypeID = this.feedbackTypeID;
    this.foodSafetyObj.isSelf = this.disableFlag;

    this.foodSafetyObj.patientName = this.firstName;
    if (this.lastName != undefined && this.lastName != null) {
      this.foodSafetyObj.patientName = this.foodSafetyObj.patientName + ' ' + this.lastName;
    }
    this.foodSafetyObj.patientAge = this.age;
    this.foodSafetyObj.patientGenderID = this.gender;

    if (this.currentCampaign == 'OUTBOUND') {
      this.foodSafetyObj.requestID = this.outboundRequestID;
      this.foodSafetyObj.fSComplaintID = this.fSComplaintID;
    }
    if (this.commonAppData.benCallID) {
      this.foodSafetyObj.benCallID = this.commonAppData.benCallID;
    }
    else {
      this.foodSafetyObj.benCallID = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }
    //   console.log("food safety complaint " + JSON.stringify(this.foodSafetyObj));
    this.foodSafetyServices.saveFoodSafetyComplaint(this.foodSafetyObj)
      .subscribe((res) => {
        if (this.outboundReq) {
          this.takeFollowUp(values, res.requestID);
        }
        this.foodSafetyComplaint = this.successHandler(res)
      }, (err) => {
        this.alertMesage.alert(err.status, 'error');
      });

  }
  altPhNumber: any;  //getting from modal window
  successHandler(response) {
    
    this.commonAppData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

    if (response.fSComplaintID != undefined) {
      this.foodSafetyComplaintID = response.requestID;
      this.page1 = true;

      if (this.currentCampaign == 'INBOUND') {
        this.foodSafetyComplaintForm.reset();
        //  this.showComplaintForm = false;
        this.showTable = true;
        this.count = "";
        this.fromWhen = new Date();
        var id = this.currentLanguageSet.foodComplaintRaisedSuccessfullyID + this.foodSafetyComplaintID;
        this.getFoodSafetyComplaints();
        this.diarrhea = '0';
        this.abdominalPain = '0';
        this.chillsRigors = '0';
        this.giddiness = '0';
        this.dehydration = '0';
        this.rashes = '0';
        this.vomiting = '0';
        this.consumedFood = '0';
        /* Commented gender and age - need to patch both after saving the food safety complaint*/
        // this.age = null;
        // this.gender = null;

      }
      else {
        var id = this.currentLanguageSet.foodComplaintUpdatedSuccessfullyID  + this.foodSafetyComplaintID;
        this.getFoodSafetyOutboundHistory();
      }
      let dialogReff = this.dialog.open(RegisteredBeneficiaryModal104, {
        // height: '280px',
        width: '420px',
        disableClose: true,
        data: {
          "generatedId": id,
          "Title": "Success"
        }
      });

      dialogReff.afterClosed().subscribe(result => {

        if (result != 'close' && result != '') {
          this.sendSMS(result, response);

        }

      });
    }

    return response;

  }

  sendSMS(alternate_number, foodSafetyObj) {
    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.commonAppData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (response[i].smsType.toLowerCase() === 'Food Safety Complaint SMS'.toLowerCase()) {
                smsTypeID = response[i].smsTypeID;
                break;
              }
            }
          }
        }

        if (smsTypeID != '') {
          this._smsService.getSMStemplates(this.providerServiceMapID,
            smsTypeID).subscribe(res => {
              if (res != undefined) {
                if (res.length > 0) {
                  for (let j = 0; j < res.length; j++) {
                    if (res[j].deleted === false) {
                      sms_template_id = res[j].smsTemplateID;
                      break;
                    }
                  }
                }

                if (smsTypeID != '') {

                  let reqArr = [];

                  let reqObj = {
                    "alternateNo": alternate_number,
                    'beneficiaryRegID': this.beneficiaryRegID,
                    "fSComplaintID": foodSafetyObj.fSComplaintID,
                    "createdBy": this.commonAppData.Userdata.userName,
                    "is1097": false,
                    "providerServiceMapID": this.providerServiceMapID,
                    "smsTemplateID": sms_template_id,
                    "smsTemplateTypeID": smsTypeID
                    // "userID": 0
                  }
                  reqArr.push(reqObj);

                  this._smsService.sendSMS(reqArr)
                    .subscribe(ressponse => {
                      console.log(ressponse, 'SMS Sent');
                      this.alertMesage.alert(this.currentLanguageSet.smsSent, 'success');
                    }, err => {
                      console.log(err, 'SMS not sent Error');
                    })
                }
              }
            }, err => {
              console.log(err, 'Error in fetching sms templates');
            })
        }
      }, err => {
        console.log(err, 'error while fetching sms types');
      })
  }

  takeFollowUp(values, requestID) {

    let benDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    let id
    if (this.commonAppData.benCallID) {
      id = this.commonAppData.benCallID;
    }
    else {
      id = benDetails.benCallID;
      //   console.log("benCallID: " + benDetails.benCallID);
    }
    let obj = {
      "endCall": false,
      "beneficiaryRegID": this.beneficiaryRegID,
      "providerServiceMapID": this.commonAppData.current_service.serviceID,
      "isFollowupRequired": true,
      "prefferedDateTime": values.dateOfOutbound,
      "createdBy": this.agentData.userName,
      "requestedFeature": "Food safety",
      "requestedFor": values.remarks ? values.remarks.trim() : null,
      "requestNo": requestID,
      "benCallID": id,

    }
    //  console.log(obj);
    this._callServices.closeCall(obj).subscribe((response) => { this.followUpSuccess(response) },
      (err) => {
        console.log(err)
        this.alertMesage.alert(this.currentLanguageSet.errorWhileTakingFollowUpInFoodSafety, 'error')
      });
  }
  followUpSuccess(res) {
    console.log(res);
  }

  successHandeler(response) {
    //  console.log('the response is', response);
    if (this.currentCampaign == 'OUTBOUND') {
      this.location.getDistricts(this.commonAppData.current_stateID_based_on_role).subscribe(response => this.districts = this.districtsuccessHandeler(response));
    }
    return response;
  }
  districtsuccessHandeler(response) {
    //  console.log('the response is', response);
    if (this.currentCampaign == 'OUTBOUND') {
      this._feedbackTypes.getFeedbackTypeID(this.commonAppData.current_service.serviceID).subscribe(response => this.getFeedbackTypeIDSuccessHandeler(response));
    }
    return response;
  }

  getFoodSafetyComplaints() {
    let data = '{"beneficiaryRegID":"' + this.beneficiaryRegID + '"}';
    this.foodSafetyServices.getFoodSafetyComplaintsByBenID(data).subscribe(res => this.handleSuccess(res));

  }
  // //  populating form on the basis of request for self or not
  // populateForm(value:any)
  // {
  //   console.log(value);
  //   if(value==='self')
  //   {
  //     this.firstName=this.beneficiaryDetails.i_beneficiary.firstName;
  // 		this.lastName=this.beneficiaryDetails.i_beneficiary.lastName;
  // 		this.gender=this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
  //   }
  //   else{
  //     this.firstName ="";
  //     this.lastName ="";
  //     this.gender ="";
  //   }

  // }
  data: any = [];
  handleSuccess(res) {
    if (res instanceof Array) {
      this.foodSafetyComplaints = res;
      this.data = res;
      this.filteredFeedbackList = res;
    }
  }
  showForm() {
    this.showTable = false;
    this.diarrhea = '0';
    this.abdominalPain = '0';
    this.chillsRigors = '0';
    this.giddiness = '0';
    this.dehydration = '0';
    this.rashes = '0';
    this.vomiting = '0';
    this.consumedFood = '0';
    this.historyOfDiet=null;
    this.complaintType=null;
    this.whatTypeOfFood=null;
    this.foodConsumedFrom=null;
    this.associatedSymptoms=null;
    this.district=null;
    this.taluk=null;
    this.cityVillageName=null;
    this.outboundReq=null;
    this.remarks=null;
    this.dateOfOutbound=new Date();
    this.fromWhen=new Date();
    this.page1=true;
    this.patientIs='self';
    this.patientDetails(this.patientIs);
    //  this.showComplaintForm = true;
  }
  updateCount() {
    this.count = this.remarks.length + '/300';
  }
  nameFlag: any = true;
  nameInput(value) {
    //   console.log(value.length);
    if (value.length >= 3 && value.length <= 24) {
      this.nameFlag = false;


    }
    else {
      this.nameFlag = true;

    }

  }
  genderErrFlag: any = false;
  genderFlag: any = true;
  genderchange(value) {
    if (value == '') {
      this.genderErrFlag = true;
      this.genderFlag = true;
    }
    else {
      this.genderErrFlag = false;
      this.genderFlag = false;

    }
  }

  ageFlag: any = true;
  ageInput(value) {
    if (value == undefined) {

    }
    else if (value >= 1 && value <= 120) {
      this.ageFlag = false;
    }
    else {
      this.ageFlag = true;
    }
  }
  lenghOfRemarks: any;
  txtAreaRemarks(value) {
    //   console.log(value);
    this.lenghOfRemarks = (300 - value.length);
    //  console.log(this.lenghOfRemarks);
  }
  wrongDate: boolean = false;
  calculateDays(datee) {

    const year = this.today.getFullYear() - datee.getFullYear();
    const month = this.today.getMonth() - datee.getMonth();
    const day = this.today.getDate() - datee.getDate();

    if ((year == 0 && month < 0) || year < 0) {
      this.wrongDate = true;
    }
    else if (year == 0 && month > 0) {
      this.wrongDate = false;
    }
    else if (month == 0 && day < 0) {
      this.wrongDate = true;
    }
    else if (month == 0 && day == 0) {
      this.wrongDate = false;
    }
    else {
      this.wrongDate = false;
    }
  }

  outboundHistorySuccess(res) {
    this.diarrhea = res[0].isDiarrhea.toString();
    this.abdominalPain = res[0].isAbdominalPain.toString();
    this.chillsRigors = res[0].isChillsOrRigors.toString();
    this.giddiness = res[0].isGiddiness.toString();
    this.dehydration = res[0].isDehydration.toString();
    this.vomiting = res[0].isVomiting.toString();
    this.rashes = res[0].isRashes.toString();
    this.consumedFood = res[0].isFoodConsumed.toString();
    let a = new Date(res[0].fromWhen).toISOString();
    this.fromWhen = new Date(a);
    this.historyOfDiet = res[0].historyOfDiet;
    this.complaintType = res[0].typeOfRequest;
    this.whatTypeOfFood = res[0].typeOfFood;
    this.foodConsumedFrom = res[0].foodConsumedFrom;
    this.associatedSymptoms = res[0].associatedSymptoms ? res[0].associatedSymptoms : '';
    this.remarks = res[0].remarks ? res[0].remarks : '';
    this.district = res[0].district.districtID ? res[0].district.districtID : undefined;
    this.taluk = res[0].districtBlock.blockID ? res[0].districtBlock.blockID : undefined;
    this.cityVillageName = res[0].districtBranchMapping.districtBranchID ? res[0].districtBranchMapping.districtBranchID : undefined;
    this.fSComplaintID = res[0].fSComplaintID;

    this.getSubDistrict(this.district);
    this.getVillage(this.taluk);

  }
  onSearchChange(type) {
    if (type === 'MobileNumber') {
      this.minLength = 10;
      this.maxLength = 10;
    }
    else {
      this.minLength = 1;
      this.maxLength = 30;
    }
  }
  filterFeedbackList(searchTerm: string) {
		if (!searchTerm)
			this.filteredFeedbackList = this.data;
		else {
			let object = { 
				"phoneNum":this.searchType == 'MobileNumber' ? searchTerm : null,
				"requestID":this.searchType == 'ComplaintID' ? searchTerm : null
			 };
			 console.log(JSON.stringify(object));			 
			this.filteredFeedbackList = [];
			this.viewALL = false;
			this.foodSafetyServices.getFoodSafetyComplaintsByBenID(object).subscribe(res => 	this.filteredFeedbackList = res);
		}
  }
  revertFullTable() {
		this.filterTerm = "";
		this.viewALL = true;
    this.searchType = "ComplaintID";
    this.minLength = 1;
    this.maxLength = 30;
		let data = '{"beneficiaryRegID":"' + this.beneficiaryRegID + '"}';
    this.foodSafetyServices.getFoodSafetyComplaintsByBenID(data).subscribe(res => this.handleSuccess(res));
	}
 

  ngOnChanges() {
   
  }
}
//Sio-food-safety Modal window component

@Component({
  selector: 'sio-food-modal',
  templateUrl: './sio-food-safety-modal.html',
})
export class SioFoodSafetyModal {
  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<SioFoodSafetyModal>,
    public getCommonData: dataService,public HttpServices: HttpServices) { }
  altNum: any;
  mobileNumber: any;
  validNumber: any = false;

  ngOnInit() {
  this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
      this.dialogReff.close()
    }
    else {
      this.validNumber = false;
    }
  }
}