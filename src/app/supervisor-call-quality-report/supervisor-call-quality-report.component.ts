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

import { ReportService } from '../services/report-services/report.service';
import * as XLSX from 'xlsx/xlsx';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';
import * as moment from "moment";
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-supervisor-call-quality-report',
  templateUrl: './supervisor-call-quality-report.component.html',
  styleUrls: ['./supervisor-call-quality-report.component.css']
})
export class SupervisorCallQualityReportComponent implements OnInit {

  callQualityForm: FormGroup;

  currentLanguageSet: any;

  constructor(private reportService: ReportService, public saved_data: dataService, private alertService: ConfirmationDialogsService,
    private formBuilder: FormBuilder,public HttpServices: HttpServices) { }

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  dateOffset: any;

  callTypes:Array<any> = [];
  users :Array<any>= [];
  workLocations:Array<any> = [];
  roles:Array<any> = [];
  searchCriterias:Array<any> = [];
  callQualityList :Array<any>= [];

  ngOnInit() {
    this.currentLanguageSetValue();
    this.providerServiceMapID = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.createCallQualityForm();
    this.today = new Date();
    this.today.setHours(23, 59, 59, 0);
    this.dateOffset = (24 * 60 * 60 * 1000);
    this.maxEndDate = new Date(this.today.setTime(this.today.getTime()));
    this.searchCriterias = [
      {showValue : 'Location wise', sendValue: 'LocationWiseReport'}, 
      {showValue :'Call type wise', sendValue: 'callTypeWise'}, 
      {showValue :'Agent wise', sendValue: 'AgentWiseReport'}, 
      {showValue :'Skillset wise', sendValue: 'SkillsetWiseReport'}, 
      {showValue :'Date wise', sendValue: 'DateWiseReport'}];
  }

  currentLanguageSetValue() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
	  
	  ngDoCheck() {
		this.currentLanguageSetValue();
	  }    

  createCallQualityForm() {
    this.callQualityForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      searchCriteria: [null, Validators.required],
      callType: null,
      userID: null,
      workLocationID: null,
      roleID: null
    })
  }

  get startDate() {
    return this.callQualityForm.controls['startDate'].value;
  }

  get endDate() {
    return this.callQualityForm.controls['endDate'].value;
  }

  get searchCriteria() {
    return this.callQualityForm.controls['searchCriteria'].value;
  }

  get callType() {
    return this.callQualityForm.controls['callType'].value;
  }

  get userID() {
    return this.callQualityForm.controls['userID'].value;
  }

  get workLocationID() {
    return this.callQualityForm.controls['workLocationID'].value;
  }

  get roleID() {
    return this.callQualityForm.controls['roleID'].value;
  }

  setEndDate() {
    const timeDiff = this.maxEndDate.getTime() - this.startDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.startDate);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.callQualityForm.patchValue({
          endDate: this.maxEndDate
        })
      }
      if (diffDays <= 31) {
       this.checkForEndDateDifference();
      }
    } else {
     this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff =  this.today.getTime() - this.startDate.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxEndDate = new Date(this.startDate);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.callQualityForm.patchValue({
        endDate: this.maxEndDate
      })
    } else {
      this.callQualityForm.patchValue({
        endDate: this.today
      })
      this.maxEndDate = this.today;
    }
  }

  getSearchValues(searchCriteria) {
    if(searchCriteria == 'callTypeWise') {
      this.getCallTypes();
    }else if(searchCriteria == 'AgentWiseReport') {
      this.getUsers();
    }else if(searchCriteria == 'LocationWiseReport') {
      this.getWorkLocations();
    }else if(searchCriteria == 'SkillsetWiseReport') {
      this.getRoles();
    }
  }
  getCallTypes() {
    this.reportService.getCallTypes(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.callTypes = response.data;
    })
  }

  getUsers() {
    this.reportService.getUsers(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.users = response.data;
    })
  }

  getWorkLocations() {
    this.reportService.getWorkLocations(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.workLocations = response.data;
    })
  }

  getRoles() {
    this.reportService.getRoles(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.roles = response.data;
    })
  }

  searchReport() {
    let startDate: Date = new Date(this.callQualityForm.value.startDate);
    let endDate: Date = new Date(this.callQualityForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.callQualityForm.value));
    let reqObjForCallQualityReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "providerServiceMapID": this.callQualityForm.value.providerServiceMapID,
      "searchCriteria": this.callQualityForm.value.searchCriteria,
      "fileName": this.callQualityForm.value.searchCriteria,
      // "callTypeID": this.callQualityForm.value.callType
    }

    if(this.searchCriteria == 'callTypeWise') {
      reqObjForCallQualityReport['callTypeID'] = this.callQualityForm.value.callType
    }else if(this.searchCriteria == 'AgentWiseReport') {
      reqObjForCallQualityReport['userID'] = this.callQualityForm.value.userID
    }else if(this.searchCriteria == 'SkillsetWiseReport') {
      reqObjForCallQualityReport['roleID'] = this.callQualityForm.value.roleID
    }else if(this.searchCriteria == 'LocationWiseReport') {
      reqObjForCallQualityReport['workingLocationID'] = this.callQualityForm.value.workLocationID
    }

    console.log("Data form data", JSON.stringify(reqObjForCallQualityReport, null, 4));
    this.reportService.getCallQualityReport(reqObjForCallQualityReport).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForCallQualityReport.fileName+".xlsx");
        this.alertService.alert(this.currentLanguageSet.callQualityReportDownloaded);
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
    })


    // this.reportService.getCallQualityReport(reqObjForCallQualityReport).subscribe((response) => {
    //   console.log("Json data of response: ", JSON.stringify(response, null, 4));
    //   if (response.length > 0) {
    //     this.callQualityList = response;
    //     this.getResponseOfSearchThenDo();
    //   }else {
    //     this.alertService.alert(this.currentLanguageSet.noRecordFound);
    //   }
    // })
  }

  downloadReport(downloadFlag) {
    if (downloadFlag == true) {
      this.searchReport();
    }
  }

  getResponseOfSearchThenDo() {
    let criteria: any = [];
    criteria.push({ 'Filter_Name': 'Start_Date', 'value': moment(this.startDate).format('DD-MM-YYYY') });
    criteria.push({ 'Filter_Name': 'End_Date', 'value': moment(this.endDate).format('DD-MM-YYYY') });
    criteria.push({ 'Filter_Name': 'Search_Criteria', 'value': this.searchCriteria });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    console.log('this.callQualityList',this.callQualityList);
    
    if (this.callQualityList.length > 0) {
      let array = this.callQualityList.filter(function (obj) {
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
        let wb_name = this.searchCriteria;
        const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.callQualityList, { header: (head) });

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
      this.alertService.alert(this.currentLanguageSet.callQualityReportDownloaded);
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
