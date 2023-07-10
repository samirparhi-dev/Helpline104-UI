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


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { dataService } from '../services/dataService/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundWorklistService } from '../services/outboundServices/outbound-work-list.service';
import { BloodOnCallServices } from '../services/sioService/bloodOnCallServices.service';
import { RegisteredBeneficiaryModal104 } from '../beneficiary-registration-104/beneficiary-registration-104.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

declare var jQuery: any;
@Component({
  selector: 'app-sio-outbound-provider',
  templateUrl: './sio-outbound-provider.component.html',
  styleUrls: ['./sio-outbound-provider.component.css']
})
export class SioOutboundProviderComponent implements OnInit {
  @Input() providerData: any;

  altNum: any;
  mobileNumber: any;
  data: any = {};
  agentData: any;
  bloodRquest: any;
  beneficiaryRegID: any;
  beneficiaryDetails: any;
  reqNumber: any;

  currentLanguageSet: any;

  constructor(private _dataService: dataService,
              public dialog: MdDialog,
              private bloodOnCallService: BloodOnCallServices,
              private _OWLService: OutboundWorklistService,
              public HttpServices: HttpServices) {
    this.agentData = this._dataService.Userdata;
    this.beneficiaryDetails = this._dataService.beneficiaryDataAcrossApp.beneficiaryDetails;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.data = this._dataService.sio_outbond_providerlist;
    // console.log(this.data);
    // console.log(this.data+"FF");
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary)
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    //  console.log(this.providerData.requestNo);
    //  console.log(this.bloodOnCallService);
    console.log(this.providerData, 'kjkjkjkjkjkjk');
    if (this.providerData) {
      this.beneficiaryRegID = this.providerData.beneficiary.beneficiaryRegID;
      this.reqNumber = this.providerData.requestNo;
      this.getBloodRequests();
    }
    if(this.currentLanguageSet) {
    this.msg2 = "Blood requirement details captured.";
    }
  }
  saveBloodDetails(values) {

    this.bloodOutboundObj = {};
    this.bloodOutboundObj.bloodReqID = values.bloodReqID;
    this.bloodOutboundObj.bloodBankAddress = values.address;
    this.bloodOutboundObj.bloodBankPersonName = values.contactPerson;
    this.bloodOutboundObj.bloodBankMobileNo = values.phoneNumber;
    this.bloodOutboundObj.bBPersonDesignation = values.designation;
    this.bloodOutboundObj.sendSMS = false;
    this.bloodOutboundObj.remarks = values.remarks ? values.remarks.trim() : null;
    this.bloodOutboundObj.feedback = values.feedback;
    this.bloodOutboundObj.isRequestFulfilled = values.isRequestFulfilled;
    this.bloodOutboundObj.deleted = false;
    this.bloodOutboundObj.createdBy = this.agentData.userName;

    this._OWLService.saveBloodBankDetails(JSON.stringify(this.bloodOutboundObj)).subscribe(response => {
      this.bloodBankSuccessHandler(response)
    });
    //TODO: remove here, keep where it is needed
    //this.updateBloodOutboundDetails(this.bloodOutboundRes.bloodOutboundDetailID);

  }
  msg2: any;
  bloodBankSuccessHandler(res) {

    this.bloodOutboundRes = res;
    jQuery("#blood_form").trigger("reset");
    let dialogReff = this.dialog.open(RegisteredBeneficiaryModal104, {
      // height: '280px',
      width: '420px',
      disableClose: true,
      data: {
        "generatedId": this.msg2,
        "bloodOnCall": "yes"
      }
    });
    dialogReff.afterClosed().subscribe(result => {
      let number = result
    });

  }

  updatebloodOutboundObj: any = {};
  updateBloodOutboundRes: any;
  bloodOutboundRes: any;
  bloodOutboundObj: any = {};
  updateBloodOutboundDetails(bloodOutboundDetailID) {
    console.log(bloodOutboundDetailID);
    this.updatebloodOutboundObj = {};
    this.updatebloodOutboundObj.czentrixCallID = "131234";
    this.updatebloodOutboundObj.bloodOutboundDetailID = bloodOutboundDetailID;

    this._OWLService.updateBloodBankDetails(JSON.stringify(this.updatebloodOutboundObj)).subscribe(response => { this.updateBloodOutboundRes = response });
  }
  getBloodRequests() {
    console.log("getBloodRequests: " + this.beneficiaryRegID + " : " + this.reqNumber);
    this.bloodOnCallService.getBloodRequestsByBenID(this.beneficiaryRegID, this.reqNumber).subscribe(response  =>  this.bloodRquest  =  this.successHandler(response));
  }
  blood_details: any = {};
  successHandler(res) {
    console.log("blood request response: " + JSON.stringify(res));
    this.blood_details = res[0];
    console.log(this.blood_details.m_componentType);
  }
  sendSMS(value) {
    if (value == undefined) {
      console.log("use registered number");
      //fetch registered mobile number
    }
    else {
      console.log(value);
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