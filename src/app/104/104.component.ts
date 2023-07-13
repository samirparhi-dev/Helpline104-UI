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


import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationDialogsService } from "app/services/dialog/confirmation.service";
import { SearchService } from "app/services/searchBeneficiaryService/search.service";
import { CallerService } from "../services/common/caller.service";
import { dataService } from "../services/dataService/data.service";
declare var jQuery: any;

@Component({
  selector: "app-104",
  templateUrl: "./104.component.html",
  styleUrls: ["./104.component.css"],
})
export class Helpline_104_Component implements OnInit {
  callerNumber: any;
  callerID: any;
  beneficiaryDetails: any;
  loadComponent: any = false;

  current_role: any;
  current_campaign: any = "";
  screens = [];
  hasHAOpriveledge: boolean = false;
  @Output() onBenRegDataSelect: EventEmitter<any> = new EventEmitter<any>();
  // event emitter to send role change event to inner page
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();
  benDetails: any;
  healthIDValue:string='';

  constructor(
    private router: ActivatedRoute,
    private _util: SearchService,
    private callerService: CallerService,
    public commonAppData: dataService,
    private alertMessage: ConfirmationDialogsService
  ) {}
  ngOnInit() {
    this.screens = this.commonAppData.screens;

    if (
      this.screens.includes("Health_Advice") &&
      this.screens.includes("Registration")
    ) {
      this.hasHAOpriveledge = true;
    }
    this.current_campaign = this.commonAppData.current_campaign;
    if (sessionStorage.getItem("CLI") != undefined) {
      this.callerNumber = sessionStorage.getItem("CLI");
    }
    if (sessionStorage.getItem("session_id") != undefined) {
      this.callerID = sessionStorage.getItem("session_id");
    }
    if (
      this.current_role !== "Supervisor" &&
      this.commonAppData.current_campaign === "INBOUND"
    ) {
      this.getBeneficiaryByCallID();
    } else {
      this.loadComponent = true;
    }

    this.current_role = this.commonAppData.current_role;
  }

  getSelectedBenDetails(data: any) {
    this.onBenRegDataSelect.emit(data);
  }
  //SH20094090,23-092021,HealthID Integration changes on Innerpage
  getHealthIdDetails(benRegID)
  {
    this.healthIDValue='';
    this.commonAppData.benHealthID=null;
    let obj = {
      "beneficiaryID": null,
      "beneficiaryRegID": benRegID
    }
    this._util.fetchHealthIdDetails(obj).subscribe(
      (healthIDDetails) => {
          if(healthIDDetails !=undefined && healthIDDetails.BenHealthDetails !=undefined && healthIDDetails.BenHealthDetails !=null)
          {
            this.benDetails=healthIDDetails.BenHealthDetails;
            if(this.benDetails.length >0)
          {
          this.benDetails.forEach((healthID) => {
            if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDValue=this.healthIDValue+healthID.healthId+', ';
          })
          if(this.healthIDValue !=undefined && this.healthIDValue !=null && this.healthIDValue.length >1)
          this.healthIDValue=this.healthIDValue.substring(0,this.healthIDValue.length-1);
          this.commonAppData.benHealthID= this.healthIDValue;
        }
        else
        {
          this.commonAppData.benHealthID=null;
          this.healthIDValue='';
        }
        
        }
        else
        {
          this.commonAppData.benHealthID=null;
          this.healthIDValue='';
        }
        // else {
        //   this.getCommonData.benHealthID=null;
        //   this.alertMessage.alert("Issue in getting Beneficiary Health ID  Details", 'error');
        // }
      }, (err) => {
        this.commonAppData.benHealthID=null;
        this.healthIDValue='';
        this.alertMessage.alert("Issue in getting Beneficiary Health ID  Details", 'error');
      });
  }
  getBeneficiaryByCallID() {
    console.log("getBeneficiaryByCallID: " + this.callerID);
    let data = '{"callID":"' + this.callerID + '"}';
    this.callerService.getBeneficiaryByCallID(data).subscribe(
      (response) => {
        this.loadComponent = true;
        this.beneficiaryDetails = this.handlesuccess(response);
        console.log(
          "getBeneficiaryByCallID::Response: " +
            JSON.stringify(this.beneficiaryDetails)
        );
        if (response.i_beneficiary) {
          this.commonAppData.benRegID = response.i_beneficiary.beneficiaryRegID;
          this.getHealthIdDetails(response.i_beneficiary.beneficiaryRegID);
          this.onBenRegDataSelect.emit(response.i_beneficiary);
        }

        // send beneficiary details to inner page
      },
      (err) => {
        console.log("error in benDetailByCallerID");
        this.loadComponent = true;
      }
    );
  }

  handlesuccess(response) {
    if (this.hasHAOpriveledge == false) {
      this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails = response;

      //	console.log("beneficiaryDetails from call id: "+JSON.stringify(response));
      return response;
    }
  }

  changeCurrentRole(newRole: string) {
    console.log("new role is", newRole);
    this.current_role = newRole;
    // send role change event to parent (inner page)
    this.roleChanged.emit(newRole);
  }
}
