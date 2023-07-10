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


import { Component, OnInit, Input, EventEmitter, Output, OnChanges, DoCheck } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
declare var jQuery: any;
import { CallServices } from "../services/callservices/callservice.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
@Component({
  selector: "app-104-hao",
  templateUrl: "./104-hao.component.html",
  styleUrls: ["./104-hao.component.css"],
})
export class Hao_104_Component implements OnInit, OnChanges, DoCheck {
  callerNumber: any;
  callerID: any;
  beneficiaryDetails: any;
  flag = true;
  current_campaign: any;
  screens: any;
  dataInjection: any;
  confirm_cancel: any;
  confirm_closure: any;
  showBackToRO: boolean = false;
  outboundFor: any;
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();
  assignSelectedLanguageValue: any;

  constructor(
    private dialogService: ConfirmationDialogsService,
    public commonAppData: dataService,
    private _callServices: CallServices,
    private httpServices: HttpServices
  ) {
    if (sessionStorage.getItem("service") != undefined) {
      this.outboundFor = sessionStorage.getItem("service");
    } else {
      this.outboundFor = "casesheet";
    }
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.current_campaign = this.commonAppData.current_campaign;
    this.screens = this.commonAppData.screens;
    console.log("Screens", this.screens);
    var idx = jQuery(".carousel-inner div.active").index();
    console.log("index", idx);
    if (this.screens.includes("Registration")) {
      this.showBackToRO = true;
    }
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

    jQuery("#previous").on("click", function () {
      idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      if (idx === 0) {
        console.log("chala");
        jQuery("#one").parent().find("a").removeClass("active-tab");
        jQuery("#one").find("a").addClass("active-tab");
      }
      if (idx === 1) {
        jQuery("#four").parent().find("a").removeClass("active-tab");
        jQuery("#four").find("a").addClass("active-tab");
      }
    });

    jQuery("#next").on("click", function () {
      idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      if (idx === 0) {
        jQuery("#one").parent().find("a").removeClass("active-tab");
        jQuery("#one").find("a").addClass("active-tab");
      }
      if (idx === 1) {
        jQuery("#four").parent().find("a").removeClass("active-tab");
        jQuery("#four").find("a").addClass("active-tab");
      }
    });
    var outIdx = jQuery(".carousel-inner div.active").index();
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
      jQuery("#myOutCarousel").carousel(idx);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });
    jQuery("#outThree").on("click", function () {
      jQuery("#myOutCarousel").carousel(idx + 2);
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

  openDialog() {
    this.dialogService
      .confirm("Cancel Call ", this.assignSelectedLanguageValue.confirmDoCancel)
      .subscribe((response) => {
        if (response) {
          const id = jQuery(".carousel-inner div.active").index();
          jQuery("#myCarousel").carousel(0);
          jQuery("#myOutCarousel").carousel(0);
          jQuery("#two").parent().find("a").removeClass("active-tab");
          jQuery("#two").find("a").addClass("active-tab");
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

  outboundProviderList(value) {
    jQuery("#cancelLink").attr("disabled", false);
    this.dataInjection = value;
  }
  ngOnChanges() {
    this.assignSelectedLanguage();
    this.confirm_cancel = this.assignSelectedLanguageValue.confirmDoCancel;
    this.confirm_closure = this.assignSelectedLanguageValue.confirmDoClosure;
  }
  changeCurrentRole(newRole: string) {
    jQuery("#closureLink").attr("disabled", false);
    if (newRole != "1") {
      console.log("new role is", newRole);
      // send role change event to parent (inner page)
      this.roleChanged.emit(newRole);
    }
  }
  gotoRO() {
    this.commonAppData.current_role = "RO";
    this.roleChanged.emit("RO");
  }
}
