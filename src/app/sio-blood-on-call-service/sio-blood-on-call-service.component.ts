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


import {
  Component, OnInit, Inject, Input, Output, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { SearchService } from '../services/searchBeneficiaryService/search.service';
import { dataService } from '../services/dataService/data.service';
import { BloodOnCallServices } from '../services/sioService/bloodOnCallServices.service';
import { OutboundWorklistService } from '../services/outboundServices/outbound-work-list.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { FeedbackResponseModel } from '../sio-grievience-service/sio-grievience-service.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { UtilityService } from '../services/common/utility.service';
import { RegisteredBeneficiaryModal104 } from '../beneficiary-registration-104/beneficiary-registration-104.component';
import { LocationService } from '../services/common/location.service';
import { CaseSheetService } from '../services/caseSheetService/caseSheet.service';
import { AvailableServices } from '../services/common/104-services';
import { CallServices } from '../services/callservices/callservice.service'
import { ActivatedRoute, Params } from '@angular/router';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { OutboundListnerService } from '../services/common/outboundlistner.service';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { NgForm, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';


declare var jQuery: any;

@Component({
  selector: 'app-sio-blood-on-call-service',
  templateUrl: './sio-blood-on-call-service.component.html',
  styleUrls: ['./sio-blood-on-call-service.component.css']
})
export class SioBloodOnCallServiceComponent implements OnInit {

  @Output() outBoundOnCall: EventEmitter<any> = new EventEmitter<any>();

  providerServiceMapID: any;

  showBloodRequestForm: boolean = false;
  requestID: any;
  bloodRequestID: any;
  bloodRequestResponse = false;
  beneficiaryRegID: any;
  commonData: any;
  bloodRquest: any;
  bloodRquestsHistory: any = [];
  districts: any;
  componentTypes: any = [];
  bloodGroups: any = [];
  bloodgroup: any = ""; // used in html file
  // ngModels
  bloodRequestFor: any = "self";

  firstName: any;
  lastName: any;
  gender: any = "";
  age: any = "";
  // flags
  disablePatientDetails: boolean = true;

  showTable: boolean;
  Patient_Details: boolean;
  Hospital_Details: boolean;
  Bloodbank_Details: boolean;

  Patient_Details_nav: boolean = true;
  Hospital_Details_nav: boolean = false;
  Bloodbank_Details_nav: boolean = false;

  isOutboundRequired: boolean = false;
  patientForm: any;
  beneficiaryDetails: any;

  outboundReq: boolean = false;

  minDate: Date;
  dateOfOutbound: any;
  agentData: any;
  componentTypeName: any;
  bloodGroupName: any;
  unitRequired: any;
  hospitalName: any;
  district: any;
  current_campaign: any;
  callerNumber: any;

  contactPerson: any;
  designation: any;
  phoneNumber: any;
  remarks: any;
  address: any;
  dialerNumber: any;
  showDialBenificiary: boolean = true;
  showDialBlood: boolean = true;
  disableRadio: boolean = false;
  isRequestFulfilled: boolean = false;
  rqstFullfilledMobileNum: any;
  mobileNumbers: Array<any> = [];
  componentType: any;
  bloodUnits: any;

  bloodBank: FormGroup = new FormGroup({
    bloodBankForm: new FormArray([])
  });
  currentLanguageSet: any;

  constructor(public searchBenData: SearchService,
    public commonAppData: dataService,
    private _smsService: SmsTemplateService,
    public bloodOnCallService: BloodOnCallServices,
    public dialog: MdDialog, public ref: ChangeDetectorRef,
    private _OWLService: OutboundWorklistService,
    private alertMesage: ConfirmationDialogsService,
    private utilityService: UtilityService, public fb: FormBuilder,
    private caseSheetService: CaseSheetService, private outboundService: OutboundListnerService,
    private router: ActivatedRoute, private cz_service: CzentrixServices,
    private _availableServices: AvailableServices, private _callServices: CallServices,
    private location: LocationService,public HttpServices: HttpServices) {
    this.current_campaign = this.commonAppData.current_campaign;
    this.agentData = this.commonAppData.Userdata;
    this.beneficiaryDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (this.current_campaign == "INBOUND") {
      this.showTable = true;
      this.Patient_Details = true;
      this.Bloodbank_Details = false;
    }
    else {
      this.showTable = false;
      this.Patient_Details = false;
      this.Bloodbank_Details = true;
    }

    if (this.current_campaign == "INBOUND") {
      this.bloodBank = this.fb.group({
        bloodBankForm: this.fb.array([
          this.fb.group({
            bbPersonName: null,
            bbPersonDesignation: null,
            bbMobileNo: null,
            bloodBankAddress: null,
            remarks: null,
            requestedBloodBankID: undefined  // Used during Outbound only
          })
        ])
      })
    }
    console.log(this.bloodBank.get('bloodBankForm')['controls'].length);
  }


  ngOnInit() {
   this.assignSelectedLanguage();
    this.providerServiceMapID = this.commonAppData.current_service.serviceID;
    let today = new Date();
    this.minDate = today;
    this.dateOfOutbound = today;

    this.searchBenData.getCommonData().subscribe(response => this.commonData = this.successHandeler(response));
    this.location.getDistricts(this.commonAppData.current_stateID_based_on_role)
      .subscribe(response => this.districts = this.successHandeler(response));

    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary && this.current_campaign == "INBOUND") {
      this.benDataInboundPopulationg();
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }
    else if (this.commonAppData.benRegID && this.current_campaign == 'INBOUND') {
      this.benDataInboundPopulationg();

      this.beneficiaryRegID = this.commonAppData.benRegID;
    }
    else if (this.current_campaign == "OUTBOUND") {
      this.beneficiaryRegID = this.commonAppData.outboundBenID;
      let obj = {
        "beneficiaryRegID": this.beneficiaryRegID
      }

      this.searchBenData.retrieveRegHistory(obj)
        .subscribe(response => this.benDataOnBenIDSuccess(response));
      let object = {

        "requestID": this.commonAppData.outboundBloodReqtID
      }
      this.bloodOnCallService.getOutboundRequestDetails(object)
        .subscribe((response) => { this.populateOutboundDetails(response) }, (err) => {
          //console.log(err)
        });

      if (sessionStorage.getItem('CLI') != undefined) {
        this.callerNumber = sessionStorage.getItem('CLI');
      }
    }

    this.bloodOnCallService.getComponentTypes().subscribe(response => {
      this.componentTypes = this.successHandler(response)
      //    console.log(this.componentTypes);
    });
    this.bloodOnCallService.getBloodGroups().subscribe(response => this.bloodGroups = this.successHandler(response));
    this.nameFlag = false;
    this.genderFlag = false;
    this.ageFlag = false;

    this.getBloodRequests();

    let requestObj = {
      "providerServiceMapID": this.commonAppData.current_service.serviceID
    };
    this._availableServices.getServices(requestObj).subscribe(response => this.servicesSuccessHandler(response));
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    if (this.currentLanguageSet) {
    this.msg = this.currentLanguageSet.yourBloodRequestIsRegisteredIDIs;
    this.msg2 = this.currentLanguageSet.bloodReruirementDetailsCaptured;
    }
    }

  outboundBenDetail: any = [];
  benDataOnBenIDSuccess(resp) {
    this.outboundBenDetail = resp[0];
    this.benDataOutboundPopulating();
  }

  benDataOutboundPopulating() {
    this.firstName = this.outboundBenDetail.firstName;
    this.lastName = this.outboundBenDetail.lastName;
    this.gender = this.outboundBenDetail.m_gender.genderID;
    this.age = this.utilityService.calculateAge(this.outboundBenDetail.dOB);
  }

  bloodBankURL: any;
  BB_url_exists = false;
  getUrlSuccess(res) {
    if (res.institutionID) {
      //  console.log("Blood Bank URL recieved!!");
      this.bloodBankURL = res.website;
      this.BB_url_exists = true;
    }
    else {
      this.bloodBankURL = "";
      this.BB_url_exists = false;
    }
  }

  benDataInboundPopulationg() {
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
      this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
      this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
      this.age = this.utilityService.calculateAge(this.beneficiaryDetails.i_beneficiary.dOB);
    }

    else {

      this.firstName = this.commonAppData.firstName;
      this.lastName = this.commonAppData.lastName;
      this.gender = this.commonAppData.gender;
      this.age = this.commonAppData.age;
      // this.retrieveGenderName(this.commonAppData.gender);

      // debugger;
    }

  }
  // retrieveGenderName(value) {
  //   if(this.commonData.m_genders != undefined)
  //   {
  //   this.genders.filter(function (obj) {
  //     return obj.genderID == value;
  //   })
  //   }
  // }
  services: any = [];
  servicesSuccessHandler(response) {
    this.services = response;
    this.getSubserviceID();
  }

  blood_sub_service_ID: any;
  blood_related_document: any = [];

  populateOutboundDetails(details) {
    this.componentTypeName = details[0].m_componentType.componentType;
    this.bloodGroupName = details[0].m_bloodGroup.bloodGroup;
    this.unitRequired = details[0].unitRequired;

    // this.contactPerson = details[0].bbPersonName;
    // this.designation = details[0].bbPersonDesignation;
    // this.phoneNumber = details[0].bbMobileNo;
    // this.remarks = details[0].remarks;
    // this.address = details[0].bloodBankAddress;
    //let arr = details.requestedBloodBank;
    for (let i = 0; i < details[0].requestedBloodBank.length; i++) {
      (<FormArray>this.bloodBank.get('bloodBankForm')).push(this.fb.group({
        bbPersonName: details[0].requestedBloodBank[i].bbPersonName,
        bbPersonDesignation: details[0].requestedBloodBank[i].bbPersonDesignation,
        bbMobileNo: details[0].requestedBloodBank[i].bbMobileNo,
        bloodBankAddress: details[0].requestedBloodBank[i].bbMobileNo,
        remarks: details[0].requestedBloodBank[i].remarks,
        requestedBloodBankID: details[0].requestedBloodBank[i].requestedBloodBankID  // Used during Outbound only
      }));
    }

    this.dialerNumber = details[0].bbMobileNo ? details[0].bbMobileNo : '';

    this.bloodRequestID = details[0].bloodReqID
    this.requestID = details[0].requestID;
    // "data": [
    //   {
    //     "bloodReqID": 186,
    //     "requestID": "BR/112/07032018/186",
    //     "beneficiaryRegID": 64,
    //     "recipientName": "Sinu",
    //     "recipientAge": 30,
    //     "m_gender": {
    //       "outputMapper": {}
    //     },
    //     "bloodGroupID": 1,
    //     "m_bloodGroup": {
    //       "bloodGroupID": 1,
    //       "bloodGroup": "A+",
    //       "bloodGroupDesc": "A RhD positive (A+)"
    //     },
    //     "m_componentType": {
    //       "componentTypeID": 1,
    //       "componentType": "Plasma"
    //     },
    //     "m_component": {},
    //     "unitRequired": "3",
    //     "hospitalAdmitted": "sdsd",
    //     "m_district": {
    //       "districtID": 112,
    //       "districtName": "BASTAR"
    //     },
    //     "outboundNeeded": 0
    //   }
    // ],
    // "statusCode": 200,
    // "errorMessage": "Success",
    // "status": "Success"

  }

  getSubserviceID() {
    //  console.log(this.services, 'ALL SUB SERVICES');
    for (let k = 0; k < this.services.length; k++) {
      if (this.services[k].subServiceName.toUpperCase() === 'Blood Request'.toUpperCase()) {
        this.blood_sub_service_ID = this.services[k].subServiceID;
        break;
      }
    }

    this.getBloodRelatedDocument(this.blood_sub_service_ID);
  }

  getBloodRelatedDocument(blood_subservice_id) {
    this.bloodOnCallService.getBloodBankUrl(this.providerServiceMapID).subscribe(response => { this.getUrlSuccess(response) });
    this.blood_related_document = [];

    let obj = {
      'providerServiceMapID': this.commonAppData.current_service.serviceID,
      'subServiceID': blood_subservice_id
    }

    this.caseSheetService.getCategories(obj).subscribe((response) => {
      //  console.log(response, 'ALL CATEGORIES IN CASE OF BLOOD RELATION');
      let categoryID = '';
      let subcategoryID = '';

      response.filter(item => {
        if (item.categoryName.toUpperCase() === 'Blood Document'.toUpperCase()) {
          categoryID = item.categoryID;

          this.caseSheetService.getSubCategories(categoryID).subscribe((response) => {
            //  console.log(response, "All Subcategories in Blood Case for category as Blood Document");
            subcategoryID = response[0].subCategoryID;

            // hit api to get document for below mentioned details
            const req_obj = {
              'categoryID': categoryID,
              'subCategoryID': subcategoryID,
              'providerServiceMapID': this.commonAppData.current_service.serviceID
            }

            this.caseSheetService.getDetails(JSON.stringify(req_obj)).subscribe(response => {
              //  console.log(response, 'DOCUMENT FETCHED FOR BLOOD RELATED');
              if (response[0].hasOwnProperty('subCatFilePath')) {
                this.blood_related_document = [];
              }
              else {
                this.blood_related_document = [];
              }

            });

          });
        }
      });

    });
  }

  preventTyping(e: any) {

    if (e.keyCode === 9) {

      return true;

    } else {

      return false;

    }

  }

  getBloodRequests() {

    this.bloodOnCallService.getBloodRequestsByBenID(this.beneficiaryRegID, null).subscribe(response => this.bloodRquestsHistory = this.handleSuccess(response));
  }
  // ui manipulation functions
  disableFlag: boolean = true;
  patientDetailsFields(val: any) {


    //    console.log(val + "sdfd");
    if (val === "self" && this.current_campaign == "INBOUND") {
      this.disablePatientDetails = true;
      this.benDataInboundPopulationg();
      // jQuery('.test').attr('disabled',true);
      this.nameFlag = false;
      this.genderErrFlag = false;
      // jQuery('#firstname').removeClass("field-error");
      this.disableFlag = true;
      this.genderFlag = false;
      this.ageFlag = false;
      this.componentType = "";
      this.bloodgroup = "";
      this.bloodUnits = "";
      this.hospitalName = "";
      this.district = "";
    }
    if (val === "self" && this.current_campaign == "OUTBOUND") {
      this.disableFlag = true;
      this.ageFlag = false;
      this.nameFlag = false;
      this.genderErrFlag = false;
      this.genderFlag = false;
      this.benDataOutboundPopulating()
    }
    if (val === "other") {
      this.disablePatientDetails = false;
      this.firstName = "";
      this.lastName = "";
      this.gender = "";
      this.age = "";
      this.componentType = "";
      this.bloodgroup = "";
      this.bloodUnits = "";
      this.hospitalName = "";
      this.district = "";
      // jQuery('.test').attr('disabled', false);
      this.disableFlag = false;
      this.nameFlag = true;
      this.genderFlag = true;
      this.ageFlag = true;

    }
  }

  reset1() {
    this.Patient_Details_nav = true;
    this.Hospital_Details_nav = false;
    this.Bloodbank_Details_nav = false;
    jQuery("#L1").css("font-weight", "800");
    this.Patient_Details = true;
    this.Hospital_Details = false;
    this.Bloodbank_Details = false;
  }

  reset2() {
    this.Patient_Details_nav = true;
    this.Hospital_Details_nav = true;
    this.Bloodbank_Details_nav = false;
    jQuery("#L1").css("font-weight", "100");
    //  this.Hospital_Details = true;
    this.Patient_Details = false;
    //  this.Bloodbank_Details = false;
  }

  reset3() {
    this.Patient_Details_nav = true;
    this.Hospital_Details_nav = true;
    this.Bloodbank_Details_nav = true;

    this.Bloodbank_Details = true;
    this.Hospital_Details = false;
    this.Patient_Details = false;
  }

  savePatientDetails(values: any, hospitalValues: any) {

    this.patientForm = values;
    this.saveHospitalDetails(hospitalValues);



  }
  backPatientDetails() {
    this.Patient_Details = true;
    this.Hospital_Details = false;
    this.reset1();
  }

  bloodRequestObj: any = {};
  saveHospitalDetails(values: any) {


    let patientDetails = this.patientForm;
    let hospitalDetails = values;
    let dateOfOutbound = "";

    for (let component of this.componentTypes) {
      if (component.componentTypeID == patientDetails.componentType) {
        this.componentTypeName = component.componentType;
      }
    }

    for (let bloodGroup of this.bloodGroups) {
      if (bloodGroup.bloodGroupID == patientDetails.bloodgroup) {
        this.bloodGroupName = bloodGroup.bloodGroup;
      }
    }
    this.unitRequired = patientDetails.bloodUnits ? patientDetails.bloodUnits.trim() : null;

    this.bloodRequestObj = {};
    this.bloodRequestObj.beneficiaryRegID = this.beneficiaryRegID;
    this.bloodRequestObj.recipientName = this.firstName;
    this.bloodRequestObj.recipientAge = this.age;
    //this.bloodRequestObj.recipientGender = this.gender;
    this.bloodRequestObj.recipientGenderID = this.gender;
    this.bloodRequestObj.bloodGroupID = patientDetails.bloodgroup;
    //this.bloodRequestObj.typeOfRequest = patientDetails.typeOfRequest;
    this.bloodRequestObj.componentTypeID = (patientDetails.componentType !== undefined && patientDetails.componentType !== null && patientDetails.componentType !== "") ? patientDetails.componentType : null;
    this.bloodRequestObj.unitRequired = patientDetails.bloodUnits ? patientDetails.bloodUnits.trim() : null;
    //this.bloodRequestObj.componentID = patientDetails.componentID;
    this.bloodRequestObj.hospitalAdmitted = hospitalDetails.HospitalName;
    this.bloodRequestObj.districtID = hospitalDetails.district;
    this.bloodRequestObj.outboundNeeded = hospitalDetails.outboundRequired ? "1" : "0";
    this.bloodRequestObj.bloodBank = hospitalDetails.bloodBank;
    this.bloodRequestObj.mobileNo = hospitalDetails.outboundPhoneNumber;
    this.bloodRequestObj.remarks = hospitalDetails.remarks;
    this.bloodRequestObj.feedback = hospitalDetails.feedback;
    this.bloodRequestObj.deleted = false;
    this.bloodRequestObj.createdBy = this.commonAppData.Userdata.userName;
    this.bloodRequestObj.isSelf = this.disableFlag;
    this.bloodRequestObj.providerServiceMapID = this.commonAppData.current_service.serviceID;
    if (this.commonAppData.benCallID) {
      this.bloodRequestObj.benCallID = this.commonAppData.benCallID;
    }
    else {
      this.bloodRequestObj.benCallID = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }
    this.bloodOnCallService.saveBloodRequest(JSON.stringify(this.bloodRequestObj))
      .subscribe((response) => {
        this.bloodRquest = this.bloodRequestHandler(response)
       
      }, (err) => {
        this.alertMesage.alert(err.status, 'error');
      })

  }
  msg: any;
  bloodRequestHandler(response) {
    this.commonAppData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

    
    // console.log(response, "ffffffffffff");
    if (response.requestID != undefined) {
      this.requestID = response.requestID;
      this.bloodRequestID = response.bloodReqID;
      var message = this.msg +" "+ this.requestID;
      this.alertMesage.alert(message, 'success');

      jQuery("#hospitalDetailForm").trigger("reset");
      jQuery("#patientDetailsForm").trigger("reset");
      this.getBloodRequests();
      this.componentType = "";
      this.bloodgroup = "";
      this.bloodUnits = "";
      this.hospitalName = "";
      this.district = "";
      this.bloodRequestResponse = true;
      this.showBloodRequestForm = false;
      // this.patientDetailsFields("self");
      this.bloodRequestFor = "self";
      this.patientDetailsFields(this.bloodRequestFor);

      this.Hospital_Details = false;
      this.Bloodbank_Details = true;
      this.Bloodbank_Details_nav = true;
      this.reset2();
      this.Patient_Details = false;
      //   this.Hospital_Details = true;
      this.Hospital_Details_nav = true;
    }
    return response;
  }
  data: any = [];
  // altPhNumber: any;  //getting from modal window
  handleSuccess(res) {

    this.data = res;
    return res;
  }
  // genders=[];
  successHandeler(response) {
    // this.genders = response.m_genders;
    return response;



    //     let dialogReff=this.dialog.open(SioBloodOnCallModel, {
    //   height: '300px',
    //   width: '420px',
    //   disableClose:true
    // });
    //   dialogReff.afterClosed().subscribe(result => {
    //   this.altPhNumber = result;

    //   // var idx = jQuery('.carousel-inner div.active').index();
    //   //    jQuery('#myCarousel').carousel(idx + 1);
    //   //     jQuery("#two").parent().find("a").removeClass('active-tab');
    //   //      jQuery("#two").find("a").addClass("active-tab");
    //    });
    //   if(this.altPhNumber == undefined) {
    //     console.log("Registered number will be used"); // Registered number will be used
    //   }
    //   else {

    //     console.log(this.altPhNumber);
    //   }
  }

  successHandler(response) {
    return response;
  }

  showForm() {
    this.componentType = "";
    this.bloodgroup = "";
    this.bloodUnits = "";
    this.hospitalName = "";
    this.district = "";
    this.showTable = false;
    this.showBloodRequestForm = true;
    this.bloodRequestFor = "self";
    this.patientDetailsFields(this.bloodRequestFor);
    this.reset1();
  }

  showHistory() {
    this.showTable = true;
    this.showBloodRequestForm = false;
    this.Hospital_Details = false;
    this.Bloodbank_Details = false;

  }
  setOutboundRequirement(event: any) {
    if (event) {
      this.isOutboundRequired = true;
    }
    else {
      this.isOutboundRequired = false;
    }
  }
  nameFlag: any = true;
  nameInput(value) {
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
      jQuery('#age').addClass("field-error");
    }
  }
  bloodGrpErrFlag: any = false;
  // bloodGrpFlag: any = true;
  bloodGrpchange(value) {
    if (value == '') {
      this.bloodGrpErrFlag = true;
      // this.bloodGrpFlag = true;
    }
    else {
      this.bloodGrpErrFlag = false;
      // this.bloodGrpFlag = false;
    }
  }

  bloodUnitFlag: any = false;
  bloodUnitsDonated(value) {

    if (value == undefined) {
    }
    else if (value > 0) {
      this.bloodUnitFlag = false;
      //   console.log("value > 0");
    }
    else {
      this.bloodUnitFlag = true;
      //  console.log("bloodUnitFlag = true");
    }
  }



  saveBloodDetails(form1, form2) {

    this.bloodOutboundObj = {};
    // this.bloodOutboundObj.bloodReqID = values.bloodReqID;
    this.bloodOutboundObj.requestedBloodBank = form1.bloodBankForm;
    // this.bloodOutboundObj.bloodBankAddress = form1.address;
    // this.bloodOutboundObj.bbPersonName = form1.contactPerson;
    // this.bloodOutboundObj.bbMobileNo = form1.mobileNum;
    // this.bloodOutboundObj.bbPersonDesignation = form1.designation;
    this.bloodOutboundObj.sendSMS = false;
    // this.bloodOutboundObj.remarks = form1.remarks;
    //    this.bloodOutboundObj.feedback = form1.feedback;
    this.bloodOutboundObj.isRequestFulfilled = form2.isRequestFulfilled;
    this.bloodOutboundObj.deleted = false;
    this.bloodOutboundObj.createdBy = this.agentData.userName;
    this.bloodOutboundObj.bloodReqID = this.bloodRequestID;
    this.bloodOutboundObj.requestID = this.requestID;
    if (form2.outboundReq) {
      this.bloodOutboundObj.outboundDate = form2.dateOfOutbound;
      this.bloodOutboundObj.outboundNeeded = true;
    }
    else {
      this.bloodOutboundObj.outboundNeeded = false;
    }
    this.bloodOnCallService.saveBloodRequest(JSON.stringify(this.bloodOutboundObj)).subscribe(response => {
      this.bloodBankSuccessHandler(response);
      if (form2.outboundReq) {
        this.takeFollowUp(form2);
      }
    });


    //TODO: remove here, keep where it is needed
    //this.updateBloodOutboundDetails(this.bloodOutboundRes.bloodOutboundDetailID);


    // this.Bloodbank_Details = false;
    // this.showTable = true;
  }

  takeFollowUp(values) {


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
      "providerServiceMapID": this.providerServiceMapID,
      "isFollowupRequired": true,
      "prefferedDateTime": values.dateOfOutbound,
      "createdBy": this.agentData.userName,
      "requestedFeature": "Blood Request",
      "requestedFor": values.remarks,
      "requestNo": this.requestID,
      "benCallID": id,

    }
    this._callServices.closeCall(obj).subscribe((response) => {
      this.followUpSuccess(response);
    },
      (err) => { console.log(err) });
  }
  followUpSuccess(res) {
    console.log(res);
  }
  msg2: any;
  bloodBankSuccessHandler(res) {
    let numbers = [];
    if (this.current_campaign == 'OUTBOUND') {
      for (let i = 0; i < res.requestedBloodBank.length; i++) {
        if (res.requestedBloodBank[i].bbMobileNo != null) {
          numbers.push(res.requestedBloodBank[i]);
        }
      }
    }
    console.log(numbers);
    this.bloodOutboundRes = res;
    this.commonAppData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

    let dialogReff = this.dialog.open(RegisteredBeneficiaryModal104, {
      // height: '280px',
      width: '420px',
      disableClose: true,
      data: {
        "generatedId": this.msg2,
        "bloodOnCall": "yes",
        "Title": "Success",
        "mobileNumbers": numbers
      }
    });
    dialogReff.afterClosed().subscribe(result => {
      if (result != '' && result != 'close') {
        let alternate_number = result[0];
        this.sendSMS(alternate_number, res);

        if (result[1] && result[2] == undefined) {
          this.sendSMS_to_bloodbank(res);
        }
        else if (result[1] && result[2]) {
          this.sendSMS_to_bloodbank_outbound(res);
        }
      }

    });

    if (this.current_campaign == "INBOUND") {
      this.Bloodbank_Details = false;
      this.showTable = true;
      this.isRequestFulfilled = false;
      //jQuery("#blood_form").trigger("reset");
      let len = this.bloodBank.get('bloodBankForm')['controls'].length;
      for (let i = len; i > 1; i--) {
        (<FormArray>this.bloodBank.get('bloodBankForm')).removeAt(i - 1);
      }
      this.bloodBank.reset({
        bbPersonName: null,
        bbPersonDesignation: null,
        bbMobileNo: null,
        bloodBankAddress: null,
        remarks: null,
        requestedBloodBankID: undefined  // Used during Outbound only
      });
    }
    else {
      // things to do in OUTBOUND
    }

  }
  addInputField() {
    (<FormArray>this.bloodBank.get('bloodBankForm')).push(this.fb.group({
      bbPersonName: null,
      bbPersonDesignation: null,
      bbMobileNo: null,
      bloodBankAddress: null,
      remarks: null,
      requestedBloodBankID: undefined  // Used during Outbound only
    }));
  }
  deleteInputField(index) {
    (<FormArray>this.bloodBank.get('bloodBankForm')).removeAt(index);
  }

  updatebloodOutboundObj: any = {};
  updateBloodOutboundRes: any;
  bloodOutboundRes: any;
  bloodOutboundObj: any = {};
  updateBloodOutboundDetails(bloodOutboundDetailID) {
    //   console.log(bloodOutboundDetailID);
    this.updatebloodOutboundObj = {};
    this.updatebloodOutboundObj.czentrixCallID = "131234";
    this.updatebloodOutboundObj.bloodOutboundDetailID = bloodOutboundDetailID;

    this._OWLService.updateBloodBankDetails(JSON.stringify(this.updatebloodOutboundObj))
      .subscribe((response) => {
        this.alertMesage.alert(this.currentLanguageSet.successfullyAdded, 'success');
        this.updateBloodOutboundRes = response
      }, (err) => {
        this.alertMesage.alert(err.status, 'error');
      });
  }

  // getBloodRequest(bloodReqId:any){
  //   console.log("getBloodRequests: "+this.beneficiaryRegID + " : "+bloodReqId);
  //   this.bloodOnCallService.getBloodRequestsByBenID(this.beneficiaryRegID,bloodReqId).subscribe(response => this.bloodRquest = this.successHandler(response));
  // } 

  sendSMS(alt_number, blood_data) {


    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.commonAppData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined && response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            if (response[i].smsType.toLowerCase() === 'Blood on Call SMS'.toLowerCase()) {
              smsTypeID = response[i].smsTypeID;
              break;
            }
          }
        }

        if (smsTypeID != '') {
          this._smsService.getSMStemplates(this.providerServiceMapID,
            smsTypeID).subscribe(res => {
              if (res != undefined && res.length > 0) {
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
                  for (let z = 0; z < blood_data.requestedBloodBank.length; z++) {
                    let reqObj = {
                      "alternateNo": alt_number,
                      'beneficiaryRegID': this.beneficiaryRegID,
                      "bloodReqID": blood_data.bloodReqID,
                      "createdBy": this.commonAppData.Userdata.userName,
                      "is1097": false,
                      "providerServiceMapID": this.providerServiceMapID,
                      "smsTemplateID": sms_template_id,
                      "requestedBloodBankID": blood_data.requestedBloodBank[z].requestedBloodBankID,
                      "smsTemplateTypeID": smsTypeID
                      // "userID": 0
                    }
                    reqArr.push(reqObj);
                  }
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


  sendSMS_to_bloodbank(data) {
    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.commonAppData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined && response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            if (response[i].smsType.toLowerCase() === 'SMS for Blood Bank'.toLowerCase()) {
              smsTypeID = response[i].smsTypeID;
              break;
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
                  for (let z = 0; z < data.requestedBloodBank.length; z++) {
                    let reqObj = {
                      'beneficiaryRegID': this.beneficiaryRegID,
                      "bloodReqID": data.bloodReqID,
                      "createdBy": this.commonAppData.Userdata.userName,
                      "is1097": false,
                      "providerServiceMapID": this.providerServiceMapID,
                      "smsTemplateID": sms_template_id,
                      "requestedBloodBankID": data.requestedBloodBank[z].requestedBloodBankID,
                      "smsTemplateTypeID": smsTypeID,
                      "isBloodBankSMS": true
                      // "userID": 0
                    }
                    reqArr.push(reqObj);
                  }
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

  sendSMS_to_bloodbank_outbound(data) {
    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.commonAppData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined && response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            if (response[i].smsType.toLowerCase() === 'SMS for Blood Bank'.toLowerCase()) {
              smsTypeID = response[i].smsTypeID;
              break;
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
                  for (let z = 0; z < data.requestedBloodBank.length; z++) {
                    let reqObj = {
                      'beneficiaryRegID': this.beneficiaryRegID,
                      "bloodReqID": data.bloodReqID,
                      "createdBy": this.commonAppData.Userdata.userName,
                      "is1097": false,
                      "providerServiceMapID": this.providerServiceMapID,
                      "smsTemplateID": sms_template_id,
                      "requestedBloodBankID": data.requestedBloodBankID,
                      "smsTemplateTypeID": smsTypeID,
                      "isBloodBankSMS": true
                      // "userID": 0
                    }
                    reqArr.push(reqObj);
                  }
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

  dialBeneficiary() {
    this.commonAppData.avoidingEvent = true;

    this.cz_service.manualDialaNumber(this.commonAppData.agentID, this.callerNumber).subscribe((res) => {
      if (res.status.toLowerCase() === 'fail') {
        this.alertMesage.alert(this.currentLanguageSet.somethingWentWrongInCalling, 'error');
      } else {
        this.showDialBenificiary = false;
        sessionStorage.setItem("onCall", "yes");
        this.outboundService.onCall.next(true);
        this.outBoundOnCall.emit(true);
      }
      console.log('resp', res);
    }, (err) => {
      this.alertMesage.alert(err.errorMessage);
    });
  }

  requestFullfiled(value, form) {
    // if (value) {
    //   for (let i = 0; i < form.bloodBankForm.length; i++) {
    //     if (form.bloodBankForm[i].bbMobileNo != null) {
    //       this.mobileNumbers.push(form.bloodBankForm[i].bbMobileNo);
    //     }
    //   }
    // }
  }

  closeCall() {
    this.cz_service.disconnectCall(this.commonAppData.agentID).subscribe((res) => {
      this.alertMesage.alert(this.currentLanguageSet.callClosedSuccessfully, 'success');
      sessionStorage.removeItem("onCall");
      sessionStorage.removeItem("CLI");
      // sessionStorage.removeItem("session_id");
      this.showDialBenificiary = true;
      this.showDialBlood = true;
      this.outBoundOnCall.emit(false);
      this.outboundService.onCall.next(true);
    }),
      (err) => { this.alertMesage.alert(this.currentLanguageSet.somethingWentWrongInClosing, 'error') }

  }
  ngAfterViewChecked() {
    this.ref.detectChanges();
  }
  dialBloodBank(phn) {
    this.commonAppData.avoidingEvent = true;

    this.cz_service.manualDialaNumber(this.commonAppData.agentID, phn).subscribe((res) => {
      if (res.status.toLowerCase() === 'fail') {
        this.alertMesage.alert(this.currentLanguageSet.somethingWentWrongInCalling, 'error');
      } else {
        this.showDialBlood = false;
        sessionStorage.setItem("onCall", "yes");
        this.outboundService.onCall.next(true);
        this.outBoundOnCall.emit(true);
      }
      console.log('resp', res);
    }, (err) => {
      this.alertMesage.alert(err.errorMessage);
    });
  }
 

  ngOnChanges() {
    if (this.currentLanguageSet) {
      this.msg = this.currentLanguageSet.yourBloodRequestIsRegisteredIDIs;
      this.msg2 = this.currentLanguageSet.bloodReruirementDetailsCaptured;
    }
  }
  mobileLength: any = false;
  mobileNum(value) {
    if (value.length == 10) {
      this.mobileLength = true;
    }
    else {
      this.mobileLength = false;
    }
  }
}
//Sio-blood-on-call Modal window component
//currently not in use...have to remove from multiple places where it is called(commented),import before commenting this.
@Component({
  selector: 'sio-blood-on-call-modal',
  templateUrl: './sio-blood-on-call-modal.html',
})
export class SioBloodOnCallModel {
  currentLanguageSet: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<SioBloodOnCallModel>,
    public getCommonData: dataService,public HttpServices: HttpServices) { }
  altNum: any;
  mobileNumber: any;
  validNumber: any = false;
  mobileLength: any = false;

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
      this.mobileLength = true;
    }
    else {
      this.mobileLength = false;
    }
  }
}