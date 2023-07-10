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


import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { dataService } from 'app/services/dataService/data.service';
import { UserBeneficiaryData } from 'app/services/common/userbeneficiarydata.service';
import { SearchService } from 'app/services/searchBeneficiaryService/search.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { LocationService } from 'app/services/common/location.service';
import { CaseSheetService } from 'app/services/caseSheetService/caseSheet.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { CovidserviceService } from 'app/services/covidService/covidservice.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

declare var jQuery: any;

@Component({
  selector: 'app-covid-19',
  templateUrl: './covid-19.component.html',
  styleUrls: ['./covid-19.component.css']
})
export class Covid19Component implements OnInit {

  @Input() current_language: any;
  current_language_set: any;
  category: any;
  subCategory: any;
  subCategorydata: any;
  forwhomthistest: any;
  age: string;
  gender: any;
  travelledLast14Days: any;
  traveltype: any;
  modeoftravel: any;
  modeoftravelInter: any;
  fromstateID: any;
  fromcityID: any;
  fromsubDistrict: any;
  tostateID: any;
  tocityID: any;
  tosubDistrict: any;
  InterFromCountry: any;
  InterFromcity: any;
  InterToCountry: any;
  InterTocity: any;
  ispregnant: any;
  laboratoryconfirmed: any;
  largegathering: any;
  publicexposedplaces: any;
  famliypublicexposedplaces: any;
  howlonghavefever: any;
  highhestrecordedfever: any;
  feverpattern: any;
  RiskOfCovid19: any = "";

  categoryList: any;
  testForList: any;
  commonData: any = [];
  today: Date;
  maxDate: any;
  agentData: any;
  calledServiceID: any;
  sessionID: any;
  providerServiceID: any;
  states: any;
  districts: any;
  village: any;
  subDistricts: any;
  districtsToDom: any;
  subDistrictsToDom: any;
  countries: any;
  citiesFromInter: any;
  citiesToInter: any;
  ageLimit: number = 120;
  beneficiaryDetails: any;
  beneficiaryRegID: any;
  callerID: string;
  current_campaign: any;
  is_patient: string;
  firstName: any;
  lastName: any;
  disableFlag: boolean = false;
  parentBenRegName: any;
  benCallID: any;
  callTypeID: any;
  providerServiceMapID: any;
  beneficiaryID: any;
  healthConditionsList: any;
  symptomsList: any = [];
  symptomsList11: any;
  isShowFever: boolean = false;
  selectedsymptoms: any = [];
  selectedHealthConditions: any = [];
  symptoms11Selected: any = [];
  isSymptomsNone: boolean = true;
  isCovidform: boolean;
  domest: any;
  international: any;
  traveltypeselected: any = [];
  masterData:any;
  feverDurationList: any;
  feverStatsList: any;
  feverPatternList: any;
  assignSelectedLanguageValue: any;
  constructor(public getCommonData: dataService, private _userData: UserBeneficiaryData,
    private _util: SearchService, private alertMessage: ConfirmationDialogsService,
    private _locationService: LocationService, private caseSheetService: CaseSheetService, public covidService:CovidserviceService,
    public httpServices:HttpServices
  ) {
    this.beneficiaryDetails = this.getCommonData.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary && this.current_campaign == "INBOUND") {
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }
    else if (this.getCommonData.benRegID) {
      this.beneficiaryRegID = this.getCommonData.benRegID;
    }
    else {
      this.beneficiaryRegID = this.getCommonData.outboundBenID;
    }
  }

  ngOnInit() {
    this.loadMasterData();   
    this.IntializeSessionValues();
    this.initiallyState();
    this.initiallyCountry();
    this.assignSelectedLanguage();
   
    if (this.current_language) {
      this.current_language_set = this.current_language;
    }
    this.current_campaign = this.getCommonData.current_campaign;
    if (sessionStorage.getItem('session_id') != undefined) {
      this.callerID = sessionStorage.getItem('session_id');
    }
    let obj = {
      "beneficiaryRegID": this.beneficiaryRegID,
      "callID": this.callerID
    }
    this.InitializePatientData();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  InitializePatientData(){
    //this.disableFlag = true;
    if (this.beneficiaryRegID && this.current_campaign == 'INBOUND') {
      let IDobj = {
        "beneficiaryRegID": this.beneficiaryRegID
      }
      let res = this._util.retrieveRegHistory(IDobj)
        .subscribe(response => { this.presentCasesheetSuccess(response); this.benDataInboundPopulationg(); }, (err) => {
          this.benDataInboundPopulationg();
          this.alertMessage.alert(err.errorMessage, 'error');
        }); //calling to check if ben has taken the service as 'other' on the same call
    }
    else {
      this.benDataInboundPopulationg(); // in case ben id is not retrieved in INBOUND it will still populate data, as first if condition would be omitted
    }
  }
  IntializeSessionValues() {
    let data = {
      "providerServiceMapID": this.getCommonData.current_service.serviceID
    };

    this._userData.getUserBeneficaryData(data).subscribe(response => {
      this.commonData = response;
      console.log(this.commonData);

    });

    this.today = new Date();
    this.maxDate = this.today;
    this.agentData = this.getCommonData.Userdata;
    this.calledServiceID = this.getCommonData.current_service.serviceID;
    this.sessionID = this.getCommonData.sessionID;
    this.providerServiceID = this.getCommonData.service_providerID;
  }
  initialization() {
    this.forwhomthistest = this.testForList[0];
    this.disableFlag = true;
  }
  getSubCategory(value) {
    this.subCategorydata = [];
    this.subCategory = null;
    this.isCovidform = false;
    switch (value.Value) {
      case 'Medical Assistance':
        this.subCategorydata = this.masterData.medicalAssistance;
        break;
      case 'Food Supply':
        this.subCategorydata = this.masterData.foodSupply;
        break;
      case 'LPG Supply':
        this.subCategorydata = this.masterData.lpgSupply;
        break;
      case 'Stranded Assistance':
        this.subCategorydata = this.masterData.strandedAssistance;
        break;
      case 'Law & Order':
        this.subCategorydata = this.masterData.lawAndOrder;
        break;
      case 'Essential Services':
        this.subCategorydata = this.masterData.essentialServicese;
        break;
      case 'Transportation':
        this.subCategorydata = this.masterData.transportation;
        break;
      case 'COVID Relief Fund':
        this.subCategorydata = this.masterData.covidReliefFund;
        break;
    }
    this.onCategoryChange();
  }
  // this.assignSelectedLanguageValue
  initiallyState() {
    this._locationService.getStates(1).subscribe(response => this.states = response,
      (err) => {
        this.alertMessage.alert( this.assignSelectedLanguageValue.errorInFetchingStates, 'error');
      });
  }
  initiallyCountry() {
    this._locationService.getCountry().subscribe(response => this.countries = response,
      (err) => {
        this.alertMessage.alert(this.assignSelectedLanguageValue.errorInFetchingStates, 'error');
      });
  }
  getCitiesFromInter(countryID) {
    this._locationService.getCity(countryID).subscribe(response => this.citiesFromInter = response,
      (err) => {
        this.alertMessage.alert(this.assignSelectedLanguageValue.errorInFetchingStates, 'error');
      });
  }
  getCitiesToInter(countryID) {
    this._locationService.getCity(countryID).subscribe(response => this.citiesToInter = response,
      (err) => {
        this.alertMessage.alert(this.assignSelectedLanguageValue.errorInFetchingStates, 'error');
      });
  }
  GetDistrictsFromDom(value) {
    let res = this._locationService.getDistricts(value).subscribe(response => this.districts = response);
  }
  GetDistrictsToDom(value) {
    let res = this._locationService.getDistricts(value).subscribe(response => this.districtsToDom = response);
  }
  getSubDistrictFromDom(districtID) {
    this.village = undefined;
    this._util.getSubDistricts(districtID).subscribe(response => this.subDistricts = response);
  }
  getSubDistrictToDom(districtID) {
    this.village = undefined;
    this._util.getSubDistricts(districtID).subscribe(response => this.subDistrictsToDom = response);
  }
  calculateDOB(age) {
    let valueEntered = age;
    if (valueEntered) {
      if (valueEntered > this.ageLimit) {
        this.alertMessage.alert(`${this.assignSelectedLanguageValue.ageCanOnlyBeSetBetweenTodayTo} ${this.ageLimit} Years`, 'info');
        this.age = null; 
      }
    }
  }
  presentCasesheetSuccess(registeredBenData) {
    if (registeredBenData.length > 0) {
      registeredBenData = registeredBenData[0];
      this.beneficiaryRegID = registeredBenData.beneficiaryRegID;
      this.beneficiaryID = registeredBenData.beneficiaryID;
      this.firstName = registeredBenData.firstName;
      this.lastName = registeredBenData.lastName;
      //this.gender = registeredBenData.genderID;
      //this.age = registeredBenData.actualAge;
    }
    else {
      this.benDataInboundPopulationg();
    }
  }
  benDataInboundPopulationg() {
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
      this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
     // this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
      this.benCallID = this.getCommonData.benCallID;
      this.callTypeID = this.getCommonData.callTypeID;
      this.providerServiceMapID = this.getCommonData.current_service.providerServiceMapID
    }
    else {
      this.firstName = this.getCommonData.firstName;
      this.lastName = this.getCommonData.lastName;
     // this.gender = this.getCommonData.gender;
     // this.age = this.getCommonData.age;
      this.benCallID = this.getCommonData.benCallID;
      this.callTypeID = this.getCommonData.callTypeID;
      this.providerServiceMapID = this.getCommonData.current_service.providerServiceMapID
    }
  }
  patientDetailsFields(val: any) {
    if (val.Value === "For yourself") {
      this.disableFlag = true;
      this.gender = this.getCommonData.gender;
      this.age = this.getCommonData.age;
      this.benDataInboundPopulationg();
    }
    else {
      this.disableFlag = false;
      this.age = "";
      this.gender = "";
    }
  }
  onsymptomsCheckboxChange(event, value) {
    if (event.checked == true) {
      this.selectedsymptoms.push(value.Value);
      if (value.Value === 'Fever') {
        this.isShowFever = event.checked;
        this.clearFeverControls();
      }
      else if (value.Value === 'None') {
        this.isSymptomsNone = false;
        this.symptomsList.forEach(element => {
          if (element.Value !== 'None') {
            element.disable = true;
            element.checked = false;
            this.selectedsymptoms = [];
          }
        });
      }
    }
    else {
      let index = this.selectedsymptoms.indexOf(value.Value);
      if (index > -1) {
        if (value.Value === 'Fever') {
          this.isShowFever = event.checked;
          this.clearFeverControls();
        }
        this.selectedsymptoms.splice(index, 1);
      }
      if (value.Value === 'None') {
        this.isSymptomsNone = true;
        this.symptomsList.forEach(element => {
          element.disable = false;
        });
      }
    }
  }
  onhealthconditionsCheckboxChage(event, value) {
    if (event.checked == true) {
      this.selectedHealthConditions.push(value.Value);
      if (value.Value === 'No existing conditions') {
        this.healthConditionsList.forEach(element => {
          if (element.Value !== 'No existing conditions') {
            element.disable = true;
            element.checked = false;
            this.selectedHealthConditions = [];
          }
        });
      }
    }
    else {
      let index = this.selectedHealthConditions.indexOf(value.Value);
      if (index > -1) {
        this.selectedHealthConditions.splice(index, 1);
      }
      if (value.Value === 'No existing conditions') {
        this.healthConditionsList.forEach(element => {
          element.disable = false;
        });
      }
    }
  }
  onSymptoms11CheckboxChagen(event, value) {
    if (event.checked == true) {
      this.symptoms11Selected.push(value.Value);
      if (value.Value === 'None') {
        this.symptomsList11.forEach(element => {
          if (element.Value !== 'None') {
            element.disable = true;
            element.checked = false;
            this.symptoms11Selected = [];
          }
        });
      }
    }
    else {
      let index = this.symptoms11Selected.indexOf(value.Value);
      if (index > -1) {
        this.symptoms11Selected.splice(index, 1);
      }
      if (value.Value === 'None') {
        this.symptomsList11.forEach(element => {
          element.disable = false;
        });
      }
    }
  }
  covid19Obj: any = {}
  saveCovidData(values: any) {
    this.covid19Obj = {};
    let data = JSON.stringify(values);
    this.covid19Obj.beneficiaryRegID = this.beneficiaryRegID.toString();
    this.covid19Obj.beneficiaryID = this.beneficiaryID;
    this.covid19Obj.genderID = this.gender;
    if (this.getCommonData.benCallID) {
			this.covid19Obj.benCallID = this.getCommonData.benCallID;
		}
		else {
			this.covid19Obj.benCallID = this.getCommonData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }
    this.covid19Obj.callTypeID = this.callTypeID;
    this.covid19Obj.providerServiceMapID = this.providerServiceMapID;
    this.covid19Obj.age = this.age;
    this.covid19Obj.categoryID = this.category["ID"];
    this.covid19Obj.subCategoryID = this.subCategory["ID"];
    this.covid19Obj.categoryName = this.category["Value"];
    this.covid19Obj.subCategoryName = this.subCategory["Value"];
    this.covid19Obj.forWhomThisTest = this.forwhomthistest;
    if (this.gender === 2) {
      this.covid19Obj.isPregnant = this.ispregnant;
    }
    this.covid19Obj.travelledLast14Days = this.travelledLast14Days;
    this.covid19Obj.travelType = this.traveltypeselected;  
    if(this.travelledLast14Days === "YES"){
        if(this.traveltypeselected.length == 0){
          this.alertMessage.alert(this.assignSelectedLanguageValue.selectTravelType,'info');
          return false;
        }
    }     
    if (this.domest) {
      this.covid19Obj.fromstateID = this.fromstateID;
      this.covid19Obj.fromcityID = this.fromcityID;
      this.covid19Obj.fromSubDistrict = this.fromsubDistrict;
      this.covid19Obj.tostateID = this.tostateID;
      this.covid19Obj.tocityID = this.tocityID;
      this.covid19Obj.tosubDistrict = this.tosubDistrict;
      this.covid19Obj.modeOfTravel = this.modeoftravel;
    }
    if (this.international) {
      this.covid19Obj.interFromCountry = this.InterFromCountry;
      this.covid19Obj.interFromcity = this.InterFromcity;
      this.covid19Obj.interToCountry = this.InterToCountry;
      this.covid19Obj.interTocity = this.InterTocity;
      this.covid19Obj.modeOfTravelInternational = this.modeoftravelInter;
    }
    if (this.selectedsymptoms.length > 0)
      this.covid19Obj.symptoms = this.selectedsymptoms;
    if (this.selectedHealthConditions.length > 0)
      this.covid19Obj.healthConditions = this.selectedHealthConditions;
    this.covid19Obj.laboratoryConfirmed = this.laboratoryconfirmed;
    this.covid19Obj.largeGathering = this.largegathering;
    this.covid19Obj.publicExposedPlaces = this.publicexposedplaces;
    this.covid19Obj.famliyPublicExposedPlaces = this.famliypublicexposedplaces;
    if (this.symptoms11Selected.length > 0)
      this.covid19Obj.symptoms11Selected = this.symptoms11Selected;
    if(this.isShowFever){
      this.covid19Obj.howLongHaveFever = this.howlonghavefever["ID"];
      this.covid19Obj.highestRecordedFever = this.highhestrecordedfever["ID"];
      this.covid19Obj.feverPattern = this.feverpattern["ID"];
      this.covid19Obj.howLongHaveFeverValue = this.howlonghavefever["Value"];
      this.covid19Obj.highestRecordedFeverValue = this.highhestrecordedfever["Value"];
      this.covid19Obj.feverPatternValue = this.feverpattern["Value"];
    }    
    this.covid19Obj.riskOfCovid19 = this.RiskOfCovid19;
    this.covid19Obj.createdBy = this.agentData.userName;



    
    let covidData = JSON.stringify(this.covid19Obj);
    console.log(covidData);
    this.covidService.saveCovidData(covidData).subscribe((response) => {
      this.alertMessage.alert(this.assignSelectedLanguageValue.covidDataSavedSuccessfully, 'success');  
      this.isCovidform = false;
      this.category = null;
      this.subCategory = null;
      jQuery("#covidForm").trigger("reset");
      this.getCommonData.serviceAvailed.next(true); 
    }, (err) => {
      this.alertMessage.alert(err.status, 'error');
    });


  }
  onCategoryChange(){
    this.subCategory = null;
    this.forwhomthistest = null;
    this.age = null;
    this.gender = null;
    this.ispregnant = null;
    this.travelledLast14Days =null;
    this.domest = null;
    this.international = null;
    this.traveltype = null;
    this.clearDomTraveldata();
    this.clearInterTraveldata();
    this.selectedsymptoms = [];
    this.selectedHealthConditions = [];
    this.symptoms11Selected = [];
    this.traveltypeselected = [];
    this.laboratoryconfirmed = null;
    this.largegathering = null;
    this.publicexposedplaces = null;
    this.famliypublicexposedplaces = null;
    this.isShowFever = false;
    this.clearFeverControls();
    this.clearMultiCheckBox();
    this.InitializePatientData();
    this.RiskOfCovid19 = "";
  }
  clearDomTraveldata(){
    this.modeoftravel = null;
    this.fromstateID = null;
    this.fromcityID = null;
    this.fromsubDistrict = null;
    this.tostateID = null;
    this.tocityID = null;
    this.tosubDistrict = null;
  }
  clearInterTraveldata(){
    this.modeoftravelInter = null;
    this.InterFromCountry = null;
    this.InterFromcity = null;
    this.InterToCountry = null;
    this.InterTocity = null;
  }
  clearFeverControls(){
    this.howlonghavefever = null;
    this.highhestrecordedfever = null;
    this.feverpattern = null;
  }
  clearTravelType() {
    this.domest = null;
    this.international = null;
  }
  clearMultiCheckBox(){
    this.healthConditionsList.forEach(element => {
      element.disable = false;
      element.checked = false;
    });
    this.symptomsList11.forEach(element => {
      element.disable = false;
      element.checked = false;
    });
    this.symptomsList.forEach(element => {
      element.disable = false;
      element.checked = false;
    });
  }
  onClearButton() {
    this.isCovidform = false;
    this.category = null;
    this.subCategory = null;
    jQuery("#covidForm").trigger("reset");
  }
  onGenderChange(gen){
    this.ispregnant = null;
  }
  onSubCategoryChange(type) {
    if (type)
      this.isCovidform = true;
    else
      this.isCovidform = false;
  }
  travelTypechange(event,traveltype){
    if (event.checked == true) {
      this.traveltypeselected.push(traveltype);    
    }
    else{
      let index = this.traveltypeselected.indexOf(traveltype);
      if (index > -1) {
        this.traveltypeselected.splice(index, 1);
      }
    }
  }
  populateRisk() {
    let healthcondition = false;
    let symptomcondition = false;
    this.RiskOfCovid19 = "";
    this.selectedHealthConditions.forEach(element => {
      if(element !== 'No existing conditions'){
         healthcondition = true;
      }      
    });
    this.selectedsymptoms.forEach(element => {
      if(element !== 'None'){
        symptomcondition = true;
      }      
    });
    if (this.gender === 2) {
      if (this.ispregnant === "NO" && this.travelledLast14Days === "NO" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.ispregnant === "NO" && this.travelledLast14Days === "YES" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.ispregnant === "YES" && this.travelledLast14Days === "YES" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.ispregnant === "YES" && this.travelledLast14Days === "NO" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.ispregnant === "YES" && this.largegathering === 'YES' && this.publicexposedplaces === 'YES' && this.famliypublicexposedplaces === 'YES') {
        this.RiskOfCovid19 = "Medium Risk";
      }
    }
    else {
      if (this.travelledLast14Days === "NO" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.travelledLast14Days === "YES" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.travelledLast14Days === "YES" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.travelledLast14Days === "NO" && this.largegathering === "NO" && this.publicexposedplaces === "NO" && this.famliypublicexposedplaces === "NO") {
        this.RiskOfCovid19 = "Low Risk";
      }
      if (this.largegathering === 'YES' && this.publicexposedplaces === 'YES' && this.famliypublicexposedplaces === 'YES') {
        this.RiskOfCovid19 = "Medium Risk";
      }
    }
    if (healthcondition) {
      this.RiskOfCovid19 = "Medium Risk";
    }
    if (this.largegathering === 'YES' || this.publicexposedplaces === 'YES' || this.famliypublicexposedplaces === 'YES') {
      this.RiskOfCovid19 = "Medium Risk";
    }
    if (symptomcondition && (this.largegathering === 'NO' && this.publicexposedplaces === 'NO' && this.famliypublicexposedplaces === 'NO')) {
      this.RiskOfCovid19 = "Medium Risk";
    }
    if (this.laboratoryconfirmed === "YES") {
      this.RiskOfCovid19 = "High Risk"
    }
    if (symptomcondition && (this.largegathering === 'YES' || this.publicexposedplaces === 'YES' || this.famliypublicexposedplaces === 'YES')) {
      this.RiskOfCovid19 = "High Risk"
    }

  }
  loadMasterData(){  
    this.covidService.getCovidMasterData(this.getCommonData.current_service.serviceID).subscribe(response => {
      this.masterData = response;
      console.log(this.masterData);
      this.testForList = this.masterData.testingPersonMaster;
      this.feverDurationList = this.masterData.feverDuration;
      this.feverStatsList = this.masterData.feverStats;
      this.feverPatternList = this.masterData.feverPattern;
      this.categoryList = this.masterData.covid19Category;       
      this.healthConditionsList = this.masterData.healthConditionsMaster;
      this.symptomsList11 = this.masterData.otherSymptoms;
      this.symptomsList = this.masterData.symptomsMaster;
      
      this.healthConditionsList.forEach(element => {
        element.checked = false;
        element.disable = false;
      });   
      
      this.symptomsList11.forEach(element => {
        element.checked = false;
        element.disable = false;
      });
      this.symptomsList.forEach(element => {
        element.checked = false;
        element.disable = false;
      });
    });
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
