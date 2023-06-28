import { Component, OnInit, Input, OnChanges, DoCheck } from "@angular/core";
import { Router } from "@angular/router";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
declare var jQuery: any;
import { OutboundListnerService } from "../services/common/outboundlistner.service";
import { CallServices } from "../services/callservices/callservice.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
@Component({
  selector: "app-104-sio",
  templateUrl: "./104-sio.component.html",
  styleUrls: ["./104-sio.component.css"],
})
export class Sio_104_Component implements OnInit, OnChanges, DoCheck {
  assignSelectedLanguageValue: any;
  constructor(
    private dialogService: ConfirmationDialogsService,
    public getCommonData: dataService,
    private _router: Router,
    private outboundService: OutboundListnerService,
    private _callServices: CallServices,
    private httpServices: HttpServices
  ) {
    this.outboundService.onCall.subscribe((data) => {
      console.log(data);
      this.callConnected(data);
    });
  }
  callerNumber: any;
  callerID: any;
  beneficiaryDetails: any;
  endPage: any;
  current_campaign: any;
  disableClosure: boolean;
  dataInjection: any;
  confirm_closure: any;
  confirm_cancel: any;
  disableWorklist: boolean = false;
  outboundFor: any;

  ngOnInit() {
    this.assignSelectedLanguage();
    if (sessionStorage.getItem("service") != undefined) {
      this.outboundFor = sessionStorage.getItem("service");
    }
    this.current_campaign = this.getCommonData.current_campaign;
    console.log("campaign: " + this.current_campaign);
    var idx = jQuery(".carousel-inner div.active").index();
    var outIdx = jQuery(".carousel-inner div.active").index();
    jQuery("#previous").hide();

    this.getCommonData.callDisconnected.subscribe(() => {
      const id = jQuery(".carousel-inner div.active").index();
      jQuery("#myCarousel").carousel(1);
      jQuery("#four").parent().find("a").removeClass("active-tab");
      jQuery("#four").find("a").addClass("active-tab");
      jQuery("#cancelLink").attr("disabled", false);
      //jQuery('#closureLink').attr('disabled', true);
      this.disableClosure = true;
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
    jQuery("#two").on("click", function () {
      jQuery("#myCarousel").carousel(idx);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
      jQuery("#cancelLink").attr("disabled", true);
      this.disableClosure = false;
    
    });
    jQuery("#four").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 1);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
      jQuery("#cancelLink").attr("disabled", false);
      //	jQuery('#closureLink').attr('disabled', true);
      this.disableClosure = true;
     
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
    jQuery("#previous").on("click", function () {
      var idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      jQuery("#next").show();
      if (idx === 1) {
        jQuery("#two").parent().find("a").removeClass("active-tab");
        jQuery("#two").find("a").addClass("active-tab");
      }
      if (idx === 2) {
        jQuery("#three").parent().find("a").removeClass("active-tab");
        jQuery("#three").find("a").addClass("active-tab");
      }
    });
 
    jQuery("#next").on("click", function () {
      var idx = jQuery(".carousel-inner div.active").index();
      console.log("chala with", idx);
      jQuery("#previous").show();

      if (idx === 0) {
        jQuery("#three").parent().find("a").removeClass("active-tab");
        jQuery("#three").find("a").addClass("active-tab");
      }
      if (idx === 1) {
        jQuery("#four").parent().find("a").removeClass("active-tab");
        jQuery("#four").find("a").addClass("active-tab");
        jQuery("#next").hide();
      }
    });
    if (
      this.getCommonData.avoidingEvent == true &&
      this.outboundFor == "Blood Request"
    ) {
      //	jQuery('#closureLink').attr('disabled', true);
      this.disableClosure = true;
    } //this will come in blood outbound
    else {
      this.disableClosure = false;
    }
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
  callConnected(data) {
    if (data == true) {
      //	jQuery('#closureLink').attr('disabled', false);
      this.disableClosure = false;
    }
  } //this function will be invoked in case of outbound
  backToWorklist() {
    this._router.navigate(["/MultiRoleScreenComponent/OutboundWorkList"]);
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
  openDialog() {
    this.dialogService
      .confirm("Cancel Call ", this.assignSelectedLanguageValue.confirmDoCancel)
      .subscribe((response) => {
        if (response) {
          const id = jQuery(".carousel-inner div.active").index();
          jQuery("#myCarousel").carousel(0);
          jQuery("#two").parent().find("a").removeClass("active-tab");
          jQuery("#two").find("a").addClass("active-tab");
          jQuery("#cancelLink").attr("disabled", true);
          //		jQuery('#closureLink').attr('disabled', false);
          this.disableClosure = false;
        }
      });
  }
  openDialogClosure() {
    this.dialogService
      .confirm("Closure ", this.assignSelectedLanguageValue.confirmDoClosure)
      .subscribe((response) => {
        if (response) {
          const id = jQuery(".carousel-inner div.active").index();
          jQuery("#myCarousel").carousel(1);
          jQuery("#four").parent().find("a").removeClass("active-tab");
          jQuery("#four").find("a").addClass("active-tab");
          jQuery("#cancelLink").attr("disabled", false);
          //		jQuery('#closureLink').attr('disabled', true);
          this.disableClosure = true;
        }
      });
  }
  closeCall() {
    this._callServices.clearSessionValuesAfterCallClose();
  }
  continueCall() {
    jQuery("#cancelLink").attr("disabled", true);
    //	jQuery('#closureLink').attr('disabled', false);
    this.disableClosure = false;
  }
  outboundProviderList(value) {
    this.dataInjection = value;
  }

  ngOnChanges() {
   this.assignSelectedLanguage();
   this.confirm_cancel = this.assignSelectedLanguageValue.confirmDoCancel;
   this.confirm_closure = this.assignSelectedLanguageValue.confirmDoClosure;
  }

  callStatus(value) {
    this.disableWorklist = value;
  }
}
