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
  EventEmitter,
  Input,
  Output,
  OnChanges,
  DoCheck,
} from "@angular/core";
import { Router } from "@angular/router";
import { CzentrixServices } from "../services/czentrix/czentrix.service";
import { dataService } from "../services/dataService/data.service";
import { AvailableServices } from "../services/common/104-services";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-services-104",
  templateUrl: "./104-services.component.html",
})
export class ServicesComponent implements OnInit, OnChanges, DoCheck {
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();

  @Output() closurePage: EventEmitter<any> = new EventEmitter<any>();
  assignSelectedLanguageValue: any;

  constructor(
    private _availableServices: AvailableServices,
    private czentrixServices: CzentrixServices,
    public _dataService: dataService,
    public rout: Router,
    private message: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}
  beneficiaryDetails: any;
  ipAddress: any;
  services: any = [];
  transferCallResponse: any = [];
  service: any;
  requestObj: any = {};
  beneficiaryRegID: any;
  agentData: any;
  callerNumber: any;
  callerID: any;
  transferToCampaign: any;
  transferToService: any;
  hasHAOPrivilege: boolean = false;
  privleges: any;
  transferableCampaigns: any = [];
  call_transfered_to: any;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.privleges = this._dataService.userPriveliges;
    this.agentData = this._dataService.Userdata;
    this.ipAddress = this._dataService.ipAddress;
    console.log("ipAddress:" + this.ipAddress);

    this.beneficiaryDetails =
      this._dataService.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.beneficiaryRegID =
        this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }

    this.requestObj = {
      providerServiceMapID: this._dataService.current_service.serviceID,
    };

    this._availableServices
      .getServices(this.requestObj)
      .subscribe((response) => this.successHandler(response));

    if (this.ipAddress == undefined || this.ipAddress == "") {
      console.log("fetch ipAddress");
      // fetch ip address & then fetch campaigns
      this.czentrixServices.getIpAddress(this._dataService.agentID).subscribe(
        (response) => {
          this.ipSuccessHandler(response);
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
    } else {
      this.getTransferableCampaigns();
    }
    this.checkHAOPrivilege();
  }

  checkHAOPrivilege() {
    for (let i = 0; i < this.privleges.length; i++) {
      if (this.privleges[i].serviceName == "104") {
        for (let j = 0; j < this.privleges[i].roles.length; j++) {
          for (
            let k = 0;
            k < this.privleges[i].roles[j].serviceRoleScreenMappings.length;
            k++
          ) {
            if (
              this.privleges[i].roles[j].serviceRoleScreenMappings[k].screen
                .screenName == "Health_Advice"
            ) {
              console.log("Agent has HAO privilege");
              this.hasHAOPrivilege = true;
            }
          }
        }
      }
    }
  }

  getCampaigns() {
    this.czentrixServices.getCampaigns().subscribe(
      (response) => {
        console.log("getCampaigns response: " + JSON.stringify(response));
      },
      (err) => {
        console.log("Error in getCampaigns", err);
      }
    );
  }

  getTransferableCampaigns() {
    this.czentrixServices
      .getTransferableCampaigns(this._dataService.agentID, this.ipAddress)
      .subscribe(
        (response) => {
          console.log("getTransferableCampaigns: " + JSON.stringify(response));

          this.transferableCampaigns = response.campaign;

          console.log(
            "transferableCampaigns: " +
              JSON.stringify(this.transferableCampaigns)
          );
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
  }

  transferCallToCampaign() {
    this.czentrixServices
      .transferToCampaign(
        this._dataService.agentID,
        this.ipAddress,
        this.transferToCampaign
      )
      .subscribe(
        (response) => {
          console.log(
            "transferToCampaign response: " + JSON.stringify(response)
          );

          if (response.status == "SUCCESS") this.showAlert();
        },
        (err) => {
          console.log("Error in getCampaigns", err);
        }
      );
  }

  showAlert() {
    this.message.alert(
      this.call_transfered_to + this.transferToCampaign,
      "success"
    );
    this.rout.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }

  chooseService(serviceName) {
    console.log("service " + serviceName);
    serviceName = serviceName.toLowerCase();
    this.transferToService = serviceName;
    let errorMsg;

    if (serviceName.indexOf("health advisory") != -1 && this.hasHAOPrivilege) {
      return;
    } else if (
      serviceName.indexOf("health advisory") != -1 ||
      serviceName.indexOf("directory") != -1 ||
      serviceName.indexOf("diabetic") != -1 ||
      serviceName.indexOf("hypertension") != -1
    ) {
      this.transferToCampaign = this.getCampaignName("hao");
      errorMsg = "Please configure HAO campaign.";
      /*  if(this.hasHAOPrivilege)
              {  }  */
    } else if (
      serviceName.indexOf("blood") != -1 ||
      serviceName.indexOf("organ") != -1 ||
      serviceName.indexOf("service improvements") != -1 ||
      serviceName.indexOf("health schemes") != -1 ||
      serviceName.indexOf("epidemic outbreak service") != -1 ||
      serviceName.indexOf("food safety") != -1
    ) {
      this.transferToCampaign = this.getCampaignName("sio");
      errorMsg = "Please configure SIO campaign.";
    } else if (serviceName.indexOf("counselling") != -1) {
      this.transferToCampaign = this.getCampaignName("co");
      errorMsg = "Please configure CO campaign.";
    } else if (serviceName.indexOf("medical") != -1) {
      this.transferToCampaign = this.getCampaignName("mo");
      errorMsg = "Please configure MO campaign.";
    } else if (serviceName.indexOf("psychiatrist") != -1) {
      this.transferToCampaign = this.getCampaignName("pd");
      errorMsg = "Please configure PD campaign.";
    }

    console.log("transferToCampaign " + this.transferToCampaign);

    if (!this.transferToCampaign) {
      this.message.alert(errorMsg, "error");
    }
  }

  callServiceObj: any = {};
  serviceSelected: any;
  TransferCall(serviceID) {
    console.log("TransferCal::serviceID " + serviceID);
    this.transferSuccessHandler("ree");
  }

  getCampaignName(role) {
    if (this.transferableCampaigns.length > 0) {
      try {
        return this.transferableCampaigns.filter(function (item) {
          console.log(
            "campaign_name: " + item.campaign_name + " role: " + role
          );
          return item.campaign_name.toLowerCase().indexOf(role) != -1;
        })[0].campaign_name;
      } catch (err) {
        return undefined;
      }

      // .campaign_name
    } else console.log("No Campaigns");
  }

  successHandler(response) {
    console.log("RESPONSE", JSON.stringify(response));
    this.services = response;
  }

  ipSuccessHandler(response) {
    console.log("fetch ip response: " + JSON.stringify(response));
    this.ipAddress = response.agent_ip;
    console.log("ipAddress:" + this.ipAddress);
    this.getTransferableCampaigns();
    return response;
  }

  transferSuccessHandler(response) {
    console.log("transferSuccessHandler", JSON.stringify(response));

    if (
      this.transferToService.indexOf("health advisory") != -1 &&
      this.hasHAOPrivilege
    ) {
      console.log("navigateToHAO");
      this.navigateToHAO();
    } else {
      console.log("navigate To closure page");
      this.closurePage.emit(this.transferToCampaign);
    }
  }

  navigateToHAO() {
    console.log("navigateToHAO called");
    this._dataService.current_role = "HAO";
    this.roleChanged.emit("HAO");
  }
  close() {
    this.closurePage.emit("none");
  }

  ngOnChanges() {
    this.assignSelectedLanguage();
    this.call_transfered_to =
      this.assignSelectedLanguageValue.callTransferedTo;
  }
  /*
   * JA354063 - Created on 22-07-2021
   */
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  /* Ends*/
}
