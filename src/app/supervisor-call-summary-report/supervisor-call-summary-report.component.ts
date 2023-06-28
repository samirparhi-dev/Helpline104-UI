import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

import { ReportService } from '../services/report-services/report.service';
import * as XLSX from 'xlsx/xlsx';
import { CallServices } from '../services/callservices/callservice.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';
import * as moment from "moment";
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-supervisor-call-summary-report',
  templateUrl: './supervisor-call-summary-report.component.html',
  styleUrls: ['./supervisor-call-summary-report.component.css']
})
export class SupervisorCallSummaryReportComponent implements OnInit {

  callSummaryReportForm: FormGroup;

  constructor(private reportService: ReportService, public saved_data: dataService, private alertService: ConfirmationDialogsService,
    private formBuilder: FormBuilder,
    private _callServices: CallServices,public HttpServices: HttpServices) { }

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxDate: any;
  maxEndDate: Date;
  dateOffset: any;
  calltypes: Array<any> = [];
  callType: any;
  callTypeObj: any;
  callSubTypes: any = [];
  callSummaryReportList:Array<any> = [];
  roles:Array<any> = [];
  currentLanguageSet: any;

  ngOnInit() {
    this.currentLanguageSetValue();
    this.providerServiceMapID = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.createCallSummaryReportForm();
    this.today = new Date();
    this.today.setHours(23, 59, 59, 0);
    this.dateOffset = (24 * 60 * 60 * 1000);
    this.maxEndDate = new Date();
    this.maxEndDate.setHours(23, 59, 59, 59);
    this.getRoles();
    let requestObject = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this._callServices.getCallTypes(requestObject).subscribe(response => {
      this.callTypeObj = response;
      console.log("this.callTypeObj", this.callTypeObj);
      this.populateCallTypes(response)
    }, (err) => {
    });
  }

  currentLanguageSetValue() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
	  
	  ngDoCheck() {
		this.currentLanguageSetValue();
	  }    

  createCallSummaryReportForm() {
    this.callSummaryReportForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      roleID: null,
      agentID: null,
      callType: null,
      subCallTypeID: null
    })
  }

  get startDate() {
    return this.callSummaryReportForm.controls['startDate'].value;
  }

  get endDate() {
    return this.callSummaryReportForm.controls['endDate'].value;
  }

  get roleID() {
    return this.callSummaryReportForm.controls['roleID'].value;
  }

  get agentID() {
    return this.callSummaryReportForm.controls['agentID'].value;
  }

  get calltype() {
    return this.callSummaryReportForm.controls['callType'].value;
  }
  get subCallTypeID() {
    return this.callSummaryReportForm.controls['subCallTypeID'].value;
  }
 
  checkEndDate() {
    const timeDiff = this.maxEndDate.getTime() - this.startDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.startDate);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.callSummaryReportForm.patchValue({
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
      this.callSummaryReportForm.patchValue({
        endDate: this.maxEndDate,
      });
    } else {
      this.maxEndDate = this.today;
      this.callSummaryReportForm.patchValue({
        endDate: this.maxEndDate,
      });
    }
  }
  getRoles() {
    this.reportService.getRoles(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.roles = response.data;
    })
  }

  populateCallTypes(response: any) {


    this.calltypes = response;
    // let valid = response.filter((item) => {
    //   if (item.callGroupType === 'Valid') {
    //     return item.callGroupType;
    //   }
    // })
    // this.callType = valid[0].callGroupType;
    // if (this.callType === 'Valid') {
    //   this.getCallSubType(this.callType);
    // }
  }
  filteredCallSubTypes: any = [];
  getCallSubType(calltype) {

    //   console.log("callType: " + callType);
    this.filteredCallSubTypes = [];
     this.callSummaryReportForm.controls['subCallTypeID'].reset();
    // this.callType = callType;
    console.log("Call Type:"+calltype)
    this.callTypeObj.filter((item) => {
      if(item.callGroupType === calltype) {
        this.filteredCallSubTypes.push(item.callTypes)
      }
    })
    this.callSubTypes = this.filteredCallSubTypes[0];

    console.log("Call Sub Types:"+ this.callSubTypes[0])

    }

  searchReport() {
    let startDate: Date = new Date(this.callSummaryReportForm.value.startDate);
    let endDate: Date = new Date(this.callSummaryReportForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.callSummaryReportForm.value));
    
    let reqObjForCallSummaryReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "providerServiceMapID": this.callSummaryReportForm.value.providerServiceMapID,
      "agentID": this.callSummaryReportForm.value.agentID ? this.callSummaryReportForm.value.agentID : null,
      "roleName": this.callSummaryReportForm.value.roleID ? this.callSummaryReportForm.value.roleID : null,
      "callTypeName": this.callSummaryReportForm.value.callType ? this.callSummaryReportForm.value.callType.callGroupType : null,
      "callTypeID": this.callSummaryReportForm.value.subCallTypeID ? this.callSummaryReportForm.value.subCallTypeID.callTypeID : null,
      "fileName": "Call_Summary_Report"
    }
    console.log("Data form data", JSON.stringify(reqObjForCallSummaryReport, null, 4));

    this.reportService.getCallSummaryReport(reqObjForCallSummaryReport).subscribe((response) => {
      console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForCallSummaryReport.fileName+".xlsx");
        this.alertService.alert(this.currentLanguageSet.callSummaryReportDownloaded);
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
    criteria.push({ 'Filter_Name': 'RoleID', 'value': this.roleID });
    criteria.push({ 'Filter_Name': 'AgentID', 'value': this.agentID });
    criteria.push({ 'Filter_Name': 'callTypeName', 'value': this.calltype ? this.calltype.callGroupType : null});
    criteria.push({ 'Filter_Name': 'callTypeID', 'value': this.subCallTypeID ? this.subCallTypeID.callTypeID : null });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.callSummaryReportList.length > 0) {
      let array = this.callSummaryReportList.filter(function (obj) {
        for (var key in obj) {
          if (obj[key] == null) {
            obj[key] = "";
          }
        }
        return obj;
      });
      if (array.length != 0) {
         var head = Object.keys(array[0]);
       // console.log('this.callTypes',this.callTypes);
        
        //var head = this.callTypes.map((callType) => {
          //console.log('callType',callType);
          //return callType.callType;
        //)};
        console.log(" head", head);
        //head.splice(0,0, "District")
        let wb_name = "Call Summary Report";
        const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.callSummaryReportList, { header: (head) });

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
      this.alertService.alert(this.currentLanguageSet.callSummaryReportDownloaded);
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
