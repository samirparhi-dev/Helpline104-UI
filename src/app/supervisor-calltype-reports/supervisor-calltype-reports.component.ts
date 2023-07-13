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


import { Component, OnInit, ViewChild } from "@angular/core";
import { SupervisorCallTypeReportService } from "../services/supervisorServices/supervisor-calltype-reports-service.service";
import { dataService } from "../services/dataService/data.service";
import { NgForm } from "@angular/forms";
import { CallTypeReportService } from "../services/callTypeReports/callTypeReport.service";
import { ReportService } from "../services/report-services/report.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { FeedbackTypes } from "../services/common/feedbacktypes.service";
import * as XLSX from "xlsx/xlsx";
import { log } from "util";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import * as moment from "moment";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-supervisor-calltype-reports",
  templateUrl: "./supervisor-calltype-reports.component.html",
  styleUrls: ["./supervisor-calltype-reports.component.css"],
})
export class SupervisorCalltypeReportsComponent implements OnInit {
  start_date: any;
  end_date: any;
  today: any;
  maxDate: Date;
  services: Array<any> = [];
  service: any;
  searchCriteriaBRD: any;
  grievanceType: any;
  // feedbackType:any;
  // feedbackNatureType: any;
  showType = false;
  agentid: any;
  greivanceTypes: Array<any> = [];
  feedbackTypes: Array<any> = [];
  feedbackNatureTypes: Array<any> = [];
  feedbackIdObject: any;
  stateID: any;
  districts: Array<any> = [];
  subDistricts: Array<any> = [];
  villages: Array<any> = [];
  roles: Array<any> = [];
  workLocations: Array<any> = [];
  searchCriteriasForMA = ["Disease Summary", "SubCategory"];
  searchCriteriasForCD = ["Guidelines", "Category"];
  searchCriteriasForBRD = [
    "Component",
    "Group",
    "District Wise Component",
    "District Wise Group",
  ];
  populateServicesExceptHAO = [];

  @ViewChild("callTypeForm") callTypeForm: NgForm;
  currentLanguageSet: any;

  constructor(
    private repostService: CallTypeReportService,
    private reports: ReportService,
    public _SupervisorCallTypeReportService: SupervisorCallTypeReportService,
    private _feedbackTypes: FeedbackTypes,
    public saved_data: dataService,
    private alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.currentLanguageSetValue();
    this.today = new Date();
    this.today.setHours(23, 59, 59, 0);
    this.maxDate = this.today;
    this.maxDate.setHours(23, 59, 59, 59);
    let requestObject = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
    };
    this.repostService.getServices(requestObject).subscribe(
      (response) => {
        this.successHandler(response);
      },
      (err) => {
        console.log(err, "error");
      }
    );
    this._feedbackTypes
      .getFeedbackTypeID(this.saved_data.current_service.serviceID)
      .subscribe((response) => this.getFeedbackTypeIDSuccessHandeler(response));

    this.stateID = this.saved_data.current_stateID_based_on_role;
    this.getDistricts(this.stateID);
    this.getWorkLocations(requestObject);
    this.getRoles(requestObject);
    this.searchCriteriasForMA;
    this.getFeedbackTypes();
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  ngDoCheck() {
    this.currentLanguageSetValue();
  }

  getDistricts(stateID) {
    this.reports.getDistricts(stateID).subscribe((response) => {
      this.districts = response.data;
    });
  }

  getSubDistricts(districtID) {
    this.reports.getSubDistricts(districtID).subscribe((response) => {
      this.subDistricts = response.data;
    });
  }

  getVillages(subDistrictID) {
    this.reports.getVillages(subDistrictID).subscribe((response) => {
      this.villages = response.data;
    });
  }

  getWorkLocations(providerServiceMapID) {
    this.reports
      .getWorkLocations(providerServiceMapID)
      .subscribe((response) => {
        //console.log('Feedback Types: ', response);
        this.workLocations = response.data;
      });
  }
  getFeedbackTypes() {
    let requestObject = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
    };
    this.reports.getFeedbackTypes(requestObject).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.feedbackTypes = response.data;
    });
  }

  getRoles(providerServiceMapID) {
    this.reports.getRoles(providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.roles = response.data;
    });
  }

  getFeedbackNatureTypes(feedbackTypeID) {
    //console.log("this.feedbackTypeID", this.feedbackTypeID);
    this.feedbackIdObject = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
      feedbackTypeID: feedbackTypeID.feedbackTypeID,
    };
    this.reports
      .getFeedbackNature(this.feedbackIdObject)
      .subscribe((response) => {
        //console.log('Feedback nature types: ', JSON.stringify(response));
        this.feedbackNatureTypes = response.data;
        console.log(
          "Feedback nature types: ",
          JSON.stringify(this.feedbackNatureTypes, null, 4)
        );
      });
  }
  /* Removed HAO report from the services dropdown inorder to avoid memory consumption while downloading the report
   * HAO report will be downloading from the replication slave servers
   */
  successHandler(res) {
    if (res !== undefined && res !== null && res.length > 0) {
      this.services = res.filter((obj) => {
        if (obj.subServiceName === "Service Improvements") {
          obj.subServiceName = "Grievance";
        }
        return (
          obj.subServiceName !== "HyperTension Screening" &&
          obj.subServiceName !== "Diabetic Screening"
        );
      });
      this.services.forEach((serviceName) => {
        // const isHealthAdvisoryService =
        //   serviceName.subServiceName !== "Health Advisory Service";
        // if (isHealthAdvisoryService) {
          this.populateServicesExceptHAO.push(serviceName);
          const isCounsellingService =
            serviceName.subServiceName === "Counselling Service";
          const isMedicalService =
            serviceName.subServiceName === "Medical Services";
          const isBloodRequest = serviceName.subServiceName === "Blood Request";
          const isGrievance = serviceName.subServiceName === "Grievance";

          if (isMedicalService) {
            this.addServices("Medical Services Detail");
          }
          if (isCounsellingService) {
            this.addServices("Counselling Service Detail");
          }
          if (isBloodRequest) {
            this.addServices("Blood Request Detail");
          }
          if (isGrievance) {
            this.addServices("Grievance Detail");
          }
        // }
      });
    }
  }

  addServices(addServiceName) {
    const addSubServiceName = { subServiceName: addServiceName };
    this.populateServicesExceptHAO.push(addSubServiceName);
  }

  getFeedbackTypeIDSuccessHandeler(response) {
    this.greivanceTypes = response.filter(function (obj) {
      return (
        obj.feedbackTypeName === "Asha Complaints" ||
        obj.feedbackTypeName === "Generic Complaint"
      );
    });
    console.log(this.greivanceTypes);
  }
  setEndDate() {
    const timeDiff = this.maxDate.getTime() - this.start_date.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxDate = new Date(this.start_date);
        this.maxDate.setDate(this.maxDate.getDate() + 30);
        this.maxDate.setHours(23, 59, 59, 0);
        this.end_date = this.maxDate;
      }
      if (diffDays <= 31) {
        this.checkForEndDateDifference();
      }
    } else {
      this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff = this.today.getTime() - this.start_date.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxDate = new Date(this.start_date);
      this.maxDate.setDate(this.maxDate.getDate() + 30);
      this.maxDate.setHours(23, 59, 59, 0);
      this.end_date = this.maxDate;
    } else {
      this.end_date = this.today;
      this.maxDate = this.today;
    }
  }
  serviceSelected(service) {
    if (service == "Grievance") {
      this.showType = true;
    } else {
      this.showType = false;
    }
  }

  fieldReset() {
    this.callTypeForm.control.patchValue({
      grievanceType: null,
      district: null,
      subDistrict: null,
      village: null,
      searchCriteria: null,
      searchCriteriaBRD: null,
      searchCriteriasCD: null,
      feedbackTypeID: null,
      feedbackNatureID: null,
    });
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  headerHAO_CO_MO_PD = [
    "beneficiaryID",
    "actionByCO",
    "actionByHAO",
    "actionByMO",
    "actionByPD",
    "allergies",
    "diseaseSummary",
    "selecteDiagnosis",
    "selecteDiagnosisID",
    "addedAdvice",
    "diseaseSummaryID",
    "prescriptionID",
    "requestID",
    "benHistoryID",
    "firstName",
    "lastName",
    "patientName",
    "isSelf",
    "dateOfBirth",
    "patientAge",
    "gender",
    "patientGenderName",
    "healthCareWorker",
    "phoneNumber",
    "district",
    "subDistrict",
    "village",
    "benCallID",
    "callType",
    "callSubType",
    "callReceivedUserID",
    "callEndUserID",
  ];
  searchReports(value) {
    let start =
      new Date(
        value.startDate.getTime() -
          1 * (value.startDate.getTimezoneOffset() * 60 * 1000)
      )
        .toJSON()
        .slice(0, 10) + "T00:00:00.000Z";

    let end =
      new Date(
        value.endDate.getTime() -
          1 * (value.endDate.getTimezoneOffset() * 60 * 1000)
      )
        .toJSON()
        .slice(0, 10) + "T23:59:59.000Z";

    // let requestObj = {
    //   providerServiceMapID: this.saved_data.current_service.serviceID,
    //   startDateTime: start,
    //   endDateTime: end,
    //   agentID: value.agentid,
    //   fileName: null
    // };
    let requestObj=null;
    switch (value.service) {
      case "Registration": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Registration_Service"
        };
        this.reports.getROSummaryReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
             saveAs(response,  requestObj.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Health Advisory Service": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Health_Advisory_Service"
        };
        this.reports.getHAOSummaryReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Medical Services Detail": {
        let requestObjForMA = {
          startDateTime: start,
          endDateTime: end,
          providerServiceMapID: this.saved_data.current_service.serviceID,
          // "searchCriteria": value.searchCriteria,
          roleID: value.roleID,
          locationID: value.workLocationID,
          districtID: value.district,
          subDistrictID: value.subDistrict,
          villageID: value.village,
          fileName: "Medical_Services_Detail"
        };
        this.reports.getMedicalAdviseReport(requestObjForMA).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObjForMA.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Counselling Service": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Counselling_Service"
        };
        this.reports.getCOSummaryReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Counselling Service Detail": {
        let reqObjForMentalHealthReport = {
          startDateTime: start,
          endDateTime: end,
          providerServiceMapID: this.saved_data.current_service.serviceID,
          searchCriteria: value.searchCriteriasCD,
          fileName: "Counselling_Service_Detail"
        };
        this.reports
          .getMentalHealthReport(reqObjForMentalHealthReport)
          .subscribe(
            (response) => {
              if (response) {
                saveAs(response,  reqObjForMentalHealthReport.fileName+".xlsx");
              } else {
                this.alertService.alert(this.currentLanguageSet.noDataFound);
              }
            },
            (err) => {
              // this.alertService.alert(err.errorMessage, "error");
              if(err.status === 500)
              {
                this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
              }
              else
              this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
            }
          );
        break;
      }
      case "Medical Services": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Medical_Services"
        };
        this.reports.getMOSummaryReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Psychiatrist": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid === "" ? undefined: value.agentid,
          fileName: "Psychiatrist"
        };
        this.reports.getPDSummaryReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = this.headerHAO_CO_MO_PD.slice();
            //   headers.splice(0, 1);
            //   headers.splice(0, 1);
            //   headers.splice(0, 1);
            //   this.handleReportSuccess(response, "Psychiatrist", headers);
            // } else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            //this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Blood Request": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid === "" ? undefined: value.agentid,
          fileName: "Blood_Request"
        };
        this.reports.getBloodOnCallReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = [
            //     "beneficiaryID",
            //     "bloodGroupName",
            //     "componentTypeName",
            //     "unitRequired",
            //     "typeOfRequest",
            //     "bloodReqID",
            //     "bloodBankPersonName",
            //     "bloodBankPersonDesignation",
            //     "bloodBankAddress",
            //     "bloodBankMobileNo",
            //     "outboundCallDate",
            //     "outboundNeeded",
            //     "hospitalAdmitted",
            //     "hospitalDistrictName",
            //     "date",
            //     "remarks",
            //     "feedback",
            //     "requestID",
            //     "firstName",
            //     "lastName",
            //     "dateOfBirth",
            //     "gender",
            //     "healthCareWorker",
            //     "isSelf",
            //     "phoneNumber",
            //     "recipientAge",
            //     "recipientName",
            //     "recipientBeneficiaryID",
            //     "recipientGenderName",
            //     "district",
            //     "subDistrict",
            //     "village",
            //     "benCallID",
            //     "callType",
            //     "callSubType",
            //     "callReceivedUserID",
            //     "callEndUserID",
            //   ];
            //   this.handleReportSuccess(response, "Blood Request", headers);
            // }  else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Blood Request Detail": {
        let requestObjForBRD = {
          startDateTime: start,
          endDateTime: end,
          providerServiceMapID: this.saved_data.current_service.serviceID,
          searchCriteria: value.searchCriteriaBRD,
          districtID: value.district ? value.district : null,
          subDistrictID: value.subDistrict ? value.subDistrict : null,
          villageID: value.village ? value.village : null,
          fileName : "Blood_Request_Detail"
        };
        this.reports.getBloodOnCallDetailedReport(requestObjForBRD).subscribe(
          (response) => {
            if (response) {
             saveAs(response,  requestObjForBRD.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        // this.reports.getBloodOnCallDetailedReport(requestObjForBRD).subscribe(
        //   (response) => {
        //     if (response.length > 0) {
        //       let array = response.filter(function (obj) {
        //         for (var key in obj) {
        //           if (obj[key] == null) {
        //             obj[key] = "";
        //           }
        //         }
        //         return obj;
        //       });
        //       var head = Object.keys(array[0]);
        //       let headers = head;
        //       this.handleReportSuccess(
        //         response,
        //         "Blood Request Detail",
        //         headers
        //       );
        //     }  else {
        //       this.alertService.alert(this.currentLanguageSet.noDataFound);
        //     }
        //   },
        //   (err) => {
        //     this.alertService.alert(err.errorMessage, "error");
        //   }
        // );
        break;
      }
      case "Organ Donation": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid === "" ? undefined: value.agentid,
          fileName: "Organ_Donation"
        };
        this.reports.getOrganDonationReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = [
            //     "beneficiaryID",
            //     "donationTypeName",
            //     "organDonationID",
            //     "donatableOrganName",
            //     "acceptorHospitalName",
            //     "acceptorHospitalState",
            //     "acceptorHospitalDistrict",
            //     "acceptorHospitalSubDistrict",
            //     "acceptorHospitalVillage",
            //     "createdDate",
            //     "remarks",
            //     "requestID",
            //     "firstName",
            //     "lastName",
            //     "dob",
            //     "donarAge",
            //     "donarGender",
            //     "gender",
            //     "healthCareWorker",
            //     "isSelf",
            //     "phoneNumber",
            //     "donarName",
            //     "district",
            //     "subDistrict",
            //     "village",
            //     "benCallID",
            //     "callType",
            //     "callSubType",
            //     "callReceivedUserID",
            //     "callEndUserID",
            //   ];
            //   this.handleReportSuccess(response, "Organ Donation", headers);
            // } else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            //this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Directory Services": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Directory_Services"
        };
        this.reports.getDirectoryServiceReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = [
            //     "beneficiaryID",
            //     "acceptorHospitalName",
            //     "acceptorHospitalState",
            //     "acceptorHospitalDistrict",
            //     "acceptorHospitalSubDistrict",
            //     "acceptorHospitalVillage",
            //     "instituteDirectoryName",
            //     "instituteSubDirectoryName",
            //     "institutionID",
            //     "date",
            //     "firstName",
            //     "lastName",
            //     "dateOfBirth",
            //     "gender",
            //     "healthCareWorker",
            //     "phoneNumber",
            //     "district",
            //     "subDistrict",
            //     "village",
            //     "benCallID",
            //     "callType",
            //     "callSubType",
            //     "callReceivedUserID",
            //     "callEndUserID",
            //   ];
            //   this.handleReportSuccess(response, "Directory Services", headers);
            // }else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Grievance": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Grievance"
        };
        requestObj["feedbackTypeID"] =
          value.grievanceType == "all" ? undefined : value.grievanceType;
        this.reports.getGrievanceReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Grievance Detail": {
        let filename="Grievance_Detail";
        let tempArray = [];
        if (
          start != null &&
          end != null &&
          value.feedbackTypeID == null &&
          value.feedbackNatureID == null
        ) {
          this.feedbackTypes.forEach((feedback) => {
            let reqObjForComplaintDetailReport: any;
            reqObjForComplaintDetailReport = {
              startDate: start,
              endDate: end,
              providerServiceMapID: this.saved_data.current_service.serviceID,
              feedbackTypeID: feedback.feedbackTypeID,
              feedbackNatureID: null,
              feedbackTypeName: feedback.feedbackTypeName,
              fileName: filename
            };
            tempArray.push(reqObjForComplaintDetailReport);
          });
        } else {
          let reqObjForComplaintDetailReport: any;
          reqObjForComplaintDetailReport = {
            startDate: start,
            endDate: end,
            providerServiceMapID: this.saved_data.current_service.serviceID,
            feedbackTypeID: value.feedbackTypeID.feedbackTypeID,
            feedbackNatureID: value.feedbackNatureID,
            feedbackTypeName: value.feedbackTypeID.feedbackTypeName,
            fileName: filename
          };
          tempArray.push(reqObjForComplaintDetailReport);
        }
        // requestObj['feedbackTypeID'] = value.grievanceType == 'all' ? undefined : value.grievanceType;
        this.reports.getComplaintDetailsReport(tempArray).subscribe(
          (response) => {
            if (response) {
              saveAs(response, filename+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Prescription": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Prescription"
        };
        this.reports.getPrescriptionReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
            } else {
              this.alertService.alert(this.currentLanguageSet.noDataFound);
            }
          },
          (err) => {
            // this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Food Safety": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid === "" ? undefined: value.agentid,
          fileName: "Food_Safety"
        };
        this.reports.getFoodSafetyReportByDate(requestObj).subscribe(
          (response) => {
            console.log("response for health schemes..", response);
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
          },
          (err) => {
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        // this.reports.getFoodSafetyReportByDate(requestObj).subscribe(
        //   (response) => {
        //     if (response.length > 0) {
        //       let headers = [
        //         "beneficiaryID",
        //         "feedbackType",
        //         "associatedSymptoms",
        //         "foodConsumedFrom",
        //         "fromaddServicesDate",
        //         "fsComplaintID",
        //         "historyOfDiet",
        //         "isAbdominalPain",
        //         "isChillsOrRigors",
        //         "isDehydration",
        //         "isDiarrhea",
        //         "isFoodConsumed",
        //         "isGiddiness",
        //         "isRashes",
        //         "isVomiting",
        //         "typeOfFood",
        //         "typeOfRequest",
        //         "remarks",
        //         "requestID",
        //         "date",
        //         "firstName",
        //         "lastName",
        //         "patientName",
        //         "patientAge",
        //         "dateOfBirth",
        //         "gender",
        //         "healthCareWorker",
        //         "isSelf",
        //         "patientGenderID",
        //         "phoneNumber",
        //         "district",
        //         "subDistrict",
        //         "village",
        //         "benCallID",
        //         "callType",
        //         "callSubType",
        //         "callReceivedUserID",
        //         "callEndUserID",
        //       ];
        //       this.handleReportSuccess(response, "Food Safety", headers);
        //     } else {
        //       this.alertService.alert(this.currentLanguageSet.noDataFound);
        //     }
        //   },
        //   (err) => {
        //     this.alertService.alert(err.errorMessage, "error");
        //   }
        // );
        break;
      }
      case "Health Schemes": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Health_Schemes"
        };
        this.reports.getSchemesReportByDate(requestObj).subscribe(
          (response) => {
            console.log("response for health schemes..", response);
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = [
            //     "beneficiaryID",
            //     "schemeDesc",
            //     "schemeID",
            //     "schemeName",
            //     "schemeServiceID",
            //     "remarks",
            //     "requestID",
            //     "date",
            //     "firstName",
            //     "lastName",
            //     "dateOfBirth",
            //     "gender",
            //     "healthCareWorker",
            //     "phoneNumber",
            //     "district",
            //     "subDistrict",
            //     "village",
            //     "callType",
            //     "callSubType",
            //     "benCallID",
            //     "callReceivedUserID",
            //     "callEndUserID",
            //   ];
            //   this.handleReportSuccess(response, "Health Schemes", headers);
            // } else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Epidemic Outbreak Service": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid === "" ? undefined: value.agentid,
          fileName: "Epidemic_Outbreak_Service"
        };
        this.reports.getEpidemicReportByDate(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = [
            //     "beneficiaryID",
            //     "natureOfComplaint",
            //     "outbreakComplaintID",
            //     "affectedDistrictBlockName",
            //     "affectedDistrictBranchName",
            //     "affectedDistrictName",
            //     "totalPeopleAffected",
            //     "remarks",
            //     "requestID",
            //     "date",
            //     "firstName",
            //     "lastName",
            //     "dateOfBirth",
            //     "gender",
            //     "healthCareWorker",
            //     "phoneNumber",
            //     "district",
            //     "subDistrict",
            //     "village",
            //     "callType",
            //     "callSubType",
            //     "benCallID",
            //     "callReceivedUserID",
            //     "callEndUserID",
            //   ];
            //   this.handleReportSuccess(
            //     response,
            //     "Epidemic Outbreak Service",
            //     headers
            //   );
            // }  else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            //this.alertService.alert(err.errorMessage, "error");
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      case "Surveyor": {
        requestObj = {
          providerServiceMapID: this.saved_data.current_service.serviceID,
          startDateTime: start,
          endDateTime: end,
          agentID: value.agentid,
          fileName: "Surveyor"
        };
        this.reports.getCDIResponseReport(requestObj).subscribe(
          (response) => {
            if (response) {
              saveAs(response,  requestObj.fileName+".xlsx");
             } else {
               this.alertService.alert(this.currentLanguageSet.noDataFound);
             }
            // if (response.length > 0) {
            //   let headers = [
            //     "question",
            //     "answer",
            //     "score",
            //     "beneficiaryID",
            //     "firstName",
            //     "lastName",
            //     "healthCareWorker",
            //     "gender",
            //     "dateOfBirth",
            //     "village",
            //     "subDistrict",
            //     "district",
            //     "callType",
            //     "callSubType",
            //     "phoneNumber",
            //   ];
            //   this.handleReportSuccess(response, "Surveyor", headers);
            // }else {
            //   this.alertService.alert(this.currentLanguageSet.noDataFound);
            // }
          },
          (err) => {
            if(err.status === 500)
            {
              this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
            }
            else
            this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
          }
        );
        break;
      }
      // case "Diabetic Screening":
      //   {
      //     break;
      //   }
      // case "HyperTension Screening":
      //   {
      //     break;
      //   }
      default:
        break;
    }
  }
  handleReportSuccess(response, service, headers) {
    let criteria: any = [];
    criteria.push({ "Filter Name": "Start_Date", Value: moment(this.start_date).format('DD-MM-YYYY') });
    criteria.push({ "Filter Name": "End_Date", Value: moment(this.end_date).format('DD-MM-YYYY') });
    criteria.push({ "Filter Name": "Service", Value: service });

    this.exportToxlsx(criteria, response, service, headers);
  }
  exportToxlsx(criteria: any, response: any, service: any, headers: any) {
    let wb_name = service;
    const criteria_worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      response,
      { header: headers }
    );

    // below code added to modify the headers ---XXXXXXXXXXXXXX----- 4/7/18 gursimran

    let i = 65; // starting from 65 since it is the ASCII code of 'A'.
    let count = 0;
    while (i < headers.length + 65) {
      let j;
      if (count > 0) {
        j = i - 26 * count;
      } else {
        j = i;
      }
      let cellPosition = String.fromCharCode(j);
      let finalCellName: String;
      if (count == 0) {
        finalCellName = cellPosition + "1";
        // console.log(finalCellName);
      } else {
        let newcellPosition = String.fromCharCode(64 + count);
        finalCellName = newcellPosition + cellPosition + "1";
        // console.log(finalCellName);
      }
      let newName = this.modifyHeader(headers, i);
      delete report_worksheet[finalCellName].w;
      report_worksheet[finalCellName].v = newName;
      i++;
      if (i == 91 + count * 26) {
        // i = 65;
        count++;
      }
    }
    // --------end--------

    const workbook: XLSX.WorkBook = {
      Sheets: { Report: report_worksheet, Criteria: criteria_worksheet },
      SheetNames: ["Criteria", "Report"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    let blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, wb_name);
    } else {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("visibility", "hidden");
      link.download = wb_name.replace(/ /g, "_") + ".xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65]
      .toString()
      .replace(/([A-Z])/g, " $1")
      .trim();
    modifiedHeader =
      modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    //console.log(modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
  }
}
