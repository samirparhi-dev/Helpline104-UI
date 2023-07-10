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


import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  Renderer2,
  ElementRef,
} from "@angular/core";
import { Response } from "@angular/http";
import { SupervisorCallTypeReportService } from "../services/supervisorServices/supervisor-calltype-reports-service.service";
import { dataService } from "../services/dataService/data.service";
import { MdDialog, MdDialogRef } from "@angular/material";
import { MD_DIALOG_DATA } from "@angular/material";
import { DiseaseScreeningService } from "../services/screening/diseaseScreening.service";
import { SurveyorReportsService } from "../services/surveyorServices/surveyor.reports.service";
import { FormsModule, NgForm } from "@angular/forms";
import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { CallerService } from "../services/common/caller.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { Router } from "@angular/router";
import { CzentrixServices } from "./../services/czentrix/czentrix.service";
import { OutboundSearchRecordService } from "../services/outboundServices/outbound-search-records.service";
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-surveyor-calltype-reports",
  templateUrl: "./surveyor-calltype-reports.component.html",
  styleUrls: ["./surveyor-calltype-reports.component.css"],
})
export class SurveyorCalltypeReportsComponent implements OnInit {
  // ngmodels
  maxDate: Date;
  today: Date;
  filter: any = "All";
  //This is only for valid calls, given static value
  callType: any;
  start_date: any;
  end_date: any;
  min_start_date: Date;
  // arrays

  callTypes: any;
  callList: Array<any> = [];
  filterCallListArray: Array<any> = [];
  featureRoleMapArray: Array<any> = [];
  statusArray: any = [
    {
      name: "All",
      value: "All",
    },
    {
      name: "New",
      value: "New",
    },
    {
      name: "Attempted",
      value: "Attempted",
    },
    {
      name: "Closed",
      value: "Closed",
    },
    {
      name: "Not Interested",
      value: "Not Interested",
    },
  ];
  pager: any = {
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    startIndex: 0,
    endIndex: 0,
    pages: 0,
  };
  pageCount: any;
  // flags

  tableFlag: boolean;
  //	showPaginationControls: boolean;
  @ViewChild("surveyorForm") surveyorForm: NgForm;
  currentLanguageSet: any;

  constructor(
    private message: ConfirmationDialogsService,
    private cz_service: CzentrixServices,
    public router: Router,
    public _SupervisorCallTypeReportService: SupervisorCallTypeReportService,
    public commonDataService: dataService,
    private OCRService: OutboundReAllocationService,
    public dialog: MdDialog,
    private _OSRService: OutboundSearchRecordService,
    public HttpServices: HttpServices
  ) {
    this.tableFlag = false;
    this.today = new Date();
    this.maxDate = this.today;
    this.min_start_date = new Date();
    this.min_start_date.setDate(this.today.getDate() - 3);
    if (this.today.getDate() <= 3) {
      this.min_start_date.setMonth(this.today.getMonth() - 1);
    }
    this.filterCallListArray = [];
  }
  rowsPerPage: any;
  ngOnInit() {
    this.assignSelectedLanguage();
    //move the call type API from here to after fetching roleName in getRoleName function()

    //	this.showPaginationControls = false;
    // this.callType = this.commonDataService.callTypeID;
    this.rowsPerPage = "5";
    this.start_date = this.min_start_date;
    this.end_date = this.maxDate;

    let requestObject = {
      providerServiceMapID: this.commonDataService.current_service.serviceID,
    };

    this._OSRService.getFeatureRoleMapping(requestObject).subscribe(
      (response) => {
        console.log(response, "featureRoleMapArray");
        this.featureRoleMapArray = response.data;
        this.getHAORoleID();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  roleID: any;
  getHAORoleID() {
    var tempFilterArr = [];
    tempFilterArr = this.featureRoleMapArray.filter((obj) => {
      return obj.screen.screenName == "Health_Advice";
    }, this);
    console.log(tempFilterArr, "tempFilterArr");
    this.roleID = tempFilterArr[0].roleID;

    //Todo get the role name by calling Roles API (user/getRolesByProviderID)
    if (this.roleID) {
      this.getRoleName(this.roleID);
    }
  }
  roleName: any;

  getRoleName(roleID) {
    let roleId = roleID;
    this.OCRService.getRoles({
      providerServiceMapID: this.commonDataService.current_service.serviceID,
    }).subscribe((response) => {
      if (response !== undefined && response !== null) {
        let role = response.filter((obj) => {
          if (obj.roleID == roleId) {
            return obj;
          }
        });
        if (role && role[0]) {
          this.roleName = role[0].roleName;
        }
        let requestObject = {
          providerServiceMapID:
            this.commonDataService.current_service.serviceID,
        };
        console.log(
          "service.serviceID: " +
            this.commonDataService.current_service.serviceID
        );
        if (this.roleName) {
          this._SupervisorCallTypeReportService
            .getCallTypes(requestObject)
            .subscribe(
              (response) => {
                this.calltypesSuccess(response);
                // this.commonDataService.callTypeID = this.callType;
              },
              (err) => {
                //	alert(nside surveyor")
                console.log("Could'nt find call types in suveyor");
              }
            );
        } else {
          this.setTableFlag(true, 1, this.rowsPerPage, this.filter);
        }
      }
    });
  }
  calltypesSuccess(response) {
    if (response) {
      console.log(response);
      this.callType = response
        .filter(function (item) {
          console.log(item.callGroupType);
          return item.callGroupType.toLowerCase() === "valid";
        })[0]
        .callTypes.filter(function (previousData) {
          console.log(previousData.callType);
          return previousData.callType.toLowerCase().indexOf("valid") != -1;
        })[0].callTypeID;
    }

    console.log("valid call id", this.callType);
    this.setTableFlag(true, 1, this.rowsPerPage, this.filter);
  }

  setTableFlag(val, pageNo, pageSize, status) {
    this.tableFlag = val;
    this.get_filterCallList(pageNo, pageSize, status);
  }

  get_filterCallList(pageNo, pageSize, status) {
    let requestObj = {
      calledServiceID: this.commonDataService.current_service.serviceID,
      callTypeID: this.callType,
      filterStartDate: "",
      filterEndDate: "",
      receivedRoleName: this.roleName,
      pageNo: pageNo,
      pageSize: parseInt(pageSize),
      cDICallStatus: status,
    };
    if (this.surveyorForm.value.startDate && this.surveyorForm.value.endDate) {
      requestObj.filterStartDate =
        new Date(
          this.surveyorForm.value.startDate -
            1 *
              (this.surveyorForm.value.startDate.getTimezoneOffset() *
                60 *
                1000)
        )
          .toJSON()
          .slice(0, 10) + "T00:00:00.000Z";
      requestObj.filterEndDate =
        new Date(
          this.surveyorForm.value.endDate -
            1 *
              (this.surveyorForm.value.endDate.getTimezoneOffset() * 60 * 1000)
        )
          .toJSON()
          .slice(0, 10) + "T23:59:59.999Z";
      // requestObj['filterStartDate'] = new Date(this.surveyorForm.value.startDate.valueOf() - 1 * this.surveyorForm.value.startDate.getTimezoneOffset() * 60 * 1000);
      // requestObj['filterEndDate'] = new Date(this.surveyorForm.value.endDate.valueOf() - 1 * this.surveyorForm.value.endDate.getTimezoneOffset() * 60 * 1000);
    } else if (this.start_date && this.end_date) {
      requestObj.filterStartDate =
        new Date(
          this.start_date -
            1 * (this.start_date.getTimezoneOffset() * 60 * 1000)
        )
          .toJSON()
          .slice(0, 10) + "T00:00:00.000Z";
      requestObj.filterEndDate =
        new Date(
          this.end_date - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)
        )
          .toJSON()
          .slice(0, 10) + "T23:59:59.999Z";
      // requestObj['filterStartDate'] = new Date(this.start_date.valueOf() - 1 * this.start_date.getTimezoneOffset() * 60 * 1000);
      // requestObj['filterEndDate'] = new Date(this.end_date.valueOf() - 1 * this.end_date.getTimezoneOffset() * 60 * 1000);
    } else {
      // requestObj['filterStartDate'] = undefined;
      // requestObj['filterEndDate'] = undefined;
      requestObj.filterStartDate = undefined;
      requestObj.filterEndDate = undefined;
    }

    //	console.log("Request: " + JSON.stringify(requestObj));

    // write the api here to get filtercall list
    this._SupervisorCallTypeReportService.filterCallList(requestObj).subscribe(
      (response) => this.successhandeler(response, pageNo),
      (err) => {
        this.errorInCallType(err);
      }
    );
  }

  successhandeler(response, pageNo) {
    console.log("response", response);
    if (response) {
      this.callList = response.workList;
      this.filterCallListArray = response.workList;
      this.pageCount = response.totalPages;
      this.pager = this.getPager(pageNo);
    }
  }
  getPager(page) {
    // Total page count
    let totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (page > totalPages) {
      page = totalPages;
    }
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (page <= 2) {
        startPage = 1;
        endPage = 5;
      } else if (page + 2 >= totalPages) {
        startPage = totalPages - 5;
        endPage = totalPages;
      } else {
        startPage = page - 2;
        endPage = page + 2;
      }
    }
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );
    // return object with all pager properties required by the view
    return {
      currentPage: page,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  }
  checkPager(pager, page, pageSize, status) {
    if (page == 1 && pager.currentPage != 1) {
      this.setPage(page, pageSize, status);
    } else if (pager.currentPage < page) {
      this.setPage(page, pageSize, status);
    }
  }
  setPage(page: number, pageSize, status) {
    if (page <= this.pageCount && page >= 1) {
      this.setTableFlag(true, page, pageSize, status);
      // get pager object
      this.pager = this.getPager(page);
    }
  }
  errorInCallType(err) {
    console.log("ERROR" + err.status);
  }
  getFeedback(item, pageNo, rowsPerPage, status) {
    this.cz_service
      .manualDialaNumber(this.commonDataService.agentID, item.phoneNo)
      .subscribe(
        (res) => {
          console.log("resp", res);
          this.commonDataService.avoidingEvent = true;
          this.eventSuccess(item, pageNo, rowsPerPage, status);
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
    console.log(item);
  }

  eventSuccess(data, pageNo, rowsPerPage, status) {
    sessionStorage.setItem("onCall", "yes");
    let dialogReff = this.dialog.open(CDICallModel, {
      // height: '650px',
      // width: '1050px',
      width: 0.9 * window.innerWidth + "px",
      panelClass: "dialog-width",
      disableClose: true,
      data: {
        details: data,
        resultType: "feedBack",
      },
    });
    dialogReff.afterClosed().subscribe((result) => {
      this.filterCallListArray = [];
      this.setTableFlag(true, pageNo, rowsPerPage, status);
      this.commonDataService.avoidingEvent = false;
      sessionStorage.removeItem("onCall");
      sessionStorage.removeItem("CLI");
      // sessionStorage.removeItem("session_id");
      this.cz_service
        .disconnectCall(this.commonDataService.agentID, "")
        .subscribe(
          (res) => {
            console.log("resp", res);
            //	this.message.alert("Call Disconnected Successfully");
          },
          (err) => {
            this.message.alert(this.currentLanguageSet.czentrixResponseFailed, "error");
          }
        );
    });
  }

  getReports(item) {
    // new Angular2Csv(this.data, 'My new Report', {headers: (this.head)});
    let dialogReff = this.dialog.open(CDICallModel, {
      // height: '650px',
      // width: '1050px',
      disableClose: true,
      data: {
        details: item,
        resultType: "report",
      },
    });
  }
  filterList(pageNo, pageSize, status) {
    if (status) {
      // this.filterCallListArray = this.callList.filter(function (obj) {
      // 	return obj.cDICallStatus == status;
      // });
      this.setTableFlag(true, pageNo, pageSize, status);
    }
    // else {
    // 	this.filterCallListArray = this.callList;
    // }
  }
  sdChange(sd) {
    sd.setHours(0, 0, 0, 0);
  }

  edChange(ed) {
    ed.setHours(23, 59, 59, 0);
  }
  dashboard() {
    this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  // bikeImage.src = "assets/images/icon-user-active.png";
  //  head = ['[src]="assets/images/icon-user-active.png', 'Lastname', 'Email'];

  //  options = {

  //    showLabels: true,
  //    showTitle: true
  //      };
  //  data = [
  //   {
  //     name: "Test 1",
  //     age: 13,
  //     average: 8.2,
  //     approved: true,
  //     description: "using 'Content here, content here' "
  //   },
  //   {
  //     name: 'Test 2',
  //     age: 11,
  //     average: 8.2,
  //     approved: true,
  //     description: "using 'Content here, content here' "
  //   },
  //   {
  //     name: 'Test 4',
  //     age: 10,
  //     average: 8.2,
  //     approved: true,
  //     description: "using 'Content here, content here' "
  //   },
  // ];
}

@Component({
  selector: "surveyor-call-modal",
  templateUrl: "./surveyor-call-modal.html",
  styleUrls: ["./surveyor-calltype-reports.component.css"],
})
export class CDICallModel {
  @ViewChild("notIntreasted") notIntersted: any;

  qualitativeQuestionTypeId: any;
  utilityQuestionTypeId: any;
  quantitativeQuestionTypeId: any;
  qualitativeQuestions: any = [];
  utilityQuestions: any;
  quantitativeQuestions: any;
  showComment = false;
  beneficiaryDetails: any;
  beneficiaryRegID: any;
  agentData: any;

  formBuilder: FormBuilder = new FormBuilder();
  questionaireForm: FormGroup;
  calledServiceID: any;
  notIntreasted: any = false;
  altEmail: any = false;
  itemData: any;
  resultType: any;
  // qualitativereasonForm:FormGroup;
  qualitativeQuestionID: any = [];
  utilityQuestionID: any = [];
  setreasonNOArray: any = [];
  enableQualitativeReason: boolean = false;
  valueIndex: any = [];
  enablereason: any = [];
  qualitativeReasonifNo: any = -1;
  lastQualitativeIndex: number;
  qualityCheck: number = 0;
  utilityCheck: number = 0;
  currentLanguageSet: any;
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    private renderer: Renderer2,
    public dialog: MdDialog,
    public dialogReff: MdDialogRef<CDICallModel>,
    public saved_data: dataService,
    private screeningService: DiseaseScreeningService,
    public surveyorReportsService: SurveyorReportsService,
    public callerService: CallerService,
    private alertMessage: ConfirmationDialogsService,
    public HttpServices: HttpServices
  ) {
    this.beneficiaryDetails =
      this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
    this.agentData = this.saved_data.Userdata;
    this.calledServiceID = this.saved_data.current_service.serviceID;
    this.itemData = data.details;
    this.resultType = data.resultType;
  }
  showFeedBack: any = true;
  ngOnInit() {
    this.assignSelectedLanguage();
    // this.qualitativereasonForm = this.formBuilder.group({
    // 	QualitativereasonIfNo: ""
    //   });

    this.screeningService
      .getQuestionTypes()
      .subscribe((response) => this.getQuestionTypeSuccessHandeler(response));

    if (this.resultType == "feedBack") {
      //added the below code in getQuestionTypeSuccessHandeler
      /*	this.questionaireForm = this.formBuilder.group({
					questions: this.formBuilder.array([])
				});
	
				if(this.beneficiaryDetails.i_beneficiary)
				this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
	
				this.getCDIScreeningQuestions(this.qualitativeQuestionTypeId);
				this.getCDIScreeningQuestions(this.utilityQuestionTypeId);
				this.getCDIScreeningQuestions(this.quantitativeQuestionTypeId); */
    } else {
      this.showFeedBack = false;
      this.requestObj = {};
      this.requestObj.beneficiaryRegID = this.itemData.beneficiaryRegID;
      this.requestObj.benCallID = this.itemData.benCallID;

      let res = this.surveyorReportsService
        .getCallReports(this.requestObj)
        .subscribe((response) => this.HandleReports(response));
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  getQuestionTypeSuccessHandeler(response) {
    console.log("*QUESTION TYPES*", response);
    for (let i = 0; i < response.length; i++) {
      if (response[i].questionType === "Qualitative") {
        this.qualitativeQuestionTypeId = response[i].questionTypeID;
      }
      if (response[i].questionType === "Utility") {
        this.utilityQuestionTypeId = response[i].questionTypeID;
      }
      if (response[i].questionType === "Quantitative") {
        this.quantitativeQuestionTypeId = response[i].questionTypeID;
      }
    }

    if (this.resultType == "feedBack") {
      this.questionaireForm = this.formBuilder.group({
        questions: this.formBuilder.array([]),
      });

      if (this.beneficiaryDetails.i_beneficiary)
        this.beneficiaryRegID =
          this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;

      // this.getCDIScreeningQuestions(this.qualitativeQuestionTypeId);
      // this.getCDIScreeningQuestions(this.utilityQuestionTypeId);
      // this.getCDIScreeningQuestions(this.quantitativeQuestionTypeId);
      this.getCDIScreeningQuestions();
    }
  }

  reportData: any = [];
  totalScore: any = 0;
  HandleReports(response) {
    this.reportData = response;
    for (let report of this.reportData) {
      this.totalScore = this.totalScore + report.score;
    }
  }

  requestObj: any = {};
  getCDIScreeningQuestions() {
    //console.log(screeningServiceName)
    this.requestObj = {};
    // this.requestObj.questionTypeID = questionTypeID;
    this.requestObj.providerServiceMapID =
      this.saved_data.current_service.serviceID;

    let res = this.screeningService
      .getQuestionsList(this.requestObj)
      .subscribe((response) => this.successHandler(response));
  }

  questionIds: any = [];
  // index = 0;
  successHandler(response) {
    /**create separate array for storing each type of  questionID */
    // this.index++;
    this.qualitativeQuestions = this.qualitativeQuestions.concat(response);
    let j = 0;
    for (let i = 0; i < this.qualitativeQuestions.length; i++) {
      if (
        this.qualitativeQuestions[i].questionTypeID ==
        this.qualitativeQuestionTypeId
      ) {
        this.qualitativeQuestionID[i] = this.qualitativeQuestions[i].questionID;
        this.lastQualitativeIndex = i;
      } else if (
        this.qualitativeQuestions[i].questionTypeID ==
        this.utilityQuestionTypeId
      ) {
        this.utilityQuestionID[j] = this.qualitativeQuestions[i].questionID;
        j++;
      }
    }

    for (let i = 0; i < this.qualitativeQuestions.length; i++) {
      this.questionIds.push(this.qualitativeQuestions[i].questionID);
    }

    this.questionaireForm = this.formBuilder.group({
      questions: this.formBuilder.array([]),
    });
    for (var i = 0; i < this.qualitativeQuestions.length; i++) {
      (<FormArray>this.questionaireForm.get("questions")).push(
        this.createItem(this.qualitativeQuestions[i])
      );
    }
    console.log(this.questionaireForm);
    console.log(this.questionaireForm.get("questions"));
  }

  createItem(obj): FormGroup {
    let answers: any = {};
    answers.questionScores = obj.m_questionairValues;
    return this.formBuilder.group({
      questionId: obj.questionID,
      question: obj.question,
      answerType: obj.answerType,
      questionRank: obj.questionRank,
      triggerFeedbackFor: obj.triggerFeedbackFor,
      triggerFeedback: obj.triggerFeedback,
      questionOptions: [obj.m_questionairValues],
      answer: "",
      feedback: "",
      UtilityreasonIfNo: "",
      QualitativereasonIfNo: "",
    });
  }
  get questions(): FormArray {
    return this.questionaireForm.get("questions") as FormArray;
  }
  checkreasonIfNO(index, ID) {
    if (this.setreasonNOArray.length == 0) {
      // this.qualitativereasonForm.reset();
      this.questions
        .at(this.lastQualitativeIndex)
        .patchValue({ QualitativereasonIfNo: "" });
    }

    let val = this.questions.at(index).value.answer;
    let value = val.toUpperCase();
    console.log("Value:", value);
    console.log("ID:", ID);
    /**Qualitative */
    for (let i = 0; i < this.qualitativeQuestionID.length; i++) {
      if (ID == this.qualitativeQuestionID[i]) {
        if (value == "NO") {
          this.setreasonNOArray.push({ id: ID, value: value });
          this.enableQualitativeReason = true;
        } else {
          for (let j = 0; j < this.setreasonNOArray.length; j++) {
            if (
              ID == this.setreasonNOArray[j].id &&
              this.setreasonNOArray[j].value == "NO"
            ) {
              // this.setreasonNOArray[j].removeAt()
              this.setreasonNOArray.splice(j, 1);
            }
          }
          if (this.setreasonNOArray.length == 0) {
            this.enableQualitativeReason = false;
          }
          for (let j = 0; j < this.setreasonNOArray.length; j++) {
            console.log("setreasonNOArrayID", this.setreasonNOArray[j]);
            console.log("setreasonNOArrayID1", this.setreasonNOArray[j].id);
            if (
              ID != this.setreasonNOArray[j].id &&
              this.setreasonNOArray[j].value == "NO"
            ) {
              this.enableQualitativeReason = true;
              break;
            } else {
              this.enableQualitativeReason = false;
            }
          }
          // this.enableQualitativeReason=false;
        }
        break;
      }
    }
    console.log("enableQualitativeReason", this.enableQualitativeReason);
    /**Utility */
    for (let i = 0; i < this.utilityQuestionID.length; i++) {
      if (ID == this.utilityQuestionID[i]) {
        this.valueIndex[index] = index;

        if (value == "NO") {
          this.enablereason[index] = true;
        } else {
          this.questions.at(index).patchValue({ UtilityreasonIfNo: "" });
          this.enablereason[index] = false;
        }
        break;
      }
    }

    console.log("this.setreasonNOArray.length2", this.setreasonNOArray);
  }
  //   setQualitativeReason()
  //   {
  // 	this.qualitativeReasonifNo=this.qualitativereasonForm.controls['QualitativereasonIfNo'].value;
  //   }

  // showCommentBox(value1,value2){
  // 	let
  // 	console.log("value1 "+value1);
  // 		console.log("value2 "+value2);
  // 	this.showComment = true;
  // }

  CallqaMappings: any = {};
  CallqaMapping: any = {};
  callReportsResponse: any;
  success: any = false;
  notInteresting: any = false;
  storeData() {
    if (this.notIntersted.checked) {
      this.cancelCall();
    } else {
      //console.log(this.questionaireForm.value);
      let questions = this.questionaireForm.value.questions;
      console.log(questions);
      this.CallqaMappings.m_104callqamapping = [];
      var totalScore = 0;
      for (let i = 0; i < questions.length; i++) {
        this.CallqaMapping = {};
        this.CallqaMapping.beneficiaryRegID = this.itemData.beneficiaryRegID;
        this.CallqaMapping.callerID = "";
        this.CallqaMapping.benCallID = this.itemData.benCallID;
        this.CallqaMapping.questionID = questions[i].questionId;
        this.CallqaMapping.answer = questions[i].answer;
        let score = 0;
        console.log(questions[i].questionOptions);
        questions[i].questionOptions.filter(function (obj) {
          console.log(obj.answer, "&&&", questions[i].answer);
          if (obj.answer.toLowerCase() == questions[i].answer.toLowerCase()) {
            score = obj.score;
            return obj.score;
          } else if (
            obj.answer != "" &&
            questions[i].question.toLowerCase() ==
              "what is your recommendation on 104 to improve in our service"
          ) {
            score = obj.score;
            return obj.score;
          }
        });
        console.log(score);
        this.CallqaMapping.score = score;

        for (let j = 0; j < this.qualitativeQuestionID.length; j++) {
          if (this.qualitativeQuestionID[j] == questions[i].questionId) {
            this.CallqaMapping.reasonIfNo =
              questions[this.lastQualitativeIndex].QualitativereasonIfNo;
            this.qualityCheck = 1;
            break;
          }
        }
        for (let k = 0; k < this.utilityQuestionID.length; k++) {
          if (this.utilityQuestionID[k] == questions[i].questionId) {
            this.CallqaMapping.reasonIfNo = questions[i].UtilityreasonIfNo;
            this.utilityCheck = 1;
            break;
          }
        }

        if (this.qualityCheck == 0 && this.utilityCheck == 0) {
          this.CallqaMapping.reasonIfNo = "";
        }

        this.qualityCheck = 0;
        this.utilityCheck = 0;

        // this.CallqaMapping.utilityReasonIfNo = questions[i].UtilityreasonIfNo;
        this.CallqaMapping.remarks = questions[i].feedback;
        this.CallqaMapping.processed = "N";
        this.CallqaMapping.deleted = false;
        this.CallqaMapping.createdBy = this.agentData.userName;
        this.CallqaMapping.providerServiceMapID =
          this.saved_data.current_service.serviceID;
        // this.CallqaMapping.notInteresting =  !this.notInteresting;
        // console.log(this.CallqaMapping);
        this.CallqaMappings.m_104callqamapping[i] = this.CallqaMapping;
        //	totalScore += this.CallqaMapping.score;
      }
      console.log(this.CallqaMappings);
      // this.CallqaMappings.totalScore = totalScore;
      // this.CallqaMappings.providerServiceMapID = this.saved_data.current_service.serviceID;
      this.surveyorReportsService
        .saveCallReports(this.CallqaMappings)
        .subscribe(
          (response) => {
            this.callReportsResponse = response;
            this.success = true;
            this.storeCallID(this.beneficiaryRegID, "", "Closed", false);
          },
          (err) => {
            this.alertMessage.alert(err.status, "error");
          }
        );
    }
  }
  cancelCall() {
    // this code need to be optimized, dummy update is used to update the modified time which used for last call time of surveyor
    let dummyUpdate = false;
    if (this.notIntersted.checked) {
      dummyUpdate =
        this.itemData.cDICallStatus == "Not Interested" ? true : false;
      this.storeCallID(
        this.beneficiaryRegID,
        "",
        "Not Interested",
        dummyUpdate
      );
    } else {
      dummyUpdate = this.itemData.cDICallStatus == "Attempted" ? true : false;
      this.storeCallID(this.beneficiaryRegID, "", "Attempted", dummyUpdate);
    }
  }

  callerObj: any;
  updateStatusObj: any;
  storeCallID(beneficiaryRegID, callerID, CDIcallStatus, dummyUpdate) {
    let date = new Date();
    console.log("dummyUpdate:" + dummyUpdate);
    // this.callerObj = {};
    // this.callerObj.beneficiaryRegID = this.beneficiaryRegID;
    // this.callerObj.callID = callerID;

    // this.callerObj.sessionID = "";
    // this.callerObj.calledServiceID = this.calledServiceID;
    // this.callerObj.cDICallStatus = CDIcallStatus;

    // this.callerObj.createdBy = this.agentData.userName;

    // let res = this.callerService.storeCallID(JSON.stringify(this.callerObj)).subscribe(response => this.callerSuccessHandeler(response));
    if (
      this.itemData !== undefined &&
      this.itemData.benCallID !== undefined &&
      this.itemData.benCallID !== null
    ) {
      this.updateStatusObj = {};
      this.updateStatusObj.benCallID = this.itemData.benCallID;
      this.updateStatusObj.cDICallStatus = CDIcallStatus;
      // this code need to be optimized, dummy update is used to update the modified time which used for last call time of surveyor
      if (dummyUpdate) {
        if (CDIcallStatus == "Not Interested")
          this.updateStatusObj.cDICallStatus = "Attempted";
        else this.updateStatusObj.cDICallStatus = "Not Interested";

        this.callerService
          .updateCDIStatus(this.updateStatusObj)
          .subscribe((response) => this.dummySuccessHandeler(response));
      } else
        this.callerService
          .updateCDIStatus(this.updateStatusObj)
          .subscribe((response) => this.callerSuccessHandeler(response));
    }
  }
  callerSuccessHandeler(response) {
    this.dialogReff.close();
    this.alertMessage.alert(this.currentLanguageSet.cdiStatusUpdatedSuccessfully, "success");
  }
  // this code need to be optimized, dummy update is used to update the modified time which used for last call time of surveyor
  dummySuccessHandeler(response) {
    console.log("CDI response:" + JSON.stringify(response));
    if (response.cDICallStatus == "Attempted")
      this.updateStatusObj.cDICallStatus = "Not Interested";
    else this.updateStatusObj.cDICallStatus = "Attempted";

    this.callerService
      .updateCDIStatus(this.updateStatusObj)
      .subscribe((response) => this.callerSuccessHandeler(response));
  }

  // closeFeedbackWindow() {
  // 	this.alertMessage.confirm("Confirm Alert", "Are you sure you want to close the call")
  // 	  .subscribe((response) => {
  // 		if (response) {
  // 		  this.dialogReff.close();
  // 		}
  // 	  })
  //   }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
}
