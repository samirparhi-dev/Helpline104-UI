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


import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";

import { ReportService } from '../services/report-services/report.service';
import * as XLSX from 'xlsx/xlsx';
import { SetLanguageComponent } from 'app/set-language.component';
import * as moment from "moment";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-supervisor-complaint-detail-report',
  templateUrl: './supervisor-complaint-detail-report.component.html',
  styleUrls: ['./supervisor-complaint-detail-report.component.css']
})
export class SupervisorComplaintDetailReportComponent implements OnInit {

  complaintDetailForm: FormGroup;

  constructor(private reportService: ReportService, public saved_data: dataService, private alertService: ConfirmationDialogsService,
    private formBuilder: FormBuilder,public HttpServices: HttpServices) { }

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  dateOffset: any;
  currentLanguageSet: any;
  feedbackIdObject: any;
  feedbackTypes:Array<any> = [];
  feedbackNatureTypes :Array<any>= [];

  complaintDetailList:Array<any> = [];

  ngOnInit() {
    this.currentLanguageSetValue();
    this.providerServiceMapID = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.createComplaintDetailForm();
    this.today = new Date();

    this.dateOffset = (24 * 60 * 60 * 1000);
    this.maxEndDate = new Date(this.today.setTime(this.today.getTime()));
    this.feedbackTypes;
    this.feedbackNatureTypes;
    this.getFeedbackTypes();
  }

  currentLanguageSetValue() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
	  
	  ngDoCheck() {
		this.currentLanguageSetValue();
	  }    

  createComplaintDetailForm() {
    this.complaintDetailForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      feedbackTypeID: null,
      feedbackNatureID: null
    })
  }

  get startDate() {
    return this.complaintDetailForm.controls['startDate'].value;
  }

  get endDate() {
    return this.complaintDetailForm.controls['endDate'].value;
  }

  get feedbackTypeID() {
    return this.complaintDetailForm.controls['feedbackTypeID'].value;
  }

  get feedbackNatureID() {
    return this.complaintDetailForm.controls['feedbackNatureID'].value;
  }
  checkEndDate() {
    console.log('', this.startDate);

    if (this.endDate == null) {
      this.minEndDate = new Date(this.startDate);
      console.log("new Date(this.today.getDate() - 1);", new Date(this.today));
    } else {
      this.complaintDetailForm.patchValue({
        endDate: null, feedbackTypeID: null, feedbackNatureID: null
      })
    }
  }

  getFeedbackTypes() {
    this.reportService.getFeedbackTypes(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.feedbackTypes = response.data;
    })
  }

  getFeedbackNatureTypes() {
    //console.log("this.feedbackTypeID", this.feedbackTypeID);
    this.feedbackIdObject = {
      "providerServiceMapID": this.complaintDetailForm.value.providerServiceMapID,
      "feedbackTypeID": this.feedbackTypeID.feedbackTypeID
    }
    this.reportService.getFeedbackNature(this.feedbackIdObject).subscribe((response) => {
      //console.log('Feedback nature types: ', JSON.stringify(response));
      this.feedbackNatureTypes = response.data;
      console.log('Feedback nature types: ', JSON.stringify(this.feedbackNatureTypes, null, 4));
    })
  }

  searchReport() {
    let filename="Complaint_Details_Report";
    let tempArray = [];
    let startDate: Date = new Date(this.complaintDetailForm.value.startDate);
    let endDate: Date = new Date(this.complaintDetailForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.complaintDetailForm.value));
    if(startDate != null && endDate != null && this.feedbackTypeID == null && this.feedbackNatureID == null) {
      this.feedbackTypes.forEach( (feedback) => {
        let reqObjForComplaintDetailReport : any;
        reqObjForComplaintDetailReport = {
          "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
          "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
          "providerServiceMapID": this.complaintDetailForm.value.providerServiceMapID,
          "feedbackTypeID": feedback.feedbackTypeID,
          "feedbackNatureID": null,
          "feedbackTypeName": feedback.feedbackTypeName,
          "fileName": filename
        }
        tempArray.push(reqObjForComplaintDetailReport);
      })
    } else {
        let reqObjForComplaintDetailReport : any;
        reqObjForComplaintDetailReport = {
          "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
          "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
          "providerServiceMapID": this.complaintDetailForm.value.providerServiceMapID,
          "feedbackTypeID": this.complaintDetailForm.value.feedbackTypeID.feedbackTypeID,
          "feedbackNatureID": this.complaintDetailForm.value.feedbackNatureID,
          "feedbackTypeName": this.complaintDetailForm.value.feedbackTypeID.feedbackTypeName,
          "fileName": filename
        }
        tempArray.push(reqObjForComplaintDetailReport);
     
    }
    
    console.log("Data form data", JSON.stringify(tempArray, null, 4));

    this.reportService.getComplaintDetailsReport(tempArray).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response, filename+".xlsx");
        this.alertService.alert(this.currentLanguageSet.complaintDetailsReportDownloaded);
        // this.complaintDetailList = response;
        // console.log("COMPLAINT DETAIL REPORT RESPONSE, ", this.complaintDetailList);
        // this.getResponseOfSearchThenDo();
      }else {
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
    )
  }

  downloadReport(downloadFlag) {
    if (downloadFlag == true) {
      this.searchReport();
    }
  }

  getResponseOfSearchThenDo() {
    console.log("in get response...");
    let criteria: any = [];
    criteria.push({ 'Filter_Name': 'Start_Date', 'value': moment(this.startDate).format('DD-MM-YYYY') });
    criteria.push({ 'Filter_Name': 'End_Date', 'value': moment(this.endDate).format('DD-MM-YYYY') });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.complaintDetailList.length > 0) {
      let array = this.complaintDetailList.filter(function (obj) {
        for (var key in obj) {
          if (obj[key] == null) {
            obj[key] = "";
          }
        }
        return obj;
      });
      if (array.length != 0) {
        var head = Object.keys(array[0]);
        console.log(" head", head);
        let wb_name = "Complaint Details Report";
        const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.complaintDetailList, { header: (head) });

        // below code added to modify the headers

        let i = 65;    // starting from 65 since it is the ASCII code of 'A'.
        let count = 0;
        while (i < head.length + 65) {
          let j;
          if (count > 0) {
            j = i - (26 * count);
          }
          else {
            j = i;
          }
          let cellPosition = String.fromCharCode(j);
          let finalCellName: any;
          if (count == 0) {
            finalCellName = cellPosition + "1";
            console.log(finalCellName);
          }
          else {
            let newcellPosition = String.fromCharCode(64 + count);
            finalCellName = newcellPosition + cellPosition + "1";
            console.log(finalCellName);
          }
          let newName = this.modifyHeader(head, i);
          delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
          i++;
          if (i == 91 + (count * 26)) {
            // i = 65;
            count++;
          }
        }
        // --------end--------

        const workbook: XLSX.WorkBook = { Sheets: { 'Report': report_worksheet, 'Criteria': criteria_worksheet }, SheetNames: ['Criteria', 'Report'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
        let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, wb_name);
        }
        else {
          var link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute('visibility', 'hidden');
          link.download = wb_name.replace(/ /g, "_") + ".xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      this.alertService.alert(this.currentLanguageSet.complaintDetailsReportDownloaded);
    } else {
      this.alertService.alert(this.currentLanguageSet.noRecordFound);
    }
  }

  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65].toString().replace(/([A-Z])/g, ' $1').trim();
    modifiedHeader = modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    //console.log(modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
  }

}
