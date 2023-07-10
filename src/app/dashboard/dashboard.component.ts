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


import { Component, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfigService } from "../services/config/config.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { Router } from "@angular/router";
import { ListnerService } from "./../services/common/listner.service";
import { CzentrixServices } from "./../services/czentrix/czentrix.service";
import { OutboundListnerService } from "../services/common/outboundlistner.service";
import { ToasterService, ToasterConfig } from "angular2-toaster";
import { SocketService } from "../services/socketService/socket.service";
import { Subscription } from "rxjs/Subscription";
import { CallServices } from "../services/callservices/callservice.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
declare var jQuery: any;

@Component({
  selector: "dashboard-component",
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard-component.css"],
})
export class dashboardContentClass implements OnInit {
  data: any;
  barMinimized = true;
  eventSpiltData;
  widget: any;
  ctiHandlerURL: any;
  current_role: any;
  alertRefresh: number = 1;
  hasHAOPrivilege: boolean = false;
  privleges: any = [];
  notificationSubscription: Subscription;

  public config: ToasterConfig = new ToasterConfig({
    timeout: 15000,
  });
  assignSelectedLanguageValue: any;

  constructor(
    public dataSettingService: dataService,
    private _callServices: CallServices,
    public router: Router,
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private message: ConfirmationDialogsService,
    private listnerService: ListnerService,
    private callService: CzentrixServices,
    private outboundService: OutboundListnerService,
    private toasterService: ToasterService,
    private socketService: SocketService,
    private httpServices: HttpServices
  ) {
    this.dataSettingService.benRegID = undefined;
    this.dataSettingService.benCallID = undefined;
    this.dataSettingService.outboundBenID = undefined;
    this.dataSettingService.beneficiaryDataAcrossApp.beneficiaryDetails =
      undefined;
    this.dataSettingService.healthcareTypeID = undefined;
    this.dataSettingService.benHealthID=undefined;
    // this.outboundService.inOutCampaign.subscribe((data) => {
    //   console.log(data);
    //   this.setCampaign(data)
    // });

    // this.notificationSubscription = this.socketService
    //   .getMessages()
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.alertRefresh++;
    //     if (data.type == "Alert") {
    //       this.toasterService
    //         .popAsync("error", data.type, data.subject + ": " + data.message)
    //         .subscribe((res) => {
    //           console.log(res);
    //         });
    //     }

    //     if (data.type == "Notification") {
    //       this.toasterService
    //         .popAsync("success", data.type, data.subject + ": " + data.message)
    //         .subscribe((res) => {
    //           console.log(res);
    //         });
    //     }

    //     if (data.type == "Emergency_Contact") {
    //       this.toasterService
    //         .popAsync("warning", data.type, data.subject + " " + data.message)
    //         .subscribe((res) => {
    //           console.log(res);
    //         });
    //     }

    //     if (data.type == "Training_Resource") {
    //       this.toasterService
    //         .popAsync("wait", data.type, data.subject + ": " + data.message)
    //         .subscribe((res) => {
    //           console.log(res);
    //         });
    //     }

    //     if (data.type == "Location_Message") {
    //       this.toasterService
    //         .popAsync("info", data.type, data.subject + ": " + data.message)
    //         .subscribe((res) => {
    //           console.log(res);
    //         });
    //     }
    //   });
  }

  ngOnInit() {
    console.log("Dabshboard lands");
    this.data = this.dataSettingService.Userdata;
    this.current_role = this.dataSettingService.current_role;
    this.dataSettingService.sendHeaderStatus.next(
      this.current_role + " Dashboard"
    );
    // this.dataSettingService.current_campaign = "INBOUND";
    this.addListener();
    this.setCampaign();
    let url =
      this.configService.getTelephonyServerURL() + "bar/cti_handler.php";
    console.log("url = " + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const obj = { innerPage: false };
    this.listnerService.cZentrixSendData(obj);

    // if (this.dataSettingService.inOutBound) {
    //   this.inOutBound = this.dataSettingService.inOutBound;
    //   if (this.inOutBound == '1') {
    //     this.dataSettingService.current_campaign = 'INBOUND';
    //   }
    //   else if (this.inOutBound == '0') {
    //     this.dataSettingService.current_campaign = 'OUTBOUND';
    //   }
    // }
    this.dataSettingService.avoidingEvent = false;
    this.privleges = this.dataSettingService.userPriveliges;
    this.checkHAOPrivilege();

    jQuery(document).ready(function () {
      jQuery('[data-toggle="tooltip"]').tooltip();
    });
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  routeToRoleSelection() {
    // this.socketService.logOut();
    this.router.navigate(["/MultiRoleScreenComponent"]);
    // this.socketService.reInstantiate();
  }

  setCampaign() {
    if (
      this.dataSettingService.current_campaign === null ||
      this.dataSettingService.current_campaign === undefined
    ) {
      this.dataSettingService.current_campaign = "INBOUND";
      this.inOutBound = "1";
    } else {
      if (this.dataSettingService.current_campaign === "INBOUND") {
        this.inOutBound = "1";
      } else {
        this.inOutBound = "0";
      }
    }
  }

  toggleBar() {
    if (this.barMinimized) {
      this.barMinimized = false;
    } else {
      this.barMinimized = true;
    }
  }
  minimizeBar() {
    this.barMinimized = true;
    // this.testEvent();
  }

  // testing event
  testEvent() {
    // var event = new Event('message');

    let event = new CustomEvent("message", {
      detail: {
        data: "Accept|9034862882|1539175449.1040000000|INBOUND",

        // data: 'Accept|456789|1289742012.5180000000|INBOUND',
        time: new Date(),
      },
      bubbles: true,
      cancelable: true,
    });

    /*comment the below mentioned line before pushing the code*/
    //   this.dataSettingService.current_campaign='INBOUND';
    //   this.dataSettingService.outboundBenID='1068';
    // document.dispatchEvent(event);
  }

  listener(event) {
    console.log("listener invoked: " + JSON.stringify(event));
    // spliting test event
    // this.eventSpiltData = event.detail.data.split('|');
    // spliting czntrix event
    // this.eventSpiltData = event.data.split('|');

    if (event.data !== undefined && event.data !== null) {
      this.eventSpiltData = event.data.split("|");
    } else {
      this.eventSpiltData = event.detail.data.split("|");
    }
    if (
      this.eventSpiltData[2] !== undefined &&
      this.eventSpiltData[2] !== "undefined" &&
      this.eventSpiltData[2] !== null &&
      this.eventSpiltData[2] !== ""
    ) {
      if (
        !sessionStorage.getItem("session_id") &&
        !sessionStorage.getItem("callTransferred")
      ) {
        this.handleEvent();
      } else if (
        sessionStorage.getItem("session_id") !== this.eventSpiltData[2]
      ) {
        this.handleEvent(); // If session id is different from previous session id then allow the call to drop
      } else if (
        sessionStorage.getItem("session_id") === this.eventSpiltData[2] && // on call transfer
        sessionStorage.getItem("callTransferred")
      ) {
        this.handleEvent();
      } else if (
        !sessionStorage.getItem("session_id") && // First call transfer cases
        sessionStorage.getItem("callTransferred")
      ) {
        this.handleEvent();
      } else {
        console.log("Reject the call");
      }
    } else {
      console.log('session ID is null');
  }
  }

  handleEvent() {
    var key = "pass1234";
    if (key == "pass1234") {
      if (this.eventSpiltData.length > 2) {
        if (this.current_role != "Surveyor") {
          sessionStorage.setItem("onCall", "yes");
          this.routeToInnerPage();

          // if (this.dataSettingService.benRegID == undefined && this.dataSettingService.current_campaign == 'OUTBOUND') {
          //   this.router.navigate(['/MultiRoleScreenComponent/Closure']);
          // }
          // else {
        }
      }
    } else {
      sessionStorage.removeItem("key");
      sessionStorage.removeItem("onCall");
      this.router.navigate([""]);
    }
    // event.stopImmediatePropagation();
    /*   else
       this.message.alert('Invalid call event, please contact technical team'); */
  }
  routeToInnerPage() {
    console.log("listener invoked: " + this.eventSpiltData);
    if (
      this.dataSettingService.avoidingEvent != true &&
      this.dataSettingService.current_campaign != "OUTBOUND"
    ) {
      sessionStorage.setItem("CLI", this.eventSpiltData[1]);
      sessionStorage.setItem("session_id", this.eventSpiltData[2]);
      this.router.navigate([
        "/MultiRoleScreenComponent/RedirectToInnerpageComponent",
      ]);
      this.dataSettingService.avoidingEvent = false;
      this.dataSettingService.apiCalledForInbound = false;
    } else {
      this.storeCallID(this.eventSpiltData[1], this.eventSpiltData[2]); //this is only being called in case of blood outbound gursimran 12/3/18
    }
  }
  addListener() {
    if (window.parent.parent.addEventListener) {
      console.log("dash adding message listener", this.listener.bind(this));
      addEventListener("message", this.listener.bind(this), false);
      removeEventListener("message", this.listener.bind(this), false);
    } else {
      console.log("adding onmessage listener");
      // document.attachEvent("onmessage", this.listener)
    }
  }

  storeCallID(phoneNumber, callerID) {
    /*This IF condition is a workaround to avoid duplicate data is getting updated in db
    (to stop multiple API calls) */
    if (callerID !== undefined && callerID !== null) {
      if (
        this.dataSettingService.current_campaign === "OUTBOUND" &&
        this.dataSettingService.setUniqueCallIDForOutbound === true
      ) {
        let callerObj = {};
        callerObj["beneficiaryRegID"] = this.dataSettingService.outboundBenID;
        callerObj["callID"] = callerID;
        callerObj["receivedRoleName"] =
          this.dataSettingService.current_roleName;
        callerObj["createdBy"] = this.dataSettingService.Userdata.userName;
        callerObj["phoneNo"] = phoneNumber;
        callerObj["agentID"] = this.dataSettingService.agentID;
        callerObj["callReceivedUserID"] = this.dataSettingService.uid;
        callerObj["calledServiceID"] =
          this.dataSettingService.current_service.serviceID;
        callerObj["isOutbound"] = true;
        callerObj["isOutboundManualDial"] = true;
        this.dataSettingService.setUniqueCallIDForOutbound = false;
        this._callServices.storeCallID(JSON.stringify(callerObj)).subscribe(
          (response) => this.callerSuccessHandeler(response),
          (err) => {
            console.log("error", err);
          }
        );
      } else {
        if (this.dataSettingService.apiCalledForInbound) {
          return;
        } else {
          let callerObj = {};
          callerObj["beneficiaryRegID"] = this.dataSettingService.outboundBenID;
          callerObj["callID"] = callerID;
          callerObj["receivedRoleName"] =
            this.dataSettingService.current_roleName;
          callerObj["createdBy"] = this.dataSettingService.Userdata.userName;
          callerObj["phoneNo"] = phoneNumber;
          callerObj["agentID"] = this.dataSettingService.agentID;
          callerObj["callReceivedUserID"] = this.dataSettingService.uid;
          callerObj["calledServiceID"] =
            this.dataSettingService.current_service.serviceID;
          callerObj["isOutbound"] = false;
          this.dataSettingService.apiCalledForInbound = true;
          this._callServices.storeCallID(JSON.stringify(callerObj)).subscribe(
            (response) => this.callerSuccessHandeler(response),
            (err) => {
              console.log("error", err);
            }
          );
        }
      }
    } else {
      console.log("Session ID is null not able to land a call");
    }
  }
  callerSuccessHandeler(response) {
    console.log("dashcallerSuccessHandeler: " + JSON.stringify(response));
    if (response.statusCode === 200) {
      let beneficiaryDetails = response;
      this.dataSettingService.beneficiaryDataAcrossApp.beneficiaryDetails =
        beneficiaryDetails;
      this.dataSettingService.benCallID = response.benCallID;
    } else {
      console.log("error", response.errorMessage);
    }
  }

  /**
    Diamond Khanna 28 june,2017
    Implementation of adding or deleting of a widget from the dashboard
  */

  activity_component: boolean = true;
  ratings_component: boolean = true;
  alerts_component: boolean = true;
  daily_tasks_component: boolean = false;
  news_component: boolean = true;
  call_statistics: boolean = true;
  training_resources: boolean = true;

  hideComponentHandeler(event) {
    console.log("event is", event);
    if (event === "1") {
      this.activity_component = false;
    }
    if (event === "2") {
      this.ratings_component = false;
    }
    if (event === "3") {
      this.alerts_component = false;
    }
    if (event === "4") {
      this.daily_tasks_component = false;
    }
    if (event === "5") {
      this.news_component = false;
    }
    if (event === "6") {
      this.call_statistics = false;
    }
    if (event === "7") {
      this.training_resources = false;
    }
  }

  addWidget(widget_name) {
    if (widget_name === "1") {
      this.activity_component = true;
    }
    if (widget_name === "2") {
      this.ratings_component = true;
    }
    if (widget_name === "3") {
      this.alerts_component = true;
    }
    if (widget_name === "4") {
      this.daily_tasks_component = true;
    }
    if (widget_name === "5") {
      this.news_component = true;
    }
    if (widget_name === "6") {
      this.call_statistics = true;
    }
    if (widget_name === "7") {
      this.training_resources = true;
    }
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

  // makeCalls() {
  //   console.log("make calls");
  // }
  // receiveCalls() {
  //   console.log("receive calls")
  // }

  // outBound: any = false;
  // inBound: any = true;
  // inOutToolTip: any = "change to InBound";
  // currentInOutState: any = "OutBound calls only";
  // slide() {
  //   this.inBound = !this.inBound;
  //   this.outBound = !this.outBound;
  //   this.dataSettingService.current_campaign = this.inBound ? 'INBOUND' : 'OUTBOUND';
  //  this.dataSettingService.inBound = this.inBound;
  //   if (this.outBound) {
  //     this.currentInOutState = "OutBound Calls only";
  //     this.inOutToolTip = "change to InBound call";
  //     console.log("inside Outbound");

  //   }
  //   if (this.inBound) {
  //     this.currentInOutState = "InBound Calls only";
  //     this.inOutToolTip = "change to OutBound call";
  //     console.log("Inside Inbound");
  //   }
  // }

  inOutBound: any;
  campaign(value) {
    // this.dataSettingService.inOutBound = value;
    if (value === "1") {
      this.message
        .confirm("", this.assignSelectedLanguageValue.switchToInbound)
        .subscribe((response) => {
          if (response) {
            this.callService
              .switchToInbound(this.dataSettingService.agentID)
              .subscribe(
                (res) => {
                  this.dataSettingService.current_campaign = "INBOUND";
                },
                (err) => {
                  this.message.alert(err.errorMessage, "error");
                  this.inOutBound = 0;
                }
              );
          } else {
            this.inOutBound = 0;
          }
        });
    }
    if (value === "0") {
      this.message
        .confirm("", this.assignSelectedLanguageValue.switchToOutbound)
        .subscribe((response) => {
          if (response) {
            this.callService
              .switchToOutbound(this.dataSettingService.agentID)
              .subscribe(
                (res) => {
                  this.dataSettingService.current_campaign = "OUTBOUND";
                },
                (err) => {
                  this.message.alert(err.errorMessage, "error");
                  this.inOutBound = 1;
                }
              );
          } else {
            this.inOutBound = 1;
          }
        });
    }
  }

  // CODE FOR SIDE NAV
  clicked: boolean = false;
  hamburgerHoverOut() {
    console.log(this.clicked);
    if (this.clicked === true) {
      const element = document.querySelector(".leftMenu");
      element.classList.toggle("openMenu");

      // const hamburger = document.querySelector('.hamburger');
      // hamburger.classList.toggle('open');

      const closeAccordion = document.getElementsByClassName("dropdown");
      let i = 0;
      for (i = 0; i < closeAccordion.length; i++) {
        closeAccordion[i].classList.remove("active");
      }
    }
    this.clicked = false;
  }

  hamburgerClick() {
    if (this.clicked === false) {
      this.clicked = true;
      const element = document.querySelector(".leftMenu");
      element.classList.toggle("openMenu");

      // const hamburger = document.querySelector('.hamburger');
      // hamburger.classList.toggle('open');

      const closeAccordion = document.getElementsByClassName("dropdown");
      let i = 0;
      for (i = 0; i < closeAccordion.length; i++) {
        closeAccordion[i].classList.remove("active");
      }
    }
  }

  // ngOnDestroy() {
  //   this.notificationSubscription.unsubscribe();
  // }

  // dropdownClick(ref) {
  //   ref.classList.toggle('active');
  // }

  /*
   * JA354063 - Created on 20-07-2021
   */
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}
