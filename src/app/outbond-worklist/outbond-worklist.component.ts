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
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  Input,
} from "@angular/core";
import { enableProdMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { dataService } from "../services/dataService/data.service";
import { FormGroup, FormControl } from "@angular/forms";
import { OutboundWorklistService } from "../services/outboundServices/outbound-work-list.service";
import { OutboundSearchRecordService } from "../services/outboundServices/outbound-search-records.service";
import { MdDialog, MdDialogRef } from "@angular/material";
import { MD_DIALOG_DATA } from "@angular/material";
import { AvailableServices } from "../services/common/104-services";
import { CzentrixServices } from "./../services/czentrix/czentrix.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
declare var jQuery: any;
import { OutboundListnerService } from "./../services/common/outboundlistner.service";
import { ListnerService } from "./../services/common/listner.service";
//import { CaseSheetHistoryModal } from '../case-sheet/case-sheet.component';
import { CaseSheetService } from "../services/caseSheetService/caseSheet.service";
import { EpidemicServices } from "../services/sioService/epidemicServices.service";
import { FoodSafetyServices } from "../services/sioService/foodSafetyService.service";
import { OrganDonationServices } from "app/services/sioService/organDonationServices.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-outbond-worklist",
  templateUrl: "./outbond-worklist.component.html",
  styleUrls: ["./outbond-worklist.component.css"],
  //providers:[OCWService]
})
export class OutbondWorklistComponent implements OnInit {
  // @Output() onTableRowSelection: EventEmitter<any> = new EventEmitter<any>();
  // @Output() sioOutboundList: EventEmitter<any> = new EventEmitter<any>();  // ye b naya h

  public showCreateFlag = false;
  serviceProviders: string[];
  outbondWorklist: any;

  sioOutbondWorklist: Array<any> = [];
  //bpOutbondWorklist: any[];
  //diabeticBPOutbondWorklist = [];
  haoOutbondWorklist: Array<any> = [];
  moOutbondWorklist: Array<any> = [];
  coOutbondWorklist: Array<any> = [];
  pdOutboundWorklist: Array<any> = [];

  historyDetails: any;
  _today: Date;
  data: any;
  agentData: any;
  current_role: any;
  services: Array<any> = [];
  requestObj: any = {};
  phoneNumber: any;
  caseSheetData: any = [];
  disableDialingWorklist: any = false;
  displayHistory: boolean = false;
  featureRoleMapArray: Array<any> = [];
  maxlength: any = 10;
  currentLanguageSet: any;

  constructor(
    private outboundListner: OutboundListnerService,
    private caseSheetService: CaseSheetService,
    private listnerService: ListnerService,
    public router: Router,
    private _OWLService: OutboundWorklistService,
    private _OSRService: OutboundSearchRecordService,
    private _dataServivce: dataService,
    public dialog: MdDialog,
    private _availableServices: AvailableServices,
    private cz_service: CzentrixServices,
    private message: ConfirmationDialogsService,
    public HttpServices: HttpServices
  ) {
    this.serviceProviders;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.current_role = this._dataServivce.current_role;
    this._today = new Date();
    this.agentData = this._dataServivce.Userdata;
    //this.data = { assignedUserID: this._dataServivce.uid, providerServiceMapID:15};
    this.data = {
      assignedUserID: this._dataServivce.uid,
      providerServiceMapID: this._dataServivce.current_service.serviceID,
    };
    //  console.log(JSON.stringify(this.data));
    this._OWLService.getCallWorklist(this.data).subscribe((resProviderData) => {
      this.outbondWorklist = resProviderData;
      //  this.filterWorkList();
      this._OSRService
        .getFeatureRoleMapping({
          providerServiceMapID: this._dataServivce.current_service.serviceID,
        })
        .subscribe(
          (response) => {
            console.log(response, "featureRoleMapArray");
            if (response.data !== undefined || response.data !== null) {
              this.featureRoleMapArray = response.data;
              this.filterWorkList();
            }
          },
          (error) => {
            console.log(error);
          }
        );
    });

    this.requestObj = {
      providerServiceMapID: this._dataServivce.current_service.serviceID,
    };

    this._availableServices
      .getServices(this.requestObj)
      .subscribe((response) => this.successHandler(response));

    const obj = { innerPage: false };
    this.listnerService.cZentrixSendData(obj);

    this._dataServivce.sendHeaderStatus.next("");
    this._dataServivce.avoidingEvent = false;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  successHandler(response) {
    this.services = response;
    //   console.log("services: "+JSON.stringify(this.services));
    // this.filterWorkList();
  }

  filterWorkList() {
    if (this.outbondWorklist !== undefined || this.outbondWorklist !== null) {
      let totWorkListItems = this.outbondWorklist.length;

      for (let i = 0; i < totWorkListItems; i++) {
        this.addtoWorklistByFeatureName(
          this.outbondWorklist[i].requestedFeature,
          this.outbondWorklist[i]
        );
        /*
         if (this.outbondWorklist[i].requestedFeature) {
           if (this.outbondWorklist[i].requestedFeature.includes('Blood'))
             this.sioOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Epidemic Outbreak Service'))
             this.sioOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Organ Donation'))
             this.sioOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Food safety'))
             this.sioOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Counselling'))
             this.coOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Medical'))
             this.moOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Health'))
             this.haoOutbondWorklist.push(this.outbondWorklist[i]);
           else if (this.outbondWorklist[i].requestedFeature.includes('Psychiatrist'))
             this.pdOutboundWorklist.push(this.outbondWorklist[i]);
         } */
      }
    }
  }

  addtoWorklistByFeatureName(featureName, worklistItem) {
    var tempFilterArr = [];
    tempFilterArr = this.featureRoleMapArray.filter((obj) => {
      return obj.screen.screenName == featureName;
    }, this);
    //  console.log(tempFilterArr, "tempFilterArr");
    let roleID = tempFilterArr[0].roleID;

    for (let i = 0; i < this.featureRoleMapArray.length; i++) {
      if (
        (worklistItem.beneficiary !== undefined &&
          worklistItem.beneficiary.benPhoneMaps !== undefined &&
          (worklistItem.beneficiary.benPhoneMaps[0].phoneNo !== undefined &&
          worklistItem.beneficiary.benPhoneMaps[0].phoneNo !== "undefined" &&
          worklistItem.beneficiary.benPhoneMaps[0].phoneNo !== "" &&
          worklistItem.beneficiary.benPhoneMaps[0].phoneNo !== null) ) &&
        (worklistItem.beneficiary.beneficiaryID !== undefined ||
          worklistItem.beneficiary.beneficiaryID !== null)
      ) {
        if (
          this.featureRoleMapArray[i].roleID == roleID &&
          this.featureRoleMapArray[i].screen.screenName == "Health_Advice"
        ) {
          this.haoOutbondWorklist.push(worklistItem);
        
          break;

        } else if (
          this.featureRoleMapArray[i].roleID == roleID &&
          this.featureRoleMapArray[i].screen.screenName == "Medical_Advice"
        ) {
          this.moOutbondWorklist.push(worklistItem);
          break;
        } else if (
          this.featureRoleMapArray[i].roleID == roleID &&
          this.featureRoleMapArray[i].screen.screenName == "Counselling"
        ) {
          this.coOutbondWorklist.push(worklistItem);
          break;
        } else if (
          this.featureRoleMapArray[i].roleID == roleID &&
          this.featureRoleMapArray[i].screen.screenName == "Psychiatrist"
        ) {
          this.pdOutboundWorklist.push(worklistItem);
          break;
        } else 
            if (
              this.featureRoleMapArray[i].roleID == roleID &&
              this.featureRoleMapArray[i].screen.screenName == "Service_Improvements")
              {
              this.sioOutbondWorklist.push(worklistItem);
              break;
              }
           
            }
            }
          
     
        //   this.featureRoleMapArray[i].roleID == roleID &&
        //   this.featureRoleMapArray[i].screen.screenName ==
        //     "Service_Improvements"
        // ) {
        //   this.sioOutbondWorklist.push(worklistItem);
        //   break;
        // }
      
    
  }

  getSubserviceID(serviceName) {
    let subServiceID;
    for (let i = 0; i < this.services.length; i++) {
      if (this.services[i].subServiceName.indexOf(serviceName) != -1) {
        subServiceID = this.services[i].subServiceID;
        break;
      }
    }
    console.log("serviceName " + serviceName + "subServiceID: " + subServiceID);
    return subServiceID;
  }

  //   modaldata:any;
  viewHistory(data: any, i: any) {
    //  this.onTableRowSelection.emit(data);
    this._dataServivce.setUniqueCallIDForOutbound = true;
    console.log(i, this.sioOutbondWorklist, "lllllll");
    if (
      data.requestedFeature == "Food safety" ||
      data.requestedFeature == "Epidemic Outbreak Service" ||
      data.requestedFeature == "Organ Donation"
    ) {
      this._dataServivce.avoidingEvent = true;
    } else {
      this._dataServivce.avoidingEvent = false;
    }
    // this._dataServivce.sio_outbond_providerlist = this.outbondWorklist[i];
    // this.sioOutboundList.emit(this.sioOutbondWorklist[i]);
    //this.sioOutboundList.emit(data);

    // var idx = jQuery('.carousel-inner div.active').index();
    // jQuery('#myOutCarousel').carousel(idx + 1);
    // jQuery('#two').parent().find("a").removeClass('active-tab');
    // jQuery('#two').find("a").addClass("active-tab");
    //  console.log(data.beneficiary.beneficiaryRegID);
    this.cz_service
      .manualDialaNumber(
        this._dataServivce.agentID,
        data.beneficiary.benPhoneMaps[0].phoneNo
      )
      .subscribe(
        (res) => {
          if (res.status.toLowerCase() === "fail") {
            this.message.alert(this.currentLanguageSet.somethingWentWrongInCalling, "error");
          } else {
            this._dataServivce.outboundBenID =
              data.beneficiary.beneficiaryRegID;
            this._dataServivce.outboundCallReqID = data.outboundCallReqID;
            sessionStorage.setItem("onCall", "yes");
            this._dataServivce.isSelf = data.isSelf;
            this._dataServivce.outboundRequestID = data.requestNo;
            //  this.router.navigate(['/MultiRoleScreenComponent/InnerpageComponent']);
            if (
              data.requestedFeature == "Food safety" ||
              data.requestedFeature == "Epidemic Outbreak Service" ||
              data.requestedFeature == "Organ Donation"
            ) {
              this.viewDetails(data);
            }
          }
          //   console.log('resp', res);
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
    // this.outboundListner.sendingBenID({ 'benID': data.beneficiary.beneficiaryRegID });

    // this.router.navigate(['/MultiRoleScreenComponent/InnerpageComponent',9914061230,272851722.64691632744]);
  }
  viewDetails(data) {
    //  this.onTableRowSelection.emit(data);
    this._dataServivce.outboundBenID = data.beneficiary.beneficiaryRegID;
    this._dataServivce.outboundCallReqID = data.outboundCallReqID;
    this._dataServivce.outboundBloodReqtID = data.requestNo;
    this._dataServivce.avoidingEvent = false;
    sessionStorage.setItem("service", data.requestedFeature);
    sessionStorage.setItem("CLI", data.beneficiary.benPhoneMaps[0].phoneNo);
    this.router.navigate(["/MultiRoleScreenComponent/InnerpageComp"]);
  }
  manualDial(phoneNumber: any) {
    this._dataServivce.setUniqueCallIDForOutbound = true;
    this._dataServivce.benRegID = undefined;
    this.cz_service
      .manualDialaNumber(this._dataServivce.agentID, phoneNumber)
      .subscribe(
        (res) => {
          this._dataServivce.avoidingEvent = true;
          this.disableDialingWorklist = true;
          sessionStorage.setItem("onCall", "yes");
          //  console.log('resp', res);
        },
        (err) => {
          this._dataServivce.avoidingEvent = true;
          this.message.alert(err.errorMessage, "error");
        }
      );
  }
  closeCall() {
    this.cz_service.disconnectCall(this._dataServivce.agentID).subscribe(
      (res) => {
        if (res.statusCode === 200) {
          this.message.alert(this.currentLanguageSet.callClosedSuccessfully, "success");
          sessionStorage.removeItem("onCall");
          sessionStorage.removeItem("CLI");
          sessionStorage.removeItem("service");
          this._dataServivce.avoidingEvent = false;
          this.disableDialingWorklist = false;
        } else {
          sessionStorage.removeItem("onCall");
          sessionStorage.removeItem("CLI");
          sessionStorage.removeItem("service");
          this._dataServivce.avoidingEvent = false;
          this.disableDialingWorklist = false;
          console.log("err", res.errorMessage);
        }
      },
      (err) => {
        console.log("error", err.errorMessage);
        this.disableDialingWorklist = false;
        sessionStorage.removeItem("onCall");
      }
    );
  }
  tab: number = 1;
  changeService(val) {
    this.tab = val;
    jQuery("#service" + val)
      .parent()
      .find("li")
      .removeClass();
    jQuery("#service" + val).addClass("animation-nav-active");

    jQuery("#service" + val)
      .parent()
      .find("a")
      .removeClass();
    jQuery("#service" + val + " a").addClass("f-c-o");
  }

  history(list) {
    if (
      list.requestedFeature == "Food safety" ||
      list.requestedFeature == "Epidemic Outbreak Service" ||
      list.requestedFeature == "Organ Donation"
    ) {
      this.viewSioHistory(list);
    } else {
      let data =
        '{"beneficiaryRegID":"' + list.beneficiary.beneficiaryRegID + '"}';

      this.caseSheetService.getCaseSheetData(data).subscribe(
        (response) => {
          this.handlesuccess(response);
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
    }
  }
  handlesuccess(response) {
    this.displayHistory = true;
    this.caseSheetData = response.reverse();

    // let dialogReff = this.dialog.open(CaseSheetHistoryModal, {
    //   // height: '620px',
    //   width: 0.8 * window.innerWidth + "px",
    //   panelClass: 'dialog-width',
    //   disableClose: true,
    //   data: {
    //     "caseSheetData": this.caseSheetData
    //      }
    // });
  }
  viewSioHistory(details) {
    let dialogReff = this.dialog.open(OutboundWorklistModal, {
      // height: '620px',
      width: 0.8 * window.innerWidth + "px",
      panelClass: "dialog-width",
      disableClose: true,
      data: {
        type: details,
      },
    });
  }
  @Input() current_language: any;
  current_language_set: any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'

  ngOnChanges() {
    if (this.current_language) {
      this.current_language_set = this.current_language;
      //  console.log("language in outbound-worklist", this.current_language_set);
    }
  }
  dashboard() {
    this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }
  checkMobNumberLength(phoneNumber) {
    if (phoneNumber.slice(0, 1) == "0") {
      this.maxlength = "11";
    } else if (phoneNumber.slice(0, 2) == "91") {
      this.maxlength = "12";
    } else {
      this.maxlength = "10";
    }
  }
}

@Component({
  selector: "outbound-worklist-modal",
  templateUrl: "./outbound-worklist-modal.html",
})
export class OutboundWorklistModal {
  //  agentData:any ;
  epidemicData: any;
  foodSafetyData: any;
  organdonationData: any;
  feature: any;
  currentLanguageSet: any;
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    private foodSafetyServices: FoodSafetyServices,
    public dialogReff: MdDialogRef<OutboundWorklistModal>,
    private _OWLService: OutboundWorklistService,
    private alertService: ConfirmationDialogsService,
    private _dataServivce: dataService,
    private _EpidemicServices: EpidemicServices,
    private _organDonationServices: OrganDonationServices,
    public HttpServices: HttpServices
  ) {
    //    this.agentData = this._dataServivce.Userdata;
  }
  ngOnInit() {
    this.assignSelectedLanguage();
    let obj = {
      requestID: this.data.type.requestNo,
    };
    if (this.data.type.requestedFeature == "Food safety") {
      this.foodSafetyServices.getFoodSafetyComplaintsByBenID(obj).subscribe(
        (res) => this.foodSafetyHistorySuccess(res),
        (err) => {
          this.alertService.alert(
            this.currentLanguageSet.errorInFetchingFoodSafetyHistory,
            "error"
          );
        }
      );
    } else if (this.data.type.requestedFeature == "Epidemic Outbreak Service") {
      this._EpidemicServices.getEpidemicDetailsByBenID(obj).subscribe(
        (response) => this.epidemicHistorySuccesshandeler(response),
        (err) => {
          this.alertService.alert(
            this.currentLanguageSet.errorInFetchingEpidemicHistory,
            "error"
          );
        }
      );
    } else if (this.data.type.requestedFeature == "Organ Donation") {
      this._organDonationServices
        .getOrganDonationHistoryByBenID({
          beneficiaryRegID: this.data.type.beneficiary.beneficiaryRegID,
        })
        .subscribe(
          (res) => this.organHistorySuccesshandeler(res),
          (err) => {
            this.alertService.alert(
             this.currentLanguageSet.errorInFetchingOrganDonationHistory,
              "error"
            );
          }
        );
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  epidemicHistorySuccesshandeler(res) {
    this.epidemicData = res[0];
    this.feature = this.data.type.requestedFeature;
  }
  foodSafetyHistorySuccess(res) {
    this.foodSafetyData = res[0];
    this.feature = this.data.type.requestedFeature;
  }
  organ = [];
  organHistorySuccesshandeler(res) {
    this.organdonationData = res[0];
    this.feature = this.data.type.requestedFeature;
    let arr = [];
    res.forEach(function (val) {
      arr.push(val.m_donatableOrgan.donatableOrgan);
    });
    this.organ = arr.slice();
  }
}
