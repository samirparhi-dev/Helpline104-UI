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


import { Component, OnInit, Input, Inject, ViewChild } from "@angular/core";
import { MdDialog, MdDialogRef } from "@angular/material";
import { MD_DIALOG_DATA } from "@angular/material";
import { FeedbackResponseModel } from "../sio-grievience-service/sio-grievience-service.component";
import { NgForm } from "@angular/forms";
import { CDSSService } from "../services/cdssService/cdss.service";
import { CaseSheetService } from "../services/caseSheetService/caseSheet.service";
import { SnomedService } from "../services/snomedService/snomed-service.service";
import { ResultFormat } from "../cdss/Result";
import { dataService } from "../services/dataService/data.service";
import { prescriptionComponent } from "../prescription/prescription.component";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";
import { UtilityService } from "../services/common/utility.service";
import { SearchService } from "../services/searchBeneficiaryService/search.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { AvailableServices } from "../services/common/104-services";
import { Subscription } from "rxjs/Subscription";
import { OutboundListnerService } from "./../services/common/outboundlistner.service";
import { ListnerService } from "../services/common/listner.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { SmsTemplateService } from "./../services/supervisorServices/sms-template-service.service";
import { ViewDiseaseSummaryDetailsComponent } from "../view-disease-summary-details/view-disease-summary-details.component";
import { LocationService } from "app/services/common/location.service";

import { UserBeneficiaryData } from "app/services/common/userbeneficiarydata.service";
import { CaseSheetCovidModalComponent } from "app/case-sheet-covid-modal/case-sheet-covid-modal.component";
import * as moment from "moment";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import { CallerService } from "app/services/common/caller.service";

declare var jQuery: any;

@Component({
  selector: "app-case-sheet",
  templateUrl: "./case-sheet.component.html",
  styleUrls: ["./case-sheet.component.css"],
})
export class CaseSheetComponent implements OnInit {
  @Input() providerData: any;

  beneficiaryDetails: any;
  beneficiaryRegID: any;
  caseSheetData: Array<any> = [];
  current_role: any;
  recommendedAction: any = "";
  // followupRequired= "0";
  followUpRqrd: any = "0";
  doFollow: boolean = false;
  minDate: Date;
  followupOn: any;
  maxDate: any = new Date();
  subs: Subscription;

  commonData: any = [];
  chiefCompliants: any = [];
  diseaseNames: any = [];
  csFormControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  diseaseNameFilterOption: Observable<string[]>;
  diseaseFormControl: FormControl = new FormControl();

  is_patient: any;
  firstName: any;
  lastName: any;
  gender: any = "";
  age: any = "";
  disableFlag: boolean = true;
  isSelfFlag: boolean = true;
  ageFlag: boolean = false;
  nameFlag: boolean = false;
  requiredRole: boolean;
  minlength: any;
  services: any = [];
  subServiceID: any;
  category: any;
  subcategory: any;
  outbound: boolean = false;
  actionByMo: any = "";
  actionByHao: any = "";
  // actionByCo: any;
  actionByPd: any;
  sctID_pcc: any = "";
  sctID_psd: any;
  sctID_pcc_toSave: any;
  sctID_psd_toSave: any;
  recentPrescriptionData: any = [];
  no_question_found: any;
  counselling_sheet_success: any;
  case_sheet_success: any;
  error_occured: any;
  current_campaign: any;
  /*end*/
  districtID: any;
  disableRadioButton: boolean = false;
  agentData: any;
  genders: any;
  relationshipTypeID: any;
  relationShips: Array<any> = [];
  parentBenRegName: any;
  displayHistory: boolean = false;
  screens: any;
  callerID: any;

  /*Chief Complaint Or Disease Summary */
  chiefCompliantOrDiseaseSummary: String;
  chiefComplaint: Boolean = true;
  summaryDetails: any = [];
  summaryObj: any;
  informationGiven: any;
  diseasesSummary: any;
  providerServiceID: any;
  stateID: any;
  states: any = [];
  districtsFromDom: any = [];
  districtsToDom: any = [];
  subDistrictsFromDom: any = [];
  subDistrictsToDom: any = [];
  villages: any = [];
  village: any;
  countries: any = [];
  citiesFromInter: any = [];
  citiesToInter: any = [];
  //covidSymptom=[{ "id":1,"name":"Fever"},{"id":2,"name":"Cough"},{"id":3 ,"name":"Breathing Difficulties"},{"id":4,"name":"No Symptoms"}];
  covidSymptom = ["Fever", "Cough", "Breathing Difficulties", "No Symptoms"];
  cvdSymptom: any = [];
  confirmedCaseCOVID_flag: boolean = false;
  feverCoughBreath_flag: boolean = false;
  TravelPlaces_flag: boolean = false;
  recommendationText: string = "";

  covidFill_flag: boolean = false;
  istravelStatus: boolean = false;
  istravelModeDomestic: boolean = false;
  istravelModeInternatinal: boolean = false;
  iscontactMode: boolean = false;
  contactArray: any = [];
  travelstat: any;
  contactstat: any;
  suspectedstat: any;
  recommend: any;
  suspectedCovid: string;
  travelType: string;
  symptomJoin: any;
  contactJoin: any;
  seekMedical: number = 0;
  seekSuspectedStat: number = 0;
  caseResponse: any;
  question1: string;
  question2: string;
  symptomQ1: string = "no";
  symptomQ2: string = "no";
  symptomQ3: string = "no";
  symptomQ4: string = "no";
  question3: string = "no";
  flag: boolean = false;
  isdisplay: boolean = false;
  display_flag: boolean = false;
  travelSelected: boolean;
  disableTravelButton: boolean = true;
  disablesymptomQ1: boolean;
  disablesymptomQ2: boolean;
  disablesymptomQ3: boolean;
  disablesymptomQ4: boolean;
  disableSaveButton: boolean = false;
  diableOtherSymptom: boolean = false;
  disablenoSymptom: boolean = false;
  disableSaveForGender: boolean = false;
  coviddisplay = "no";
  domest: any;
  inter: any;
  modeOfTravelDom: any;
  DomFromstate: any;
  DomFromDistrict: any;
  DomFromsubDistrict: any;
  DomTostate: any;
  DomToDistrict: any;
  DomTosubDistrict: any;
  IntermodeOfTravel: any;
  InterFromCountry: any;
  InterFromcity: any;
  InterToCountry: any;
  InterTocity: any;
  fev: any;
  cough: any;
  breathingDiff: any;
  nosymp: any;
  seekMedicalConsult: any;
  altPhNumber: any;
  altNumberResult: any;
  prespsd: any;
  presFlag: boolean;
  ageUnit: any = "";
  DOB: any;
  ageLimit: number = 120;
  currentLanguageSet: any;
  noDocument = true;
  isCovidVaccine: boolean = false;
  ageGroup: any;
  isApplicableForVaccine: any;
  vaccineStatus: any;
  vaccineTypes: any = [];
  doseTaken: any;
  doseOneDate: any;
  doseTwoDate: any;
  boosterDoseDate: any;
  vaccineApplicableAge = ["< 12 years", ">= 12years"];
  vaccineAgeGroup: boolean = false;
  vaccineTypeSelected: any;
  vaccApplicableText: string;
  doseTypes: any = [];
  doseTypeID: any;
  doseType: any;
  covidVaccineTypeID: any;
  covidVSID: any;
  disableCovidSave: boolean = false;
  /* CR-Treatment recommendation*/ 
  treatmentRecommendation: any;
  riskLevel: any;
  benHihlData: Array<any> = [];
  pccFlag : boolean = false;
  treatmentRecommendationFlag : boolean = false;
  categoryFlag : boolean = false;
  saveMainFlag : boolean = false;
 
  constructor(
    private _userData: UserBeneficiaryData,
    private _locationService: LocationService,
    private _smsService: SmsTemplateService,
    public searchBenData: SearchService,
    public dialog: MdDialog,
    private caseSheetService: CaseSheetService,
    private snomedService: SnomedService,
    private saved_data: dataService,
    public HttpServices: HttpServices,
    // public router: Router,
    public route: ActivatedRoute,
    private _CDSSService: CDSSService,
    public alertMessage: ConfirmationDialogsService,
    private listnerService: ListnerService,
    private _availableServices: AvailableServices,
    private callerService: CallerService,
  ) {
    if (this.saved_data.age < 12) {
      this.ageGroup = "< 12 years";
      this.isApplicableForVaccine = false;
      this.vaccApplicableText = "Not Applicable for Vaccination";
    } else {
      this.ageGroup = ">= 12years";
      this.isApplicableForVaccine = true;
      this.vaccApplicableText = "Applicable for Vaccination";
    }
    this.beneficiaryDetails =
      this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (
      this.beneficiaryDetails &&
      this.beneficiaryDetails.i_beneficiary &&
      this.current_campaign == "INBOUND"
    ) {
      this.beneficiaryRegID =
        this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    } else if (this.saved_data.benRegID) {
      this.beneficiaryRegID = this.saved_data.benRegID;
    } else {
      this.beneficiaryRegID = this.saved_data.outboundBenID;
    }

    this.saved_data.roleChanged.subscribe(
      (response) => {
        if (response === "HAO") {
          console.log("subject recieved");
          this.beneficiaryDetails =
            this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
          this.benDataInboundPopulationg();
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  @ViewChild("caseSheetForm") caseSheetForm: NgForm;
  @ViewChild("catSubcatForm") catSubcatForm: NgForm;
  @ViewChild("patientDetailForm") patientDetailForm: NgForm;
  @ViewChild("covidVaccineForm") covidVaccineForm: NgForm;
  ngOnInit() {
    // this.saveMainFlag = false;
    this.currentLanguageSetValue();
    this.screens = this.saved_data.screens;
    this.getCovidVaccineMaster();
    this.current_campaign = this.saved_data.current_campaign;
    this.providerServiceID = this.saved_data.service_providerID;
    this.initialization();
    this.initiallyState();
    this.initiallyCountry();
    this.fetchCommonData();
    if (sessionStorage.getItem("session_id") != undefined) {
      this.callerID = sessionStorage.getItem("session_id");
    }

    this.current_role = this.saved_data.current_role;
    this.filteredOptions = this.csFormControl.valueChanges
      .startWith(null)
      .map((val) => (val ? this.filter(val) : this.chiefCompliants.slice()));

    let requestObj = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
    };
    this._availableServices
      .getServices(requestObj)
      .subscribe((response) => this.servicesSuccessHandler(response));
    this.agentData = this.saved_data.Userdata;

    //** load case sheet if beneficiary id is present
    if (this.beneficiaryRegID) {
      this.getCaseSheetData();
    }
    this.setDateLimits();
    this.setDefaultAgeUnit();
    this.setChiefComplaintAsDefaultForSelf();
  }
 
  fetchCommonData() {
    this.searchBenData
      .getCommonData()
      .subscribe((response) => this.m_gender_successHandeler(response));
  }
  m_gender_successHandeler(response) {
    if (response) {
      this.commonData = response;
      this.relationShips = response.benRelationshipTypes.filter(function (obj) {
        return obj.benRelationshipType.toLowerCase() != "self";
      });
      this.getPresentCaseSheet();
    }
  }

  fetchChiefComplaintsBasedOnGender() {
    this._CDSSService
      .getChiefComplaints({
        age: this.age,
        gender: (this.genders[0] !== null && this.genders[0] !== undefined) ? this.genders[0].genderName.charAt(0) : 
        null,
        // gender: this.saved_data.ben_gender_name
        //   ? this.saved_data.ben_gender_name.charAt(0)
        //   : this.genders[0].genderName.charAt(0),
      })
      .subscribe((any) => this.chiefComplaintsSuccessHandeler(any));
  }
  chiefComplaintsSuccessHandeler(response) {
    if (response !== undefined && response !== null) {
      this.chiefCompliants = response;
    }
  }
  setChiefComplaintAsDefaultForSelf() {
    if (this.is_patient === "self") {
      this.chiefCompliantOrDiseaseSummary = "1";
    } else {
      this.chiefCompliantOrDiseaseSummary = null;
    }
  }
  getPresentCaseSheet() {
    const obj = {
      beneficiaryRegID: this.beneficiaryRegID,
      callID: this.callerID,
    };
    if (this.beneficiaryRegID && this.current_campaign == "INBOUND") {
      this.caseSheetService.getPresentCaseSheet(obj).subscribe(
        (res) => {
          this.presentCasesheetSuccess(res);
        },
        (err) => {
          this.benDataInboundPopulationg();
          this.alertMessage.alert(err.errorMessage, "error");
        }
      ); //calling to check if ben has taken the service as 'other' on the same call
    } else if (this.current_campaign == "OUTBOUND") {
      let obj = {
        beneficiaryRegID: this.saved_data.outboundBenID,
      };
      this.searchBenData
        .retrieveRegHistory(obj)
        .subscribe((response) => this.benDataOnBenIDSuccess(response));

      let res = this.saved_data.isSelf;
      if (res) {
        this.is_patient = "self";
      } else {
        this.is_patient = "other";
      }
    } else {
      this.benDataInboundPopulationg(); // in case ben id is not retrieved in INBOUND it will still populate data, as first if condition would be omitted
    }
  }
  getPreviousCovidVaccineData() {
    let data = {
      beneficiaryRegID: this.beneficiaryRegID,
    };
    this.caseSheetService.getPreviousCovidVaccineData(data).subscribe(
      (res) => {
        if (res.statusCode == 200) {
          if (res.data.covidVSID != undefined && res.data.covidVSID != null) {
            this.disableCovidSave = true;
            this.covidVSID = res.data.covidVSID;
            this.vaccineStatus = res.data.vaccineStatus;
            //this.enableVaccineTypeAndDoseTaken();
            if (res.data.vaccineStatus === "YES") {
              this.covidVaccineTypeID = res.data.covidVaccineTypeID;
              this.doseTypeID = res.data.doseTypeID;
            }
          }
        }
      }
    );
  }
  saveCovidVaccineData() {
    let data = {
      covidVSID:
        this.covidVSID != null && this.covidVSID != undefined
          ? this.covidVSID
          : null,
      beneficiaryRegID: this.beneficiaryRegID,
      vaccineStatus: this.vaccineStatus,
      covidVaccineTypeID: this.covidVaccineTypeID,
      doseTypeID: this.doseTypeID,
      providerServiceMapID: this.saved_data.current_service.serviceID,
      createdBy: this.saved_data.Userdata.userName,
      vanID: this.saved_data.current_serviceID,
      modifiedBy:
        this.covidVSID != null && this.covidVSID != undefined
          ? this.saved_data.Userdata.userName
          : null,
      //"parkingPlaceID" : parkingPlaceID,
      //"processed": "N"
    };
    this.caseSheetService.saveCovidVaccineData(data).subscribe(
      (res) => {
        if (res.statusCode == 200 && res.data != null) {
          this.covidVSID = res.data.covidVSID;
          this.alertMessage.alert(
            this.currentLanguageSet.covidDataSavedSuccessfully,
            "success"
          );
          this.vaccineStatus = null;
          this.covidVaccineTypeID = null;
          this.doseTypeID = null;
          this.isCovidVaccine = false;
        }
      },
      (err) => {
        this.alertMessage.alert(err.errorMessage, "error");
      }
    );
  }
  getCovidVaccineMaster() {
    this.caseSheetService.getCovidVaccineMasterData().subscribe(
      (res) => {
        if (res.statusCode == 200) {
          if (res.data) {
            this.doseTypes = res.data.doseType;
            this.vaccineTypes = res.data.vaccineType;
            if (this.saved_data.age >= 12) this.getPreviousCovidVaccineData();
          }
        }
      },
      (err) => {
        this.alertMessage.alert(err.errorMessage, "error");
      }
    );
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngDoCheck() {
    this.currentLanguageSetValue();
  }
  changeCovidVaccine(value) {
    if (value == true) this.isCovidVaccine = true;
    else {
      this.covidVaccineTypeID = null;
      this.doseTypeID = null;
      this.vaccineStatus = null;
      this.isCovidVaccine = false;
    }
  }
  vaccineStatusChange(val) {
    this.disableCovidSave = false;
    if (val === "NO") {
      this.covidVaccineTypeID = null;
      this.doseTypeID = null;
    }
  }
  doseChange(val) {
    this.disableCovidSave = false;
    //  this.doseTypeID=val.covidDoseTypeID;
    //  this.doseType=val.doseType;
  }
  saveCovidVaccineStatus() {
    if (this.vaccineStatus != undefined && this.vaccineStatus != null) {
      this.saveCovidVaccineData();
    }
  }
  vaccineTypeChange() {
    this.disableCovidSave = false;
  }
  ageGroupChange(ageGroup) {
    this.disableCovidSave = false;
    this.covidVaccineTypeID = null;
    this.doseTypeID = null;
    this.vaccineStatus = null;
    if (ageGroup === "< 12 years") {
      this.isApplicableForVaccine = false;
      this.vaccApplicableText = "Not Applicable for Vaccination";
    } else {
      this.isApplicableForVaccine = true;
      this.vaccApplicableText = "Applicable for Vaccination";
    }
  }
  presentCasesheetSuccess(res) {
    if (res.length > 0 && res[0].isSelf == false) {
      this.disableRadioButton = true;
      this.disableFlag = true;
      this.isSelfFlag=res[0].isSelf;
      let name = res[0].patientName.split(" ");
      this.firstName = name[0];
      //this.parentBenRegName
      this.lastName = name[1];
      this.gender = res[0].patientGenderID;
      this.age = res[0].patientAge;
      this.is_patient = "other";
      this.retrieveGenderName(res[0].patientGenderID);
      this.checkPatientDetailsPatched();
    } else {
      this.benDataInboundPopulationg();
    }

  }
  initialization() {
    if (this.current_role == "MO" || this.current_role == "HAO") {
      this.requiredRole = true;
      this.minlength = "3";
    } else {
      this.requiredRole = false;
      this.MoActionErr = false;
      this.HaoActionErr = false;
      this.minlength = "0";
    }
    this.is_patient = "self";
    this.disableFlag = true;
    this.isSelfFlag= true;
    this.nameFlag = false;
  }
  initiallyCountry() {
    this._locationService.getCountry().subscribe(
      (response) => this.getAllCounrySuccessHandeler(response),
      (err) => {
        this.alertMessage.alert(
          this.currentLanguageSet.errorInFetchingStates,
          "error"
        );
      }
    );
  }
  getAllCounrySuccessHandeler(response) {
    this.countries = response;
  }

  getCitiesFromInter(countryID) {
    this._locationService.getCity(countryID).subscribe(
      (response) => this.getAllCitySuccessHandelerFromInter(response),

      (err) => {
        this.alertMessage.alert(
          this.currentLanguageSet.errorInFetchingStates,
          "error"
        );
      }
    );
  }
  getAllCitySuccessHandelerFromInter(response) {
    this.citiesFromInter = response;
  }

  getCitiesToInter(countryID) {
    this._locationService.getCity(countryID).subscribe(
      (response) => this.getAllCitySuccessHandelerToInter(response),

      (err) => {
        this.alertMessage.alert(
          this.currentLanguageSet.errorInFetchingStates,
          "error"
        );
      }
    );
  }
  getAllCitySuccessHandelerToInter(response) {
    this.citiesToInter = response;
  }

  initiallyState() {
    this._locationService.getStates(1).subscribe(
      (response) => this.getAllStatesSuccessHandeler(response),
      (err) => {
        this.alertMessage.alert(
          this.currentLanguageSet.errorInFetchingStates,
          "error"
        );
      }
    );
  }
  getAllStatesSuccessHandeler(response) {
    this.states = response;
  }
  GetDistrictsFromDom(value) {
    let res = this._locationService
      .getDistricts(value)
      .subscribe((response) => this.SetDistrictsFromDom(response));
  }
  GetDistrictsToDom(value) {
    let res = this._locationService
      .getDistricts(value)
      .subscribe((response) => this.SetDistrictsTomDom(response));
  }
  SetDistrictsFromDom(response: any) {
    this.districtsFromDom = response;
  }
  SetDistrictsTomDom(response: any) {
    this.districtsToDom = response;
  }

  getSubDistrictFromDom(districtID) {
    this.village = undefined;
    this.searchBenData
      .getSubDistricts(districtID)
      .subscribe((response) =>
        this.getSubDistrictSuccessHandelerFromDom(response)
      );
  }
  getSubDistrictToDom(districtID) {
    this.village = undefined;
    this.searchBenData
      .getSubDistricts(districtID)
      .subscribe((response) =>
        this.getSubDistrictSuccessHandelerToDom(response)
      );
  }

  getSubDistrictSuccessHandelerFromDom(response) {
    this.subDistrictsFromDom = response;
    //	console.log("********SUBDISTRICT", this.subDistricts);
  }
  getSubDistrictSuccessHandelerToDom(response) {
    this.subDistrictsToDom = response;
    //	console.log("********SUBDISTRICT", this.subDistricts);
  }

  getVillage(subDistrictID) {
    this.searchBenData
      .getVillages(subDistrictID)
      .subscribe((response) => this.getVillageSuccessHandeler(response));
  }

  getVillageSuccessHandeler(response) {
    this.villages = response;
    //	console.log("********VILLAGES", this.villages);
  }

  onChangeSymptom(event, symp) {
    this.cvdSymptom.push(symp);
    // this.covidFill_flag=true;
  }
  changeConfirmedCase(IsConfirmedCaseCOVID) {
    if (IsConfirmedCaseCOVID == "yes") {
      this.confirmedCaseCOVID_flag = true;
    } else {
      this.confirmedCaseCOVID_flag = false;
    }
  }
  changeFeverCoughDifficulty(feverCoughBreathDifficulty) {
    if (feverCoughBreathDifficulty == "yes") {
      this.feverCoughBreath_flag = true;
    } else {
      this.feverCoughBreath_flag = false;
    }
  }
  changeHistoryOfTravelPlaces(historyOfTravelPlaces) {
    if (historyOfTravelPlaces == "yes") {
      this.TravelPlaces_flag = true;
    } else {
      this.TravelPlaces_flag = false;
    }
  }

  onCheckboxChagen(event, value) {
    if (event.checked) {
      this.cvdSymptom.push(value);
    }
    if (!event.checked) {
      let index = this.cvdSymptom.indexOf(value);

      if (index > -1) {
        this.cvdSymptom.splice(index, 1);
      }
    }
  }

  onCheckQuestion1(fev) {
    if (fev == true) {
      this.symptomQ1 = "yes";
      console.log("Qut1Checked");
      this.disablesymptomQ1 = false;
      this.disablenoSymptom = true;
    } else {
      this.symptomQ1 = "no";
      console.log("Qut1UnChecked");
      this.disablesymptomQ1 = true;
      if (this.symptomQ2 == "no" && this.symptomQ3 == "no")
        this.disablenoSymptom = false;
    }
    this.populate();
  }

  onCheckQuestion2(cough) {
    if (cough == true) {
      this.symptomQ2 = "yes";
      this.disablesymptomQ2 = false;
      this.disablenoSymptom = true;
    } else {
      this.symptomQ2 = "no";
      this.disablesymptomQ2 = true;
      if (this.symptomQ1 == "no" && this.symptomQ3 == "no")
        this.disablenoSymptom = false;
    }
    this.populate();
  }
  onCheckQuestion3(breathingDiff) {
    if (breathingDiff == true) {
      this.symptomQ3 = "yes";
      this.disablesymptomQ3 = false;
      this.disablenoSymptom = true;
    } else {
      this.symptomQ3 = "no";
      this.disablesymptomQ3 = true;
      if (this.symptomQ1 == "no" && this.symptomQ2 == "no")
        this.disablenoSymptom = false;
    }
    this.populate();
  }
  onCheckQuestion4(noSymptom) {
    if (noSymptom == true) {
      this.symptomQ4 = "yes";
      this.disablesymptomQ4 = false;

      this.diableOtherSymptom = true;
    } else {
      this.symptomQ4 = "no";
      this.disablesymptomQ4 = true;
      this.diableOtherSymptom = false;
    }
    this.populate();
  }
  /*changeSuspectedCovid()
  {
    if( !this.confirmedCaseCOVID_flag &&   !this.feverCoughBreath_flag && this.TravelPlaces_flag)
    {
    this.recommendationText="";
    this.suspectedCovid="";
    }
     else
      if( !this.confirmedCaseCOVID_flag &&   !this.feverCoughBreath_flag && !this.TravelPlaces_flag)
      {
      this.recommendationText="Keep a watch on symptoms of COVID (Cough, Fever, Breathlessness),Kindly follow Cough Etiquette,Hand Hygiene and Social Distancing";
      this.suspectedCovid="No";
      }else
      if( !this.confirmedCaseCOVID_flag &&   this.feverCoughBreath_flag && !this.TravelPlaces_flag){
      this.recommendationText="Treat as Acute Respiratory Infection,Kindly follow Cough Etiquette, Hand Hygiene and Social Distancing";
      this.suspectedCovid="No";
    } else
      if( this.confirmedCaseCOVID_flag &&   !this.feverCoughBreath_flag){
      this.recommendationText="Facility Quarantine for 24 days,Kindly follow Cough Etiquette, Hand Hygiene";
      this.suspectedCovid="No";
       } else 
      if( this.confirmedCaseCOVID_flag &&   this.feverCoughBreath_flag){
      this.recommendationText="Hospital Isolation for 14 days,Contact Tracing,Kindly follow Cough Etiquette, Hand Hygiene";
      this.suspectedCovid="Yes";  
    }
    else
    {
      this.recommendationText="";
      this.suspectedCovid="";  
    }
    /*this.recommendationArray=this.recommendationText.split(":");
    console.log("REcomArray"+this.recommendationArray)*/
  /*  this.covidFill_flag=true;
  }*/
  travelStatuschange(boolean_flag) {
    this.disableTravelButton = false;
    this.travelSelected = true;
    if (boolean_flag == "true") {
      this.question1 = "yes";
      this.istravelStatus = true;
    } else {
      this.question1 = "no";
      this.istravelStatus = false;
    }
    //this.covidFill_flag=true;
    this.populate();
  }
  travelTypeDomesticchange(travelMode_flag) {
    if (travelMode_flag == true) {
      this.istravelModeDomestic = true;
    } else {
      this.istravelModeDomestic = false;
    }
    // this.covidFill_flag=true;
  }
  travelTypeInternationalchange(travelMode_flag) {
    if (travelMode_flag == true) {
      this.istravelModeInternatinal = true;
    } else {
      this.istravelModeInternatinal = false;
    }
    //this.covidFill_flag=true;
  }
  contactStatuschange(contactstatus) {
    this.confirmedCaseCOVID_flag = false;
    this.feverCoughBreath_flag = false;
    this.TravelPlaces_flag = false;

    if (contactstatus.length > 0) {
      this.question3 = "yes";
      this.contactArray = contactstatus;
      for (let a = 0; a < contactstatus.length; a++) {
        if (contactstatus[a] == "Is a confirmed case of COVID-19") {
          this.confirmedCaseCOVID_flag = true;
        }

        if (
          contactstatus[a] ==
          "Is having symptoms of Fever, Cough or breathing difficulty"
        ) {
          this.feverCoughBreath_flag = true;
        }

        if (
          contactstatus[a] ==
          "Has a history of travel to places reporting local transmission"
        ) {
          this.TravelPlaces_flag = true;
        }
      }
    } else {
      this.question3 = "no";
    }
    this.populate();
  }
  updateCheckedOptions(symp, event) {
    this.cvdSymptom[symp] = event.target.checked;
  }
  outboundBenDetail: any = [];
  benDataOnBenIDSuccess(resp) {
    this.outboundBenDetail = resp[0];
    this.benDataOutboundPopulating();
  }
  benDataOutboundPopulating() {
    this.firstName = this.outboundBenDetail.firstName;
    this.parentBenRegName = this.outboundBenDetail.firstName;
    this.lastName = this.outboundBenDetail.lastName;
    this.gender = this.outboundBenDetail.m_gender.genderID;
    this.genders = [{ genderName: this.outboundBenDetail.m_gender.genderName }];
    this.age = this.outboundBenDetail.actualAge;
    this.districtID = this.outboundBenDetail.i_bendemographics.districtID;
  }

  benDataInboundPopulationg() {
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
      this.parentBenRegName = this.beneficiaryDetails.i_beneficiary.firstName; // currently not in use*****CR
      this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
      this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
      this.age = this.beneficiaryDetails.i_beneficiary.actualAge;
      this.districtID =
        this.beneficiaryDetails.i_beneficiary.i_bendemographics.districtID;
      this.genders = [
        {
          genderName: this.beneficiaryDetails.i_beneficiary.m_gender.genderName,
        },
      ];

      console.log("GENDERS", this.genders);
    } else {
      this.firstName = this.saved_data.firstName;
      this.parentBenRegName = this.saved_data.firstName;
      this.lastName = this.saved_data.lastName;
      this.gender = this.saved_data.gender;
      this.age = this.saved_data.age;
      this.districtID = this.saved_data.districtID;

      this.retrieveGenderName(this.saved_data.gender);
    }
    this.checkPatientDetailsPatched();
  }

  checkPatientDetailsPatched()
  {
    if( this.firstName !== undefined && this.firstName !== null && this.firstName !== "" 
    && this.gender !== undefined && this.gender !== null && this.gender !== "" 
    && this.age !== undefined && this.age !== null && this.age !== "") {
    this.disableSaveForGender = false;
    this.fetchChiefComplaintsBasedOnGender();
    }
    else
    {
    this.disableSaveForGender = true;
    this.alertMessage.confirm("info", "Unable to fetch beneficiary details, Please click 'OK' to reload beneficiary details again")
    .subscribe((confirmResponse) => {
      if (confirmResponse) {
        this.fetchBenenficiaryDetails();
      }
      else
      {
        this.disableSaveForGender = false;
      }
    });
  }
}

fetchBenenficiaryDetails()
{

  if(this.is_patient === "self")
  {
  let data = '{"callID":"' + this.callerID + '"}';
  this.callerService.getBeneficiaryByCallID(data).subscribe(
    (response) => {
      
      this.firstName = response.i_beneficiary.firstName;
      this.parentBenRegName = response.i_beneficiary.firstName;
      this.lastName = response.i_beneficiary.lastName;
      this.gender = response.i_beneficiary.m_gender.genderID;
      this.age = response.i_beneficiary.actualAge;
      this.districtID =
      response.i_beneficiary.i_bendemographics.districtID;
      this.genders = [
        {
          genderName: response.i_beneficiary.m_gender.genderName,
        },
      ];
      this.checkPatientDetailsPatched();

    },
    (err) => {
      console.log("error in benDetailByCallerID");
      this.alertMessage.alert(err.errorMessage, 'error');
      this.checkPatientDetailsPatched();
    }
  );
  }
  else
  {
    const obj = {
      beneficiaryRegID: this.beneficiaryRegID,
      callID: this.callerID,
    };
    this.caseSheetService.getPresentCaseSheet(obj).subscribe(
      (res) => {
        let name = res[0].patientName.split(" ");
        this.firstName = name[0];
        this.lastName = name[1];
        this.gender = res[0].patientGenderID;
        this.age = res[0].patientAge;
        this.retrieveGenderName(res[0].patientGenderID);
        this.checkPatientDetailsPatched();
      },
      (err) => {
        this.alertMessage.alert(err.errorMessage, "error");
        this.checkPatientDetailsPatched();
      }
    ); 
  }


}

  filter(val: string): string[] {
    return this.chiefCompliants.filter(
      (option) => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  successHandeler(response) {
    //  console.log("common data", response);
    if (response) {
      this.commonData = response;
      this.relationShips = response.benRelationshipTypes.filter(function (obj) {
        return obj.benRelationshipType.toLowerCase() != "self";
      });
    }
  }

  servicesSuccessHandler(response) {
    this.services = response;
    this.getSubserviceID();
  }

  getSubserviceID() {
    console.log(this.services, "ALL SUB SERVICES");

    for (let i = 0; i < this.services.length; i++) {
      if (this.current_role == "HAO") {
        if (this.services[i].subServiceName.indexOf("Health") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "CO") {
        if (this.services[i].subServiceName.indexOf("Counselling") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "MO") {
        if (this.services[i].subServiceName.indexOf("Medical") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "SIO") {
        if (this.services[i].subServiceName.indexOf("Blood") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        } else if (this.services[i].subServiceName.indexOf("Organ") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "PD") {
        if (this.services[i].subServiceName.indexOf("Psychiatrist") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      }
    }
    this.getCategories();
    console.log("this.subServiceID: " + this.subServiceID);
  }

  getCategories() {
    let obj = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
      subServiceID: this.subServiceID,
    };

    this.caseSheetService.getCategories(obj).subscribe((response) => {
      this.categorySuccess(response);
    });
  }
  allCategories: any = [];
  categorySuccess(res) {
    this.allCategories = res;
    this.on_WB_or_INFO_change("1");
  }

  wellbeing_infotype: string = "1";
  testFlagOne: boolean = true;
  filteredCategories: any = [];
  on_WB_or_INFO_change(wellbeing_infotype) {
    this.catSubcatForm.reset();
    //  this.subcategory = "";
    this.subCategories = [];
    //  this.category = "";
    this.showDocument = false;
    if (wellbeing_infotype == "1") {
      this.testFlagOne = true;
      this.guidelinesFlag = false;
      this.informationFlag = false;
      this.filteredCategories = this.allCategories.filter(function (obj) {
        return obj.isWellBeing == true;
      });
    }
    if (wellbeing_infotype == "2") {
      this.testFlagOne = false;
      this.guidelinesFlag = false;
      this.informationFlag = false;
      this.filteredCategories = this.allCategories.filter(function (obj) {
        return obj.isWellBeing == null || obj.isWellBeing == false;
      });
    }
  }
  categoryID: any;
  subCategoryID: any;

  showDetails(categoryId: any, subCategoryID: any) {
    console.log(this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails);
    console.log(this.saved_data.benRegID);
    const getDocuments = {
      categoryID: categoryId ? categoryId : null,
      subCategoryID: subCategoryID ? subCategoryID : null,
      providerServiceMapID: this.saved_data.current_service.serviceID
        ? this.saved_data.current_service.serviceID
        : null,
    };
    console.log("Request: " + JSON.stringify(getDocuments));
    this.caseSheetService.getDetails(getDocuments).subscribe(
      (response) => {
        if (response !== undefined && response !== null) {
          this.detailsSuccess(response);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  showDocument: boolean = false;
  detailsList: any = [];
  detailsSuccess(res) {
    this.showDocument = true;
    this.noDocument = true;
    this.detailsList = res;
    res.forEach((filterSubCatPath) => {
      if (
        filterSubCatPath.subCatFilePath !== null &&
        filterSubCatPath.subCatFilePath !== undefined
      ) {
        this.noDocument = false;
      }
    });
    console.log(this.detailsList);
  }
  guidelinesFlag: boolean = false;
  informationFlag: boolean = false;
  showGuidelines() {
    this.guidelinesFlag = true;
    this.informationFlag = false;
  }

  showInformation() {
    this.informationFlag = true;
    this.guidelinesFlag = false;
  }

  getSubCategories(categoryID) {
    this.subcategory = null;
    this.showDocument = false;
    this.caseSheetService.getSubCategories(categoryID).subscribe((response) => {
      this.subSategorySuccess(response);
    });
  }
  subCategories: any = [];
  subSategorySuccess(res) {
    this.subCategories = res;
  }

  hideDocument() {
    this.showDocument = false;
  }
  providerOutboundData: any = [];
  ngOnChanges() {
    if (this.beneficiaryRegID) {
      this.getCaseSheetData();
    }
  }

  patientDetailsFields(val: any) {
    if (val === "self" && this.current_campaign == "INBOUND") {
      this.disableFlag = true;
      this.isSelfFlag= true;
      this.benDataInboundPopulationg();
      this.ageFlag = false;
      this.nameFlag = false;
      this.genderErrFlag = false;
      this.genderFlag = false;
      this.chiefCompliantOrDiseaseSummary = "1";
      this.fetchChiefComplaintsBasedOnGender();
    }
    if (val === "self" && this.current_campaign == "OUTBOUND") {
      this.disableFlag = true;
      this.isSelfFlag= true;
      this.ageFlag = false;
      this.nameFlag = false;
      this.genderErrFlag = false;
      this.genderFlag = false;
      this.benDataOutboundPopulating();
      this.chiefCompliantOrDiseaseSummary = "1";
      this.fetchChiefComplaintsBasedOnGender();
    }

    if (val === "other") {
      this.disableFlag = false;
      this.isSelfFlag= false;
      this.patientDetailForm.resetForm();
      this.setDefaultAgeUnit();
      this.ageFlag = true;
      this.nameFlag = true;
      this.genderFlag = true;
      this.chiefCompliants = [];
      this.diseaseNames = [];
      this.chiefCompliantOrDiseaseSummary = null;
    }
    this.caseSheetForm.resetForm();
    this.disableSaveForGender = false;
  }

  ageInput(value) {
    if (value == undefined) {
    } else if (value >= 1 && value <= 120) {
      this.ageFlag = false;
    } else {
      this.ageFlag = true;
      jQuery("#age").addClass("field-error");
    }
  }

  genderErrFlag: any = false;
  genderFlag: any = false;
  genderchange(value) {
    if (value == "") {
      this.genderErrFlag = true;
      this.genderFlag = true;
    } else {
      this.genderErrFlag = false;
      this.genderFlag = false;
      this.retrieveGenderName(value);
    }
  }
  retrieveGenderName(value) {
    if (this.commonData.m_genders != undefined) {
      this.genders = this.commonData.m_genders.filter(function (obj) {
        return obj.genderID == value;
      });
      if (this.age !== null && this.age !== undefined && this.genders !== null && this.genders !== undefined) {
        this.fetchChiefComplaintsBasedOnGender();
      }
    }
  }
  pcc: any;
  symptoms: any;
  psd: any = "";
  recommendedActive: any;
  allergies: any;
  notesComments: any;
  activeByMo: any;
  activeByHao: any;
  activeByCo: any;

  symptom: any = "";
  selectedSymptoms: any = "";

  questions: any = [];
  patientData: any = {};
  invokeDialog(val) {
    let gen;
    if (this.current_campaign == "INBOUND" && this.is_patient == "self") {
      gen = this.saved_data.ben_gender_name.charAt(0);
    } else if (
      this.current_campaign == "INBOUND" &&
      this.is_patient == "other"
    ) {
      gen = this.genders[0].genderName.charAt(0);
    } else if (this.current_campaign == "OUTBOUND") {
      gen = this.saved_data.ben_gender_name.charAt(0);
    }
    console.log(
      "this.saved_data.ben_gender_name: " + this.saved_data.ben_gender_name
    );
    if (this.pcc !== null && this.pcc !== undefined && this.pcc !== "") {
      //  this.patientData = { "age": 21, "gender": "M", "symptom": this.symptom }
      // this.patientData = { "age": this.age, "gender": this.saved_data.ben_gender_name?this.saved_data.ben_gender_name.charAt(0):this.genders[0].genderName.charAt(0), "symptom": this.pcc }
      this.patientData = { age: this.age, gender: gen, symptom: this.pcc };

      this._CDSSService.getQuestions(this.patientData).subscribe(
        (any) => {
          this.success(any);
        },
        (err) => {
          console.log(err);
        }
      );

      console.log("patientData: " + JSON.stringify(this.patientData));

      this.sctID_pcc = "";
      this.sctID_pcc_toSave = "";
      this.getSnomedCTRecord(this.pcc, "pcc");
    } else {
      this.psd = null;
      this.recommendedAction = null;
    }
  }

  getSnomedCTRecord(term, field) {
    this.snomedService.getSnomedCTRecord(term).subscribe(
      (response) => {
        console.log("Snomed response: " + JSON.stringify(response));

        if (response.conceptID) {
          if (field == "pcc") {
            this.sctID_pcc = "SCTID: " + response.conceptID;
            this.sctID_pcc_toSave = response.conceptID;
          } else if (field == "psd") {
            this.sctID_psd += term + ("(SCTID): " + response.conceptID + "\n");
            if (this.sctID_psd_toSave.length == 0)
              this.sctID_psd_toSave = response.conceptID;
            else this.sctID_psd_toSave += "," + response.conceptID;
          }

          console.log("sctID_pcc: " + this.sctID_pcc);
        } else {
          // No SnomedCT ID found
          if (field == "pcc") {
            this.sctID_pcc_toSave = "NA";
          } else if (field == "psd") {
            if (this.sctID_psd_toSave.length == 0) this.sctID_psd_toSave = "NA";
            else this.sctID_psd_toSave += ",NA";
          }
        }
      },
      (err) => {
        console.log("getSnomedCTRecord Error");
      }
    );
  }

  result: any = [];
  success(res) {
    this.questions = res;
    console.log(this.questions["Questions"]);
    if (
      this.questions["Questions"] !== undefined &&
      this.questions["Questions"] !== null &&
      this.questions["Questions"].length > 0
    ) {
      let dr = this.dialog.open(DialogOverviewExampleDialog, {
        // height: '550px',
        width: 0.8 * window.innerWidth + "px",
        panelClass: "dialog-width",
        disableClose: true,
        data: {
          patientData: this.patientData,
          current_language_set: this.current_language_set,
        },
      });
      dr.afterClosed().subscribe((result) => {
        console.log("POST MODAL CLOSING", result);
        this.result = result;

        this.psd = "";
        this.recommendedAction = "";
        this.selectedSymptoms = "";
        this.sctID_psd = "";
        this.sctID_psd_toSave = "";
        if (result != undefined) {
          let diseaseArr = [];
          let recomdAction = [];
          for (var a = 0; a < result.length; a++) {
            diseaseArr.push(result[a].diseases);

            this.getSnomedCTRecord(result[a].diseases, "psd");
            //  this.psd.slice(0,100);
            if (!this.recommendedAction.includes(result[a].action)) {
              recomdAction.push(result[a].action);
            }
            //  this.recommendedAction.slice(0,100);
            for (var k = 0; k < result[a].symptoms.length; k++) {
              this.selectedSymptoms += result[a].symptoms[k] + " ";
            }
          }
          this.psd = (diseaseArr !== undefined && diseaseArr.length > 0) ? diseaseArr.join(",") : "" ;
          this.recommendedAction =  (recomdAction !== undefined && recomdAction.length > 0) ? recomdAction.join(",") : "";

          this.recommendedAction = this.recommendedAction.trim().slice(0, 300);
          this.psd = this.psd.trim().slice(0, 100);
          this.selectedSymptoms = this.selectedSymptoms.trim().slice(0, 300);
          console.log(
            "lengths",
            this.selectedSymptoms.length,
            "/300",
            this.recommendedAction.length,
            "/100",
            this.psd.length,
            "/100"
          );
        } else {
          this.psd = this.pcc.trim();
          // this.recommendedAction="";
        }
      });
    } else {
      this.alertMessage.alert(
        this.currentLanguageSet.noQuestionsFoundForCorrespondingInput
      );
      this.psd = this.pcc.trim();
    }
  }

  loadLatestHistory() {
    let latestHistoryData = this.caseSheetData[0];
    if (latestHistoryData && latestHistoryData.isSelf == true) {
      this.is_patient = "self";
    } else {
      this.is_patient = "other";
    }
  }
  prescriptionID: any;
  showPrescription() {
    if (this.psd) {
      this.prespsd = this.psd;
      this.presFlag = true;
    } else {
      this.prespsd = this.informationGiven;
      this.presFlag = false;
    }

    let dialogReff = this.dialog.open(prescriptionComponent, {
      // height: '620px',
      width: 0.8 * window.innerWidth + "px",
      panelClass: "dialog-width",
      disableClose: true,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        age: this.age,
        gender: this.gender,
        psd: this.prespsd,
        current_language_set: this.current_language_set,
        prescriptionID: this.prescriptionID,
        presFlag: this.presFlag,
      },
    });
    dialogReff.afterClosed().subscribe((result) => {
      if (this.prescriptionID == undefined) {
        this.prescriptionID = result;
      }
      let obj = '{"beneficiaryRegID":"' + this.beneficiaryRegID + '"}';
      this.caseSheetService.getValidCaseSheetData(obj).subscribe(
        (response) => {
          this.handlesuccess2(response);
        },
        (err) => {
          console.log("Case Sheet Error");
        }
      );
    });
  }

  getCaseSheetData() {
    let data = '{"beneficiaryRegID":"' + this.beneficiaryRegID + '"}';

    this.caseSheetService.getCaseSheetData(data).subscribe(
      (response) => {
        this.handlesuccess(response);
      },
      (err) => {
        ("");
        this.alertMessage.alert(err.errorMessage, "error");
      }
    );

    let obj = '{"beneficiaryRegID":"' + this.beneficiaryRegID + '"}';

    this.caseSheetService.getValidCaseSheetData(obj).subscribe(
      (response) => {
        this.handlesuccess2(response);
      },
      (err) => {}
    );
  }
  changeCovidDisplay(covidDisp, values) {
    if (covidDisp == "yes") {
      this.covidFill_flag = true;
      this.isdisplay = true;
      this.disableSaveButton = true;
    } else {
      this.covidFill_flag = false;
      this.isdisplay = false;
      this.disableSaveButton = false;
      this.resetCovidForm(values);
    }
  }
  resetCovidForm(values) {
    this.disablenoSymptom = false;
    this.diableOtherSymptom = false;
    this.travelType = "";
    this.travelstat = undefined;
    this.domest = undefined;
    this.inter = undefined;
    this.istravelStatus = false;
    //values.domestic.checked=false;
    //values.international.checked=false;
    this.istravelModeDomestic = false;
    this.istravelModeInternatinal = false;
    this.modeOfTravelDom = undefined;
    values.modeOfTravelDomestic = "";
    this.DomFromstate = undefined;
    values.FromstateDom = "";
    this.DomFromDistrict = undefined;
    values.FromDistrictDom = "";
    this.DomFromsubDistrict = undefined;
    values.FromsubDistrictDom = "";
    this.DomTostate = undefined;
    values.TostateDom = "";
    this.DomToDistrict = undefined;
    values.ToDistrictDom = "";
    this.DomTosubDistrict = undefined;
    values.TosubDistrictDom = "";
    this.IntermodeOfTravel = undefined;
    values.modeOfTravelInter = "";
    this.InterFromCountry = undefined;
    values.FromCountryInter = "";
    this.InterFromcity = undefined;
    values.FromcityInter = "";
    this.InterToCountry = undefined;
    values.ToCountryInter = "";
    this.InterTocity = undefined;
    values.TocityInter = "";
    this.fev = undefined;
    this.cough = undefined;
    this.breathingDiff = undefined;
    this.nosymp = undefined;

    this.cvdSymptom = [];
    this.contactstat = undefined;
    this.contactArray = [];
    this.seekMedicalConsult = undefined;
    this.contactJoin = "";
    this.suspectedstat = undefined;
    this.suspectedCovid = "";
    this.recommend = undefined;
    this.recommendationText = "";
    this.question1 = "";
    this.question2 = "";
    this.question3 = "no";
    this.symptomQ1 = "no";
    this.symptomQ2 = "no";
    this.symptomQ3 = "no";
    this.symptomQ4 = "no";

    this.covidFill_flag = false;
    // this.wellbeing_infotype = undefined;
    // this.wellbeing_infotype = "1";
    // this.on_WB_or_INFO_change("1");
  }

  caseSheetObj: any = {};
  saveCaseSheetData(values: any) {
    if (this.current_role === "CO") {
      // if(this.pcc.length>0 && this.treatmentRecommendation.length>0){
      //   this.saveMainFlag = true;
      // }
      if (
        (this.pcc !== undefined &&
        this.pcc !== null &&
        this.pcc !== "" &&
        this.pcc.length !== 0)
      ) {
        this.pccFlag = true;
      }
      
      if(this.pccFlag ){
        this.saveCasesheetValues(values);
      }

      else{
        this.pccFlag=false;
      }


    } else {
      if (
        (this.pcc !== undefined && this.pcc !== null && this.pcc !== "") ||
        (values.diseasesSummary !== undefined &&
          values.diseasesSummary !== null &&
          values.diseasesSummary !== "") 
      ) {
          //  this.treatmentRecommendationFlag = true;
        this.saveCasesheetValues(values);
      } else {
        this.alertMessage.alert(
          this.currentLanguageSet.pleaseFillPccOrDiseasesSummary
        );
      }
    }

  }

  
  saveCasesheetValues(values) {
    //relationship to be acessed by values.relationshipTypeID;
    this.caseSheetObj = {};
    this.caseSheetObj.beneficiaryRegID = this.beneficiaryRegID;
    let lastname = this.lastName ? this.lastName : "";
    this.caseSheetObj.patientName = this.firstName + " " + lastname;
    this.caseSheetObj.patientAge = (this.age === "") ? null : this.age;
    this.caseSheetObj.patientGenderID = (this.gender === "") ? null : this.gender;
    this.caseSheetObj.allergies = values.allergies;

    this.caseSheetObj.selecteDiagnosisID =
      values.psd != null || values.psd != undefined
        ? this.sctID_psd_toSave
        : null;
    this.caseSheetObj.selecteDiagnosis =
      values.psd != null || values.psd != undefined ? values.psd : null;
    if (
      values.informationGiven != null ||
      values.informationGiven != undefined
    ) {
      this.caseSheetObj.selecteDiagnosisID = this.summaryObj.diseasesummaryID;
      this.caseSheetObj.selecteDiagnosis = values.diseasesSummary;
    }
    if (
      this.caseSheetObj.selecteDiagnosis == null ||
      this.caseSheetObj.selecteDiagnosis == undefined
    ) {
      this.caseSheetObj.selecteDiagnosisID = null;
    }
    this.caseSheetObj.diseaseSummary = this.pcc ? this.pcc.trim() : null;

    if (!(this.pcc == ""))
      this.caseSheetObj.diseaseSummaryID = this.sctID_pcc_toSave;

    if (
      this.caseSheetObj.diseaseSummary == null ||
      this.caseSheetObj.diseaseSummary == undefined
    )
      this.caseSheetObj.diseaseSummaryID = null;
    this.caseSheetObj.addedAdvice = values.recommendedAction;
    this.caseSheetObj.prescription = values.notesComments;
    this.caseSheetObj.remarks = values.notesComments;
    this.caseSheetObj.actionByHAO = values.actionByHao;
    this.caseSheetObj.riskLevel = values.riskLevel;
    // this.caseSheetObj.actionByCO = values.actionByCo;
    this.caseSheetObj.treatmentRecommendation = values.treatmentRecommendation;
    this.caseSheetObj.actionByMO = values.actionByMo;
    this.caseSheetObj.actionByPD = values.actionByPd;

    this.caseSheetObj.isSelf = this.isSelfFlag;
    this.caseSheetObj.providerServiceMapID =
      this.saved_data.current_service.serviceID;
    this.caseSheetObj.deleted = false;
    this.caseSheetObj.createdBy = this.agentData.userName;
    this.caseSheetObj.isChiefComplaint = this.chiefComplaint;
    if (this.saved_data.benCallID) {
      this.caseSheetObj.benCallID = this.saved_data.benCallID;
    } else {
      this.beneficiaryDetails =
        this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails; //it is requiredboth in constructor and here, due to some inbound/outbound scenario
      this.caseSheetObj.benCallID = this.beneficiaryDetails.benCallID;
    }
    if (this.current_role === "MO" || this.current_role === "HAO") {
      this.caseSheetObj.algorithm = this.selectedSymptoms;
    }

    if (this.current_role == "CO" || this.current_role == "PD") {
      this.caseSheetObj.districtID = this.districtID;
      this.caseSheetObj.categoryID = this.category;
      this.caseSheetObj.subCategoryID = this.subcategory;
    }

    this.caseSheetObj.travel_14days = values.travelstatus;
    if (
      this.istravelModeDomestic == true &&
      this.istravelModeInternatinal == true
    )
      this.travelType = "domestic" + "," + "international";
    else if (this.istravelModeDomestic == true) this.travelType = "domestic";
    else if (this.istravelModeInternatinal == true)
      this.travelType = "international";
    else this.travelType = null;
    this.caseSheetObj.travel_type = this.travelType;

    this.caseSheetObj.domestic_mode = values.modeOfTravelDomestic;
    this.caseSheetObj.domStateID_from = values.FromstateDom;
    this.caseSheetObj.domDistrictID_from = values.FromDistrictDom;
    this.caseSheetObj.domTalukID_from = values.FromsubDistrictDom;

    this.caseSheetObj.domStateID_to = values.TostateDom;
    this.caseSheetObj.domDistrictID_to = values.ToDistrictDom;
    this.caseSheetObj.domTalukID_to = values.TosubDistrictDom;

    this.caseSheetObj.international_mode = values.modeOfTravelInter;
    this.caseSheetObj.interCountryID_from = values.FromCountryInter;
    this.caseSheetObj.interCityID_from = values.FromcityInter;
    this.caseSheetObj.interCountryID_to = values.ToCountryInter;
    this.caseSheetObj.interCityID_to = values.TocityInter;
    this.caseSheetObj.symptoms = this.cvdSymptom.join(",");

    if (this.contactArray.length > 0) {
      this.contactJoin = this.contactArray.join(",");
    }
    this.caseSheetObj.COVID19_contact_history = this.contactJoin;

    this.caseSheetObj.medical_consultation = values.seekMedicalConsultation;
    if (this.suspectedCovid == "Yes") {
      this.caseSheetObj.Suspected_COVID19 = "true";
    } else if (this.suspectedCovid == "No") {
      this.caseSheetObj.Suspected_COVID19 = "false";
    } else this.caseSheetObj.Suspected_COVID19 = this.suspectedCovid;

    this.caseSheetObj.recommendation = this.recommendationText;
    this.caseSheetObj.isCOVIDAvailable = this.covidFill_flag;

    if (this.is_patient == "other" && this.current_role === "HAO") {
      this.caseSheetObj.ageUnits = this.ageUnit;
      this.caseSheetObj.dOB = this.DOB;
    }
    let data = JSON.stringify(this.caseSheetObj);
    this.caseSheetService.saveCaseSheetData(data).subscribe(
      (response) => {
        if (response !== undefined && response !== null) {
          this.successHandler(response);
        }
      },
      (err) => {
        this.alertMessage.alert(err.status, "error");
      }
    );
  }
  populate() {
    if (
      this.disableTravelButton == true ||
      (this.disablesymptomQ1 == true &&
        this.disablesymptomQ2 == true &&
        this.disablesymptomQ3 == true &&
        this.disablesymptomQ4 == true)
    )
      this.disableSaveButton = true;
    else if (
      this.disableTravelButton == false &&
      (this.disablesymptomQ1 == false ||
        this.disablesymptomQ2 == false ||
        this.disablesymptomQ3 == false ||
        this.disablesymptomQ4 == false)
    )
      this.disableSaveButton = false;
    else this.disableSaveButton = true;

    if (
      this.symptomQ1 == "yes" ||
      this.symptomQ2 == "yes" ||
      this.symptomQ3 == "yes"
    ) {
      //if((this.symptomQ1=="yes"||this.symptomQ2=="yes"||this.symptomQ3=="yes")&& this.symptomQ4=="no")
      this.question2 = "yes";
    } else if (this.symptomQ4 == "yes") this.question2 = "no";
    else if (
      this.symptomQ1 == "no" ||
      this.symptomQ2 == "no" ||
      this.symptomQ3 == "no" ||
      this.symptomQ4 == "no"
    ) {
      this.question2 = "";
    }

    console.log(
      "QuestionStatus" +
        this.question1 +
        "," +
        this.question2 +
        "," +
        this.question3
    );
    if (
      (this.question1 == "yes" &&
        this.question2 == "yes" &&
        this.question3 == "yes") ||
      (this.question1 == "yes" &&
        this.question2 == "yes" &&
        this.question3 == "no") ||
      (this.question1 == "no" &&
        this.question2 == "yes" &&
        this.question3 == "yes")
    ) {
      this.recommendationText =
        "Hospital Isolation.Initiate treatment.Test for Covid 19 and follow instructions of the hospital personnel.Contact Tracing.Kindly follow Cough Etiquette, Hand Hygiene";

      this.suspectedCovid = "Yes";
    } else if (
      this.question1 == "no" &&
      this.question2 == "yes" &&
      this.question3 == "no"
    ) {
      console.log("Questionyes" + this.question2);
      this.recommendationText =
        "Treat as Acute Respiratory Infection.Kindly follow Cough Etiquette, Hand Hygiene";

      this.suspectedCovid = "No";
    } else if (
      this.question1 == "no" &&
      this.question2 == "no" &&
      this.question3 == "no"
    ) {
      console.log("Question2" + this.question2);
      console.log(
        "QuestionStatus" +
          this.question1 +
          "," +
          this.question2 +
          "," +
          this.question3
      );
      this.recommendationText =
        "Keep a watch on your health specifically your body temperature.Follow cough etiquette, hand hygiene and social distancing";

      this.suspectedCovid = "No";
    } else if (
      (this.question1 == "no" &&
        this.question2 == "no" &&
        this.question3 == "yes") ||
      (this.question1 == "yes" &&
        this.question2 == "no" &&
        this.question3 == "yes")
    ) {
      this.recommendationText =
        "Facility Quarantine 24 hours.Test for Covid 19; if tested positive, follow instructions of the hospital personnel.Look for comorbities (Diabetes, Hypertension) - No comorbidities home quarantine for 28 days; With comorbidities, manage comorbidities and home quarantine for 28 days; Refer to 104/1075 if any symptoms arise.Kindly follow Cough Etiquette, Hand Hygiene, Social Distancing";

      this.suspectedCovid = "Yes";
      console.log("RecommendationNew2" + this.recommendationText);
    } else if (
      this.question1 == "yes" &&
      this.question2 == "no" &&
      this.question3 == "no"
    ) {
      this.recommendationText =
        "Home quarantine for 14 days. Kindly follow Cough Etiquette, Hand Hygiene, Social Distancing.Call 104 incase any COVID19 symptoms arises";

      this.suspectedCovid = "Yes";
    } else {
      this.recommendationText = "";

      this.suspectedCovid = "";
    }
  }

  msg: any;

  successHandler(response) {
    this.selectedSymptoms = "";
    this.disableRadioButton = true;
    this.saved_data.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page
    if (this.is_patient == "other" && this.current_campaign == "INBOUND") {
      this.listnerService.disableFollowUp.next({
        disable: true,
        isSelf: false,
      });
    } else if (
      this.is_patient == "self" &&
      this.current_campaign == "INBOUND"
    ) {
      this.listnerService.disableFollowUp.next({
        disable: true,
        isSelf: true,
      });
    }
    this.msg =
      this.current_role == "CO"
        ? this.currentLanguageSet.counsellingSheetSavedSuccessfully
        : this.currentLanguageSet.caseSheetSavedSuccessfully;
    this.getCaseSheetData();
    console.log("Recommendation-message" + this.recommendationText);
    if (this.recommendationText == "") {
      if (this.msg != undefined) {
        this.alertMessage.alert(this.msg, "success");
        console.log("Successfull Message");
      }
    } else {
      let dialogReff = this.dialog.open(CaseSheetCovidModalComponent, {
        // height: '280px',
        width: "420px",
        disableClose: true,
        data: {
          Title: "Success",
          beneficiaryRegID: this.beneficiaryRegID,
          current_language_set: this.current_language_set,
        },
      });

      dialogReff.afterClosed().subscribe((result) => {
        this.altPhNumber = result;
        jQuery("#caseSheetForm").trigger("reset");
        if (
          this.altPhNumber == undefined &&
          this.altPhNumber != "" &&
          this.altPhNumber != "close"
        ) {
          console.log("Registered number will be used"); // Registered number will be used

          // ** code to send SMS **
          this.sendSMS(this.beneficiaryRegID);
        } else if (
          this.altPhNumber != undefined &&
          this.altPhNumber != "" &&
          this.altPhNumber != "close"
        ) {
          this.saveAlternateNumber(this.beneficiaryRegID, this.altPhNumber);
          console.log(this.altPhNumber);
          this.sendSMS(this.beneficiaryRegID, this.altPhNumber);
        }
      });
    }
    this.formReset();
    this.caseSheetForm.controls["coviddisplay"].setValue("no");
    console.log(
      "Covid Display" + this.caseSheetForm.controls["coviddisplay"].value
    );
    this.isdisplay = false;

    if (response.status == 5000) {
      this.alertMessage.alert(
        this.currentLanguageSet.errorOccuredPleaseTryAgain,
        "error"
      );
    }

    return response;
  }
  sendSMS(generated_ben_id, alternate_Phone_No?) {
    let sms_template_id = "";
    let smsTypeID = "";
    let currentServiceID = this.saved_data.current_serviceID;

    this._smsService.getSMStypes(currentServiceID).subscribe(
      (response) => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (
                response[i].smsType.toLowerCase() ===
                "COVID-19 SMS".toLowerCase()
              ) {
                smsTypeID = response[i].smsTypeID;
                break;
              }
            }
          }
        }

        if (smsTypeID != "") {
          this._smsService
            .getSMStemplates(
              this.saved_data.current_service.serviceID,
              smsTypeID
            )
            .subscribe(
              (res) => {
                if (res != undefined) {
                  if (res.length > 0) {
                    for (let j = 0; j < res.length; j++) {
                      if (res[j].deleted === false) {
                        sms_template_id = res[j].smsTemplateID;
                        break;
                      }
                    }
                  }
                  /*  console.log("DataResponse"+response.data)
                console.log("BenHistIDresponse"+response.benHistoryID)
                console.log("BenHistID"+response.data.benHistoryID);
                console.log("BenHistValue"+response.data[0].benHistoryID);*/
                  if (smsTypeID != "") {
                    let reqObj = {
                      alternateNo: alternate_Phone_No,
                      beneficiaryRegID: generated_ben_id,
                      //"benHistoryID": this.benHistID,
                      createdBy: this.agentData.userName,
                      is1097: false,
                      providerServiceMapID:
                        this.saved_data.current_service.serviceID,
                      smsTemplateID: sms_template_id,
                      smsTemplateTypeID: smsTypeID,
                      // "userID": 0
                    };

                    let reqArr = [];
                    reqArr.push(reqObj);

                    this._smsService.sendSMS(reqArr).subscribe(
                      (response) => {
                        //	console.log(response, 'SMS Sent');
                        if (response) {
                          //setTimeout(this.messageAlertHAO(), 1);
                          this.alertMessage.alert(
                            this.currentLanguageSet.smsSent,
                            "success"
                          );
                        }
                      },
                      (err) => {
                        //	this.messageAlertHAO();
                        console.log(err, "SMS not sent Error");
                      }
                    );
                  }
                }
              },
              (err) => {
                //this.messageAlertHAO();
                console.log(err, "Error in fetching sms templates");
              }
            );
        }
      },
      (err) => {
        console.log(err, "error while fetching sms types");
      }
    );
  }
  altNumObj: any = [];
  saveAlternateNumber(beneficiaryRegID, mobileNumber) {
    this.altNumObj = {};

    this.altNumObj.benificiaryRegID = beneficiaryRegID;
    this.altNumObj.createdBy = this.agentData.userName;
    this.altNumObj.parentBenRegID = "";
    this.altNumObj.phoneNo = mobileNumber;
    this.altNumObj.phoneTypeID = 1;

    let data = JSON.stringify(this.altNumObj);
    this._userData
      .storeAlternateNumber(data)
      .subscribe((res) => (this.altNumberResult = res));
  }
  handlesuccess(response) {
    // this.caseSheetData = response.reverse();
    this.caseSheetData = response;

    if (this.current_campaign == "OUTBOUND") {
      //   this.loadLatestHistory();
    }
    console.log(this.caseSheetData);

    // Load latest history for CO outbound followup
    // if (this.saved_data.current_campaign == 'OUTBOUND')
    //  this.loadLatestHistory();
  }
  handlesuccess2(res) {
    if (res.length > 0) {
      this.recentPrescriptionData = [];
      this.recentPrescriptionData = res;
    }

    console.log(this.recentPrescriptionData);
  }
  showHistory() {
    this.benToMcts = "";
    this.benToMmu = ""; // to make sure no API is being called in mmu & mcts component, only on click of particular tab API would be called
    this.displayHistory = true;
    this.getCounsellingFormData();
  }
  benToMcts: any;
  benToMmu: any;
  benHihl:any;

  onLinkClick(event) {
    if (event.index == 1) {
      this.benToMcts = this.beneficiaryRegID;
    }
    if (event.index == 2) {
      this.benToMmu = this.beneficiaryRegID;
    }
    if(event.index == 3){
      this.benHihl = this.beneficiaryRegID;
    }
  }
  getCounsellingFormData(){
    let beneficiaryRegID = this.saved_data.benRegID;
  this.caseSheetService.getHihlCounsellingData(beneficiaryRegID).subscribe((res)=>{
    if (res !== null && res !== undefined) {
      this.benHihlData = res;
    }
  })
}

  formReset() {
    this.pccFlag=false;
    this.disablenoSymptom = false;
    this.diableOtherSymptom = false;
    this.pcc = "";
    this.treatmentRecommendation = "";
    this.sctID_psd = "";
    this.sctID_pcc = "";
    this.sctID_pcc_toSave = "";
    this.sctID_psd_toSave = "";
    this.caseSheetForm.reset();
    this.detailsList = [];

    //this.coviddisplay="no";
    this.showDocument = false;
    this.travelType = "";
    this.cvdSymptom = [];
    this.contactArray = [];
    this.contactJoin = "";
    this.suspectedCovid = "";
    this.recommendationText = "";
    this.question1 = "";
    this.question2 = "";
    this.question3 = "no";
    this.symptomQ1 = "no";
    this.symptomQ2 = "no";
    this.symptomQ3 = "no";
    this.symptomQ4 = "no";
    this.covidFill_flag = null;
    this.covidVaccineTypeID = null;
    this.doseTypeID = null;
    this.vaccineStatus = null;
    this.vaccApplicableText = null;
    // this.wellbeing_infotype = undefined;
    // this.wellbeing_infotype = "1";
    // this.on_WB_or_INFO_change("1");
    this.catSubcatForm.reset();

    if (this.saved_data.age < 12) {
      this.ageGroup = "< 12 years";
      this.isApplicableForVaccine = false;
      this.vaccApplicableText = "Not Applicable for Vaccination";
    } else {
      this.ageGroup = ">= 12years";
      this.isApplicableForVaccine = true;
      this.vaccApplicableText = "Applicable for Vaccination";
    }
  }
  resetPatientForm() {
    this.formReset();
    if (this.is_patient === "other") {
      this.patientDetailForm.resetForm();
      // this.setDefaultAgeUnit();
      this.chiefCompliantOrDiseaseSummary = null;
    }
  }
  HaoActionErr: any = true;
  CoActionErr: any = true;
  MoActionErr: any = true;
  actionBy(value) {
    if (this.current_role != "MO") {
      this.MoActionErr = false;
    } else if (value.length > 2) {
      this.MoActionErr = false;
    } else {
      this.MoActionErr = true;
    }
    if (this.current_role != "HAO") {
      this.HaoActionErr = false;
    } else if (value.length > 2) {
      this.HaoActionErr = false;
    } else {
      this.HaoActionErr = true;
    }
    if (this.current_role != "CO") {
      this.CoActionErr = false;
    } else if (value.length > 2) {
      this.CoActionErr = false;
    } else {
      this.CoActionErr = true;
    }
  }
  wrongDate: boolean = false;
  today: any = new Date();

  calculateDays(datee) {
    const year = this.today.getFullYear() - datee.getFullYear();
    const month = this.today.getMonth() - datee.getMonth();
    const day = this.today.getDate() - datee.getDate();

    if (year != 0) {
      this.wrongDate = true;
    } else if (month < -3 || month > 0) {
      this.wrongDate = true;
    } else if (month == -3 && day < -1) {
      this.wrongDate = true;
    } else {
      this.wrongDate = false;
    }

    jQuery(".md2-datepicker-value").prop("readonly", true);
  }
  recentPresData() {
    let dialogReff = this.dialog.open(CaseSheetRecentPrescription, {
      // height: '620px',
      width: 0.8 * window.innerWidth + "px",
      panelClass: "dialog-width",
      disableClose: true,
      data: {
        prescription: this.recentPrescriptionData,
        current_language_set: this.current_language_set,
      },
    });
  }
  switchPccAndDS(chiefCompliantOrDiseaseSummary) {
    this.caseSheetForm.reset();
    this.caseSheetForm.controls["coviddisplay"].setValue("no");
    this.isdisplay = false;
    if (chiefCompliantOrDiseaseSummary == "1") {
      this.chiefComplaint = true;
      this.fetchChiefComplaintsBasedOnGender();
    } else {
      this.chiefComplaint = false;
      this.getDiseaseNames();
    }
  }
  getDiseaseNames() {
    this.caseSheetService.getDiseaseName().subscribe(
      (diseaseName) => {
        if (diseaseName) {
          this.summaryDetails = diseaseName;
          diseaseName.forEach((names) => {
            this.diseaseNames.push(names.diseaseName);
          });
        }
        this.filteredOptions = this.diseaseFormControl.valueChanges
          .startWith(null)
          .map((val) =>
            val ? this.filterDiseaseNames(val) : this.diseaseNames.slice()
          );
      },
      (err) => {
        console.log("error");
      }
    );
  }
  filterDiseaseNames(val: string): string[] {
    return this.diseaseNames.filter(
      (option) => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }
  showDiseaseSummary(diseaseData) {
    this.summaryObj = null;
    this.summaryDetails.forEach((filterDiseaseObj) => {
      if (filterDiseaseObj.diseaseName == diseaseData) {
        this.summaryObj = filterDiseaseObj;
      }
    });
    if (diseaseData != undefined && diseaseData != null && diseaseData != "") {
      this.caseSheetService
        .getDiseaseData(this.summaryObj)
        .subscribe((data) => {
          if (data) {
            let dialogRef = this.dialog.open(
              ViewDiseaseSummaryDetailsComponent,
              {
                height: "500px",
                panelClass: "my-panel",
                data: {
                  summaryDetails: data,
                },
              }
            );

            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                // this.informationGiven = `Information Given - ` + result.diseaseName;
                this.informationGiven = result.diseaseName;
                this.recommendedAction = result.self_care
                  .substring(1)
                  .replace(/\$/g, ",");
              }
              if (sessionStorage.getItem("diseaseClose") == "False") {
                // this.caseSheetForm.reset();
                this.caseSheetForm.controls["diseasesSummary"].setValue(" ");
                this.caseSheetForm.controls["informationGiven"].setValue(" ");
                this.caseSheetForm.controls["recommendedAction"].setValue(" ");
              }
            });
          }
        });
    } else {
      this.informationGiven = null;
      this.recommendedAction = null;
    }
  }
  calculateAge(datee) {
    if (datee) {
      const dateDiff = Date.now() - datee.getTime();
      const age = new Date(dateDiff);
      const yob = Math.abs(age.getFullYear() - 1970);
      const mob = Math.abs(age.getMonth());
      const dob = Math.abs(age.getDate() - 1);
      if (yob > 0) {
        this.age = yob;
        this.ageUnit = "years";
      } else if (mob > 0) {
        this.age = mob;
        this.ageUnit = "months";
      } else if (dob > 0) {
        this.age = dob;
        this.ageUnit = "days";
      }
      if (datee.setHours(0, 0, 0, 0) == this.today.setHours(0, 0, 0, 0)) {
        this.age = 1;
        this.ageUnit = "days";
      }
      this.ageFlag = false;
    } else {
      this.age = null;
    }
  }
  setDateLimits() {
    this.today = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.today.getFullYear() - (this.ageLimit + 1));
  }
  setDefaultAgeUnit() {
    this.ageUnit = "years";
  }
  calculateDOB() {
    let valueEntered = this.age;
    if (valueEntered) {
      if (valueEntered > this.ageLimit && this.ageUnit == "years") {
        this.alertMessage.alert(
          this.currentLanguageSet.ageCanOnlyBeSetBetweenTodayTo +
            "${this.ageLimit}" +
            this.currentLanguageSet.years,
          "info"
        );
        this.age = null;
      } else {
        this.DOB = moment().subtract(this.ageUnit, valueEntered).toDate();
      }
    }
  }
  onAgeUnitEntered() {
    if (this.age != null) {
      this.calculateDOB();
    }
  }

  @Input() current_language: any;
  current_language_set: any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'
}

@Component({
  selector: "cdss-dialog",
  templateUrl: "./cdssModal.html",
})
export class DialogOverviewExampleDialog {
  currentLanguageSet: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    private saved_data: dataService,
    private _CDSSService: CDSSService,
    public dialog: MdDialog,
    public HttpServices: HttpServices,
    private alertMessage: ConfirmationDialogsService,
    public dialogReff: MdDialogRef<DialogOverviewExampleDialog>
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.current_Role = this.saved_data.current_role;
    this.getQuestions();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    this.emergency_transferToMo =
      this.currentLanguageSet.emergencyQuestionSelectedTransfertoMO;
    this._close = this.currentLanguageSet.areYouSureWantToClose;
  }

  current_Role: any;
  _close: any;
  emergency_transferToMo: any;
  page1: boolean = true;
  page2: boolean = false;
  page3: boolean = true;
  settings = {
    hideSubHeader: true,
    actions: false,
    columns: {
      Disease: {
        title: "Disease",
      },
      selected: {
        title: "UserInput",
      },
      percentage: {
        title: "Count",
      },
      Information: {
        title: "Information",
      },
      DoDonts: {
        title: "Dos & Donts",
      },
      SelfCare: {
        title: "SelfCare",
      },
      Action: {
        title: "Action",
      },
    },
  };

  showQuestions: boolean = true;

  questionid: any = [];
  questions: any;
  sizeQuestion: any = [];
  answers: any;

  result: any;
  formattedResult: any;
  formattedResult1: any[];

  getQuestions() {
    this.questionid = [];
    console.log(this.data.patientData, "data.patientData");
    this._CDSSService
      .getQuestions(this.data.patientData)
      .subscribe((any) => this.successHandeler(any));
  }

  getNextSet(value: any, id: any) {
    if (value && this.current_Role != "MO") {
      this.alertMessage.alert(this.emergency_transferToMo);
    }
    var questionSelected = {};
    questionSelected["complaintId"] = this.questions.id;
    questionSelected["selected"] = id;
    this._CDSSService
      .getAnswer(questionSelected)
      .subscribe((any) => this.assignresult(any));
  }

  assignresult(val: any) {
    this.result = val;
    if (val.length != 0) {
      this.page1 = false;
      this.page2 = true;
    }
    console.log("Data for inbetween model ", val);
  }

  getAnswers() {
    console.log(this.questionid);
    this.sizeQuestion = [];
    this.questions.Questions.forEach((element) => {
      console.log(element);

      this.getKeys(element).forEach((element1) => {
        console.log(Object.keys(element[element1]).length);
        this.sizeQuestion.push(Object.keys(element[element1]).length);
      });
    });

    var code = [];
    for (var index = 0; index < this.sizeQuestion.length; index++) {
      code[index] = 0;
      for (var indexj = 0; indexj <= index; indexj++) {
        code[index] += this.sizeQuestion[indexj];
      }
    }
    console.log(code);
    var answer = [];
    for (var index = 0; index < this.questionid.length; index++) {
      var element = this.questionid[index].split(".");
      console.log(element + ":" + index);
      if (Number(element[0]) > 1) {
        answer[index] = code[Number(element[0]) - 2] + Number(element[1]);
      } else {
        answer[index] = Number(element[1]);
      }
    }

    var response: any = {};
    console.log(this.questions);
    response["SymptomId"] = this.questions["id"];
    response["response"] = answer;
    console.log(response);

    this._CDSSService
      .getAnswer(response)
      .subscribe((any) => this.resultFunction(any));
  }

  toggle(element: any, value: any) {
    console.log(value);
    if (element.selected == undefined) {
      element.selected = [];
    }
    var index = element.selected.indexOf(value);
    if (index < 0) {
      element.selected.push(value);
    } else {
      element.selected.splice(index, 1);
    }
  }

  getresult() {
    this.formattedResult = new LocalDataSource(
      JSON.parse(JSON.stringify(this.result))
    );
    for (let index = 0; index < this.formattedResult.data.length; index++) {
      let selected = this.formattedResult.data[index].selected;
      let per = "";
      if (selected != undefined && selected.length != 0) {
        //this.formattedResult.data[index].selected.sort(this.sortn);
        per =
          this.formattedResult.data[index].selected.length +
          "/" +
          this.formattedResult.data[index].Symptoms.length;
        //per = Math.round(per * 1000) / 1000;
      }
      this.formattedResult.data[index].percentage = per;

      //  this.formattedResult.data
    }
    // this.formattedResult.data.selected.sort();
    this.formattedResult1 = JSON.parse(
      JSON.stringify(this.formattedResult.data)
    );
    console.log("formateed result 1", this.formattedResult1);
    this.formattedResult.load(this.formattedResult.data);
    if (this.formattedResult1.length != 0) {
      this.page2 = false;
      this.page3 = true;
    }
  }

  resetCount() {
    if (this.result.constructor === Array) {
      for (let i = 0; i < this.result.length; i++) {
        this.result[i].selected = undefined;
      }
    }
  }

  sortn(a, b) {
    return a - b;
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  getValue(obj, key): any {
    return obj[key];
  }

  resultFunction(data: any) {
    this.showQuestions = false;
    this.result = data;
    console.log(this.result);
    var diseases = Object.keys(this.result);
    this.formattedResult = [];
    for (var index = 0; index < diseases.length; index++) {
      var format = new ResultFormat();
      format["disease"] = diseases[index];
      format["input"] = this.result[diseases[index]]["input"];
      format["actual"] = this.result[diseases[index]]["acutal"];

      format["do"] = this.result[diseases[index]]["recommendation"]["Dos"];
      format["dont"] = this.result[diseases[index]]["recommendation"]["Donts"];

      this.formattedResult.push(format);
    }

    console.log(this.formattedResult);
  }
  diseasess: Array<any> = [];
  action: Array<any> = [];
  // action:any="";
  indexArray: Array<any> = [];
  getDiseaseName(val: any, i: any, action: any, symptoms, selectedIndexArray) {
    console.log(this.diseasess);

    let obj = {
      diseases: [],
      action: [],
      symptoms: [],
    };
    //filtering symptoms to selected symptoms array
    var tempArr = [];
    if (selectedIndexArray && selectedIndexArray.length > 0) {
      for (var j = 0; j < selectedIndexArray.length; j++) {
        tempArr.push(symptoms[selectedIndexArray[j] - 1]);
      }
    }

    if (this.diseasess.length == 0 && this.indexArray.length == 0) {
      obj = {
        diseases: val,
        action: action,
        symptoms: tempArr,
      };
      this.diseasess.push(obj);
      this.indexArray.push(i);
    } else {
      if (this.indexArray.includes(i)) {
        let a = this.indexArray.indexOf(i);
        this.diseasess.splice(a, 1);
        this.indexArray.splice(a, 1);
      } else {
        obj = {
          diseases: val,
          action: action,
          symptoms: tempArr,
        };
        this.diseasess.push(obj);
        this.indexArray.push(i);
      }
    }
    console.log(this.diseasess);
  }

  successHandeler(questions) {
    console.log("Get Questions:" + JSON.stringify(questions));
    this.questions = questions;
  }
  handleAnswers(answers) {
    console.log("answers", answers);
    this.answers = answers;
  }
  changePage(val) {
    this.diseasess = [];
    this.indexArray = [];
    if (val == 2) {
      this.page3 = false;
      this.page2 = true;
    }
    if (val == 1) {
      this.page2 = false;
      this.page1 = true;
    }
  }
  close() {
    this.alertMessage.confirm("Close ", this._close).subscribe((response) => {
      if (response) {
        this.dialogReff.close();
      }
    });
  }
}

@Component({
  selector: "app-case-sheet-history",
  templateUrl: "./case-sheet-history.html",
})
export class CaseSheetHistory {
  currentLanguageSet: any;

  // constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
  //   public dialogReff: MdDialogRef<CaseSheetHistoryModal>) { }
  constructor(public httpServices: HttpServices) {}
  @Input() medHistory: any;
  @Input() current_language: any;
  data: any;

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    this.data = {
      caseSheetData: this.medHistory,
      current_language_set: this.current_language,
    };
  }
}

@Component({
  selector: "case-sheet-comp-modal",
  templateUrl: "./case-sheet-comp-modal.html",
})
export class CaseSheetCompModal {
  currentLanguageSet: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<CaseSheetCompModal>,
    public httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}

@Component({
  selector: "case-sheet-recentPrescription-modal",
  templateUrl: "./case-sheet-recentPrescription-modal.html",
  styleUrls: ["./case-sheet.component.css"],
})
export class CaseSheetRecentPrescription {
  altNum: boolean = false;
  mobileNumber: any;
  smsFlag: boolean = false;
  beneficiaryDetails: any;
  beneficiaryRegID: any;
  current_campaign: any;
  currentLanguageSet: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public saved_data: dataService,
    private _smsService: SmsTemplateService,
    private alertMessage: ConfirmationDialogsService,
    public dialogReff: MdDialogRef<CaseSheetCompModal>,
    public httpServices: HttpServices
  ) {
    this.current_campaign = this.saved_data.current_campaign;

    this.beneficiaryDetails =
      this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (
      this.beneficiaryDetails &&
      this.beneficiaryDetails.i_beneficiary &&
      this.current_campaign == "INBOUND"
    ) {
      this.beneficiaryRegID =
        this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    } else if (this.saved_data.benRegID) {
      this.beneficiaryRegID = this.saved_data.benRegID;
    } else {
      this.beneficiaryRegID = this.saved_data.outboundBenID;
    }
  }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  validNumber: any = false;
  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    } else {
      this.validNumber = false;
    }
  }

  ref_array: Array<any> = [];
  row_array: Array<any> = [];
  toggleSms(e: any, id, obj) {
    if (e.checked) {
      this.ref_array.push(id);
      this.row_array.push(obj);
    } else {
      this.row_array.splice(this.ref_array.indexOf(id), 1);
      this.ref_array.splice(this.ref_array.indexOf(id), 1);
    }

    if (this.ref_array.length == 0) {
      this.smsFlag = false;
    } else {
      this.smsFlag = true;
    }
  }

  sendSMS(alternate_Phone_No) {
    let sms_template_id = "";
    let smsTypeID = "";
    let currentServiceID = this.saved_data.current_serviceID;
    if (currentServiceID != undefined) {
      this._smsService.getSMStypes(currentServiceID).subscribe(
        (response) => {
          if (response != undefined) {
            if (response.length > 0) {
              for (let i = 0; i < response.length; i++) {
                if (
                  response[i].smsType.toLowerCase() ===
                  "Prescription SMS".toLowerCase()
                ) {
                  smsTypeID = response[i].smsTypeID;
                  break;
                }
              }
            }
          }

          if (smsTypeID != "") {
            this._smsService
              .getSMStemplates(
                this.saved_data.current_service.serviceID,
                smsTypeID
              )
              .subscribe(
                (res) => {
                  if (res != undefined) {
                    if (res.length > 0) {
                      for (let j = 0; j < res.length; j++) {
                        if (res[j].deleted === false) {
                          sms_template_id = res[j].smsTemplateID;
                          break;
                        }
                      }
                    }
                    if (smsTypeID != "") {
                      let req_arr = [];
                      for (let i = 0; i < this.row_array.length; i++) {
                        let Obj = {
                          alternateNo: alternate_Phone_No,
                          beneficiaryRegID: this.beneficiaryRegID,
                          prescribedDrugID: this.row_array[i].prescribedDrugID,
                          createdBy: this.saved_data.Userdata.userName,
                          is1097: false,
                          providerServiceMapID:
                            this.saved_data.current_service.serviceID,
                          smsTemplateID: sms_template_id,
                          smsTemplateTypeID: smsTypeID,
                        };

                        req_arr.push(Obj);
                      }

                      this._smsService.sendSMS(req_arr).subscribe(
                        (ressponse) => {
                          console.log(ressponse, "SMS Sent");
                          this.alertMessage.alert(
                            this.currentLanguageSet.smsSent,
                            "success"
                          );
                        },
                        (err) => {
                          console.log(err, "SMS not sent Error");
                        }
                      );
                    }
                  }
                },
                (err) => {
                  console.log(err, "Error in fetching sms templates");
                }
              );
          }
        },
        (err) => {
          console.log(err, "error while fetching sms types");
        }
      );
    } else {
      console.log("Service ID not found");
    }

    this.dialogReff.close();
  }
}
