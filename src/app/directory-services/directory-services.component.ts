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


import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { CoReferralService } from "../services/coService/co_referral.service";
import { dataService } from "../services/dataService/data.service"
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
declare var jQuery: any;
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
declare var jQuery: any;
import { SearchService } from '../services/searchBeneficiaryService/search.service';
import { AvailableServices } from '../services/common/104-services';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-directory-services',
  templateUrl: './directory-services.component.html',
  styleUrls: ['./directory-services.component.css']
})
export class DirectoryServicesComponent implements OnInit {
  @Output() referralServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  showFormCondition: boolean = true;
  showTableCondition: boolean = false;
  beneficiaryDetails: any;
  beneficiaryRegID: any;
  tableArray:Array<any> = [];
  states:Array<any> = [];
  districts:Array<any> = [];
  taluks:Array<any> = [];
  blocks:Array<any> = [];
  branches:Array<any> = [];
  directory:Array<any> = [];
  sub_directory:Array<any> = [];
  detailsList:Array<any> = [];
  selected_state: any = "";
  selected_district: any = "";
  selected_taluk: any = "";
  selected_block: any = "";
  selected_branch: any;
  selected_directory: any = "";
  selected_sub_directory: any = "";
  description: any = "";
  addToSend: any;
  smsFlag: boolean = false;
  addressArray:Array<any> = [];
  indexArray:Array<any> = [];
  altNum: any;
  mobileNumber: any;
  p: any;
  providerServiceID: any;
  services:Array<any> = [];
  subServiceID: any;
  current_role: any;
  msg_send: any;
  benCallID: any;
  providerServiceMapID: any;


  searched_saved_response:Array<any> = [];

  @ViewChild('sendSMSform') sendSMSform: NgForm;
  @ViewChild('directoryServicesForm') directoryServicesForm: NgForm;
  currentLanguageSet: any;
  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _smsService: SmsTemplateService,
    private _locationService: LocationService,
    private _coReferralService: CoReferralService, private saved_data: dataService,
    private alertMesage: ConfirmationDialogsService, public dialog: MdDialog,
    private _util: SearchService, private _availableServices: AvailableServices, public httpServices: HttpServices
  ) {
    this.beneficiaryDetails = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;

    if (this.saved_data.benCallID) {
      this.benCallID = this.saved_data.benCallID;
    }
    else {
      this.benCallID = this.beneficiaryDetails.benCallID;
      console.log("benCallID: " + this.beneficiaryDetails.benCallID);
    }
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }
    else if (this.saved_data.benRegID) {
      this.beneficiaryRegID = this.saved_data.benRegID;
    }
  }

  ngOnInit() {
    this.providerServiceID = this.saved_data.service_providerID;
    this.current_role = this.saved_data.current_role;
    this.providerServiceMapID = this.saved_data.current_service.serviceID;

    this.assignSelectedLanguage();

    //this.GetServiceTypes();
    // // call the api to get all the referrals done and store them in array;

    // this.tableArray = []; //substitute it with the response

    // // call the api to get all the states
    // this.states = [];  //substitute it with the response
    let data = {
      "providerServiceMapID": this.saved_data.current_service.serviceID
    };
    this._userBeneficiaryData.getUserBeneficaryData(data)
      .subscribe(response => this.SetUserBeneficiaryRegistrationData(response));
    //   this.setBeneficiaryData();

    this._util.getProviderStates(this.providerServiceID).subscribe(response => this.providerStates(response));
    //this.selected_state = this.states[0].stateID;    

    this._availableServices.getServices(data).subscribe(response => this.successHandler(response));

    this.getDirectorySearchHistory();
  }


  ngDoCheck() {
    this.assignSelectedLanguage();
  }
 
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  getDirectorySearchHistory() {
    let reqObj = {
      'beneficiaryRegID': this.beneficiaryRegID
    }
    this._coReferralService.getDirectorySeachHistory(reqObj).
      subscribe(response => {
        console.log(response, 'HISTORY OF DIRECTORY SEARCH HISTORY');
        if (response.length) {
          this.tableArray = response;
        }
      }, err => {
        console.log(err, 'error while fetching history of directory search history');
      })
  }


  providerStates(response) {
    this.states = response.filter(item => {
      return item.stateID === this.saved_data.current_stateID_based_on_role;
    });
    this.selected_state = this.saved_data.current_stateID_based_on_role;
    this.GetDistricts(this.selected_state);

  }

  /*
  GetServiceTypes() {
    this._coReferralService.getTypes()
    .subscribe(response => this.setServiceTypes(response));
  }
  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].serviceNameFor1097 && response[i].serviceNameFor1097.toUpperCase().search("REFE") >= 0) {
        this.serviceID1097 = response[i].serviceID1097;
        break;
      }
    }
  } */

  @Input()
  setBeneficiaryData() {
    this._coReferralService.getReferralHistoryByID(this.beneficiaryRegID).subscribe(response => this.getReferralHistory(response));
  }

  getReferralHistory(response: any) {
    console.log('referral history is :', JSON.stringify(response));
    if (response.statusCode && response.statusCode != "200") {
      //   alert("Error occured, please try again!!");
    } else {
      // let dialogReff=this.dialog.open(FeedbackResponseModel, {
      //   height: '180px',
      //   width: '420px',
      //   disableClose:false,
      //   data: "Error occured, please try again!!"
      // });
      this.tableArray = response;
      console.log(this.tableArray);
    }
  }
  showForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
  }

  showTable() {
    // this.showFormCondition = false;
    // this.showTableCondition = true;
    window.scrollTo(0, 350);
  }

  SetUserBeneficiaryRegistrationData(regData: any) {
    //  console.log("UserBeneficiaryRegistrationData: "+JSON.stringify(regData));
    // if (regData.states) {
    //   this.states = regData.states;
    // }
    if (regData.directory) {
      this.directory = regData.directory;
    }
  }

  GetDistricts(state: number) {
    this.districts = [];
    this.taluks = [];
    this.blocks = [];
    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response));
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response));
    // this._locationService.getSTB( district )
    //   .subscribe( response => this.SetTaluks( response ) );
  }
  SetTaluks(response: any) {
    this.taluks = response;
  }
  GetSDTB(taluk: number) {
    this.blocks = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetSDTB(response));
    // this._locationService.getBranch( taluk )
    //   .subscribe( response => this.SetBlocks( response ) );
  }
  SetSDTB(response: any) {
    this.blocks = response;
  }

  GetSubDirectory(directoryID: number) {
    // debugger;
    this._locationService.getSubDirectory(directoryID)
      .subscribe(response => this.SetSubDirectory(response));
  }
  SetSubDirectory(response: any) {
    this.sub_directory = response.subDirectory;
  }

  successHandler(response) {
    this.services = response;
    //   console.log("services: "+JSON.stringify(this.services));
    this.getSubserviceID();
  }


  getSubserviceID() {

    for (let i = 0; i < this.services.length; i++) {

      if (this.current_role == 'HAO') {
        if (this.services[i].subServiceName.indexOf('Health') != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      }
      else if (this.current_role == 'CO') {
        if (this.services[i].subServiceName.indexOf('Counselling') != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      }
      else if (this.current_role == 'MO') {
        if (this.services[i].subServiceName.indexOf('Medical') != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      }
      else if (this.current_role == 'SIO') {
        if (this.services[i].subServiceName.indexOf('Blood') != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
        else if (this.services[i].subServiceName.indexOf('Organ') != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      }
    }

  }

  //GetReferralDetails ( selected_directory: number, selected_sub_directory: number, stateID: number, districtID: number, districtBranchMappingID: number, beneficiaryRegID: number, serviceID1097: number, benCallID: number )
  GetReferralDetails() {
    //instituteDirectoryID: number, instituteSubDirectoryID: number, stateID: number, districtID: number,
    //districtBranchMappingID: number, createdBy: string, beneficiaryRegID: number, serviceID1097: number, benCallID: number
    //this._coReferralService.getDetails( selected_directory, selected_sub_directory, stateID, districtID, districtBranchMappingID, "neer", beneficiaryRegID, serviceID1097, benCallID )

    let data =
      {
        "beneficiaryRegID": this.beneficiaryRegID,
        "benCallID": this.benCallID,
        "serviceID1097": this.subServiceID,
        "createdBy": this.saved_data.Userdata.userName,
        "instituteDirectoryID": this.selected_directory,
        "instituteSubDirectoryID": this.selected_sub_directory,
        "stateID": this.selected_state,
        "districtID": this.selected_district
      };
    // this._coReferralService.getDetails(this.selected_directory, this.selected_sub_directory, this.selected_state, this.selected_district, this.selected_branch,
    //   this.saved_data.Userdata.userName, this.beneficiaryRegID, this.subServiceID, this.beneficiaryDetails.benCallID
    // ).subscribe((response) => {
    //   this.SetReferralDetails(response)
    // },
    //   (err) => {
    //     this.alertMesage.alert(err.status);
    //   });

    this._coReferralService.getReferralInstituteDetails(data)
      .subscribe((response) => {
        this.saved_data.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page
        this.SetReferralDetails(response)
      },
      (err) => {
        this.alertMesage.alert(err.status, 'error');
      });
  }
  searchHistory: any = [];
  emptyArrayFlag = false;
  SetReferralDetails(response: any) {

    if (response.length < 1) {
      this.emptyArrayFlag = true;
    }
    else {
      this.emptyArrayFlag = false;
    }
    console.log('success referral', response);
    this.searchHistory = [];
    this.addressArray = [];
    this.indexArray = [];

    this.detailsList = response;
    for (let detail of this.detailsList) {
      this.searchHistory[this.searchHistory.length] = detail;
    }

    if (this.searchHistory.length > 0) {
      let requestArray = [];
      console.log(this.searchHistory, "SEARCH HISTORY");
      for (let i = 0; i < this.searchHistory.length; i++) {

        let obj = {
          'beneficiaryRegID': this.beneficiaryRegID,
          'benCallID': this.benCallID,
          'institutionID': this.searchHistory[i].institute.institutionID,
          'instituteDirectoryID': this.searchHistory[i].directory.instituteDirectoryID,
          'instituteSubDirectoryID': this.searchHistory[i].subDirectory.instituteSubDirectoryID,
          'providerServiceMapID': this.searchHistory[i].directory.providerServiceMapID,
          // 'remarks': this.searchHistory[i],
          'createdBy': this.saved_data.Userdata.userName
        }

        requestArray.push(obj);
        this._coReferralService.saveDirectorySeachHistory(requestArray).
          subscribe(res => {
            console.log(res, '## DIRECTORY SERVICE SEARCH HISTORY SAVED ##');
            this.searched_saved_response = res;
          },
          err => { });
      }

    }

    this.referralServiceProvided.emit();
    // if(response.length!=0){
    //   this.provideReferralDescription();
    // }
  }
  provideReferralDescription() {
    var refObj = {
      "state": this.selected_state,
      "district": this.selected_district,
      "taluk": this.selected_taluk,
      "block": this.selected_block,
      "selected_directory": this.selected_directory,
      "selected_sub_directory": this.selected_sub_directory,
      "date": new Date()
    }
    this.tableArray.push(refObj);
  }
  addHospital(val, i) {
    if (this.addressArray.length == 0 && this.indexArray.length == 0) {
      this.addressArray.push(val);
      this.indexArray.push(i);
    }
    else {
      if (this.indexArray.includes(i)) {
        let a = this.indexArray.indexOf(i);
        this.addressArray.splice(a, 1);
        this.indexArray.splice(a, 1);
      }
      else {
        this.addressArray.push(val);
        this.indexArray.push(i);
      }
    } console.log(this.addressArray);
    if (this.addressArray.length > 0) {
      this.smsFlag = true;
    }
    else {
      this.smsFlag = false;
    }
  }
  sendSms(alternate_mobile_number) {
    // let txtMsg = '';
    // this.addressArray.forEach(function (object) {
    //   txtMsg += "Hospital: " + object.institutionName + " " + object.address + ". Contact: ";
    //   if (object.contactNo1 != undefined) {
    //     txtMsg += object.contactNo1 + " ";
    //   }
    //   if (object.contactNo2 != undefined) {
    //     txtMsg += object.contactNo2 + " ";
    //   }
    //   if (object.contactNo3 != undefined) {
    //     txtMsg += object.contactNo3 + " ";
    //   }
    // }); console.log("text msg is-------->" + txtMsg);
    // if (value == undefined) {
    //   //have to fetch number from API and send sms to that number
    //   this.alertMesage.alert(this.msg_send, 'success');
    // }
    // else {
    //   //sms to be send on this number only (value)
    //   this.alertMesage.alert(this.msg_send, 'success');
    // }

    let directoryServiceIDs = [];
    directoryServiceIDs = this.filterDirectoryIDs(this.addressArray, this.searched_saved_response);

    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.saved_data.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (response[i].smsType.toLowerCase() === 'Referral SMS'.toLowerCase()) {
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
                  for (var i = 0; i < directoryServiceIDs.length; i++) {
                    let reqObj = {
                      "alternateNo": alternate_mobile_number,
                      'beneficiaryRegID': this.beneficiaryRegID,
                      "directoryServiceID": directoryServiceIDs[i],
                      "createdBy": this.saved_data.Userdata.userName,
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
      });

    // ********************************************** //
    this.smsFlag = false;
    this.directoryServicesForm.reset();
    this.searchHistory = [];
    this.searched_saved_response = [];

    // refreshing smsForm
    this.sendSMSform.reset();
    this.validNumber = false;

    // resetting state
    this.directoryServicesForm.form.patchValue({
      state: this.saved_data.current_stateID_based_on_role
    });
    console.log(this.directoryServicesForm.value, "AFTER 2");

  }

  filterDirectoryIDs(addresses, saved_response) {
    let ids: any = [];
    for (let i = 0; i < addresses.length; i++) {
      for (let j = 0; j < saved_response.length; j++) {
        if (addresses[i].institutionID === saved_response[j].institutionID) {
          ids.push(saved_response[j].directoryServiceID);
        } else {
          continue;
        }
      }
    }
    return ids;
  }



  validNumber: any = false;
  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    }
    else {
      this.validNumber = false;
    }
  }

  @Input() current_language: any;
  current_language_set: any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'

  ngOnChanges() {
    // if (this.current_language) {
    //   this.current_language_set = this.current_language;
    //   //   console.log("language in directory-services",this.current_language_set);
    //   this.msg_send = this.current_language.hao.diabetic.msg_send;
    // }
  }
}
// No longer in use, have to remove from module.ts as well...guru
@Component({
  selector: 'directory-services-modal',
  templateUrl: './directory-services-modal.html',
})
export class DirectoryServicesModal {
  currentLanguageSet: any;
  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public httpServices: HttpServices,
    public dialogReff: MdDialogRef<DirectoryServicesModal>) { }

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
