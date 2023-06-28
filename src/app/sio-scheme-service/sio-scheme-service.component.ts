import { Component, OnInit, Input } from '@angular/core';

import { SchemeService } from '../services/sioService/sio-scheme.service';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-sio-scheme-service',
  templateUrl: './sio-scheme-service.component.html'
})
export class SioSchemeServiceComponent implements OnInit {

  providerServiceMapID: any;
  beneficiaryRegID: any;
  benCallID: any;
  schemeList: any = [];
  schemeSearchHistory: any = [];
  showHistoryFlag: any = false;
  currentLanguageSet: any;

  constructor(private schemeService: SchemeService, private saved_data: dataService,  public HttpServices: HttpServices ) {
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.saved_data.current_service.serviceID;

    let beneficiaryDetails = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (beneficiaryDetails && beneficiaryDetails.i_beneficiary) {
      this.beneficiaryRegID = beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }
    else if (this.saved_data.benRegID ) {
      this.beneficiaryRegID = this.saved_data.benRegID;
      // this case will execute in hybridHAO case
    } 

    if (this.saved_data.benCallID) {
      this.benCallID = this.saved_data.benCallID;
    }
    else {
      this.benCallID = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }

    var obj = {
      "providerServiceMapID": this.providerServiceMapID
    }
    this.schemeService.getSchemeList(obj).subscribe(response => this.getSchemesSuccess(response));
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  getSchemesSuccess(res) {
    if (res.length > 0)
      this.schemeList = res;
  }

 

  ngOnChanges() {
   
  }

  schemeServiceAvailed(file_url, scheme) {
    if (file_url != undefined && file_url != null) {
      let req_arr = [{
        'beneficiaryRegID': this.beneficiaryRegID,
        'benCallID': this.benCallID,
        'schemeID': scheme.schemeID,
        'providerServiceMapID': this.providerServiceMapID,
        'createdBy': this.saved_data.Userdata.userName,
      }];
      this.schemeService.saveSearchScheme(req_arr)
        .subscribe(response => {
          console.log(response, 'success after availing scheme service');
          this.saved_data.serviceAvailed.next(true);
        }, err => {
          console.log(err, 'error after availing scheme service');
        });
    }
  }

  showHistory() {
    let req_obj = { 'beneficiaryRegID': this.beneficiaryRegID }

    this.schemeService.schemeSearchHistory(req_obj)
      .subscribe(response => {
        console.log(response, 'scheme history response');
        this.schemeSearchHistory = response;
        this.showHistoryFlag = true;
      }, err => {
        console.log(err, 'scheme history error');
      });
  }

  showSchemes() {
    this.showHistoryFlag = false;
  }
}
