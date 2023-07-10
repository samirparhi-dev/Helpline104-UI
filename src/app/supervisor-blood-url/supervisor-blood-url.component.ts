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


import { Component, OnInit } from '@angular/core';
import { BloodOnCallServices } from '../services/sioService/bloodOnCallServices.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-supervisor-blood-url',
  templateUrl: './supervisor-blood-url.component.html',
  styleUrls: ['./supervisor-blood-url.component.css']
})
export class SupervisorBloodUrlComponent implements OnInit {

  constructor(private saved_data: dataService, private bloodOnCallService: BloodOnCallServices,
    public dialogService: ConfirmationDialogsService,public HttpServices: HttpServices) { }

  //ngModels
  existing_bloodBankUrl: any;
  bloodBankUrl: any;

//http://blood.kar.nic.in/
  

//variables
  website_expression: any;
  providerServiceMapID: any;
  agentData: any;
  instituteID: any;
  currentLanguageSet: any;

  //flags
  show: boolean = false;

  ngOnInit() {
    this.currentLanguageSetValue();
    this.website_expression = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.agentData = this.saved_data.Userdata;
    this.bloodOnCallService.getBloodBankUrl(this.providerServiceMapID).subscribe(response => { this.getUrlSuccess(response) });
  }

  currentLanguageSetValue() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
	  
	  ngDoCheck() {
		this.currentLanguageSetValue();
	  }    

  showDiv(val) {
    this.show = val;
    if (this.existing_bloodBankUrl.toUpperCase() != 'enter URL starting with http'.toUpperCase()) {
      this.bloodBankUrl = this.existing_bloodBankUrl;
    }
    else {
      this.bloodBankUrl = '';
    }

  }

  updateURL(value) {
    let data = {
      "institutionID": this.instituteID,
      "providerServiceMapID": this.providerServiceMapID,
      "website": value.bloodBankUrl ? value.bloodBankUrl.trim() : null,
      "createdBy": this.agentData.userName
    }
    console.log(JSON.stringify(data));
    this.bloodOnCallService.saveBloodBankUrl(JSON.stringify(data)).subscribe(response => { this.updateUrlSuccess(response) },
    (err)=> {
      this.dialogService.alert(this.currentLanguageSet.errorOccuredWhileUpdating, 'error');
    })
  }

  getUrlSuccess(res) {
    if (res.institutionID) {
      this.instituteID = res.institutionID;
      this.existing_bloodBankUrl = res.website;
    }
    else {
      this.instituteID = undefined;
      this.existing_bloodBankUrl = "Enter URL starting with http";
    }
  }

  updateUrlSuccess(res) {
    this.dialogService.alert(this.currentLanguageSet.bloodUrlUpdatedSuccessfully, 'success');
    this.show = false;
    this.bloodOnCallService.getBloodBankUrl(this.providerServiceMapID).subscribe(response => { this.getUrlSuccess(response) });
  }
}
