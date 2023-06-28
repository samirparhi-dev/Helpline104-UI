import { Component, DoCheck, OnInit } from '@angular/core';
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
  selector: 'app-supervisor-quality-report',
  templateUrl: './supervisor-quality-report.component.html',
  styleUrls: ['./supervisor-quality-report.component.css']
})
export class SupervisorQualityReportComponent implements OnInit, DoCheck {

  currentLanguageSet: any;

  qualityReportForm: FormGroup;
  // reportTypes:any=["DS used valid calls at MO",
  //   "HAHT disconnected calls",
  //   "HAHT valid calls closed at HAO",
  //   "LAHT Algorithm calls",
  //   "LAHT Transfer calls to MO",
  //   "Other Advice calls",
  //   "Random Pickup",
  //   "Call Analysis Report"]
  reportTypes:any=[];
  array: any;
  show: boolean=false;
  xlName: any;
  constructor(private reportService: ReportService, 
  public saved_data: dataService, 
  private alertService: ConfirmationDialogsService, 
  private formBuilder: FormBuilder, 
  public HttpServices: HttpServices) { }

  providerServiceMapID: any;
  today: Date;
  minEndDate: Date;
  maxEndDate: Date;
  dateOffset: any;

  qualityReportList:Array<any> = [];
  roles:Array<any> = [];

  ngOnInit() {
    this.assignSelectedLanguage();

    this.providerServiceMapID = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.createQualityReportFormForm();

    this.reportService.getReportTypes(this.saved_data.current_service.serviceID).subscribe((response) => {
      console.log('report Types: ', response.data);
      
      this.array = response.data.qaReportTypes;console.log('report Types2: ',this.array);
      for(var i=0;i<this.array.length;i++)
      this.reportTypes.push(this.array[i]);
      
    })
    this.today = new Date();
    this.today.setHours(23, 59, 59, 0);
    this.dateOffset = (24 * 60 * 60 * 1000);
    this.maxEndDate = new Date();
    this.maxEndDate.setHours(23, 59, 59, 59);
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

  createQualityReportFormForm() {
    this.qualityReportForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      providerServiceMapID: this.providerServiceMapID.providerServiceMapID,
      roleID: null,
      agentID: null,
      reportType:null,
      reportTypeID:null,
      report:[null, Validators.required]//report.QAreportTypeID
    })
  }

  get startDate() {
    return this.qualityReportForm.controls['startDate'].value;
  }

  get endDate() {
    return this.qualityReportForm.controls['endDate'].value;
  }

  get roleID() {
    return this.qualityReportForm.controls['roleID'].value;
  }

  get agentID() {
    return this.qualityReportForm.controls['agentID'].value;
  }

 
  checkEndDate() {
    const timeDiff = this.maxEndDate.getTime() - this.startDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.startDate);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.qualityReportForm.patchValue({
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
      this.qualityReportForm.patchValue({
        endDate: this.maxEndDate
   })
    } else {
      this.qualityReportForm.patchValue({
        endDate: this.today
   })
      this.maxEndDate = this.today;
    }
  }

  getRoles() {
    this.reportService.getRoles(this.providerServiceMapID).subscribe((response) => {
      //console.log('Feedback Types: ', response);
      this.roles = response.data;
    })
  }

onReportType()
{
  if(this.qualityReportForm.value.report.QAreportTypeID != 8) {
    this.show=false;
    this.qualityReportForm.controls['roleID'].reset();
    this.qualityReportForm.controls['agentID'].reset();
  } else {
    this.show=true;
  }
}

  searchReport() {
    let startDate: Date = new Date(this.qualityReportForm.value.startDate);
    let endDate: Date = new Date(this.qualityReportForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    console.log("Data form value...", JSON.stringify(this.qualityReportForm.value));
    
    
    let reqObjForQualtiyReport = {
      "startDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "providerServiceMapID": this.qualityReportForm.value.providerServiceMapID,
      "agentID": this.qualityReportForm.value.agentID ? this.qualityReportForm.value.agentID : null,
      "roleName": this.qualityReportForm.value.roleID ? this.qualityReportForm.value.roleID : null,
      "reportTypeID":this.qualityReportForm.value.report.QAreportTypeID,
      "reportType":this.qualityReportForm.value.report.ReportType,
      "fileName": this.qualityReportForm.value.report.ReportType.replace(/ /g, "_")
    }

   
    
    

    console.log("Data form data", JSON.stringify(reqObjForQualtiyReport, null, 4));

    this.reportService.getQualityReport(reqObjForQualtiyReport).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  reqObjForQualtiyReport.fileName+".xlsx");
        this.alertService.alert(this.qualityReportForm.value.report.ReportType +' '+this.currentLanguageSet.reportDownloaded);
        // this.qualityReportList = response;
        // console.log("RESPONSE, ", this.qualityReportList);
        // this.getResponseOfSearchThenDo();
      }else {
        this.alertService.alert(this.currentLanguageSet.noDataFound);
      }
    }, (error) => {
      console.log(error);
      // this.alertService.alert(error, 'error');
      if(error.status === 500)
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
    criteria.push({ 'Filter_Name': 'Start_Date', 'value':  moment(this.startDate).format('DD-MM-YYYY') });
    criteria.push({ 'Filter_Name': 'End_Date', 'value':  moment(this.endDate).format('DD-MM-YYYY') });
    criteria.push({ 'Filter_Name': 'RoleID', 'value': this.roleID });
    criteria.push({ 'Filter_Name': 'AgentID', 'value': this.agentID });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (this.qualityReportList.length > 0) {
      let array = this.qualityReportList.filter(function (obj) {
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
        //let wb_name = "104 QA Report";
        let wb_name = this.qualityReportForm.value.report.ReportType;
        this.xlName=wb_name;
        const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
        const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.qualityReportList, { header: (head) });

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
      this.alertService.alert(this.xlName+' '+this.currentLanguageSet.reportDownloaded);
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
