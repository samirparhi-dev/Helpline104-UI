import { Component, OnDestroy, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { CzentrixServices } from "./../services/czentrix/czentrix.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { OutboundListnerService } from "../services/common/outboundlistner.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
@Component({
  selector: "dashboard-user-id",
  templateUrl: "./dashboardUserId.html",
})
export class DashboardUserIdComponent implements OnInit, OnDestroy {
  status: any;
  timerSubscription: Subscription;
  assignSelectedLanguageValue: any;

  constructor(
    public dataSettingService: dataService,
    private Czentrix: CzentrixServices,
    public router: Router,
    private outboundService: OutboundListnerService,
    private httpServices: HttpServices
  ) {}
  ngOnInit() {
    this.assignSelectedLanguage();
    this.getAgentStatus();
    const timer = Observable.interval(15 * 1000);
    this.timerSubscription = timer.subscribe(() => {
      this.getAgentStatus();
    });
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  getAgentStatus() {
    this.Czentrix.getAgentStatus().subscribe(
      (res) => {
        console.log("res", res);
        if (res !== undefined && res !== null && res.stateObj.stateName) {
          this.status = res.stateObj.stateName;
          if (this.status) {
            if (
              this.status.toUpperCase() === "INCALL" ||
              this.status.toUpperCase() === "CLOSURE"
            ) {
              /*First call landing to the agent (conditions related to auto call closure issue)*/
              if (
                !sessionStorage.getItem("session_id") &&
                !sessionStorage.getItem("callTransferred")
              ) {
                this.routeToInnerPage(res);
              } else if (
                sessionStorage.getItem("session_id") !== res.session_id
              ) {
                // If session id is different from previous session id then allow the call to drop
                this.routeToInnerPage(res);
              } 
              // else if (
              //   sessionStorage.getItem("session_id") === res.session_id && // on call transfer
              //   sessionStorage.getItem("callTransferred")
              // ) {
              //   this.routeToInnerPage(res);
              // }
               else if (
                !sessionStorage.getItem("session_id") && // First call transfer cases
                sessionStorage.getItem("callTransferred")
              ) {
                this.routeToInnerPage(res);
              } else {
                console.log("Reject the call");
              }
            } else {
              if (res.stateObj.stateType) {
                this.status += " (" + res.data.stateObj.stateType + ")";
              }
            }
          }
        }
        if (res.dialer_type) {
          if (res.dialer_type.toUpperCase() === "PROGRESSIVE") {
            this.outboundService.inOutCampaign.next("1");
            this.dataSettingService.current_campaign = "INBOUND";
          } else if (res.dialer_type.toUpperCase() === "PREVIEW") {
            this.outboundService.inOutCampaign.next("0");
            this.dataSettingService.current_campaign = "OUTBOUND";
          }
        }
        if (res && res.stateObj.stateType) {
          this.status += " (" + res.stateObj.stateType + ")";
        }
      },
      (err) => {
        this.outboundService.inOutCampaign.next("1");
        this.dataSettingService.current_campaign = "INBOUND";
      }
    );
  }
  routeToInnerPage(res) {
    const CLI = res.cust_ph_no;
    const session_id = res.session_id;
    if (
      session_id !== undefined &&
      session_id !== "undefined" &&
      session_id !== null &&
      session_id !== ""
    ) {
      sessionStorage.setItem("CLI", CLI);
      sessionStorage.setItem("session_id", session_id);
      sessionStorage.setItem("onCall", "yes");
      this.dataSettingService.apiCalledForInbound = false;
      this.router.navigate([
        "/MultiRoleScreenComponent/RedirectToInnerpageComponent",
      ]);
    } else {
        console.log('session ID is null');
    }
  }
  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }
}
