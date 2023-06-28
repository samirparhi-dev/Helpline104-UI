import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-reallocate-calls",
  templateUrl: "./reallocate-calls.component.html",
  styleUrls: ["./reallocate-calls.component.css"],
})
export class ReallocateCallsComponent implements OnInit, DoCheck {
  providerServiceMapID: any;
  users = [];
  @ViewChild("reallocationForm") reallocationForm: NgForm;
  onAgentSelected: boolean = false;
  showFlag: boolean = false;
  records: any;
  postData: any;
  searchAgent: any;
  selectedAgent: any;
  totalAgentRecords: Array<any> = [];
  roles: Array<any> = [];
  search_role: any;
  agentName: any;
  roleID: any;
  assignSelectedLanguageValue: any;

  constructor(
    private OCRService: OutboundReAllocationService,
    private getCommonData: dataService,
    private alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.providerServiceMapID = this.getCommonData.current_service.serviceID;
    this.OCRService.getRoles({
      providerServiceMapID: this.providerServiceMapID,
    }).subscribe((response) => {
      if(response !== undefined && response !== null) {
      this.roles = response;
      this.roles = this.roles.filter((roleObj) => {
        let featureArray = roleObj.featureName;
        let matchArray = featureArray.filter((feature) => {
          return (
            feature.screen.screenName.trim().toLowerCase() == "supervising" ||
            feature.screen.screenName.trim().toLowerCase() == "registration" ||
            feature.screen.screenName.trim().toLowerCase() == "surveyor"
          );
        });
        if (matchArray.length == 0 && roleObj.featureName.length != 0)
          return roleObj;
      });
      console.log("roles:", JSON.stringify(this.roles));
    }
    });
  
  }

  roleChange(roleID: any) {
    this.OCRService.getAgents(this.providerServiceMapID, roleID).subscribe(
      (response) => {
        this.users = response;
        console.log("users: " + JSON.stringify(this.users));
      }
    );
    this.reallocationForm.form.patchValue({
      userID: [],
    });
  }

  onSubmit() {
    this.onAgentSelected = false;
    this.showFlag = false;
    console.log(this.searchAgent, "searchAgent");
    this.agentName =
      this.searchAgent.firstName + " " + this.searchAgent.lastName;
    console.log(this.reallocationForm.value);
    this.postData = {
      providerServiceMapID: this.providerServiceMapID,
      assignedUserID: this.reallocationForm.value.agentName.userID,
    };
    if (
      this.reallocationForm.value.startDate != "" &&
      this.reallocationForm.value.startDate != null
    ) {
      this.postData["filterStartDate"] =
        new Date(
          this.reallocationForm.value.startDate -
            1 *
              (this.reallocationForm.value.startDate.getTimezoneOffset() *
                60 *
                1000)
        )
          .toJSON()
          .slice(0, 10) + "T00:00:00.000Z";
    }
    if (
      this.reallocationForm.value.endDate != "" &&
      this.reallocationForm.value.endDate != null
    ) {
      this.postData["filterEndDate"] =
        new Date(
          this.reallocationForm.value.endDate -
            1 *
              (this.reallocationForm.value.endDate.getTimezoneOffset() *
                60 *
                1000)
        )
          .toJSON()
          .slice(0, 10) + "T23:59:59.999Z";
    }
    console.log(JSON.stringify(this.postData));
    this.onAgentSelected = false;
    this.OCRService.getReallocationCalls(this.postData).subscribe(
      (resProviderData) => {
        console.log(resProviderData);
        this.totalAgentRecords = resProviderData;
        if (this.totalAgentRecords.length === 0) {
          this.alertService.alert(this.assignSelectedLanguageValue.noRecordAvailable);
        } else {
          this.onAgentSelected = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  reallocationDone() {
    this.showFlag = false;
    //refreshing reallocation screen
    this.OCRService.getReallocationCalls(this.postData).subscribe(
      (resProviderData) => {
        // console.log(resProviderData);
        this.totalAgentRecords = resProviderData;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  moveToBin(agentName, values, event) {
    // console.log("move to bin api followed by refresh logic");
    var tempArray = [];
    for (var i = 0; i < values.length; i++) {
      tempArray.push(values[i].outboundCallReqID);
    }
    console.log(JSON.stringify(tempArray));
    this.OCRService.moveToBin({
      outboundCallReqIDs: tempArray,
    }).subscribe(
      (response) => {
        console.log(response);
        this.alertService.alert(this.assignSelectedLanguageValue.movedToBinSuccessfully, "success");
        // refreshing after moving to bin
        this.reallocationDone();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  allocateCalls(agentName, values: any, event) {
    this.selectedAgent = {
      agentName: agentName,
      roleID: this.search_role,
    };
    console.log("selectedAgent", this.selectedAgent);
    if (event.target.className == "mat-button-wrapper") {
      for (
        var i = 0;
        i <
        event.target.parentNode.parentNode.parentNode.parentNode.children
          .length;
        i++
      ) {
        event.target.parentNode.parentNode.parentNode.parentNode.children[
          i
        ].className = "";
      }
      event.target.parentNode.parentNode.parentNode.className = "highlightTrBg";
    } else {
      for (
        var i = 0;
        i < event.target.parentNode.parentNode.parentNode.children.length;
        i++
      ) {
        event.target.parentNode.parentNode.parentNode.children[i].className =
          "";
      }
      event.target.parentNode.parentNode.className = "highlightTrBg";
    }
    this.showFlag = true;
    this.records = values;
  }
  /*
   * JA354063 - Created on 23-07-2021
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
