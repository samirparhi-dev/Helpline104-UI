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


import { Component, OnInit, Output, EventEmitter, Input, OnChanges, DoCheck } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
declare var jQuery: any;
import { CallServices } from "../services/callservices/callservice.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-104-mo",
  templateUrl: "./104-mo.component.html",
  styleUrls: ["./104-mo.component.css"],
})
export class Mo_104_Component implements OnInit, OnChanges, DoCheck {
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();
  assignSelectedLanguageValue: any;

  constructor(
    private dialogService: ConfirmationDialogsService,
    public commonAppData: dataService,
    private _callServices: CallServices,
    private httpServices: HttpServices
  ) {}
  callerNumber: any;
  callerID: any;
  beneficiaryDetails: any;
  current_campaign: any;
  privleges: any;
  hasCOPrivilege: boolean = false;
  dataInjection: any;
  confirm_cancel: any;
  confirm_closure: any;
  screens: any;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.current_campaign = this.commonAppData.current_campaign;
    this.privleges = this.commonAppData.userPriveliges;
    this.screens = this.commonAppData.screens;
    console.log("privleges: " + JSON.stringify(this.privleges));
    this.checkCOPrivilege();

    var idx = jQuery(".carousel-inner div.active").index();
    var outIdx = jQuery(".carousel-inner div.active").index();

    console.log("index", idx);

    this.commonAppData.callDisconnected.subscribe(() => {
      jQuery("#myCarousel").carousel(1);
      jQuery("#myOutCarousel").carousel(1);
      jQuery("#four").parent().find("a").removeClass("active-tab");
      jQuery("#four").find("a").addClass("active-tab");
      jQuery("#cancelLink").attr("disabled", false);
      jQuery("#closureLink").attr("disabled", true);
    });

    jQuery("#one").on("click", function () {
      jQuery("#myCarousel").carousel(idx);

      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });
    jQuery("#four").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 1);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });
    jQuery("#outboundClosureLink").on("click", function () {
      console.log("closure");
      jQuery("#myOutCarousel").carousel(outIdx + 2);
      jQuery("#outThree").parent().find("a").removeClass("active-tab");
      jQuery("#outThree").find("a").addClass("active-tab");
    });
    jQuery("#outboundCancelLink").on("click", function () {
      console.log("cancel");
      jQuery("#myOutCarousel").carousel(outIdx);
      jQuery("#outOne").parent().find("a").removeClass("active-tab");
      jQuery("#outOne").find("a").addClass("active-tab");
    });
    jQuery("#outOne").on("click", function () {
      console.log("oneee");
      jQuery("#myOutCarousel").carousel(this.idx);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });
    jQuery("#outThree").on("click", function () {
      jQuery("#myOutCarousel").carousel(this.idx + 2);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
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
  addActiveClass(val: any) {
    jQuery("#" + val)
      .parent()
      .find("a")
      .removeClass("active-tab");
    jQuery("#" + val)
      .find("a")
      .addClass("active-tab");
  }
  outboundProviderList(value) {
    this.dataInjection = value;
    console.log("Workbound item selected");
  }

  checkCOPrivilege() {
    for (let i = 0; i < this.privleges.length; i++) {
      if (this.privleges[i].serviceName == "104") {
        for (let j = 0; j < this.privleges[i].roles.length; j++) {
          if (this.privleges[i].roles[j].RoleName == "CO") {
            console.log("Agent has CO privilege");
            this.hasCOPrivilege = true;
          }
        }
      }
    }
    console.log("COPrivilege: " + this.hasCOPrivilege);
  }

  navigateToCO() {
    console.log("navigateToCO called");
    this.commonAppData.current_role = "CO";
    this.roleChanged.emit("CO");
  }
  openDialog() {
    this.dialogService
      .confirm("Cancel Call ", this.assignSelectedLanguageValue.confirmDoCancel)
      .subscribe((response) => {
        if (response) {
          const id = jQuery(".carousel-inner div.active").index();
          jQuery("#myCarousel").carousel(0);
          jQuery("#myOutCarousel").carousel(0);
          jQuery("#one").parent().find("a").removeClass("active-tab");
          jQuery("#one").find("a").addClass("active-tab");
          jQuery("#cancelLink").attr("disabled", true);
          jQuery("#closureLink").attr("disabled", false);
        }
      });
  }
  openDialogClosure() {
    this.dialogService
      .confirm("Closure ", this.assignSelectedLanguageValue.confirmDoClosure)
      .subscribe((response) => {
        if (response) {
          jQuery("#myCarousel").carousel(1);
          jQuery("#myOutCarousel").carousel(1);
          jQuery("#four").parent().find("a").removeClass("active-tab");
          jQuery("#four").find("a").addClass("active-tab");
          jQuery("#cancelLink").attr("disabled", false);
          jQuery("#closureLink").attr("disabled", true);
        }
      });
  }

  closeCall() {
    this._callServices.clearSessionValuesAfterCallClose();
  }
  continueCall() {
    jQuery("#cancelLink").attr("disabled", true);
    jQuery("#closureLink").attr("disabled", false);
  }
 
  ngOnChanges() {
    this.assignSelectedLanguage();
    this.confirm_cancel = this.assignSelectedLanguageValue.confirmDoCancel;
    this.confirm_closure = this.assignSelectedLanguageValue.confirmDoClosure;
  }
}
