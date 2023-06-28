import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";

import { ReportService } from "../services/report-services/report.service";
import * as XLSX from "xlsx/xlsx";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import * as moment from "moment";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-supervisor-district-wise-call-volume-report",
  templateUrl: "./supervisor-district-wise-call-volume-report.component.html",
  styleUrls: ["./supervisor-district-wise-call-volume-report.component.css"],
})
export class SupervisorDistrictWiseCallVolumeReportComponent implements OnInit {
  currentLanguageSet: any;

  districtWiseCallVolumeForm: FormGroup;
  maxStartDate: Date;

  constructor(
    private reportService: ReportService,
    public saved_data: dataService,
    private alertService: ConfirmationDialogsService,
    private formBuilder: FormBuilder,
    public HttpServices: HttpServices
  ) {}

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  dateOffset: any;

  workLocations: Array<any> = [];
  districtWiseCallVolumeList: Array<any> = [];
  stateID: any;
  districts: Array<any> = [];
  subDistricts: Array<any> = [];
  villages: Array<any> = [];
  callTypes: Array<any> = [];
  roles: Array<any> = [];

  ngOnInit() {
    this.assignSelectedLanguage();

    this.providerServiceMapID = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
    };
    this.createDistrictWiseCallVolumeForm();

    this.stateID = this.saved_data.current_stateID_based_on_role;
    this.getDistricts(this.stateID);
    this.getWorkLocations();
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.getCallTypes(this.providerServiceMapID);
    this.dateOffset = 24 * 60 * 60 * 1000;
    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate() - 1);
    this.maxStartDate.setHours(0, 0, 0, 0);
    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.maxEndDate.setHours(23, 59, 59, 59);
    console.log("enddate", this.endDate);
    this.getRoles();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  createDistrictWiseCallVolumeForm() {
    this.districtWiseCallVolumeForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      // roleID: null,
      // workLocationID: null,
      district: null,
      // subDistrict: null,
      // village: null
    });
  }

  get startDate() {
    return this.districtWiseCallVolumeForm.controls["startDate"].value;
  }

  get endDate() {
    return this.districtWiseCallVolumeForm.controls["endDate"].value;
  }

  // get roleID() {
  //   return this.districtWiseCallVolumeForm.controls['roleID'].value;
  // }

  get district() {
    return this.districtWiseCallVolumeForm.controls["district"].value;
  }

  // get subDistrict() {
  //   return this.districtWiseCallVolumeForm.controls['subDistrict'].value;
  // }

  // get village() {
  //   return this.districtWiseCallVolumeForm.controls['village'].value;
  // }

  // get workLocationID() {
  //   return this.districtWiseCallVolumeForm.controls['workLocationID'].value;
  // }
  checkEndDate() {
    const timeDiff = this.maxEndDate.getTime() - this.startDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.startDate);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.districtWiseCallVolumeForm.patchValue({
          endDate: this.maxEndDate,
        });
      }
      if (diffDays <= 31) {
        this.checkForEndDateDifference();
      }
    } else {
      this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff = this.today.getTime() - this.startDate.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxEndDate = new Date(this.startDate);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.districtWiseCallVolumeForm.patchValue({
        endDate: this.maxEndDate,
      });
    } else {
      this.maxEndDate = new Date(this.today);
      this.maxEndDate.setDate(this.maxEndDate.getDate() - 1);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.districtWiseCallVolumeForm.patchValue({
        endDate: this.maxEndDate,
      });
    }
  }
  getRoles() {
    this.reportService
      .getRoles(this.providerServiceMapID)
      .subscribe((response) => {
        //console.log('Feedback Types: ', response);
        this.roles = response.data;
      });
  }

  getWorkLocations() {
    this.reportService
      .getWorkLocations(this.providerServiceMapID)
      .subscribe((response) => {
        //console.log('Feedback Types: ', response);
        this.workLocations = response.data;
      });
  }

  getDistricts(stateID) {
    this.reportService.getDistricts(stateID).subscribe((response) => {
      this.districts = response.data;
    });
  }

  getSubDistricts(district) {
    if (district != null || district != undefined) {
      this.reportService
        .getSubDistricts(district.districtID)
        .subscribe((response) => {
          this.subDistricts = response.data;
        });
    }
  }

  getVillages(subDistrictID) {
    this.reportService.getVillages(subDistrictID).subscribe((response) => {
      this.villages = response.data;
    });
  }

  getCallTypes(providerServiceMapID) {
    this.reportService
      .getCallTypes(providerServiceMapID)
      .subscribe((response) => {
        this.callTypes = response.data;
      });
  }

  searchReport() {
    let startDate: Date = new Date(
      this.districtWiseCallVolumeForm.value.startDate
    );
    let endDate: Date = new Date(this.districtWiseCallVolumeForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log(
      "Data form value...",
      JSON.stringify(this.districtWiseCallVolumeForm.value)
    );
    let reqObjForDistrictWiseCallVolumeReport = {
      startDate: new Date(
        startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000
      ),
      endDate: new Date(
        endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000
      ),
      providerServiceMapID:
        this.districtWiseCallVolumeForm.value.providerServiceMapID,
      districtID: this.districtWiseCallVolumeForm.value.district
        ? this.districtWiseCallVolumeForm.value.district.districtID
        : null,
      district: this.districtWiseCallVolumeForm.value.district
        ? this.districtWiseCallVolumeForm.value.district.districtName
        : null,
      //"subdistrictID": this.districtWiseCallVolumeForm.value.subDistrict ? this.districtWiseCallVolumeForm.value.subDistrict : null,
      //"villageID": this.districtWiseCallVolumeForm.value.village ? this.districtWiseCallVolumeForm.value.village : null,
      //"locationID": this.districtWiseCallVolumeForm.value.workLocationID ? this.districtWiseCallVolumeForm.value.workLocationID : null,
      //"roleID": this.districtWiseCallVolumeForm.value.roleID ? this.districtWiseCallVolumeForm.value.roleID : null
      "fileName": "District_Wise_Call_Volume_Report"
    };
    console.log(
      "Data form data",
      JSON.stringify(reqObjForDistrictWiseCallVolumeReport, null, 4)
    );
    this.reportService.getDistrictWiseCallVolumeReport(reqObjForDistrictWiseCallVolumeReport).subscribe((response) => {
      console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForDistrictWiseCallVolumeReport.fileName+".xlsx");
        this.alertService.alert(this.currentLanguageSet.districtWiseCallVolumeReportDownloaded);
       } else {
         this.alertService.alert(this.currentLanguageSet.noDataFound);
       }
      // if (response.length > 0) {
      //   this.callSummaryReportList = response; 
      //   console.log("RESPONSE, ", this.callSummaryReportList);
      //   this.getResponseOfSearchThenDo();
      // }else {
      //   this.alertService.alert(this.currentLanguageSet.noRecordFound);
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
    });

    // this.reportService
    //   .getDistrictWiseCallVolumeReport(reqObjForDistrictWiseCallVolumeReport)
    //   .subscribe((response) => {
    //     console.log(
    //       "Json data of response: ",
    //       JSON.stringify(response, null, 4)
    //     );
    //     if (response.length > 0) {
    //       this.districtWiseCallVolumeList = response;
    //       console.log(
    //         "UNBLOCK USER RESPONSE, ",
    //         this.districtWiseCallVolumeList
    //       );
    //       this.getResponseOfSearchThenDo();
    //     } else {
    //       this.alertService.alert(this.currentLanguageSet.noRecordFound);
    //     }
    //   });
  }

  downloadReport(downloadFlag) {
    if (downloadFlag == true) {
      this.searchReport();
    }
  }

  getResponseOfSearchThenDo() {
    console.log("in get response...");
    let criteria: any = [];
    criteria.push({ Filter_Name: "Start_Date", value: moment(this.startDate).format('DD-MM-YYYY') });
    criteria.push({ Filter_Name: "End_Date", value: moment(this.endDate).format('DD-MM-YYYY') });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.districtWiseCallVolumeList.length > 0) {
      let array = this.districtWiseCallVolumeList.filter(function (obj) {
        for (var key in obj) {
          if (obj[key] == null) {
            obj[key] = "";
          }
        }
        return obj;
      });
      if (array.length != 0) {
        // var head = Object.keys(array[0]);
        console.log("this.callTypes", this.callTypes);

        var head = this.callTypes.map((callType) => {
          console.log("callType", callType);
          return callType.callType;
        });
        console.log(" head", head);
        head.splice(0, 0, "District");
        let wb_name = "District Wise Call Volume Report";
        const criteria_worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.districtWiseCallVolumeList,
          { header: head }
        );

        // below code added to modify the headers

        let i = 65; // starting from 65 since it is the ASCII code of 'A'.
        let count = 0;
        while (i < head.length + 65) {
          let j;
          if (count > 0) {
            j = i - 26 * count;
          } else {
            j = i;
          }
          let cellPosition = String.fromCharCode(j);
          let finalCellName: any;
          if (count == 0) {
            finalCellName = cellPosition + "1";
            console.log(finalCellName);
          } else {
            let newcellPosition = String.fromCharCode(64 + count);
            finalCellName = newcellPosition + cellPosition + "1";
            console.log(finalCellName);
          }
          let newName = this.modifyHeader(head, i);
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
      this.alertService.alert(
        this.currentLanguageSet.districtWiseCallVolumeReportDownloaded
      );
    } else {
      this.alertService.alert(this.currentLanguageSet.noRecordFound);
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
