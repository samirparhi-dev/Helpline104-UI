import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { dataService } from 'app/services/dataService/data.service';
import { UserBeneficiaryData } from 'app/services/common/userbeneficiarydata.service';
import { LocationService } from 'app/services/common/location.service';
import { CoFeedbackService } from 'app/services/coService/co_feedback.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { BalVivahServiceService } from 'app/services/sioService/bal-vivah-service.service';
import { AnimationMetadataType } from '@angular/core/src/animation/dsl';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-hao-imr-mmr-information',
  templateUrl: './hao-imr-mmr-information.component.html',
  styleUrls: ['./hao-imr-mmr-information.component.css']
})
export class HaoImrMmrInformationComponent implements OnInit {
  @ViewChild('imrmmrForm') imrmmrForm: NgForm;
  @Input() current_language: any;
  current_language_set: any;
  state: any;
  districts: Array<any> = [];
  taluks: Array<any> = [];
  blocks: Array<any> = [];
  temp_districts_array: Array<object> = [];

  informerDistricts: Array<any> = [];
  informerTaluks: Array<any> = [];
  informerBlocks: Array<any> = [];
  temp_informer_districts_array: Array<object> = [];

  district: any;
  taluk: any;
  village: any = null;
  relationShips: any = [];
  maxDate: Date;
  refDate: Date;
  count: string;
  reasonofDeath: any = null;
  deliveryTypes: any = ["Normal", "C-Section"]
  facilites: any = []
  supportServiceArray: any = []

  isMRFlag: string;
  supportArray: any = [];
  suuportArrayID: any = [];
  disabledeliveryFlag: boolean = false;
  enabledeliveryDaysFlag: boolean = false;
  enableHealthFlag: boolean = false;
  disablePregnancyFlag: boolean = false;
  duringPreg: any = null;
  duringDelivery: any = null;
  noofDelivery: any = null;
  daysOfDelivery: any = null;
  abovedaysOfDelivery: any = null;
  is_Imr_Mmr: string;
  mobileNumber: any = null;
  facility: any = null;
  duringTransit: any = null;
  TypeOfDelivery: any = null;
  facilityname: any = null;
  supportArrayID: any = [];
  providerserviceMapID: any;
  age: any;
  // relationshipTypeID:any;
  victimName: any;
  showTableCondition: boolean = true;
  showFormCondition: boolean = false;
  searchType: any = "Death ID";
  benficiaryRegId: any;
  beneficiaryDetails: any;
  benCallID: any;
  filteredIMRMMRList: any;
  filterTerm: any;
  minLength: number = 1;
  maxLength: number = 30;
  data: any = [];
  feedbacksArray: any = [];
  viewALL: any = true;
  showUpdateCondition: boolean = false;
  deathrecord: any;
  disableUpdate: boolean = false;
  victimFatherName: any;
  victimMotherName: any;
  // ageMessage: string;
  deliveryMessage: string;
  phonenMaxlength: string;
  transitType: any = null;
  baseCommunity: any = null;
  supportServicesEdit: any;
  supportServiceArrayList: any = [];
  supportServicesOptions: any = [];
  seleservice: any;
  masterdata: any;
  relativephonenMaxlength: string;
  ImrMmrID: any;
  selectedRequestID: any;
  victimVillage: any;
  addInformerDetails: Boolean = true;
  radioOptions = "Yes";
  radioOptions1= "No";
  currentLanguageSet: any;
  constructor(public commonAppData: dataService, private _userBeneficiaryData: UserBeneficiaryData,
     private _locationService: LocationService, private _coFeedbackService: CoFeedbackService,
      private alertMesage: ConfirmationDialogsService,
       private alertMessage: ConfirmationDialogsService, private balVivahService: BalVivahServiceService, public httpServices: HttpServices) {
    this.beneficiaryDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    //	console.log("beneficiaryDetails: " + JSON.stringify(this.beneficiaryDetails));
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.benficiaryRegId = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
      this.benCallID = this.beneficiaryDetails.benCallID;
    }
    else if (this.commonAppData.benRegID) {
      this.benficiaryRegId = this.commonAppData.benRegID;
    }
  }
  transitTypeArray: any = [];
  baseCommunityArray: any = [];
  communityBase: any = null;
  govtID: any = [];
  healthList: any = [];
  informerCategory: any;
  selectedCategory: any = null;
  informerName: any;
  informerMobileNumber: any;
  informerDistrictid: any;
  informerTalukid: any;
  informerVillageid: any = null;
  identityType: any = null;
  informerAddress: any;
  informerIdNo: any = null;
  victimAddress: any = null;


  ngOnChanges() {
    if (this.current_language) {
      this.current_language_set = this.current_language;

    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
 
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  ngOnInit() {
    this.assignSelectedLanguage();
    let obj = {
      "beneficiaryRegID": this.benficiaryRegId
    }
    this.getIMRMMRWorklist(obj);
    this.is_Imr_Mmr = "CDR";
    //this.checkImrMmr(this.is_Imr_Mmr);
    this.isMRFlag = "CDR";
    this.informerCategory = "Asha/Sahiya";
    this.duringPreg = "No";
    this.refDate = new Date;
    this.maxDate = new Date;
    this.initialized();

    this.getfacilitySupportServices();
    this.getGovtID();
  }



  checkMobNumberLength(phoneNumber) {
    // if (phoneNumber.slice(0, 1) == "0") {
    //   this.phonenMaxlength = '11';
    // } else
    if (phoneNumber.slice(0, 2) == "91") {
      this.phonenMaxlength = '12';
    } else {
      this.phonenMaxlength = '10';
    }
  }

  checkRelativeMobNumberLength(phoneNumber) {
    // if (phoneNumber.slice(0, 1) == "0") {
    //   this.phonenMaxlength = '11';
    // } else
    if (phoneNumber.slice(0, 2) == "91") {
      this.relativephonenMaxlength = '12';
    } else {
      this.relativephonenMaxlength = '10';
    }
  }





  // allow: any="";
  // error: any="";
  // maximumLength: any=0;
  // pattern: any="";
  // patternError: any="";
  // validateInformerID(idType)
  // {
  //   switch(idType) { 
  //     case "Aadhar": { 
  //       this.allow="number";
  //       this.error="Enter 12 digit Aadhar Number";
  //       this.patternError="Enter valid Aadhar Number";
  //       this.maximumLength=12;
  //       this.pattern= "/^\d{4}\d{4}\d{4}$/";
  //        break; 
  //     } 
  //     case "Voter ID": { 
  //       this.allow="alphanumeric";
  //       this.error="Enter 12 Character Voter ID";
  //       this.patternError="Enter valid Voter ID";
  //       this.maximumLength=12;
  //       this.pattern= "/^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/";
  //        break; 
  //     } 
  //     default: { 
  //       this.allow="alphanumeric";
  //       // this.error="";
  //       // this.maximumLength=12;
  //       this.pattern= /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
  //        break; 
  //     } 
  //  } 
  // }

  idMaxValue: any;
  idMinValue: any;
  patternID: any;
  idErrorText: string;
  // tempIDtype: any = "";
  validateID(idType: any) {

    // if(idType.identityType == 'Aadhar') {
    // 	this.tempIDtype = 'Aadhar';
    // }
    // console.log(this.tempIDtype);
    this.informerIdNo = null;

    switch (idType) {
      case "Aadhar":
        {
          this.idMaxValue = '12';
          this.idMinValue = '12';
          this.patternID = /^\d{4}\d{4}\d{4}$/;
          this.idErrorText = this.currentLanguageSet.enterValidAadharNumber;
          break;
        }
      case "Voter ID":
        {
          this.idMaxValue = '15';
          this.idMinValue = '15';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = this.currentLanguageSet.enterValidVoterIdAlphanumericMinLetters;
          break;

        }
      case "Driving License":
        {
          this.idMaxValue = '15';
          this.idMinValue = '15';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = this.currentLanguageSet.enterValidDrivingLicenceAlphanumeric;
          break;
        }
      case "PAN":
        {
          this.idMaxValue = '10';
          this.idMinValue = '10';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = this.currentLanguageSet.enterValidPanAlphanumericMinLetters;
          break;
        }
      case "Passport":
        {
          this.idMaxValue = '8';
          this.idMinValue = '8';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = this.currentLanguageSet.enterValidPassportNoAlphanumeric;
          break;
        }
      case "Ration Card":
        {
          this.idMaxValue = '10';
          this.idMinValue = '10';
          this.patternID = /^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*$/;
          this.idErrorText = this.currentLanguageSet.enterValidRationNoExAlphanumeric;
          break;
        }
      default:
        this.idMaxValue = '50';
        this.idMinValue = '5';
        this.patternID = null;
        this.idErrorText = this.currentLanguageSet.enterValidIdNumber;
        break;
    }
  }
  deliveryFlag: any = true;
  validateNoOfDelivery(value) {

    if (value == undefined) {
    }
    else if (value >= 1 && value <= 20) {
      this.deliveryFlag = false;

    }
    else {
      this.deliveryFlag = true;
      this.deliveryMessage = this.currentLanguageSet.pleaseEnterAValidDeliveryNumberBetween1To20;

    }

  }

  getIMRMMRWorklist(obj) {
    this._coFeedbackService.getIMRMMRWorklist(obj).subscribe(response => this.IMRMMRHistorySuccesshandeler(response.data));
  }
  IMRMMRHistorySuccesshandeler(response) {
    //	console.log('the epidemic response is', response);
    // this.epidemicOutbreaksArray = response;
    this.setTableArray(response);
  }
  setTableArray(data) {
    this.data = data;
    this.filteredIMRMMRList = data;
  }
  showTable() {
    this.showFormCondition = false;
    this.addInformerDetails = true;
    this.showTableCondition = true;
    this.filterTerm = "";
    this.viewALL = true;
    this.searchType = "Death ID";
    this.showUpdateCondition = false;
    this.revertFullTable();
    this.successhandler();
  }
  showForm() {
    
    this.addInformerDetails = true;
    this.showFormCondition = true;
    this.showTableCondition = false;
    this.filterTerm = "";
    this.viewALL = true;
    this.searchType = "Death ID";
    this.showUpdateCondition = false;
    this.is_Imr_Mmr = "CDR";
    this.isMRFlag = "CDR";
    this.createSuportServicesOptions(this.masterdata);
  }
  showEditForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
    this.filterTerm = "";
    this.viewALL = true;
    this.searchType = "Death ID";
    this.showUpdateCondition = true;
    //this.successhandler();
  }

  onSearchChange(type) {
    if (type === 'Mobile Number') {
      this.minLength = 10;
      this.maxLength = 10;
    }
    else {
      this.minLength = 1;
      this.maxLength = 30;
    }
  }

  filterIMRMMRList(searchTerm: string) {
    if (!searchTerm)
      this.filteredIMRMMRList = this.data;
    else {
      let object = {
        "phoneNum": this.searchType == 'Mobile Number' ? searchTerm : null,
        "requestID": this.searchType == 'Death ID' ? searchTerm : null
      };
      console.log(JSON.stringify(object));
      this.filteredIMRMMRList = [];
      this.viewALL = false;
      this._coFeedbackService.getIMRMMRWorklist(object).subscribe((res) => {
        this.filteredIMRMMRList = res.data;
      });
    }
  }
  revertFullTable() {
    this.filterTerm = "";
    this.viewALL = true;
    this.searchType = "Death ID";
    this.minLength = 1;
    this.maxLength = 30;
    // let data = '{"beneficiaryRegID":"' + this.benficiaryRegId + '"}';
    let obj = {
      "beneficiaryRegID": this.benficiaryRegId
    }
    this.getIMRMMRWorklist(obj);
  }
  selectBeneficiary(infoImrMmr: any) {
   
    console.log("infoImrMmr: " + JSON.stringify(infoImrMmr));
    this.populateImrMmrInformation(infoImrMmr);
  }
  populateImrMmrInformation(infoImrMmr) {
    this.showEditForm();
    this.addInformerDetails = false;
    this.GetInformerTaluks(infoImrMmr.informerDistrictid);
    this.GetInformerBlocks(infoImrMmr.informerTalukid);
    this.GetTaluksEdit(infoImrMmr.victimDistrict);
    this.GetBlocksEdit(infoImrMmr.victimTaluk);
    this.is_Imr_Mmr = infoImrMmr.typeOfInfromation;
    this.isMRFlag = infoImrMmr.typeOfInfromation;
    this.informerCategory = infoImrMmr.informerCategory;
    this.enableHealthFlag = infoImrMmr.informerCategory == "Health Worker" ? true : false;
    this.selectedCategory = infoImrMmr.selectedCategory;
    this.informerName = infoImrMmr.informerName
    this.informerMobileNumber = infoImrMmr.informerMobileNumber;
    this.informerDistrictid = infoImrMmr.informerDistrictid;

    this.informerTalukid = infoImrMmr.informerTalukid;

    this.informerVillageid = infoImrMmr.informerVillageid;
    this.informerAddress = infoImrMmr.informerAddress;
    this.identityType = infoImrMmr.identityType;
    this.informerIdNo = infoImrMmr.informerIdNo;
    this.victimName = infoImrMmr.victimName;
    this.age = infoImrMmr.victimAge;
    this.district = infoImrMmr.victimDistrict;

    this.taluk = infoImrMmr.victimTaluk;

    console.log("test", this.blocks);

    this.victimVillage = infoImrMmr.victimVillage;
    this.victimAddress = infoImrMmr.victimAddress;
    this.mobileNumber = infoImrMmr.relativeMobileNumber;
    // this.relationshipTypeID = infoImrMmr.relationshipType;
    this.refDate = infoImrMmr.referenceDate;
    this.reasonofDeath = infoImrMmr.reasonOfDeath;
    this.duringPreg = infoImrMmr.duringPregnancy;
    this.duringDelivery = infoImrMmr.duringDelivery;
    this.checkduringDeliv(this.duringDelivery);
    this.daysOfDelivery = infoImrMmr.within42daysOfDelivery;
    this.abovedaysOfDelivery = infoImrMmr.above42daysOfDelivery;
    this.noofDelivery = infoImrMmr.noofDelivery;
    // this.facility = Object.assign({} , {"facilityID" : infoImrMmr.facilityID, "facilityName" : infoImrMmr.facilityName});

    console.log("checking facility", this.facilites);
    this.facility = this.facilites.filter(element => {
      if (element.facilityID == infoImrMmr.facilityID)
        return element

    });

    this.transitType = this.transitTypeArray.filter(element => {
      if (element.imrmmrTransitID == infoImrMmr.transitTypeID)
        return element
    })

    this.baseCommunity = this.baseCommunityArray.filter(element => {
      if (element.imrmmrCommunityID == infoImrMmr.baseCommunityID)
        return element
    })

    // this.transitType = infoImrMmr.transitType;
    // this.baseCommunity = infoImrMmr.baseCommunity;
    this.TypeOfDelivery = infoImrMmr.TypeOfDelivery;
    this.disableUpdate = infoImrMmr.deathConfirmed == null ? false : true;
    if (infoImrMmr.deathConfirmed == true) {
      this.deathrecord = "Yes";
      this.disableUpdate = true;
    }
    else if (infoImrMmr.deathConfirmed == false) {
      this.deathrecord = "No";
      this.disableUpdate = true;
    }
    else {
      this.deathrecord = null;
    }
    if (infoImrMmr.supportServicesID_db != undefined && infoImrMmr.supportServicesID_db != null) {
      this.supportServicesEdit = infoImrMmr.supportServicesID_db.split('||');
      this.supportServiceArray = [];
      this.createSuportServicesOptions(this.masterdata);
      for (let i = 0; i < this.supportServicesEdit.length; i++) {
        this.seleservice = this.supportServicesEdit[i].split('|');
        var marvelHeroes = this.supportServiceArray.filter(element => {
          if (element["supportServiceID"] == this.seleservice[0]) {
            return element;
          }
        });
        if (this.seleservice[1] == "Y") {
          marvelHeroes[0].options = [
            { "name": "Yes", "checked": true },
            { "name": "No", "checked": false }
          ];
          for (let s = 0; s < this.supportServiceArray.length; s++) {
            if (this.supportServiceArray[s].supportServiceID === marvelHeroes[0].supportServiceID) {
             // this.supportServiceArray.splice(s, 1);
             this.supportServiceArray[s].options= marvelHeroes[0].options;
              break;
            }
          }
          //this.supportServiceArray.push(marvelHeroes[0]);
        }
        else if (this.seleservice[1] == "N") {
          marvelHeroes[0].options = [
            { "name": "Yes", "checked": false },
            { "name": "No", "checked": true }
          ];
          for (let s = 0; s < this.supportServiceArray.length; s++) {
            if (this.supportServiceArray[s].supportServiceID === marvelHeroes[0].supportServiceID) {
             // this.supportServiceArray.splice(s, 1);
             this.supportServiceArray[s].options= marvelHeroes[0].options;
              break;
            }
          }
          //this.supportServiceArray.push(marvelHeroes[0]);
        }
      }
    }
    
    this.ImrMmrID = infoImrMmr.benImrMmrID;
    this.selectedRequestID = infoImrMmr.requestID;
    if (infoImrMmr.typeOfInfromation == "CDR")
      this.victimMotherName = infoImrMmr.victimGuardian;
    else if (infoImrMmr.typeOfInfromation == "MDSR")
      this.victimFatherName = infoImrMmr.victimGuardian;
      console.log("options", this.supportServiceArray);
  }


  createSuportServicesOptions(response) {
    this.supportServicesOptions = [
      { "name": "Yes", "checked": false },
      { "name": "No", "checked": false }
    ];
    this.supportServiceArrayList = [];
    this.supportServiceArray = response.supportServicesList;
    for (var i = 0; i < this.supportServiceArray.length; i++) {
      this.supportServiceArray[i]["options"] = this.supportServicesOptions;
      this.supportServiceArrayList.push(this.supportServiceArray[i]);
    }
    this.supportServiceArray = this.supportServiceArrayList;
  }
  getGovtID() {
    this._locationService.getCommonData(this.providerserviceMapID).subscribe(response =>
      this.setGovtID(response));
  }
  getfacilitySupportServices() {
    this._locationService.getFacilitySupportService()
      .subscribe(response => this.setFacilitySupportService(response));
  }
  setFacilitySupportService(response: any) {
    console.log("IMRRes", response)

    this.supportServiceArray = response.supportServicesList;
    this.masterdata = response;
    this.facilites = response.facilityList;
    this.transitTypeArray = response.transitTypeList;
    this.baseCommunityArray = response.baseCommunityList;
    this.healthList = response.healthWorkerList;

    console.log("this.transitTypeArray", this.transitTypeArray)
    console.log("this.baseCommunityArray", this.baseCommunityArray)

  }

  setGovtID(response: any) {
    console.log("adad", response)
    this.govtID = response.govtIdentityTypes;

  }

  checkImrMmr(value) {
    this.successhandler();
    if (value == "CDR") {
      this.isMRFlag = "CDR";
      this.victimFatherName = null;
    }
    else {
      this.isMRFlag = "MDSR";
      this.victimMotherName = null;
    }




  }

  // ageFlag: any = false;
  // ageInput(value) {
  //   if (this.isMRFlag == "MDSR") {
  //     if (value == undefined) {
  //     }
  //     else if (value >= 15 && value <= 49) {
  //       this.ageFlag = false;


  //     }
  //     else {
  //       this.ageFlag = true;
  //       this.ageMessage = "please Enter a valid age between 15 to 49 years";

  //     }
  //   }
  //   else {
  //     if (value == undefined) {
  //     }
  //     else if (value >= 0 && value <= 5) {
  //       this.ageFlag = false;


  //     }
  //     else {
  //       this.ageFlag = true;
  //       this.ageMessage = "please Enter a valid age between 0 to 5 years";
  //     }
  //   }
  // }

  ageFlag: any = false;
  ageInput(value) {
    if (value == undefined || value == "" || value == null) {
      this.ageFlag = false;
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
  initialized() {
    let data = {
      "providerServiceMapID": this.commonAppData.current_service.serviceID
    };
    this._userBeneficiaryData.getUserBeneficaryData(data)
      .subscribe(response => this.SetUserBeneficiaryFeedbackData(response));
  }
  SetUserBeneficiaryFeedbackData(regData: any) {
    if (regData.states) {

      this.state = this.commonAppData.current_stateID_based_on_role;
      this.GetDistricts(this.state);
      this.getInformerDistricts(this.state);
    }
    this.relationShips = regData.benRelationshipTypes.filter(function (obj) {
      return obj.benRelationshipType.toLowerCase() != 'self'
    });
  }
  getInformerDistricts(state: number) {

    this._locationService.getDistricts(state)
      .subscribe(response => this.informerDistricts = response);
  }
  GetInformerTaluks(district: number) {
    this.informerBlocks = [];
    this.informerTaluks = [];
    this.informerTalukid = null;
    this.informerVillageid = null;

    this._locationService.getTaluks(district)
      .subscribe(response => this.informerTaluks = response);
  }
  GetInformerTaluksEdit(district: number) {

    this._locationService.getTaluks(district)
      .subscribe(response => this.informerTaluks = response);
  }
  GetInformerBlocks(taluk: number) {
    this.informerBlocks = [];
    this.informerVillageid = null;
    this._locationService.getBranches(taluk)
      .subscribe(response => this.informerBlocks = response);
  }
  GetInformerBlocksEdit(taluk: number) {
    this._locationService.getBranches(taluk)
      .subscribe(response => this.informerBlocks = response);
  }


  GetDistricts(state: number) {
    this._locationService.getDistricts(state)
      .subscribe(response => this.districts = response);
  }
  GetTaluks(district: number) {

    this.blocks = [];
    this.taluks = [];
    this.victimVillage = null;
    this.taluk = null;

    this._locationService.getTaluks(district)
      .subscribe(response => this.taluks = response);
  }
  GetTaluksEdit(district: number) {
    this._locationService.getTaluks(district)
      .subscribe(response => this.taluks = response);
  }
  GetBlocks(taluk: number) {
    this.blocks = [];
    this.victimVillage = null;
    this._locationService.getBranches(taluk)
      .subscribe(response => this.blocks = response);
  }
  GetBlocksEdit(taluk: number) {
    this._locationService.getBranches(taluk)
      .subscribe(response => this.blocks = response);
  }
  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  submitIMRForm(value) {
    console.log("FormValue", value);
    let respObj: any = {};
    let stagefDeath = {
      "duringPregnancy": this.duringPreg,
      "duringDelivery": this.duringDelivery,
      "within42daysOfDelivery": this.daysOfDelivery,
      "above42daysOfDelivery": this.abovedaysOfDelivery,
      "noofDelivery": parseInt(this.noofDelivery)
    };
    let facilityValue;
    let facilitName;
    let duringTransitID;
    let duringTransitName;
    let communityBaseID;
    let communityBaseName;
    if (value.facility == null) {
      facilityValue = null;
      facilitName = null;
    }
    else {
      facilityValue = this.facility.facilityID;
      facilitName = this.facility.facilityName;
    }
    if (value.transitType == null) {
      duringTransitID = null;
      duringTransitName = null;
    }
    else {
      duringTransitID = this.transitType.imrmmrTransitID;
      duringTransitName = this.transitType.transitType;
    }

    if (value.baseCommunity == null) {
      communityBaseID = null;
      communityBaseName = null;
    }
    else {
      communityBaseID = this.baseCommunity.imrmmrCommunityID;
      communityBaseName = this.baseCommunity.communityType;
    }

    respObj.victimName = value.victimName;
    respObj.victimAge = parseInt(value.age);
    respObj.victimDistrict = value.district;
    respObj.victimTaluk = value.taluk;
    respObj.victimVillage = value.village
    respObj.victimAddress = this.victimAddress;
    respObj.victimGuardian = value.victimFatherName == null ? value.victimMotherName : value.victimFatherName;
    respObj.relativeMobileNumber = parseInt(this.mobileNumber);
    // respObj.relationshipType = value.relationshipTypeID;
    respObj.referenceDate = this.refDate;
    respObj.reasonOfDeath = this.reasonofDeath;
    respObj.stagesOfDeath = stagefDeath;
    respObj.supportServicesID = this.supportArrayID;
    respObj.supportServicesName = this.supportArray;
    respObj.facilityID = facilityValue;
    respObj.facilityName = facilitName;
    respObj.transitTypeID = duringTransitID;
    respObj.transitType = duringTransitName;
    respObj.baseCommunityID = communityBaseID;
    respObj.baseCommunity = communityBaseName;
    respObj.TypeOfDelivery = this.TypeOfDelivery;
    respObj.informerCategory = this.informerCategory;
    respObj.selectedCategory = this.selectedCategory;
    respObj.informerName = this.informerName;
    respObj.informerMobileNumber = parseInt(this.informerMobileNumber);
    respObj.informerDistrictid = this.informerDistrictid;
    respObj.informerTalukid = this.informerTalukid;
    respObj.informerVillageid = this.informerVillageid;
    respObj.informerAddress = this.informerAddress ? this.informerAddress.trim() : null;
    respObj.identityType = this.identityType == null ? null : this.identityType;
    respObj.informerIdNo = this.informerIdNo;
    respObj.typeOfInfromation = this.isMRFlag;
    respObj.createdBy = this.commonAppData.Userdata.userName;
    respObj.modifiedBy = this.commonAppData.Userdata.userName;
    respObj.providerServiceMapID = this.commonAppData.current_service.serviceID;
    respObj.userID = this.commonAppData.uid;
    respObj.beneficiaryRegID = this.commonAppData.benRegID;
    if (this.commonAppData.benCallID) {
      respObj.benCallID = parseInt(this.commonAppData.benCallID);
    }
    else {
      respObj.benCallID = parseInt(this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID);
    }







    this._coFeedbackService.createImrMmrURL(respObj)
      .subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.successhandler();
          this.alertMessage.alert(resp.data.response, 'success');
          this.showTable();
          console.log("Successfull Message");
          this.commonAppData.serviceAvailed.next(true);
        }


      }, (err) => {
        this.alertMesage.alert(err.errorMessage, 'error');
      });


  }
  updateIMRMMRForm(value) {
    console.log("FormValue", value);
    let resUObj: any = {};
    resUObj.benImrMmrID = this.ImrMmrID;
    resUObj.requestID = this.selectedRequestID;
    resUObj.deathConfirmedUI = this.deathrecord;
    this._coFeedbackService.updateImrMmrURL(resUObj)
      .subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.alertMessage.alert(resp.data.response, 'success');
          this.showTable();
          console.log("Successfull Message");
          this.commonAppData.serviceAvailed.next(true);
        }
      }, (err) => {
        this.alertMesage.alert(err.errorMessage, 'error');
      });
  }

  successhandler() {
    // this.imrmmrForm.reset();
this.addInformerDetails = true;
    this.imrmmrForm.reset({
      informerCategory: "Asha/Sahiya",
      duringPreg: "No",
    });

    this.supportServiceArray = [];
    this.supportServiceArrayList = [];
    this.supportArray = [];
    this.supportArrayID = [];
    this.createSuportServicesOptions(this.masterdata);

    this.enableHealthFlag = false;
    this.selectedCategory = null;

    this.isMRFlag = "CDR";
    this.refDate = new Date;
    this.disablePregnancyFlag = false;
    this.disabledeliveryFlag = false;
    this.enabledeliveryDaysFlag = false;
    this.enableHealthFlag = false;
    this.showUpdateCondition = false;

    // this.selectedCategory=null;
    // this.informerName=null;
    // this.informerMobileNumber=null;
    // this.informerDistrictid=null;
    // this.informerTalukid=null;
    // this.informerVillageid=null;
    // this.informerAddress=null;
    // this.identityType=null;
    // this.informerIdNo=null;
    // this.victimName=null;
    // this.victimFatherName=null;
    // this.victimMotherName=null;
    // this.age=null;
    // this.district=null;
    // this.taluk=null;
    // this.village=null;
    // this.victimAddress=null;
    // this.duringDelivery=null;
    // this.daysOfDelivery=null;
    // this.abovedaysOfDelivery=null;
    // this.noofDelivery=null;
    // this.mobileNumber=null;
    // this.reasonofDeath=null;
    // this.facility=null;
    // this.duringTransit=null;
    // this.communityBase = null;
    // this.TypeOfDelivery=null;
    // this.facilityname=null;
    // this.informerCategory="Asha/Sahiya";
    // this.duringPreg="No";
    // this.duringDelivery=null;
    // this.daysOfDelivery=null;
    // this.abovedaysOfDelivery=null;
    // this.noofDelivery=null;
    // this.transitType=null;
    // this.baseCommunity=null;
    console.log("Formvalue", this.imrmmrForm.value);

  }
  onChangeSupport(service, event) {
    console.log("service", service);
    console.log("Value", event.value)
    if (event.value == "Yes") {
      for (var i = this.supportArray.length - 1; i >= 0; i--) {
        if (this.supportArray[i] === service.supportServiceName + "|N") {
          this.supportArrayID.splice(i, 1);
          this.supportArray.splice(i, 1);

        }
      }
      this.supportArrayID.push(service.supportServiceID + "|Y");
      this.supportArray.push(service.supportServiceName + "|Y");
    }
    else {
      for (var i = this.supportArray.length - 1; i >= 0; i--) {
        if (this.supportArray[i] === service.supportServiceName + "|Y") {
          this.supportArrayID.splice(i, 1);
          this.supportArray.splice(i, 1);

        }
      }

      this.supportArrayID.push(service.supportServiceID + "|N");
      this.supportArray.push(service.supportServiceName + "|N");


    }
    console.log("Array", this.supportArrayID);
    console.log("Array", this.supportArray);
  }
  checkduringPreg(value) {
    if (value == "Yes") {
      this.disabledeliveryFlag = true;
      this.duringDelivery = null;
      // this.noofDelivery=null;
    }
    else {
      this.disabledeliveryFlag = false;
    }

  }
  checkduringDeliv(value) {
    if (value == "Yes") {
      this.enabledeliveryDaysFlag = true;
      this.disablePregnancyFlag = true;
      this.duringPreg = null;
    }
    else {
      this.enabledeliveryDaysFlag = false;
      this.disablePregnancyFlag = false;
      this.daysOfDelivery = null;
      this.abovedaysOfDelivery = null;

    }
  }

  checkHealth(value) {
    this.selectedCategory = null;
    if (value == "Health Worker") {
      this.enableHealthFlag = true;
    }
    else {
      this.enableHealthFlag = false;
    }
  }
  checkWithin42DaysOfDelivery(val) {
    if (val === "Yes")
      this.abovedaysOfDelivery = "No";
    else if (val === "No")
      this.abovedaysOfDelivery = "Yes";
  }
  checkAbove42DaysOfDelivery(val) {
    if (val === "Yes")
      this.daysOfDelivery = "No";
    else if (val === "No")
      this.daysOfDelivery = "Yes";
  }

}
