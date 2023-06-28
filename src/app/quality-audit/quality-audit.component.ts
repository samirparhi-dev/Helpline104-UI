import { Component, OnInit, ViewChild, Inject, DoCheck } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { QualityAuditService } from "../services/supervisorServices/quality-audit-service.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { NgForm } from "@angular/forms";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import { CaseSheetService } from "app/services/caseSheetService/caseSheet.service";

@Component({
  selector: "app-quality-audit",
  templateUrl: "./quality-audit.component.html",
  styleUrls: ["./quality-audit.component.css"],
})
export class QualityAuditComponent implements OnInit, DoCheck {
  showCaseSheet = false;
  benCallID: any;
  // arrays
  servicelines: Array<any> = [];
  allAgentIDs: Array<any> = [];
  agentIDs: Array<any> = [];
  roles: Array<any> = [];
  callTypes: Array<any> = [];
  callSubTypes: Array<any> = [];
  callRecordingsList: Array<any> = [];
  directory_array: Array<any> = [];
  // constants
  userID: any = "";
  providerServiceMapID: any = "";
  serviceProviderID: any = "";
  serviceID: any = "";
  currentDate = new Date();
  // ngModels
  role: any;
  ioc: any;
  agent: any;
  phno: any;
  callGroupType: any;
  callsubtype: any;
  callGroup: any = "";
  callsType: any = "";
  audioURL: string;
  audioTag: any;
  audioResponse: any;
  dispFlag: any;
  displayIcon = false;
  recordingArray: any = [];
  apiCall = true;
  benData: any;
  ageValidationForVaccination="< 12 years";
  HAO_data: any = [];
  MO_data: any = [];
  CO_data: any = [];
  PD_data: any = [];

  blood_array: any = [];
  foodsafety_array: any = [];
  epidemic_array: any = [];
  organ_array: any = [];
  grievance_array: any = [];
  pageNo: any = 1;
  pageSize = 5;
  validFrom: Date;
  validTill: Date;

  @ViewChild("qaForm") qaForm: NgForm;
  pageCount: any;
  pager: any;
  today: Date;
  maxEndDate: Date;
  max: any;
  requestedBloodBankDetails: any;
  assignSelectedLanguageValue: any;
  covidVaccineStatusUpdate: any;
  doseTypes: any;
  vaccineTypes: any;
  doseType: any;
  vaccineTypeSelected: any;

  constructor(
    private commonData: dataService,
    private qualityAuditService: QualityAuditService,
    private alertService: ConfirmationDialogsService,
    public dialog: MdDialog,
    private httpServices: HttpServices,
     private caseSheetService: CaseSheetService
  ) {}

  ngOnInit() {
    this.setTodaydate();
    this.userID = this.commonData.Userdata.userID;
    this.serviceProviderID = this.commonData.service_providerID;
    this.providerServiceMapID = this.commonData.current_service.serviceID;
    this.currentDateCallRecordingRequest(this.pageNo);
    this.getServiceProviderID();
  }
  getCovidVaccineMaster(beneficiaryRegID) {
    this.caseSheetService.getCovidVaccineMasterData().subscribe(
      (res) => {
        if (res.statusCode == 200) {
          if (res.data) {
            this.getCovidVaccinationStatus(beneficiaryRegID);
            this.doseTypes = res.data.doseType;
            this.vaccineTypes = res.data.vaccineType;
        }
      }
      },
      (err) => {
        this.alertService.alert(
          err.errorMessage,
          "error"
        );
      }
    );
  }
  setTodaydate() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.validFrom = this.today;
    this.maxEndDate = new Date();
    this.maxEndDate.setHours(23, 59, 59, 0);
    this.validTill = this.maxEndDate;
  }

  currentDateCallRecordingRequest(pageNo) {
    const requestForCallrecords = {
      calledServiceID: this.providerServiceMapID,
      filterStartDate: new Date(
        this.validFrom.valueOf() -
          1 * this.validFrom.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        this.validTill.valueOf() -
          1 * this.validTill.getTimezoneOffset() * 60 * 1000
      ),
      is1097: false,
      pageNo: pageNo,
    };
    this.getCallRecordingsList(requestForCallrecords, pageNo);
  }
  callRecordingRequestFordate(pageNo, formValues) {
    this.callRecordingsList = [];
    const requestForCallrecords = {
      calledServiceID: this.providerServiceMapID,
      callTypeID: formValues.CallSubType,
      filterStartDate: new Date(
        formValues.startDate.valueOf() -
          1 * formValues.startDate.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        formValues.endDate.valueOf() -
          1 * formValues.endDate.getTimezoneOffset() * 60 * 1000
      ),
      receivedRoleName: formValues.Role ? formValues.Role : null,
      phoneNo: formValues.benPhoneNo ? formValues.benPhoneNo : null,
      agentID: formValues.Agent ? formValues.Agent : null,
      inboundOutbound: formValues.InboundOutbound
        ? formValues.InboundOutbound
        : null,
      is1097: false,
      pageNo: pageNo,
    };
    this.getCallRecordingsList(requestForCallrecords, pageNo);
  }
  getCallRecordingsList(requestForCallrecords, pageNo) {
    this.qualityAuditService
      .getCallrecordingWorklist(requestForCallrecords)
      .subscribe(
        (recordingsPerpage) => {
          if (!this.isWorkListHasData(recordingsPerpage)) {
            console.log("Call recording are not there");
            return;
          }
          this.callAuditingWorklistPerPage(recordingsPerpage, pageNo);
        },
        (err) => {
          console.log(err.errorMessage, "error");
        }
      );
  }
  callAuditingWorklistPerPage(recordingsPerpage, pageNo) {
    this.callRecordingsList = recordingsPerpage.workList;

    this.pageCount = recordingsPerpage.totalPages;
    if (this.pageCount !== 0) {
      this.pager = this.getPager(pageNo);
    }
  }
  setPage(pageNo: number, formValues) {
    this.audioResponse = [];
    this.recordingArray = [];
    this.resetFlag();
    if (pageNo <= this.pageCount && pageNo >= 1) {
      this.callRecordingRequestFordate(pageNo, formValues);
    }
  }
  getPager(pageNo) {
    let startPage: number, endPage: number;
    const totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (pageNo > totalPages) {
      pageNo = totalPages;
    }
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (pageNo <= 2) {
        startPage = 1;
        endPage = 5;
      } else if (pageNo >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = pageNo - 2;
        endPage = pageNo + 2;
      }
    }
    return this.createPagination(endPage, startPage, pageNo, totalPages);
  }
  createPagination(endPage, startPage, pageNo, totalPages) {
    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );
    // return object with all pager properties required by the view
    return {
      currentPage: pageNo,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  }

  getServiceProviderID() {
    this.qualityAuditService
      .getServiceProviderID(this.providerServiceMapID)
      .subscribe(
        (response) => {
          if (!this.isResponseHasData(response)) {
            console.log("Data does not there");
            return;
          }
          console.log(response, "QA serviceproviderID success");
          this.serviceProviderID = response.serviceProviderID;
          this.getServicelines();
        },
        (err) => {
          console.log(err.errorMessage, "QA serviceProviderID error");
        }
      );
  }
  getServicelines() {
    this.qualityAuditService.getServices(this.userID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        console.log(response, "QA servicelines success");
        this.servicelines = response.filter((item) => {
          return item.serviceName === "104";
        });
        this.serviceID = this.servicelines[0].serviceID;
        this.getRoles();
      },
      (err) => {
        console.log(err, "QA servicelines error");
        this.alertService.alert(err.errorMessage, "error");
      }
    );
  }

  getRoles() {
    const obj = {
      providerServiceMapID: this.providerServiceMapID,
    };

    this.qualityAuditService.getRoles(obj).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        console.log(response, "QA roles success");
        this.roles = response;
        this.getAgents();
      },
      (err) => {
        console.log(err, "QA roles error");
        this.alertService.alert(err.errorMessage, "error");
      }
    );
  }

  getRoleSpecificAgents(role_name, roles_array) {
    this.resetWorklistData();
    let roleID = undefined;

    for (const role of roles_array) {
      if (role_name.toLowerCase() === role.roleName.toLowerCase()) {
        roleID = role.roleID;
        break;
      }
    }

    if (roleID !== undefined) {
      this.qualityAuditService
        .getRoleSpecificAgents(this.providerServiceMapID, roleID)
        .subscribe(
          (response) => {
            if (!this.isResponseHasData(response)) {
              console.log("Data does not there");
              return;
            }
            this.agent = undefined;
            this.agentIDs = response;
          },
          (err) => {
            console.log(err, "Error while fetching role specific agent IDs");
          }
        );
    }
  }

  getAgents() {
    this.qualityAuditService.getAllAgents(this.providerServiceMapID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        this.agentIDs = response;
        this.allAgentIDs = response;
        this.getCallTypes();
      },
      (err) => {}
    );
  }

  getCallTypes() {
    this.qualityAuditService.getCallTypes(this.providerServiceMapID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        console.log(response, "QA calltypes success");
        this.callTypes = response.filter((item) => {
          return (
            item.callGroupType.toLowerCase() === "valid".toLowerCase() ||
            item.callGroupType.toLowerCase() === "invalid".toLowerCase() ||
            item.callGroupType.toLowerCase() === "Incomplete".toLowerCase() ||
            item.callGroupType.toLowerCase() === "Transfer".toLowerCase()
          );
        });

        const obj = { callGroupType: "All", callTypes: [] };
        this.callTypes.push(obj);
      },
      (err) => {
        console.log(err.errorMessage, "QA calltypes error");
      }
    );
  }

  populateCallSubTypes(callGroupType) {
    this.resetWorklistData();
    if (callGroupType.toLowerCase() === "valid".toLowerCase()) {
      this.filterCallSubTypes("valid");
    } else if (callGroupType.toLowerCase() === "invalid".toLowerCase()) {
      this.filterCallSubTypes("invalid");
    } else if (callGroupType.toLowerCase() === "Incomplete".toLowerCase()) {
      this.filterCallSubTypes("Incomplete");
    } else if (callGroupType.toLowerCase() === "Transfer".toLowerCase()) {
      this.filterCallSubTypes("Transfer");
    } else {
      this.callSubTypes = [];
    }
    if (this.callSubTypes.length > 0) {
      let arr = [];
      for (const callSubType of this.callSubTypes) {
        arr = callSubType.callTypes;
      }
      this.callsubtype = "";
      this.callSubTypes = arr;
    }
  }
  filterCallSubTypes(callSubType) {
    this.callSubTypes = this.callTypes.filter((item) => {
      if (item.callGroupType.toLowerCase() === callSubType.toLowerCase()) {
        return item.callTypes;
      }
    });
  }
  setEndDate() {
    this.resetWorklistData();
    const timeDiff = this.validTill.getTime() - this.validFrom.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.validFrom);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.validTill = this.maxEndDate;
      }
      if (diffDays <= 31) {
        this.checkForEndDateDifference();
      }
    } else {
      this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff = this.today.getTime() - this.validFrom.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxEndDate = new Date(this.validFrom);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.validTill = this.maxEndDate;
    } else {
      this.today.setHours(23, 59, 59, 0);
      this.validTill = this.today;
      this.maxEndDate = this.today;
    }
  }
  resetValuesOnchange() {
    this.resetWorklistData();
    this.validTill.setHours(23, 59, 59, 0);
  }
  resetWorklistData() {
    this.callRecordingsList = [];
    this.pager = 0;
  }
  reset() {
    this.qaForm.resetForm();
    this.agent = undefined;
    this.agentIDs = this.allAgentIDs;
    this.setTodaydate();
    this.currentDateCallRecordingRequest(this.pageNo);
    this.getServicelines();
  }
  hideCaseSheetFunction() {
    this.showCaseSheet = false;
    this.benCallID = undefined;
    sessionStorage.removeItem("callGroup");
    sessionStorage.removeItem("callsType");
  }

  print() {
    window.print();
  }
  resetArrays() {
    this.HAO_data = [];
    this.MO_data = [];
    this.CO_data = [];
    this.PD_data = [];
    this.blood_array = [];
    this.epidemic_array = [];
    this.foodsafety_array = [];
    this.grievance_array = [];
    this.directory_array = [];
    this.organ_array = [];
  }
  invokeCaseSheetDialog(benCallID, beneficiaryData) {
    this.benData = beneficiaryData;
    this.doseType=null;
    this.vaccineTypeSelected=null;
    this.doseTypes=null;
    this.vaccineTypes=null;
    this.covidVaccineStatusUpdate = null;
    this.benCallID = benCallID;
    this.showCaseSheet = true;
    this.resetArrays();
    this.qualityAuditService.getBenCaseSheet(benCallID).subscribe(
      (response) => {
        console.log("RESPONSE 1", response.prescription);
        console.log("RESPONSE 11", response);
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        this.HAO_data = response.filter((item) => {
          if (item.actionByHAO !== null && item.actionByHAO !== undefined) {
            return this.setCallGroupAndSubType(item);
          }
        });
        this.MO_data = response.filter((item) => {
          if (item.actionByMO !== undefined && item.actionByMO !== null) {
            return this.setCallGroupAndSubType(item);
          }
        });
        this.CO_data = response.filter((item) => {
          if (item.actionByCO !== undefined && item.actionByCO !== null) {
            return this.setCallGroupAndSubType(item);
          }
        });
        this.PD_data = response.filter((item) => {
          if (item.actionByPD !== undefined && item.actionByPD !== null) {
            return this.setCallGroupAndSubType(item);
          }
        });
        this.callGroup = sessionStorage.getItem("callGroup");
        this.callsType = sessionStorage.getItem("callsType");
      },
      (err) => {
        console.log("ERROR 1", err);
      }
    );
    this.getBloodRequestData(benCallID);
    this.getEpidemicOutbreakComplaintDetail(benCallID);
    this.getFoodSafetyComplaintDetails(benCallID);
    this.getOrganDonationRequestDetails(benCallID);
    this.getDirectoryServicesResponse(benCallID);
    this.getGrievanceServicesResponse(benCallID);
    this.getCovidVaccineMaster(beneficiaryData.beneficiaryRegID);
  }
  setCallGroupAndSubType(item) {
    console.log("Item", item);
    if (
      item.benCall.receivedAgentID !== undefined &&
      item.benCall.callTypeObj !== undefined &&
      item.benCall.callTypeObj.callGroupType !== undefined &&
      item.benCall.receivedAgentID !== null &&
      item.benCall.callTypeObj !== null &&
      item.benCall.callTypeObj.callGroupType !== null
    ) {
      console.log("Item1", item.benCall.callTypeObj.callGroupType);
      sessionStorage.setItem(
        "callGroup",
        item.benCall.callTypeObj.callGroupType
      );
      sessionStorage.setItem("callsType", item.benCall.callTypeObj.callType);
    } else {
      sessionStorage.setItem("callGroup", "");
      sessionStorage.setItem("callsType", "");
    }
    return item;
  }

  getBloodRequestData(benCallID) {
    this.qualityAuditService.getBloodRequestDetails(benCallID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        console.log("RESPONSE 2", response);
        this.blood_array = response;
        response.forEach((bloodRequesterDetails) => {
          this.requestedBloodBankDetails =
            bloodRequesterDetails.requestedBloodBank;
        });
      },
      (err) => {
        console.log("ERROR 2", err.errorMessage);
      }
    );
  }
  getEpidemicOutbreakComplaintDetail(benCallID) {
    this.qualityAuditService
      .getEpidemicOutbreakComplaintDetail(benCallID)
      .subscribe(
        (response) => {
          if (!this.isResponseHasData(response)) {
            console.log("Data does not there");
            return;
          }
          console.log("RESPONSE 3", response);
          this.epidemic_array = response;
        },
        (err) => {
          console.log("ERROR 3", err);
        }
      );
  }
  getFoodSafetyComplaintDetails(benCallID) {
    this.qualityAuditService.getFoodSafetyComplaintDetails(benCallID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        console.log("RESPONSE 4", response);
        this.foodsafety_array = response;
      },
      (err) => {
        console.log("ERROR 4", err);
      }
    );
  }
  getOrganDonationRequestDetails(benCallID) {
    this.qualityAuditService
      .getOrganDonationRequestDetails(benCallID)
      .subscribe(
        (response) => {
          if (!this.isResponseHasData(response)) {
            console.log("Data does not there");
            return;
          }
          console.log("RESPONSE 5", response);
          this.organ_array = response;
        },
        (err) => {
          console.log("ERROR 5", err);
        }
      );
  }
  getDirectoryServicesResponse(benCallID) {
    this.qualityAuditService.getDirectoryServicesResponse(benCallID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        console.log("RESPONSE 6", response);
        this.directory_array = response;
      },
      (err) => {
        console.log("ERROR 6", err);
      }
    );
  }
  getGrievanceServicesResponse(benCallID) {
    this.qualityAuditService.getGrievanceServicesResponse(benCallID).subscribe(
      (response) => {
        if (!this.isResponseHasData(response)) {
          console.log("Data does not there");
          return;
        }
        this.grievance_array = response.filter((obj) => {
          const str = obj.requestID;
          const str2 = str.substring(0, 2);
          if (str2 === "GC") {
            return obj;
          }
        });
      },
      (err) => {
        console.log("ERROR 7", err);
      }
    );
  }
  isResponseHasData(response) {
    return (response !== null && response !== undefined) || response.length > 0;
  }
  isWorkListHasData(response) {
    return (
      response !== null &&
      response !== undefined &&
      response.workList.length > 0
    );
  }
  resetFlag() {
    this.dispFlag = 0;
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  check(agentID, sessionID, index) {
    console.log("AgentID", agentID);
    console.log("sessionID", sessionID);

    this.audioResponse = null;

    if (agentID > 0 && sessionID > 0) {
      if (this.recordingArray.length > 0) {
        this.recordingArray.forEach((element) => {
          if (sessionID === element.sessionId && agentID === element.agentId) {
            this.audioResponse = element.path;
            this.dispFlag = index;
            this.apiCall = false;
          }
        });
      }
      if (this.apiCall) {
        this.qualityAuditService.getAudio(agentID, sessionID).subscribe(
          (response) => {
            console.log("RESPONSEss", response.response);
            this.audioResponse = response.response;
            this.dispFlag = index;

            console.log("Audio Response1", this.audioResponse);
            this.recordingArray.push({
              sessionId: sessionID,
              agentId: agentID,
              path: this.audioResponse,
            });
            console.log("RecordingArray", this.recordingArray);
          },
          (err) => {
            this.alertService.alert(
              this.assignSelectedLanguageValue.failedToGetTheVoiceFilePath,
              "error"
            );
            console.log("ERROR", err);
          }
        );
      } else {
        this.apiCall = true;
      }
    }
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
  getCovidVaccinationStatus(beneficiaryRegID) {
    const benRegID = { "beneficiaryRegID" : beneficiaryRegID}
    this.qualityAuditService.getCovidVaccinationStatus(benRegID).subscribe((covidStatusResponse) => {
      console.log("covidStatusResponse:"+covidStatusResponse);
      if (covidStatusResponse.data !=undefined && covidStatusResponse.data !=null  && covidStatusResponse.data.covidVSID !=undefined
       && covidStatusResponse.data.covidVSID !=null) {
        if(this.doseTypes !=null && this.doseTypes.length >0)
        {
          this.doseTypes.forEach(element => {
            if(element.covidDoseTypeID == covidStatusResponse.data.doseTypeID)
            this.doseType=element.doseType;
          });
        }
        if(this.vaccineTypes !=null && this.vaccineTypes.length >0)
        {
          this.vaccineTypes.forEach(element => {
            if(element.covidVaccineTypeID == covidStatusResponse.data.covidVaccineTypeID)
            this.vaccineTypeSelected=element.vaccineType;
          });
        }
        this.covidVaccineStatusUpdate = covidStatusResponse.data;
      }
    })

  }
}

@Component({
  selector: "app-case-sheet-summary-dialog",
  templateUrl: "./case-sheet-summary-dialog.html",
  styleUrls: ["./quality-audit.component.css"],
})
export class CaseSheetSummaryDialogComponent {
  currentDate = new Date();

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<CaseSheetSummaryDialogComponent>
  ) {
    console.log("modal content", this.data);
  }

  calculateAge(date) {
    if (date) {
      const newDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - newDate.getFullYear();
      const month = today.getMonth() - newDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < newDate.getDate())) {
        age--;
      }
      return age;
    } else {
      return undefined;
    }
  }
}
