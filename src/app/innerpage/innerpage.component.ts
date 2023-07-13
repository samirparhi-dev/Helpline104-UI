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


import { Component, OnDestroy, OnInit } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchService } from "../services/searchBeneficiaryService/search.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfigService } from "../services/config/config.service";
import { CzentrixServices } from "../services/czentrix/czentrix.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { CallServices } from "../services/callservices/callservice.service";
import { CallerService } from "../services/common/caller.service";
import { PlatformLocation } from "@angular/common";
import { ListnerService } from "./../services/common/listner.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { AuthService } from "./../services/authentication/auth.service";
import { loginService } from "./../services/loginService/login.service";
import { SocketService } from "../services/socketService/socket.service";
import { OutboundListnerService } from "../services/common/outboundlistner.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-innerpage",
  templateUrl: "./innerpage.component.html",
  styleUrls: ["./innerpage.component.css"],
})
export class InnerpageComponent implements OnInit, OnDestroy {
  callDuration = "";
  barMinimized = true;
  callerNumber;
  current_role: any;
  current_roleID: any;
  current_roleName: any;
  current_campaign: any;
  ticks = 0;
  ctiHandlerURL: any;
  ipAddress: any;
  transferableCampaigns = [];
  // language_file_path: any = 'assets/language.js';
  // app_language: any = 'English';
  current_language_set: any;
  beneficiaryRegID: any;
  wrapupExceedsCallID: any;
  callStatus: any;
  traversal_history: any = "";
  TotalCalls: any;
  TotalTime: any;
  id: any;
  ignoreListner = false;
  callIDOfCallDisconnect: any;
  data: any;
  current_service: any;
  commonData: any;
  callerID: any;
  callerObj: any;
  agentData: any;
  beneficiaryDetails: any;
  seconds = 0;
  minutes = 0;
  counter = 0;
  selectedBenData: any = {
    id: "",
    fname: "",
    lname: "",
    fullname: "",
    age: "",
    gender: "",
    city: "",
    mob: "",
    district: "",
    taluk: "",
    type: "",
  };
  timerSubscription: Subscription;
  wrapupTimerSubscription: Subscription;
  custdisconnectCallID: any;
  currentLanguageSet: any;

  languageArray: any;
  language_file_path: any = "./assets/";
  app_language: any;

  constructor(
    public getCommonData: dataService,
    public route: ActivatedRoute,
    public router: Router,
    private searchService: SearchService,
    private http_service: HttpServices,
    public sanitizer: DomSanitizer,
    private configService: ConfigService,
    private czentrixServices: CzentrixServices,
    private message: ConfirmationDialogsService,
    private outboundService: OutboundListnerService,
    private _callServices: CallServices,
    location: PlatformLocation,
    private _callerService: CallerService,
    private listnerService: ListnerService,
    private authService: AuthService,
    private deleteToken: loginService,
    private socketService: SocketService,
    public httpServices: HttpServices
  ) {
    this.getLanguageObject(this.app_language);
    location.onPopState((e: any) => {});
    this.outboundService.onCall.subscribe((data) => {
      this.callConnected(data);
    });
  }
  ngOnInit() {
    console.log("Show ben details list");
    this.assignSelectedLanguage();
    this.addListener();
    this.current_service = this.getCommonData.current_service;
    this.current_role = this.getCommonData.current_role;
    this.current_roleID = this.getCommonData.current_roleID;
    this.current_roleName = this.getCommonData.current_roleName;
    this.current_campaign = this.getCommonData.current_campaign;
    this.data = this.getCommonData.Userdata;
    this.ipAddress = this.getCommonData.ipAddress;
    this.agentData = this.getCommonData.Userdata;
    const obj = { innerPage: true };
    this.listnerService.cZentrixSendData(obj);
    this.searchService
      .getCommonData()
      .subscribe(
        (response) => (this.commonData = this.successHandler(response))
      );

    if (sessionStorage.getItem("CLI") !== undefined) {
      this.callerNumber = sessionStorage.getItem("CLI");
    }
    if (sessionStorage.getItem("session_id") !== undefined) {
      this.callerID = sessionStorage.getItem("session_id");

      if (
        this.current_campaign === "OUTBOUND" &&
        this.getCommonData.setUniqueCallIDForOutbound === true &&
        sessionStorage.getItem("session_id") !== undefined &&
        sessionStorage.getItem("session_id") !== "undefined" &&
        sessionStorage.getItem("session_id") !== null
      ) {
        this.storeCallID(this.getCommonData.outboundBenID, this.callerID);
      }
    }
    this.id = this.getCommonData.agentID;

    if (this.current_campaign === "OUTBOUND") {
      this.beneficiaryRegID = this.getCommonData.outboundBenID;
      this.fetchBenDetails(this.getCommonData.outboundBenID);
    }

    const url =
      this.configService.getTelephonyServerURL() + "bar/cti_handler.php";
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    if (this.current_role === "Supervisor") {
    } else if (this.ipAddress === undefined) {
      this.czentrixServices.getIpAddress(this.getCommonData.agentID).subscribe(
        (response) => {
          this.ipSuccessHandler(response);
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
    } else {
      // fetch transferable campaigns if ipaddress is present, else fetch ip address & fetch campaigns there after
      this.getTransferableCampaigns();
    }

    this.getWrapupExceedsCallTypeID(
      this.getCommonData.current_service.serviceID
    );

    this.getAgentStatus();
    this.getAgentCallDetails();

    this.callDuration = this.minutes + "m " + this.seconds + "sec ";
    const timer = Observable.interval(1000);
    this.timerSubscription = timer.subscribe(() => {
      //    Get todays date and time
      if (this.seconds === this.counter + 60) {
        this.minutes = this.minutes + 1;
        this.seconds = 0;
      }
      this.seconds = this.seconds + 1;
      this.callDuration = this.minutes + "m " + this.seconds + "sec ";
    });

    this.fetchLanguageSet();
    this.traversal_history = "";
  }
  callConnected(data) {
    this.minutes = 0;
    this.seconds = 0;
    this.getAgentStatus();
    // this will be called in case of blood on call outbound
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    this.app_language = this.getCommonData.appLanguage;
  }
  getCallTraversalHistory(callID) {
    const _callID = callID === "" ? null : callID;
    this._callServices.getCallTraversalHistory(_callID).subscribe(
      (response) => {
        this.getCallTraversalHistorySuccessHandeler(response);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCallTraversalHistorySuccessHandeler(response) {
    this.traversal_history = "";
    if (response !== undefined && response !== null) {
      for (const roleName of response) {
        this.traversal_history += roleName.receivedRoleName + " ";
      }
    }

    // for RO, store call ID is handled in registration component
    if (this.getCommonData.apiCalledForInbound) {
      return;
    } else {
      if (this.current_role !== "RO") {
        this.storeCallID(this.getCommonData.benRegID, this.callerID);
      }
    }
  }

  storeCallID(beneficiaryRegID, callerID) {
    console.log("innerpage store call ID");
    if (this.callerID !== undefined && this.callerID !== null) {
      this.callerObj = {};
      this.callerObj.beneficiaryRegID = beneficiaryRegID;
      this.callerObj.callID = this.callerID;
      this.callerObj.receivedRoleName = this.current_roleName;
      this.callerObj.createdBy = this.agentData.userName;
      this.callerObj.phoneNo = this.callerNumber;
      this.callerObj.agentID = this.getCommonData.agentID;
      this.callerObj.callReceivedUserID = this.getCommonData.uid;
      this.callerObj.calledServiceID =
        this.getCommonData.current_service.serviceID;
      this.callerObj.isOutbound =
        this.current_campaign === "OUTBOUND" ? true : false;
      if (this.current_campaign === "OUTBOUND") {
        this.callerObj.isOutboundManualDial = true;
      }
      this.getCommonData.apiCalledForInbound = true;
      this._callServices.storeCallID(JSON.stringify(this.callerObj)).subscribe(
        (response) => this.callerSuccessHandeler(response),
        (err) => {
          console.log("error", err);
        }
      );
    } else {
      console.log("Session ID is null not able to land a call");
    }
  }

  callerSuccessHandeler(response) {
    console.log("firstcallerSuccessHandeler: " + JSON.stringify(response));
    if (response) {
      this.beneficiaryDetails = response;
      this.getCommonData.beneficiaryDataAcrossApp.beneficiaryDetails = response;
      this.getCommonData.benCallID = response.benCallID;
    } else {
      console.log("error in calling start call api", response.errorMessage);
    }
  }

  ipSuccessHandler(response) {
    this.ipAddress = response.agent_ip;
    this.getTransferableCampaigns();
    return response;
  }

  getTransferableCampaigns() {
    if (this.current_roleName !== "Surveyor") {
      this.czentrixServices
        .getTransferableCampaigns(this.getCommonData.agentID, this.ipAddress)
        .subscribe(
          (response) => {
            this.transferableCampaigns = response.campaign;
            /*emergency call transferscampaigns are inserted manually as these campaigns are external & can't be configured in C-Zentrix */
            this.transferableCampaigns.push({
              campaign_id: "dummy1",
              campaign_name: "EMERGENCY_108",
            });
            this.transferableCampaigns.push({
              campaign_id: "dummy2",
              campaign_name: "EMERGENCY_102",
            });
          },
          (err) => {
            this.message.alert(err.errorMessage, "error");
          }
        );
    }
  }

  checkCampaigns() {
    if (
      !this.transferableCampaigns ||
      this.transferableCampaigns.length === 0
    ) {
      this.message.alert(this.currentLanguageSet.PleaseConfigureTheCampaigns);
    } else if (!this.ipAddress) {
      this.message.alert(this.currentLanguageSet.pleaseLoginToSoftPhone);
      this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
    }
  }

  transferCallToCampaign(transferToCampaign) {
    if (transferToCampaign === "EMERGENCY_108") {
      this.czentrixServices
        .transferEmergencyCall(this.getCommonData.agentID, this.ipAddress, 108)
        .subscribe((response) =>
          this.transferEmergencyCallSuccessHandeler(
            response,
            transferToCampaign
          )
        );
    } else if (transferToCampaign === "EMERGENCY_102") {
      this.czentrixServices
        .transferEmergencyCall(this.getCommonData.agentID, this.ipAddress, 102)
        .subscribe((response) =>
          this.transferEmergencyCallSuccessHandeler(
            response,
            transferToCampaign
          )
        );
    }
  }

  transferEmergencyCallSuccessHandeler(response, transferToCampaign) {
    this.message.alert(
      this.currentLanguageSet.callIsKeptInConferenceWith + transferToCampaign
    );
  }

  showAlert(transferToCampaign) {
    this.message.alert(
      this.currentLanguageSet.callTransferedTo + transferToCampaign,
      "success"
    );
    this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }

  successHandler(response: any) {
    return response;
  }

  getSelectedBenDetails(data: any) {
    console.log("data", data);
    if (data && this.current_role !== "Supervisor") {
      this.beneficiaryRegID = data.beneficiaryRegID;
      this.fetchBenDetails(data.beneficiaryRegID);
      this.getCallTraversalHistory(this.callerID); // to get the list if agents roles who have talked on this call
    }
  }

  fetchBenDetails(benID) {
    const obj = {
      beneficiaryRegID: benID,
    };
    this.searchService
      .retrieveRegHistory(obj)
      .subscribe((response) => this.handleSuccess(response));
  }

  handleSuccess(res) {
    if (res.length > 0) {
      this.getCommonData.ben_gender_name = res[0].m_gender
        ? res[0].m_gender.genderName
          ? res[0].m_gender.genderName
          : ""
        : "";
      this.selectedBenData.id = res[0].beneficiaryID;
      this.selectedBenData.fullname =
        res[0].firstName + " " + (res[0].lastName ? res[0].lastName : "");
      this.selectedBenData.gender = res[0].m_gender
        ? res[0].m_gender.genderName
          ? res[0].m_gender.genderName
          : ""
        : "";
      this.selectedBenData.district = res[0].i_bendemographics
        ? res[0].i_bendemographics.m_district
          ? res[0].i_bendemographics.m_district.districtName
            ? res[0].i_bendemographics.m_district.districtName
            : ""
          : ""
        : "";
      this.selectedBenData.state = res[0].i_bendemographics
        ? res[0].i_bendemographics.m_state
          ? res[0].i_bendemographics.m_state.stateName
            ? res[0].i_bendemographics.m_state.stateName
            : ""
          : ""
        : "";
      this.selectedBenData.marital = res[0].maritalStatus
        ? res[0].maritalStatus.status
        : "";
        this.selectedBenData.actualAge = res[0].actualAge;
      this.selectedBenData.ageUnits = res[0].ageUnits;
      this.selectedBenData.type = res[0].i_bendemographics
        ? res[0].i_bendemographics.healthCareWorkerID
          ? "Healthcare Worker: " +
            res[0].i_bendemographics.healthCareWorkerType.healthCareWorkerType
          : "General Public"
        : "";
      this.selectedBenData.village = res[0].i_bendemographics
        ? res[0].i_bendemographics.m_districtbranchmapping
          ? res[0].i_bendemographics.m_districtbranchmapping.villageName
            ? res[0].i_bendemographics.m_districtbranchmapping.villageName
            : ""
          : ""
        : "";
      this.selectedBenData.education = res[0].i_bendemographics
        ? res[0].i_bendemographics.educationName
          ? res[0].i_bendemographics.educationName
          : ""
        : "";
      this.selectedBenData.subDistrict = res[0].i_bendemographics
        ? res[0].i_bendemographics.m_districtbranchmapping
          ? res[0].i_bendemographics.m_districtbranchmapping.blockName
            ? res[0].i_bendemographics.m_districtbranchmapping
            : ""
          : ""
        : "";
      this.getCommonData.firstName = res[0].firstName;
      this.getCommonData.lastName = res[0].lastName;
      this.getCommonData.age = this.selectedBenData.actualAge;
      this.getCommonData.gender = res[0].m_gender
        ? res[0].m_gender.genderID
          ? res[0].m_gender.genderID
          : ""
        : "";
      this.getCommonData.districtID = res[0].i_bendemographics
        ? res[0].i_bendemographics.m_district
          ? res[0].i_bendemographics.m_district.districtName
            ? res[0].i_bendemographics.m_district.districtID
            : undefined
          : undefined
        : undefined;

        this.getCommonData.blockID = res[0].i_bendemographics
        ? res[0].i_bendemographics.m_districtblock
            ? res[0].i_bendemographics.m_districtblock.blockID
            : undefined
        : undefined;


      this.getCommonData.caste = res[0].i_bendemographics
        ? res[0].i_bendemographics.communityID
          ? res[0].i_bendemographics.communityID
          : undefined
        : undefined;
      this.getCommonData.educationID = res[0].i_bendemographics
        ? res[0].i_bendemographics.educationID
          ? res[0].i_bendemographics.educationID
          : undefined
        : undefined;

      this.selectedBenData.caste = res[0].i_bendemographics.communityName
        ? res[0].i_bendemographics.communityName
        : undefined;
    }
  }

  changeCurrentRole(newRole: string) {
    this.current_role = newRole;
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
  listener(event) {
    console.log("inner page listener invoked: " + event);
    this.handleEvent(event);
  }
  handleEvent(event) {
    console.log("handle event");
    this.getAgentStatus();

    let eventSpiltData;

    if (event.data) {
      eventSpiltData = event.data.split("|");
    } else {
      eventSpiltData = event.detail.data.split("|");
    }
    console.log("event", JSON.stringify(event.data));
    console.log("eventonly", event);

    if (eventSpiltData[0].trim().toLowerCase() === "accept") {
      if (
        eventSpiltData[2] !== undefined &&
        eventSpiltData[2] !== "undefined" &&
        eventSpiltData[2] !== null &&
        eventSpiltData[2] !== ""
      ) {
        sessionStorage.setItem("session_id", eventSpiltData[2]);
      } else {
        console.log("session ID is null");
      }
      this.ticks = 0;
      this.unsubscribeWrapupTime();
    } else {
      this.ticks = 0;
      this.unsubscribeWrapupTime();
    }
    if (
      eventSpiltData[0].trim().toLowerCase() === "custdisconnect" &&
      this.callIDOfCallDisconnect !== eventSpiltData[1].trim()
    ) {
      console.log("Cust Disconnect call ID", eventSpiltData[1]);
      if (
        (this.current_campaign !== "OUTBOUND" || this.current_role !== "SIO") &&
        !this.ignoreListner
      ) {
        this.ignoreListner = true;
        console.log("before checking condition ticks value", this.ticks);
        // start wraupup time if it is not already running & caller id matches
        if (eventSpiltData[1] === this.callerID && this.ticks === 0) {
          this.custdisconnectCallID = eventSpiltData[1];
          this.startCallWraupup();
        } else {
          console.log("ticks count is not zero", this.ticks);
          this.getCommonData.callDisconnected.next();
        }
      }
    } else {
      console.log("Agent disconnected the call");
    }
  }
  unsubscribeWrapupTime() {
    if (this.wrapupTimerSubscription) {
      this.wrapupTimerSubscription.unsubscribe();
    }
  }
  closeCall(remarks) {
    const requestObj: any = {};
    if (this.getCommonData.benCallID) {
      requestObj.benCallID = this.getCommonData.benCallID;
    } else {
      requestObj.benCallID =
        this.getCommonData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }
    if (sessionStorage.getItem("session_id") === this.custdisconnectCallID) {
      requestObj.callID = sessionStorage.getItem("session_id");
      requestObj.callType = "Wrapup Exceeds";
      requestObj.callTypeID = this.wrapupExceedsCallID.toString();
      requestObj.beneficiaryRegID = this.beneficiaryRegID;
      requestObj.remarks = remarks;
      requestObj.isFollowupRequired = false;
      requestObj.prefferedDateTime = undefined;
      requestObj.providerServiceMapID =
        this.getCommonData.current_service.serviceID;
      requestObj.createdBy = this.getCommonData.Userdata.userName;
      requestObj.fitToBlock = "false";
      requestObj.endCall = true;
      requestObj.agentID = this.getCommonData.agentID;
      requestObj.agentIPAddress = this.ipAddress;

      this._callServices.closeCall(requestObj).subscribe(
        (response) => {
          if (response) {
            console.log(
              "current call got closed",
              sessionStorage.getItem("session_id")
            );
            this.message.alert(
              this.currentLanguageSet.successfullyClosedTheCall,
              "success"
            );
            sessionStorage.removeItem("onCall");
            sessionStorage.removeItem("CLI");
            console.log("Call Closure is Executed");
            if (this.current_campaign !== "OUTBOUND") {
              this.unsubscribeWrapupTime();
            }
            const priv_Flag = sessionStorage.getItem("privilege_flag");
            console.log("Current Role Flag" + priv_Flag);
            if (priv_Flag === "HYBRID HAO") {
              console.log("Call Closure is Executed as role changed");
              this.getCommonData.current_role = "RO";
              this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
            } else {
              this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
            }
          }
        },
        (err) => {
          this.message.alert(err.status, "error");
        }
      );
    } else {
      console.log(
        "previous custdisconnect call ID not verified with current call ID",
        this.custdisconnectCallID
      );
    }
  }

  getWrapupExceedsCallTypeID(providerServiceMapID) {
    const requestObject = { providerServiceMapID: providerServiceMapID };
    this._callServices.getCallTypes(requestObject).subscribe(
      (response) => {
        if (response) {
          this.wrapupExceedsCallID = response
            .filter(function (item) {
              return item.callGroupType.toLowerCase() === "wrapup exceeds";
            })[0]
            .callTypes.filter(function (previousData) {
              return (
                previousData.callType.toLowerCase().indexOf("wrapup exceeds") !=
                -1
              );
            })[0].callTypeID;
        }

        this.getCommonData.callTypeID = this.wrapupExceedsCallID;
      },
      (err) => {
        console.log("Error occured in getting call types", err.errorMessage);
      }
    );
  }
  startCallWraupup() {
    this._callerService.getRoleBasedWrapuptime(this.current_roleID).subscribe(
      (roleWrapupTime) => {
        if (roleWrapupTime.isWrapUpTime) {
          this.roleBasedCallWrapupTime(roleWrapupTime.WrapUpTime);
        } else {
          const time = this.configService.defaultWrapupTime;
          this.roleBasedCallWrapupTime(time);
          console.log("Need to configure wrap up time");
        }
      },
      (err) => {
        const time = this.configService.defaultWrapupTime;
        this.roleBasedCallWrapupTime(time);
        console.log("Need to configure wrap up time", err.errorMessage);
      }
    );
  }
  roleBasedCallWrapupTime(timeRemaining) {
    console.log("roleBasedCallWrapupTime", timeRemaining);
    const timer = Observable.timer(2000, 1000);
    this.wrapupTimerSubscription = timer.subscribe((t) => {
      this.ticks = timeRemaining - t;
      console.log("timer t", t);
      console.log("ticks", this.ticks);
      if (t === timeRemaining) {
        this.wrapupTimerSubscription.unsubscribe();
        t = 0;
        this.ticks = 0;
        console.log("after re initialize the timer", t);
        this.closeCall("wrapup exceeded");
      }
    });
  }

  getLanguageObject(language) {
    this.http_service
      .getLanguage(this.language_file_path)
      .subscribe((response) =>
        this.getLanguageSuccessHandeler(response, language)
      );
  }

  getLanguageSuccessHandeler(response, language) {
    if (response === undefined) {
      alert(this.currentLanguageSet.languageNotLoaded);
    }
    if (response[language] !== undefined) {
      this.current_language_set = response[language];
    } else {
      alert(
        this.currentLanguageSet.weAreComingUpWith +
          language +
          this.currentLanguageSet.languageSet
      );
    }
  }

  getAgentStatus() {
    this.czentrixServices.getAgentStatus().subscribe(
      (res) => {
        if (res && res.stateObj.stateName) {
          this.callStatus = res.stateObj.stateName;
        }
        if (res && res.stateObj.stateType) {
          this.callStatus += " (" + res.stateObj.stateType + ")";
        }
      },
      (err) => {}
    );
  }
  getAgentCallDetails() {
    this.czentrixServices.getCallDetails().subscribe(
      (res) => {
        if (res) {
          this.TotalCalls = res.total_calls;
          this.TotalTime = res.total_call_duration;
        }
      },
      (err) => {}
    );
  }
  logOut() {
    if (sessionStorage.getItem("onCall") !== "yes") {
      this.ipSuccessLogoutHandler();
    } else {
      this.message.alert(this.currentLanguageSet.youAreNotAllowedToLogOut);
    }
  }
  ipSuccessLogoutHandler() {
    if (this.current_role.toLowerCase() === "supervisor") {
      this.deleteToken.userLogout().subscribe(
        (response) => {
          this.router.navigate([""]);
          this.authService.removeToken();
          sessionStorage.removeItem("onCall");
          sessionStorage.removeItem("setLanguage");
          this.getCommonData.appLanguage = "English";
          // this.socketService.logOut();
        },
        (err) => {
          this.router.navigate([""]);
          this.authService.removeToken();
          sessionStorage.removeItem("onCall");
          sessionStorage.removeItem("setLanguage");
          this.getCommonData.appLanguage = "English";
          // this.socketService.logOut();
        }
      );
    } else {
      this.czentrixServices
        .agentLogout(this.getCommonData.agentID, "")
        .subscribe(
          (res) => {
            this.deleteToken.userLogout().subscribe(
              (resp) => {
                this.router.navigate([""]);
                this.authService.removeToken();
                sessionStorage.removeItem("onCall");
                sessionStorage.removeItem("setLanguage");
                this.getCommonData.appLanguage = "English";
                // this.socketService.logOut();
              },
              (err) => {
                this.router.navigate([""]);
                this.authService.removeToken();
                sessionStorage.removeItem("onCall");
                sessionStorage.removeItem("setLanguage");
                this.getCommonData.appLanguage = "English";
                // this.socketService.logOut();
              }
            );
          },
          (err) => {
            this.message.alert(err.errorMessage, "error");
          }
        );
    }
  }
  removeSessionStorageValues() {
    this.authService.removeToken();
    sessionStorage.removeItem("onCall");
    sessionStorage.removeItem("setLanguage");
    this.getCommonData.appLanguage = "English";
  }
  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
    this.unsubscribeWrapupTime();
  }

  /*Methods for multilingual implementation*/
  fetchLanguageSet() {
    this.http_service.fetchLanguageSet().subscribe((languageRes) => {
      this.languageArray = languageRes;
      this.getLanguage();
    });
  }

  getLanguage() {
    if (sessionStorage.getItem("setLanguage") != null) {
      this.changeLanguage(sessionStorage.getItem("setLanguage"));
    } else {
      this.changeLanguage(this.app_language);
    }
  }

  changeLanguage(language) {
    this.http_service
      .getLanguage(this.language_file_path + language + ".json")
      .subscribe(
        (response) => {
          if (response) {
            this.languageSuccessHandler(response, language);
          } else {
            alert(this.currentLanguageSet.languageNotDefined);
          }
        },
        (error) => {
          alert(
            this.currentLanguageSet.weAreComingUpWithThisLanguage +
              " " +
              language
          );
        }
      );
  }

  languageSuccessHandler(response, language) {
    if (!this.checkForNull(response)) {
      alert(
        this.currentLanguageSet.weAreComingUpWithThisLanguage + " " + language
      );
      return;
    }
    console.log("language is ", response);
    this.currentLanguageSet = response[language];
    sessionStorage.setItem("setLanguage", language);
    if (this.currentLanguageSet) {
      this.languageArray.forEach((item) => {
        if (item.languageName === language) {
          this.app_language = language;
          this.getCommonData.appLanguage = language;
        }
      });
    } else {
      this.app_language = language;
      this.getCommonData.appLanguage = language;
    }
    this.http_service.getCurrentLanguage(response[language]);
  }
  checkForNull(languageResponse) {
    return languageResponse !== undefined && languageResponse !== null;
  }

  setLangugage() {
    const languageSubscription = this.http_service.currentLangugae$.subscribe(
      (languageResponse) => {
        if (!this.checkForNull(languageResponse)) {
          return;
        }
        this.currentLanguageSet = languageResponse;
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log("completed");
      }
    );
    languageSubscription.unsubscribe();
  }
  /*END - Methods for multilingual implementation*/
}
