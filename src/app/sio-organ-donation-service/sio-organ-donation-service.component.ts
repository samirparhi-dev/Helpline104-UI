import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { SearchService } from '../services/searchBeneficiaryService/search.service';
import { LocationService } from '../services/common/location.service';
import { OrganDonationServices } from '../services/sioService/organDonationServices.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { UtilityService } from '../services/common/utility.service';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { CoReferralService } from "../services/coService/co_referral.service";
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';

declare var jQuery: any;
import { FeedbackResponseModel } from '../sio-grievience-service/sio-grievience-service.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, } from '@angular/forms';
import { CallServices } from '../services/callservices/callservice.service'
import { NgForm } from '@angular/forms';
import { RegisteredBeneficiaryModal104 } from '../beneficiary-registration-104/beneficiary-registration-104.component';

import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-sio-organ-donation-service',
  templateUrl: './sio-organ-donation-service.component.html',
  styleUrls: ['./sio-organ-donation-service.component.css']
})
export class SioOrganDonationServiceComponent implements OnInit {

  commonData: any;
  genders: Array<any> = [];
  districts:Array<any> = [];
  taluks:Array<any> = [];
  villages:Array<any> = [];
  donationTypes:Array<any> = [];
  donatableOrgans:Array<any> = [];
  beneficiaryDetails: any;
  districtID: any;
  beneficiaryRegID: any;
  showTable: any = true;
  organDonationRequests:Array<any> = [];
  acceptorHospitalID: any;
  data:Array<any> = [];

  states:Array<any> = [];
  blocks:Array<any> = [];
  branches:Array<any> = [];
  directory:Array<any> = [];
  sub_directory:Array<any> = [];
  detailsList:Array<any>= [];
  selected_state: any = "";
  selected_district: any = "";
  selected_taluk: any = "";
  selected_block: any = "";
  selected_branch: any = "";
  selected_directory: any = "";
  selected_sub_directory: any = "";
  agentData: any;
  error_occured: any;
  disableRadio: boolean = false;
  currentCampaign: any;
  outboundRequestID: any;
  organDonationID: any;
  outboundReq: boolean = false;
  dateOfOutbound: any;
  minDate: any;
  organRequired:Array<any> = [];
  outBoundForOrgans: any;
  remarks: any;
  mobileNumber: any;
  altNum: any;
  validNumber: any = false;
  providerServiceMapID: any;

  // hospitalTable: FormGroup = new FormGroup({

  // });
  // hospital: any;
  // hospital : FormArray;
  // hospitals: [];
  // hospitalTable: FormGroup = new FormGroup({});

  // formBuilder: FormBuilder = new FormBuilder();
  hospitalTable = this.fb.group({
    hospitals: this.fb.array([])
  });

  organDonationForm: FormGroup = new FormGroup({
    organDonationArray: new FormArray([])
  });

  @ViewChild('searchHospitalForm') searchHospitalForm: NgForm;
  currentLanguageSet: any;

  constructor(public appSavedData: dataService,
    private _smsService: SmsTemplateService,
    public searchBenData: SearchService,
    private _callServices: CallServices,
    private alertMesage: ConfirmationDialogsService,
    private utilityService: UtilityService,
    public dialog: MdDialog,
    public location: LocationService,
    public _organDonationServices: OrganDonationServices,
    private _userBeneficiaryData: UserBeneficiaryData,
    private _coReferralService: CoReferralService,
    private fb: FormBuilder,
    public HttpServices: HttpServices) {
    this.beneficiaryDetails = this.appSavedData.beneficiaryDataAcrossApp.beneficiaryDetails;
    this.agentData = this.appSavedData.Userdata;
  }


  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.appSavedData.current_service.serviceID;

    this.currentCampaign = this.appSavedData.current_campaign;
    this.outboundRequestID = this.appSavedData.outboundRequestID;

    this._organDonationServices.getOrganDonationTypes().subscribe(response => {
      this.donationTypes = response
    });
    this._organDonationServices.getDonatableOrgans().subscribe(response => this.donatableOrgans = this.generalSuccessHandeler(response));

    this.searchBenData.getCommonData().subscribe(response => this.successHandeler(response));

    this.dateOfOutbound = new Date();
    this.minDate = new Date();

    if (this.appSavedData.current_campaign == 'INBOUND' && this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
      this.benDataInboundPopulationg();
      this.getOrganDonationRequests();
    }
    else if (this.currentCampaign == 'INBOUND' && this.appSavedData.benRegID ) {
      this.beneficiaryRegID = this.appSavedData.benRegID;
      this.benDataInboundPopulationg();
      this.getOrganDonationRequests();
      // this case will execute in hybridHAO case
    } 
    else if (this.appSavedData.current_campaign == 'OUTBOUND') {
      this.showTable = false;
      this.donerDetailsSection = true;

      //  this.showComplaintForm = true;
      let obj = {
        "beneficiaryRegID": this.appSavedData.outboundBenID
      }
      if(this.appSavedData.outboundBenID !=undefined)
      {
        this.searchBenData.retrieveRegHistory(obj)
        .subscribe(response => this.benDataOnBenIDSuccess(response));
      }
      
    }

    let data = {
      "providerServiceMapID": this.appSavedData.current_service.serviceID
    };
    this._userBeneficiaryData.getUserBeneficaryData(data)
      .subscribe(response => this.SetUserBeneficiaryRegistrationData(response));


    //this.location.getDistricts(this.districtID).subscribe(response => this.districts = this.locationSuccessHandeler(response));
    this.nameFlag = false;
    this.genderFlag = false;
    this.ageFlag = false;
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
      this.districtID = this.beneficiaryDetails.i_beneficiary.i_bendemographics.districtID;

    }
    else if (this.appSavedData.benRegID ) {
      this.firstName = this.appSavedData.firstName;
      this.lastName = this.appSavedData.lastName;
      this.gender = this.appSavedData.gender;
      this.age = this.appSavedData.age;
      this.districtID = this.appSavedData.districtID;
      // this case will execute in hybridHAO case
    } 
  }
  benDataOnBenIDSuccess(response) {
    this.firstName = response[0].firstName;
    this.lastName = response[0].lastName;
    this.gender = response[0].m_gender.genderID;
    this.age = this.utilityService.calculateAge(response[0].dOB);
  }

  SetUserBeneficiaryRegistrationData(regData: any) {
    if (regData.states) {
      this.states = regData.states.filter(item => {
        return item.stateID === this.appSavedData.current_stateID_based_on_role;
      });
      this.selected_state = this.appSavedData.current_stateID_based_on_role;
      this.GetDistricts(this.selected_state);
    }
    if (regData.directory) {
      this.directory = regData.directory;
    }
  }

  GetDistricts(state: number) {
    this.districts = [];
    this.taluks = [];
    this.blocks = [];
    this.location.getDistricts(state)
      .subscribe(response => this.SetDistricts(response));
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this.location.getTaluks(district)
      .subscribe(response => this.SetTaluks(response));
    // this._locationService.getSTB( district )
    //   .subscribe( response => this.SetTaluks( response ) );
  }
  SetTaluks(response: any) {
    this.taluks = response;
  }
  GetSDTB(taluk: number) {
    this.blocks = [];
    this.location.getBranches(taluk)
      .subscribe(response => this.SetSDTB(response));
    // this._locationService.getBranch( taluk )
    //   .subscribe( response => this.SetBlocks( response ) );
  }
  SetSDTB(response: any) {
    this.blocks = response;
  }

  GetSubDirectory(directoryID: number) {
    this.location.getSubDirectory(directoryID)
      .subscribe(response => this.SetSubDirectory(response));
  }
  SetSubDirectory(response: any) {
    this.sub_directory = response.subDirectory;
  }

  GetReferralDetails() {
    let benDetails = this.appSavedData.beneficiaryDataAcrossApp.beneficiaryDetails;
    let id
    if (this.appSavedData.benCallID) {
      id = this.appSavedData.benCallID;
    }
    else {
      id = benDetails.benCallID;
      //   console.log("benCallID: " + benDetails.benCallID);
    }
    let data =
      {
        "beneficiaryRegID": this.beneficiaryRegID,
        "benCallID": id,
        "serviceID1097": 1,
        "createdBy": this.agentData.userName,
        "instituteDirectoryID": this.selected_directory,
        "instituteSubDirectoryID": this.selected_sub_directory,
        "stateID": this.selected_state,
        "districtID": this.selected_district
      };

    // this._coReferralService.getDetails(data).subscribe((response) => {
    // this._coReferralService.getDetails(
    //   this.selected_directory, this.selected_sub_directory, this.selected_state, this.selected_district, this.selected_branch,
    //   this.appSavedData.uname, this.beneficiaryRegID, 1, this.beneficiaryDetails.i_beneficiary.benCallID
    // )
    this._coReferralService.getReferralInstituteDetails(data)
      .subscribe((response) => {
        this.SetReferralDetails(response)
      },
      (err) => {
        this.alertMesage.alert(err.status, 'error');
      });
  }

  // init(): FormGroup {
  //   return this.fb.group({
  //     "hospitalName": null,
  //     "address": null,
  //     "state": null,
  //     "district": null,
  //     "contact1": null,
  //     "contactName1": null
  //     })
  // }
  SetReferralDetails(response: any) {

    //  console.log('success referral', response);
    this.detailsList = response;

    // this.hospitalTable = this.fb.group({
    //   hospitals: this.fb.array([])
    // });
    // for (var i = 0; i < response.length; i++) {

    //   (<FormArray>this.hospitalTable.get('hospitals')).push(this.fb.group({
    //     "hospitalName": response[i].institute.institutionName,
    //     "address": response[i].institute.address,
    //     "state": response[i].institute.states.stateName,
    //     "district": response[i].institute.district.districtName,
    //     "contact1": response[i].institute.contactNo1,
    //     "contactName1": response[i].institute.contactPerson1,
    //     "institutionID": response[i].institutionID
    //   }));
    // }
    //     this.hospital = this.fb.array([]);
    //     this.hospital.push(this.init())      

    //     response.forEach((obj, i) => {
    //       this.hospital.at(i).patchValue({
    //         "hospitalName": obj.institute.institutionName,
    //         "address": obj.institute.address,
    //         "state": obj.institute.states.stateName,
    //         "district": obj.institute.district.districtName,
    //         "contact1": obj.institute.contactNo1,
    //         "contactName1": obj.institute.contactPerson1
    //       });
    //       this.hospital.push(this.init())      

    //     });
    // console.log(this.hospitalTable.value);


    //  this.hospitalTable = this.fb.group(this.hospital);

    // console.log(this.hospitalTable.value);

    // this.hospitalSearchResults = true;
    // this.hospitalForm = false;

  }

  showForm() {
    // this.nameFlag = false;
    //   this.ageFlag = false;
      //    jQuery('#firstname').removeClass("field-error");
      //this.disableFlag = true;
      //this.genderFlag = false;
      this.organ = [];
      this.donationType = "";
      this.outBoundForOrgans = [];
      this.outboundReq = false;
      this.dateOfOutbound=new Date();
      this.remarks = "";
      this.requestFor='self';
     this.populateForm(this.requestFor);
    this.showTable = false;
    this.donerDetailsSection = true;
    this.organDonation = false;
  }

  showHistory() {

    this.showTable = true;
    this.donerDetailsSection = false;
    this.hospitalForm = false;
    this.hospitalSearchResults = false;
    this.getOrganDonationRequests();
    this.searchHospitalForm.reset();
  }
  getOrganDonationRequests() {

    let tempData = '{"beneficiaryRegID":"' + this.beneficiaryRegID + '"}';
    this._organDonationServices.getOrganDonationHistoryByBenID(tempData).subscribe(response => this.organSuccessHandeler(response));

  }

  organSuccessHandeler(response) {
    // console.log("organ", response);

    if (response instanceof Array)
      this.data = response;

  }

  firstName: any;
  lastName: any;
  gender: any;
  age: any;

  donationType: any;
  organ: any = [];
  district: any;
  taluk: any;
  city_village: any;
  requestFor: any = "self";

  donerDetailsSection: boolean = false;
  organDonation: boolean = false;
  hospitalForm: boolean = false;
  hospitalSearchResults: boolean = false;

  label1: boolean = true;
  label2: boolean = false;
  label3: boolean = false;

  idGenerated: boolean = false;
  disableFlag: boolean = true;
  //  populating form on the basis of request for self or not
  populateForm(value: any) {
    //  console.log(value);
    if (value === 'self') {
      jQuery('.self').attr('disabled', true);

      this.benDataInboundPopulationg();

      this.nameFlag = false;
      this.ageFlag = false;
      //    jQuery('#firstname').removeClass("field-error");
      this.disableFlag = true;
      this.genderFlag = false;
      this.donationType = "";
      this.outboundReq = false;
      this.remarks = "";
      
      this.organ = [];
    }
    else {
      //jQuery('.self').attr('disabled', false);
      this.firstName = "";
      this.lastName = "";
      this.gender = "";
      this.age = "";
      this.ageFlag = true;
      this.nameFlag = true;
      this.genderFlag = true;
      this.disableFlag = false;
      this.organDonation = false;
      this.donationType = "";
      this.outboundReq = false;
      this.remarks = "";
      
    }

  }
  typeOfDonation(value: any, i) {
    //  console.log(value, "type of donation");
    if (value == '1') {
      this.organDonation = true;
      this.organTypeFlag = true;         // from organType()   (validate)
      if (this.currentCampaign == 'OUTBOUND') {
        (<FormArray>this.organDonationForm.get('organDonationArray')).controls[i].patchValue({
          donatableOrganID: ''
        });
        (<FormArray>this.organDonationForm.controls['organDonationArray']).controls[i].setValidators([Validators.required]);

        //  (<FormArray>this.organDonationForm.get('organDonationArray')).controls[i].setValidators([Validators.required]);
        //  (<FormArray>this.organDonationForm.get('organDonationArray')).controls[i].updateValueAndValidity();
        //   let arr = [];
        //   res.forEach(function (val) {
        //     arr.push(val.m_donatableOrgan.donatableOrganID)
        //   });
        //   this.organ = arr.slice();
        //   console.log(this.organ);
        //   if (this.organDonationID.length > 0) {
        //     this.organTypeFlag = false;
        //   }
      }
    }
    else {
      this.organDonation = false;
      this.organTypeFlag = false;         // from organType()   (validate)
      if (this.currentCampaign == 'OUTBOUND') {
        (<FormArray>this.organDonationForm.get('organDonationArray')).controls[i].patchValue({
          donatableOrganID: "null",//this null in " " is written intentionally to make some validation work
        });

        // (<FormArray>this.organDonationForm.get('organDonationArray')).controls[i].clearValidators();
        // (<FormArray>this.organDonationForm.get('organDonationArray')).controls[i].updateValueAndValidity();



      }
    }
  }

  organDonationObject: any = {};
  organDonationRequestObject: any = {};

  organTypeFlag: any = true;
  organType(value: any) {
    // this.organRequired = [];
    // let arr = [];
    // this.donatableOrgans.filter(function (obj) {
    //   value.forEach(function (val) {
    //     if (obj.donatableOrganID == val)
    //       arr.push(obj)
    //   });
    // });

    // console.log(arr);
    //  console.log(value);
    if (value.length == 0) {
      this.organTypeFlag = true;
    }
    else {
      this.organTypeFlag = false;

    }
    // this.outBoundForOrgans = arr.slice(0);
    // console.log(this.outBoundForOrgans);
  }
  // capturing of doner details and registering(creating donation id)
  donerDetails: any = {};
  showHospitalForm(doner_details_obj) {


    //   this.hospitalForm = true;

    this.label1 = true;
    this.label2 = true;
    this.label3 = false;

    this.donerDetails = doner_details_obj;
    this.organDonationObject = {};
    this.organDonationObject.t_organDonations = [];

    let lastName = this.lastName ? this.lastName : "";

    let benCALLid: any;
    if (this.appSavedData.benCallID) {
      benCALLid = this.appSavedData.benCallID;
    }
    else {
      benCALLid = this.appSavedData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }


    if (this.organ.length > 0) {
      //let OOID
      if (this.currentCampaign == 'OUTBOUND') {
        var ODID = this.organDonationID
        var rID = this.outboundRequestID;
      }
      for (let i = 0; i < this.organ.length; i++) {
        //  console.log(this.organ[i]);
        this.organDonationObject.t_organDonations[i] = {
          'donatableOrganID': this.organ[i],
          'beneficiaryRegID': this.beneficiaryRegID,
          'donarName': this.firstName + " " + lastName,
          'donarAge': this.age,
          'donarGenderID': this.gender,
          'donationTypeID': this.donationType,
          'acceptorHospitalID': this.acceptorHospitalID,
          'deleted': false,
          'createdBy': this.agentData.userName,
          'districtID': this.districtID,
          'isSelf': this.disableFlag,
          'providerServiceMapID': this.appSavedData.current_service.serviceID,
          'benCallID': benCALLid,
          'organDonationID': ODID, //will go only in OUTBOUND
          'requestID': rID, //will go only in OUTBOUND
          'remarks': this.remarks ? this.remarks.trim() : null
        }
      }
    } else {
      this.organDonationObject.t_organDonations[0] = {
        'beneficiaryRegID': this.beneficiaryRegID,
        'donarName': this.firstName + " " + lastName,
        'donarAge': this.age,
        'donarGenderID': this.gender,
        'donationTypeID': this.donationType,
        'acceptorHospitalID': this.acceptorHospitalID,
        'deleted': false,
        'createdBy': this.agentData.userName,
        'districtID': this.districtID,
        'isSelf': this.disableFlag,
        'providerServiceMapID': this.appSavedData.current_service.serviceID,
        'benCallID': benCALLid,
        'organDonationID': ODID, //will go only in OUTBOUND
        'requestID': rID, //will go only in OUTBOUND
        'remarks': this.remarks ? this.remarks.trim() : null
      }
    }
    this.createOrganDonationRequest(this.organDonationObject, doner_details_obj);   //calling the function to register a doner request


  }


  // searching of hospitals on the basis of location details 
  locationDetails: any = {};
  searchHospital(location_details_obj) {
    this.hospitalSearchResults = true;
    this.hospitalForm = false;

    this.label1 = true;
    this.label2 = true;
    this.label3 = true;

    this.locationDetails = location_details_obj;
    //  console.log("the doner details are :", this.donerDetails, "and the location details are :", this.locationDetails);
  }


  // function for navigation via speedlinks on top of component eg: (one)/(two)/(three)
  jumpTo(value: any) {
    if (value == 1) {
      this.donerDetailsSection = true;
      this.organDonation = false;
      this.hospitalForm = false;
      this.hospitalSearchResults = false;
      // this.label1 = true;
      // this.label2 = false;
      // this.label3 = false;
      jQuery("#L1").css("font-weight", "800");
      jQuery("#L2").css("font-weight", "100");
      jQuery("#L3").css("font-weight", "100");
    }
    if (value == 2) {
      this.donerDetailsSection = false;
      this.organDonation = false;
      this.hospitalForm = true;
      this.hospitalSearchResults = false;
      jQuery("#L1").css("font-weight", "100");
      jQuery("#L2").css("font-weight", "800");
      // jQuery("#L3").css("font-weight", "100");
      // this.label1 = false;
      // this.label2 = true;
      // this.label3 = false;
    }
    if (value == 3) {
      // this.donerDetailsSection = false;
      // this.organDonation = false;
      // this.hospitalForm = false;
      this.hospitalSearchResults = true;
      // jQuery("#L1").css("font-weight", "100");
      // jQuery("#L2").css("font-weight", "100");
      jQuery("#L3").css("font-weight", "800");

      // this.label1 = true;
      // this.label2 = true;
      // this.label3 = true;
    }
  }

  institutes = [];
  outboundHospitals(institutes) {
    this.donerDetailsSection = false;
    this.organDonation = false;
    this.hospitalForm = false;
    this.hospitalSearchResults = true;
    jQuery("#L1").css("font-weight", "100");
    jQuery("#L2").css("font-weight", "100");
    jQuery("#L3").css("font-weight", "800");
    this.institutes = [];
    this.institutes.push(institutes);

  }
  // location fetching functions 
  getTaluks(district: any) {
    this.location.getTaluks(district).subscribe(response => this.taluks = this.locationSuccessHandeler(response));
  }

  getVillages(id: any) {
    this.location.getBranches(id).subscribe(response => this.villages = this.locationSuccessHandeler(response));
  }


  // creating organ donation request
  createOrganDonationRequest(object: any, organDetails) {
    this._organDonationServices.saveOrganDonationRequest(object)
      .subscribe((response) => {
        if (this.outboundReq) {
          this.takeFollowUp(organDetails, response);
        }
        this.handleOrganRequestSuccess(response)
      }, (err) => {

        this.alertMesage.alert(err.status, 'error');
      });
  }
  takeFollowUp(values, response) {
    // let arr = [];
    // response.filter(function (obj) {
    //   values.organRequired.forEach(function (val) {
    //     if (obj.donatableOrganID == val)
    //       arr.push(obj.requestID)
    //   });
    // });
    // for(let i=0; i<arr.length; i++){
    //   this.sendFollowUpRequest(values,arr[i]);
    // }
    this.sendFollowUpRequest(values, response[0].requestID)
  }
  sendFollowUpRequest(values, requestID) {
    let benDetails = this.appSavedData.beneficiaryDataAcrossApp.beneficiaryDetails;
    let id
    if (this.appSavedData.benCallID) {
      id = this.appSavedData.benCallID;
    }
    else {
      id = benDetails.benCallID;
      //   console.log("benCallID: " + benDetails.benCallID);
    }
    let obj = {
      "endCall": false,
      "beneficiaryRegID": this.beneficiaryRegID,
      "providerServiceMapID": this.appSavedData.current_service.serviceID,
      "isFollowupRequired": true,
      "prefferedDateTime": values.dateOfOutbound,
      "createdBy": this.agentData.userName,
      "requestedFeature": "Organ Donation",
      "requestedFor": values.remarks,
      "requestNo": requestID,
      "benCallID": id,

    }
    console.log(obj);
    this._callServices.closeCall(obj).subscribe((response) => { this.followUpSuccess(response) },
      (err) => {
        console.log(err)
        this.alertMesage.alert(this.currentLanguageSet.errorWhileTakingFollowUpInFoodSafety, 'error')
      });
  }
  followUpSuccess(res) {
    console.log(res);
  }
  msg: any;
  organDonationIDs: any = [];
  handleOrganRequestSuccess(response) {

    if (response[0].organDonationID != undefined) {

      for (let i = 0; i < response.length; i++) {
        this.organDonationIDs[i] = response[i].organDonationID;
      }
    }

    if (this.currentCampaign == 'INBOUND') {
      this.alertMesage.alert(this.currentLanguageSet.registeredSuccessfullyOrganDonationID + " " + this.organDonationIDs, 'success');
      this.getOrganDonationRequests();
      //this.disableRadio = true;
      this.appSavedData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page
      this.donerDetailsSection = false;
      //    this.showTable = true;
      this.hospitalForm = true;
      this.organ = [];
      this.donationType = "";
      this.outBoundForOrgans = [];
      this.outboundReq = false;
      this.remarks = "";
      
      // this.organDonationForm.reset();
      this.requestFor = "self";
      this.populateForm(this.requestFor);
    }
    else {
      this.alertMesage.alert(this.currentLanguageSet.organDonationUpdatedSuccessfully +" "+ this.organDonationIDs, 'success');
      this.getFoodSafetyOutboundHistory();
    }

    if (response.statusCode == 5000) {

      this.alertMesage.alert(this.currentLanguageSet.errorOccurred, 'error');
    }
  }

  // different success handelers
  successHandeler(response) {
    this.commonData = response;
    this.genders = response.m_genders;
    // console.log(this.commonData, "commondata", this.genders);
    if (this.currentCampaign == 'OUTBOUND') {
      this.appSavedData.serviceAvailed.next(true); // no need to avail any service in OUTBOUND, so sending true
      this.getFoodSafetyOutboundHistory();
    }
  }

  getFoodSafetyOutboundHistory() {
    this._organDonationServices.getOrganDonationHistoryByBenID({ "beneficiaryRegID": this.appSavedData.outboundBenID }).subscribe(res => this.outboundHistorySuccess(res),
      (err) => {
        this.alertMesage.alert(this.currentLanguageSet.errorInFetchingOrganDonationHistory, 'error');
      });
  }

  outboundHistorySuccess(res) {
    // this.organDonationID = res[0].organDonationID;
    // this.donationType = res[0].m_donationType.donationTypeID;
    // this.typeOfDonation(res[0].m_donationType.donationTypeID, res);
    // this.remarks = res[0].remarks ? res[0].remarks : "";

    for (let i = 0; i < res.length; i++) {
      (<FormArray>this.organDonationForm.get('organDonationArray')).push(this.fb.group({

        donationTypeID: res[i].m_donationType.donationTypeID,
        donatableOrganID: res[i].m_donationType.donationTypeID == 1 ? res[i].m_donatableOrgan.donatableOrganID : 'null', //null in "" is intentionally written
        requestID: res[i].requestID,
        remarks: res[i].remarks,
        requestedInstitution: [res[i].requestedInstitution.length > 0 ? res[i].requestedInstitution : null],

        beneficiaryRegID: res[i].beneficiaryRegID,
        donarAge: res[i].donarAge,
        donarName: res[i].donarName,
        organDonationID: res[i].organDonationID,
        m_gender: res[i].m_gender
      }));
    }

  }

  updateOrganOutbound(values) {
    console.log(values);
    let obj = {
      beneficiaryRegID: values.beneficiaryRegID,
      donarAge: values.donarAge,
      donarName: values.donarName,

      // m_donatableOrgan:  values.donatableOrganID != 'null' ? { "donatableOrganID": values.donatableOrganID } : undefined,
      // m_donationType: { "donationTypeID": values.donationTypeID },
      donatableOrganID: values.donatableOrganID!='null'?values.donatableOrganID:undefined,
      donationTypeID: values.donationTypeID,
      // m_gender: values.m_gender,
      organDonationID: values.organDonationID,
      remarks: values.remarks != null ? values.remarks : undefined,
      requestID: values.requestID,

      requestedInstitution: values.requestedInstitution != null ? values.requestedInstitution : []
    }
    console.log(obj);
    this._organDonationServices.updateOrganDonationRequest(obj).subscribe(res => {
      this.alertMesage.alert(this.currentLanguageSet.updatedSuccessfully,'success');
    },
      (err) => {
        this.alertMesage.alert(this.currentLanguageSet.errorWhileUpdating, 'error');
      })
  }

  locationSuccessHandeler(response) {
    console.log(response, "location response");
    return response;
  }

  generalSuccessHandeler(response) {
    // let arr=[];
    // this.donatableOrgans.filter(function (obj) {
    //    this.organ.forEach(function (val) {
    //      if(obj.donatableOrganID == val)
    //      arr.push(obj)
    //   });
    // });
    // this.outBoundForOrgans = arr.slice(0);
    //  console.log('response is ', response);

    return response;
  }
  nameFlag: any = true;
  nameInput(value) {
    //  console.log(value.length);
    if (value.length >= 3 && value.length <= 24) {
      this.nameFlag = false;
      //  jQuery('#firstname').removeClass("field-error");
    }
    else {
      this.nameFlag = true;
      //  jQuery('#firstname').addClass("field-error");
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
      // jQuery('#age').removeClass("field-error");
    }
    else {
      this.ageFlag = true;
      // jQuery('#age').addClass("field-error");
    }
  }
  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    }
    else {
      this.validNumber = false;
    }
  }

  selectedHospitals: any = [];
  index_array: any = [];
  onCheck(event, obj, index) {
    console.log(event);
    if (event.target.checked == true) {
      this.selectedHospitals.push(obj);
      this.index_array.push(index);
    } else if (event.target.checked == false) {
      this.selectedHospitals.splice(this.index_array.indexOf(index), 1);
      this.index_array.splice(this.index_array.indexOf(index), 1);
    }
  }

  sendSMS(alt_number) {
    let arr = [];

    for (let i = 0; i < this.selectedHospitals.length; i++) {
      arr.push({ "institutionID": this.selectedHospitals[i].institutionID });
    }
    let obj = {
      "organDonationID": this.organDonationIDs[0],
      "createdBy": this.agentData.userName,
      "requestedInstitution": arr
    }
    this._organDonationServices.savingOrganDonationInstitution(obj).subscribe(response => this.institutionSuccess(response, arr, alt_number),
      (err) => {
        this.alertMesage.alert(this.currentLanguageSet.ErrorWhileSavingInstitutions, "error");
      });

  }
  institutionSuccess(res, array, alt_number) {
    // send sms code to be written
    console.log(res);
    this.SMS(alt_number, res);

  }

  SMS(alternate_number, organObject) {
    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.appSavedData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (response[i].smsType.toLowerCase() === 'Organ Donation SMS'.toLowerCase()) {
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
                  for (let z = 0; z < organObject.requestedInstitution.length; z++) {
                    let reqObj = {
                      "alternateNo": alternate_number,
                      'beneficiaryRegID': this.beneficiaryRegID,
                      "organDonationID": organObject.organDonationID,
                      "requestedInstitutionID": organObject.requestedInstitution[z].requestedInstitutionID,
                      "createdBy": this.appSavedData.Userdata.userName,
                      "is1097": false,
                      "providerServiceMapID": this.providerServiceMapID,
                      "smsTemplateID": sms_template_id,
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

 
  ngOnChanges() {
    // if (this.currentLanguageSet) {
    //   this.msg = this.currentLanguageSet.registeredSuccessfullyOrganDonationID;
    //   this.error_occured = this.currentLanguageSet.errorOccurred;
    // }
  }

}
//No longer in use...
@Component({
  selector: 'sio-organ-modal',
  templateUrl: './sio-organ-donation-modal.html',
})
export class SioOrganDonationModal {
  currentLanguageSet: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<SioOrganDonationModal>,
    public HttpServices: HttpServices) { }

    
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

}
