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


import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef } from '@angular/material';
import { CallServices } from 'app/services/callservices/callservice.service';
import { dataService } from 'app/services/dataService/data.service';
import { ConfirmationDialogsService } from 'app/services/dialog/confirmation.service';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SearchService } from 'app/services/searchBeneficiaryService/search.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { empty } from 'rxjs/Observer';


@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css']
})
export class ScheduleAppointmentComponent implements OnInit {

  public shown = false;
  public format = 'hh:mm tt';
  providerServiceMapID: any;
  village: any;
  subDistricts: any = [];
  subDistrict : any;
  
  // isaltNumberText : boolean=false;
  currentDate = new Date();
  validFrom: Date;
  validTill: Date;
  today: Date;
  maxEndDate: Date;
  max: any;
  // minDate = new Date();
  blockTypeObj : any;
  blockMastertypes: Array<any> = [];
  cityID: any;
  districtID : any;
  subDistrictID : any;
  temp:any=[];
  blocks: any = [];
  current_role : any;
  roleFlag : boolean = true;
  facilityCode : string
  choName : string
  altMobileNumber : string
  appTime : string;
  beneficiaryRegID: any;
  beneficiaryCallID: any;
  beneficiaryPhoneNum: any;
  facilityMasterblocks : any =[];
  faciltyAppointmentForm : any;
  currentLanguageSet: any;
  minDate: string;
  maxDate: string;
  enableTimeValidation: boolean = true;
  

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
public dialog: MdDialog,
    public dialogReff: MdDialogRef<ScheduleAppointmentComponent>,
    public commonDataService: dataService,
    private _callServices: CallServices,
    private saved_data: dataService,
    private util: SearchService,
    public alertService: ConfirmationDialogsService,
    private fb: FormBuilder,
    private httpServices: HttpServices,
  ) {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Add one day to the current date
    this.minDate = tomorrow.toISOString().slice(0, 16);
    this.faciltyAppointmentForm = this.fb.group({
      subDistrict : null,
      facilityName : null,
      facilityCode : null,
      choName : null,
      appointmentDateTime : null,
      checkBox : null,
      altMobileNumber : null, 
      employeeCode : null,
      hfrId : null,
      benRegId : null,
      benCallId : null,
      createdBy : null,
      facilityPhoneNo : null
    })
    
    }
   
  

  ngOnInit() {
    this.setTodaydate();
    this.districtID=this.saved_data.districtID;
    this.getBlockMaster();
    // this.getFaciliyMaster();
    this.beneficiaryRegID=this.saved_data.benRegID
    this.beneficiaryCallID=this.saved_data.benCallID
    this.beneficiaryPhoneNum=sessionStorage.getItem("CLI");
    
    
  
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.assignSelectedLanguage();
    
    // let requestObject = {
    //   providerServiceMapID: this.saved_data.current_service.serviceID,
    // };
    // this._callServices.getBlockMaster(requestObject).subscribe(
    //   (response) => {
    //     this.blockTypeObj = response;
    //      this.populateBlockMaster(response);
    //   },
    //   (err) => {}
    // )
  }

  ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  

  setTodaydate() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.validFrom = this.today;
    this.maxEndDate = new Date();
    // this.maxEndDate.setHours(23, 59, 59, 0);
    this.maxEndDate.setHours(23, 59, 59, 0);
    this.validTill = this.maxEndDate;
  }
  getBlockMaster(){
    // let response={
    //   "data": [
    //     {
    //       "blockID": 445,
    //       "blockName": "Balod"
    //     },
    //     {
    //       "blockID": 1617,
    //       "blockName": "Dondi"
    //     },
    //     {
    //       "blockID": 1618,
    //       "blockName": "Dondi Luhara"
    //     },
    //     {
    //       "blockID": 2018,
    //       "blockName": "Gunderdehi"
    //     },
    //     {
    //       "blockID": 2041,
    //       "blockName": "Gurur"
    //     }
    //   ],
    //   "statusCode": 200,
    //   "errorMessage": "Success",
    //   "status": "Success"
    // }
    
    this.util
      .getSubDistricts(this.districtID)
      .subscribe((response) => {
        if(response){
        this.blocks = response;
        
          if(this.commonDataService.blockID!=undefined && this.commonDataService.blockID!=null){
            this.blocks.filter((res) => {
              if(this.commonDataService.blockID==res.blockID){
                this.faciltyAppointmentForm.controls["subDistrict"].patchValue(res.blockName);
                this.getFaciliyMaster();
              }


            });
          }
        }
      });
      (err) => {
        this.alertService.alert(err.errorMessage, "error");
      }
  

  }
  getFaciliyMaster(){
    let requestObject={
      "providerServiceMapID" : this.providerServiceMapID,
      "blockName" : this.faciltyAppointmentForm.controls.subDistrict.value
    };
    
    this.faciltyAppointmentForm.controls["facilityName"].patchValue(null);
    this.faciltyAppointmentForm.controls["facilityCode"].patchValue(null);
    this.faciltyAppointmentForm.controls["choName"].patchValue(null);
    this.faciltyAppointmentForm.controls["employeeCode"].patchValue(null);
    this.faciltyAppointmentForm.controls["hfrId"].patchValue(null);
    this.faciltyAppointmentForm.controls["facilityPhoneNo"].patchValue(null);
    this.util
      .getFaciliyMaster(requestObject)
      .subscribe((response) => {
        this.facilityMasterblocks = response;

      });
      // this.facilityMasterblocks= 
      // [
      //   {
      //     "facilityName": "Trivediganj Facility",
      //     "facilityCode": "FC561",
      //     "choName": "Trivediganj CHO",
      //     "employeeCode": "100017",
      //     "hfrId": "IN0910024170",
      //     "facilityPhoneNo": "7568456784"
      //   },
      //   {
      //     "facilityName": "Trivediganj Facility 2",
      //     "facilityCode": "FC562",
      //     "choName": "Trivediganj CHO 2",
      //     "employeeCode": "100018",
      //     "hfrId": "IN0910024171",
      //     " facilityPhoneNo ": "7568456781"
      //   }
      // ];
    

  }
  showFaciliyCodeAndCho(item){
    this.faciltyAppointmentForm.controls["facilityCode"].patchValue(item.facilityCode);
    this.faciltyAppointmentForm.controls["choName"].patchValue(item.employeeName);
    this.faciltyAppointmentForm.controls["employeeCode"].patchValue(item.employeeCode);
    this.faciltyAppointmentForm.controls["hfrId"].patchValue(item.hfrId);
    this.faciltyAppointmentForm.controls["facilityPhoneNo"].patchValue(item.presentMobileNo);
    

  }

  openMobileNumberFeild(event){
    this.faciltyAppointmentForm.controls["altMobileNumber"].patchValue(null);
    if(event.checked){
      this.shown=true;
    }
    else{
      this.shown=false;
    }
    
  }

  setAppointmentValue(){
    let requestObject={
      
      "blockName" : this.faciltyAppointmentForm.controls.subDistrict.value,
      "facilityName" : this.faciltyAppointmentForm.controls.facilityName.value,
      "facilityCode" : this.faciltyAppointmentForm.controls.facilityCode.value,
      "choName" : this.faciltyAppointmentForm.controls.choName.value,
      "employeeCode" : this.faciltyAppointmentForm.controls.employeeCode.value,
      "hfrId" : this.faciltyAppointmentForm.controls.hfrId.value,
      "facilityPhoneNo" : this.faciltyAppointmentForm.controls.facilityPhoneNo.value,
      "appointmentDate" : this.faciltyAppointmentForm.controls.appointmentDateTime.value + ":00.000Z",
      "benRegId" : this.beneficiaryRegID,
      "benCallId" : this.beneficiaryCallID,
      "alternateMobNo" : (this.faciltyAppointmentForm.controls.altMobileNumber.value != undefined && this.faciltyAppointmentForm.controls.altMobileNumber.value != null 
        && this.faciltyAppointmentForm.controls.altMobileNumber.value != " ") ? this.faciltyAppointmentForm.controls.altMobileNumber.value : this.beneficiaryPhoneNum,
      "createdBy" : this.commonDataService.Userdata.userName,
      "providerServiceMapID" : this.providerServiceMapID

    };

    this.util
      .saveAppointmentDetails(requestObject)
      .subscribe((response) => {
        if(response){
          this.alertService.alert(this.currentLanguageSet.appointmentScheduledSuccessfully,'success');
          this.dialogReff.close(true);
        }
        else{
          this.alertService.alert(this.currentLanguageSet.issueWhileSchedulingAppointmnet,'error');
          
        }

      },
      (err) => {
        
        this.alertService.alert(err.errorMessage, "error");
        
        }
      );
      
  }

  closePopup(){
    this.dialogReff.close();
  }

  onDateChoose(){
    let minTime: any;
    let maxTime: any;
    let time: any;
    minTime = "10:00";
    maxTime = "13:00";
    let splitMintime = minTime.split(":");
    let splitMaxtime = maxTime.split(":");
    let minTimeInMinutes = parseInt(splitMintime[0] * 60 + splitMintime[1]);
    let maxTimeInMinutes = parseInt(splitMaxtime[0] * 60 + splitMaxtime[1]);

    let appointmentTime = this.faciltyAppointmentForm.controls.appointmentDateTime.value;
    time = appointmentTime.split("T");
    let splitTime = time[1].split(":");
    let chooseTime = parseInt(splitTime[0] * 60 + splitTime[1]);
    console.log(minTime, maxTime, appointmentTime);
    if(chooseTime >= minTimeInMinutes && chooseTime <= maxTimeInMinutes){
      this.enableTimeValidation = false;
    } else {
      this.enableTimeValidation = true;
    }

  }

}
