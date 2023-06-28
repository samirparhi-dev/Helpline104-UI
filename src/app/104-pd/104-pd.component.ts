import { Component, OnInit, Output, EventEmitter, Input, OnChanges, DoCheck } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
declare var jQuery: any;
import { CallServices } from "../services/callservices/callservice.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-104-pd",
  templateUrl: "./104-pd.component.html",
  styleUrls: ["./104-pd.component.css"],
})
export class Pd_104_Component implements OnInit, OnChanges, DoCheck {
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();
  current_campaign: any;
  privleges: any;
  hasMOPrivilege: boolean = false;
  dataInjection: any;
  confirm_cancel: any;
  confirm_closure: any;
  screens: any = [];
  assignSelectedLanguageValue: any;
  constructor(
    public getCommonData: dataService,
    private dialogService: ConfirmationDialogsService,
    private _callServices: CallServices,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.screens = this.getCommonData.screens;

    this.current_campaign = this.getCommonData.current_campaign;
    this.privleges = this.getCommonData.userPriveliges;
    this.checkMOPrivilege();
    var idx = jQuery(".carousel-inner div.active").index();
    var outIdx = jQuery(".carousel-inner div.active").index();
    console.log("index", idx);
    jQuery("#previous").hide();

    this.getCommonData.callDisconnected.subscribe(() => {
      jQuery("#myCarousel").carousel(1);
      jQuery("#four").parent().find("a").removeClass("active-tab");
      jQuery("#four").find("a").addClass("active-tab");
      jQuery("#cancelLink").attr("disabled", false);
      jQuery("#closureLink").attr("disabled", true);
    });
    jQuery("#two").on("click", function () {
      console.log("one");
      jQuery("#myCarousel").carousel(idx);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
    });

    jQuery("#four").on("click", function () {
      jQuery("#myCarousel").carousel(idx + 1);
      jQuery(this).parent().find("a").removeClass("active-tab");
      jQuery(this).find("a").addClass("active-tab");
      jQuery("#next").hide();
      jQuery("#previous").show();
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
  checkMOPrivilege() {
    for (let i = 0; i < this.privleges.length; i++) {
      if (this.privleges[i].serviceName == "104") {
        for (let j = 0; j < this.privleges[i].roles.length; j++) {
          if (this.privleges[i].roles[j].RoleName == "CO") {
            console.log("Agent has CO privilege");
            this.hasMOPrivilege = true;
          }
        }
      }
    }
    console.log("MOPrivilege: " + this.hasMOPrivilege);
  }

  navigateToMO() {
    console.log("navigateToMO called");
    this.getCommonData.current_role = "MO";
    this.roleChanged.emit("MO");
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
          jQuery("#four").parent().find("a").removeClass("active-tab");
          jQuery("#four").find("a").addClass("active-tab");
          jQuery("#cancelLink").attr("disabled", false);
          jQuery("#closureLink").attr("disabled", true);
        }
      });
  }
  outboundProviderList(value) {
    this.dataInjection = value;
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
