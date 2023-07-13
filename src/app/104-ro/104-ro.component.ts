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


import { Component, OnInit, EventEmitter, Output, Input, DoCheck, OnChanges } from "@angular/core";
import { CallerService } from "../services/common/caller.service";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
declare var jQuery: any;
import { CallServices } from "../services/callservices/callservice.service";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import { RegisterService } from "app/services/register-services/register-service";
@Component({
  selector: "app-104-ro",
  templateUrl: "./104-ro.component.html",
  styleUrls: ["./104-ro.component.css"],
})
export class Ro_104_Component implements OnInit, DoCheck, OnChanges {
  @Output() onBenRegDataSelect: EventEmitter<any> = new EventEmitter<any>();
  // event emitter to send role change event to inner page
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();
  reset: any;
  isNextHide: boolean;
  registeredOrNot: boolean = false;
  disableCancel: boolean = true;
  callerNumber: any;
  callerID: any;
  transferValue: any;
  disableClosure: boolean;
  screens: any;
  confirm_cancel: any;
  confirm_closure: any;
  hasHAOpriveledge: boolean = false;
  beneficiarySelected: any;
  assignSelectedLanguageValue: any;
  isEmergency: boolean = false;

  constructor(
    public getCommonData: dataService,
    private dialogService: ConfirmationDialogsService,
    private callerService: CallerService,
    private _callServices: CallServices,
    private httpServices:HttpServices,
    private registerService: RegisterService,
  ) {}
  ngOnInit() {
    this.assignSelectedLanguage();
    this.screens = this.getCommonData.screens;
    this.disableClosure = false;
    if (sessionStorage.getItem("CLI") != undefined) {
      this.callerNumber = sessionStorage.getItem("CLI");
    }
    if (sessionStorage.getItem("session_id") != undefined) {
      this.callerID = sessionStorage.getItem("session_id");
    }
    if (this.screens.includes("Health_Advice")) {
      this.hasHAOpriveledge = true;
    }
    this.isNextHide = true;
    var idx = jQuery(".carousel-inner div.active").index();

    console.log("index", idx);

    this.getCommonData.callDisconnected.subscribe(() => {
      jQuery("#myCarousel").carousel(1);
      jQuery("#three").parent().find("a").removeClass("active-tab");
      jQuery("#three").find("a").addClass("active-tab");
      this.disableCancel = false;
      this.reset = "no";
      this.isNextHide = true;
      this.transferValue = "none";
      this.disableClosure = true;
    });

    jQuery("#previous").on("click", function () {
      var idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      if (idx === 0) {
        jQuery("#two").parent().find("a").removeClass("active-tab");
        jQuery("#two").find("a").addClass("active-tab");
      }
    });

    jQuery("#next").on("click", function () {
      var idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      if (idx === 0) {
        jQuery("#two").parent().find("a").removeClass("active-tab");
        jQuery("#two").find("a").addClass("active-tab");
      }
    });

    /*
    * boolean to enable procced to hao button 
    */
    this.registerService.checkIsEmergency$.subscribe(value =>{
      if(value == true)
      this.isEmergency = true;
      else 
      this.isEmergency = false
    });

    /*
    * boolean to disable procced to hao button 
    */
      this.registerService.isDemographicDataNeeded$.subscribe(value =>{
        if(value == true)
        this.isEmergency = false;
        else 
        this.isEmergency = true;
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
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  /* Ends */
  hideShoNextEvent(value) {
    this.disableCancel = false;
    this.reset = "no";
    if (value == true) {
      this.isNextHide = false;
    } else {
      this.isNextHide = true;
    }
  }
  nextClicked() {
    this.disableCancel = false;
    this.reset = "no";
    this.isNextHide = true;
  }
  cancelClicked() {
    this.disableCancel = true;
    this.reset = "yes";
    this.isNextHide = true;
  }

  addActiveClass(val: any) {
    jQuery("#" + val)
      .parent()
      .find("a")
      .removeClass("active-tab");
    jQuery("#" + val)
      .find("a")
      .addClass("active-tab");
  }

  getSelectedBenDetails(data: any) {
    this.beneficiarySelected = data.beneficiaryRegID;
    console.log("data recieved", data, data.beneficiaryRegID);
    this.onBenRegDataSelect.emit(data);
  }
  openDialog() {
    this.dialogService
      .confirm("Cancel Call ", this.assignSelectedLanguageValue.confirmDoCancel)
      .subscribe((response) => {
        if (response) {
          const id = jQuery(".carousel-inner div.active").index();
          jQuery("#myCarousel").carousel(0);
          jQuery("#one").parent().find("a").removeClass("active-tab");
          jQuery("#one").find("a").addClass("active-tab");
          this.disableCancel = true;
          this.reset = "yes";
          this.isNextHide = true;
          this.disableClosure = false;
          // sending default benificary details after cancel
          let data = '{"callID":"' + this.callerID + '"}';
          this.callerService
            .getBeneficiaryByCallID(data)
            .subscribe((response) => {
              // console.log(response,"getting api response");
              this.onBenRegDataSelect.emit(response.i_beneficiary);
            });
        }
      });
  }
  openDialogClosure() {
    this.dialogService
      .confirm("Closure ", this.assignSelectedLanguageValue.confirmDoClosure)
      .subscribe((response) => {
        if (response) {
          jQuery("#myCarousel").carousel(1);
          jQuery("#three").parent().find("a").removeClass("active-tab");
          jQuery("#three").find("a").addClass("active-tab");
          this.disableCancel = false;
          this.reset = "no";
          this.isNextHide = true;
          this.transferValue = "none";
          this.disableClosure = true;
        }
      });
  }

  closeCall() {
    console.log("104ro")
    this._callServices.clearSessionValuesAfterCallClose();
  }
  continueCall() {
    this.disableClosure = false;
    this.disableCancel = true;
    this.reset = "yes";
  }

  ngOnChanges() {
    this.assignSelectedLanguage();
    this.confirm_cancel = this.assignSelectedLanguageValue.confirmDoCancel;
    this.confirm_closure = this.assignSelectedLanguageValue.confirmDoClosure;
  }

  changeCurrentRole(newRole: string) {
    this.getCommonData.current_role = "HAO";
    this.getCommonData.roleChanged.next("HAO");

    if (newRole != "1") {
      console.log("new role is", newRole);
      // send role change event to parent (inner page)
      this.roleChanged.emit(newRole);
    }
  }
  nextClosure() {
    this.disableClosure = true;
  }

}
