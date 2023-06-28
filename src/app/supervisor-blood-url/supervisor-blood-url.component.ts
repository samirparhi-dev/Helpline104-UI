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
