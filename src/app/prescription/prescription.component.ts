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


import { Component, OnInit, Input, Inject, ViewChild, DoCheck, } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { CDSSService } from '../services/cdssService/cdss.service';
import { ResultFormat } from '../cdss/Result';
import { PrescriptionService } from '../services/prescriptionServices/prescription.service';
import { dataService } from '../services/dataService/data.service';
import { SearchService } from '../services/searchBeneficiaryService/search.service';
import { FeedbackResponseModel } from '../sio-grievience-service/sio-grievience-service.component';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';

declare var jQuery: any;
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { NgForm } from '@angular/forms';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'prescription',
  templateUrl: './prescription.component.html'
})
export class prescriptionComponent implements OnInit, DoCheck
 {
  serviceProviderID: any;
  providerServiceMapID: any;

  prescriptionObj: any;
  beneficiaryDetails: any;
  beneficiaryRegID: any;
  firstName: any;
  age: any;
  lastName: any;
  gender: any;
  commonData: any;
  prescriptionId: any;
  // showForm: any = true;
  frequency: any;
  drugGroups = [];
  drugList: any = [];
  currentPrescription = [];
  benCallID: any;
  calledServiceID: any;
  diagnosisProvided: any;
  dosage: any;
  usage: any;
  noOfDays: any;
  remarks: any;
  drugFrequency: any = [];
  _close: any;
  prescription_successfull: any;
  current_campaign: any;
  Strenghts = [];
  dataList: any = [];
  drugs: any = [];
  drugGroupID: any;
  drugName: any;
  drugMaster: any;
  prescriptionList: any;
  prescription: any;
  prescriptionHistory: any = false;
  addNAInStrengthDropdown: "Not Applicable";
  altNum: any = false;

  selectedDrug: any;
  filteredDrugGroup: any = [];
  presFlag: boolean;
  assignSelectedLanguageValue: any;

  prescriptionFormControl: FormControl = new FormControl();
  filteredDrugs: Observable<string[]>;
  drugNames: any = [];

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    private _smsService: SmsTemplateService,
    public searchBenData: SearchService,
    private prescriptionService: PrescriptionService,
    public dialogReff: MdDialogRef<prescriptionComponent>,
    public commonAppData: dataService,
    private alertMessage: ConfirmationDialogsService,
    private httpServices: HttpServices) {
    this.beneficiaryDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    this.serviceProviderID = this.commonAppData.providerID;
    this.providerServiceMapID = this.commonAppData.current_service.serviceID;
    this.current_campaign = this.commonAppData.current_campaign;

    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary && this.current_campaign == "INBOUND") {
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }
    else if (this.commonAppData.benRegID) {
      this.beneficiaryRegID = this.commonAppData.benRegID;
    }
    else {
      this.beneficiaryRegID = this.commonAppData.outboundBenID;
    }
  }
  prescriptionIdgiven: any;
  @ViewChild('prescriptionForm') prescriptionForm: NgForm;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.addNAInStrengthDropdown = "Not Applicable";
    if (this.current_campaign == "INBOUND") {
      this.beneficiaryRegID = this.commonAppData.benRegID
    }
    else if (this.current_campaign == "OUTBOUND") {
      this.beneficiaryRegID = this.commonAppData.outboundBenID
    }

    console.log(this.data, "prescription patient data");
    let lastName = this.data.lastName ? this.data.lastName : "";
    this.firstName = this.data.firstName + " " + lastName;
    // this.lastName = this.data.lastName;
    this.age = this.data.age;
    this.gender = this.data.gender;
    this.diagnosisProvided = this.data.psd; 
    this.presFlag = this.data.presFlag;
    this.prescriptionIdgiven = this.data.prescriptionID;
    this.prescriptionService.getDrugList(this.providerServiceMapID).subscribe(response => {
      if(response !== undefined && response !== null) {
        this.getDrugListSuccessHandeler(response)
      }
    });
    this.prescriptionService.getStrength(this.serviceProviderID).subscribe(response => this.getStrengthSuccessHandeler(response));
    this.searchBenData.getCommonData().subscribe(response => this.successHandeler(response));
    this.benCallID = this.beneficiaryDetails.benCallID;

    //commented, need testing,data already provided through dialoag
    /*
    if (this.beneficiaryDetails.i_beneficiary && this.current_campaign == "INBOUND") {
      // this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
      this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
      this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
      this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
    }     
    else {
      this.searchBenData.retrieveRegHistory(this.commonAppData.outboundBenID)
      .subscribe(response => this.benDataOnBenIDSuccess(response));
    }   */
    this.calledServiceID = this.commonAppData.current_service.serviceID;
    this.getPrescriptionList();
    this.prescriptionService.getDrugFrequency().subscribe((response) => {
      this.drugFrequencySuccess(response)
    }, (err) => { });

    this._close = this.assignSelectedLanguageValue.areYouSureWantToClose;
    this.prescription_successfull = this.assignSelectedLanguageValue.prescriptionSavedSuccessfully;
  }

  getStrengthSuccessHandeler(res) {
    this.Strenghts = res;                      
    /** Purpose: Requirement from PSMRI to add NA option in Strength dropdown (AN40085822) */
    this.Strenghts.push({                          
      drugStrength: this.addNAInStrengthDropdown
    })
  }
  getDrugListSuccessHandeler(response) {
    console.log("Drug list", response);
    this.drugList = response;
    this.drugList.forEach((names) => {
      this.drugNames.push(names.drugName);
    });
    this.filteredDrugs = this.prescriptionFormControl.valueChanges
    .startWith(null)
    .map((val) => (val ? this.filter(val) : this.drugNames.slice()));
  }
  filter(val: string): string[] {
    return this.drugNames.filter(
      (option) => option.toLowerCase().startsWith(val.toLowerCase())
    );
  }
  outboundBenDetail: any = [];
  benDataOnBenIDSuccess(resp) {
    this.outboundBenDetail = resp[0];
    this.benDataOutboundPopulating();
  }                                         ////can be commented, need testing,data already provided through dialoag
  benDataOutboundPopulating() {
    this.firstName = this.outboundBenDetail.firstName;
    //this.lastName = this.outboundBenDetail.lastName;
    this.gender = this.outboundBenDetail.m_gender.genderID;
    this.age = this.outboundBenDetail.age;
  }

  populateDrugGroup(drugName) {
    if (drugName !== undefined && drugName !== null) {
      this.drugGroupID = null;
      this.drugGroups = [];
      this.filteredDrugGroup = [];
      this.drugList.forEach((drug) => {
        if ((drug.drugName).toLowerCase() === drugName.toLowerCase()) {
          this.filteredDrugGroup.push(drug);
        }
      })
      this.drugGroups = this.filteredDrugGroup;
      this.prescriptionForm.form.patchValue({
        "drugGroupID": this.filteredDrugGroup
      })
    }
  }

  showCurrentPrescription: any = false;
  currentObject: any = {};
  addPrescription(values: any) {
    this.prescriptionForm.reset();
    this.showCurrentPrescription = true;
    this.drugList.forEach((drug) => {
      if ((drug.drugName).toLowerCase() === values.drugName.toLowerCase()) {
        this.currentPrescription.push(Object.assign(values, { "drugMapID": drug.drugMapID}))
      }
    })
    console.log(this.currentPrescription);
    this.prescriptionForm.form.patchValue({ 'diagnosisProvided': this.data.psd });
    

  }

  closePrescription() {
    this.alertMessage.confirm("Confirm Alert", this._close)
      .subscribe((response) => {
        if (response) {
          this.dialogReff.close();
        }
      })
  }

  savePrescription(sms_flag?, alternate_mobile_number?) {
    // this.currentPrescription.forEach(function(eachPrescription, index) {   
    this.prescriptionObj = {};
    // this.prescriptionObj.prescriptionID = this.prescriptionIdgiven;
    this.prescriptionObj.userID = this.commonAppData.uid;
    this.prescriptionObj.beneficiaryRegID = this.beneficiaryRegID;
    this.prescriptionObj.benCallID = this.benCallID;
    this.prescriptionObj.createdBy = this.commonAppData.Userdata.userName;
    this.prescriptionObj.providerServiceMapID = this.commonAppData.current_service.serviceID;

    if (this.currentPrescription.length > 0) {
      this.prescriptionObj.diagnosisProvided = this.currentPrescription[0].diagnosisProvided;
      this.prescriptionObj.remarks = (this.currentPrescription[0].remarks !== undefined && this.currentPrescription[0].remarks !== null) ? this.currentPrescription[0].remarks.trim() : null;
    }

    let prescribedDrugs = [];

    for (var i = 0; i < this.currentPrescription.length; i++) {
      console.log(this.currentPrescription[i]);

      let prescribedDrug = {
        drugMapID: this.currentPrescription[i].drugMapID,
        dosage: this.currentPrescription[i].dosage == this.addNAInStrengthDropdown ? "" : this.currentPrescription[i].dosage,
        drugRoute: this.currentPrescription[i].usage,
        noOfDays: this.currentPrescription[i].noOfDays,
        frequency: this.currentPrescription[i].frequency,
        timeToConsume: this.currentPrescription[i].timeToConsume,
        sideEffects: this.currentPrescription[i].sideEffects,
        //prescribedDrug.remarks = this.currentPrescription[i].remarks;
        deleted: false,
        createdBy: this.commonAppData.Userdata.userName,
      };

      prescribedDrugs.push(prescribedDrug);
    }

    this.prescriptionObj.prescribedDrugs = prescribedDrugs;

    let savingData = JSON.stringify(this.prescriptionObj);

    console.log("savingData: " + savingData);

    this.prescriptionService.savePrescription(savingData).subscribe((response) => {
      if(response !== undefined && response !== null) {
        this.prescription = this.successHandler(response);
      }
      if (this.prescription != undefined && sms_flag) {
        this.sendSMS(alternate_mobile_number, this.prescription);
      }
    }, (err) => {
      this.alertMessage.alert(err.status, 'error');
    });

    //  });
  }

  getPrescriptionList() {
    let dataa = {
      "beneficiaryRegID": this.beneficiaryRegID
    }
    console.log(dataa);
    this.prescriptionService.getPrescriptionList(dataa).subscribe(response => this.prescriptionList = this.successHandler(response));

  }

  successHandler(response) {

    this.commonAppData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

    this.prescriptionId = response.prescriptionID;
    var msgg = "prescription Given, prescription Id: " + this.prescriptionId;
    if (this.prescriptionId != undefined) {
      // this.showForm = false;
      this.dialogReff.close(response.prescriptionID);
      this.alertMessage.alert(this.prescription_successfull + this.prescriptionId, 'success');
      this.getPrescriptionList();
    }
    else {
      this.dataList = response;
      console.log(this.dataList);
    }

    return response;
  }
  successHandeler(response) {
    console.log("common data", response);
    this.commonData = response;
  }
  prescriptionListSuccessHandeler(response) {

    console.log("getPrescriptionList::response " + response);
    this.dataList = response;
  }


  save_and_sendSMS(alternate_mobile_number) {
    console.log(alternate_mobile_number + "-->fetch number from service if not alternative");
    this.savePrescription(true, alternate_mobile_number);
  }

  sendSMS(alternate_mobile_number, prescription_data) {
    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.commonAppData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (response[i].smsType.toLowerCase() === 'Prescription SMS'.toLowerCase()) {
                smsTypeID = response[i].smsTypeID;
                break;
              }
            }
          }
        }

        if (smsTypeID != '') {
          this._smsService.getSMStemplates(this.providerServiceMapID,
            smsTypeID).subscribe(res => {
              if (res != undefined) {
                if (res.length > 0) {
                  for (let j = 0; j < res.length; j++) {
                    if (res[j].deleted === false) {
                      sms_template_id = res[j].smsTemplateID;
                      break;
                    }
                  }

                }

                if (smsTypeID != '') {

                  let reqArr = [];
                  for (var i = 0; i < prescription_data.prescribedDrugs.length; i++) {
                    let reqObj = {
                      "alternateNo": alternate_mobile_number,
                      'beneficiaryRegID': this.beneficiaryRegID,
                      "prescribedDrugID": prescription_data.prescribedDrugs[i].prescribedDrugID,
                      "createdBy": this.commonAppData.Userdata.userName,
                      "is1097": false,
                      "providerServiceMapID": this.providerServiceMapID,
                      "smsTemplateID": sms_template_id,
                      "smsTemplateTypeID": smsTypeID
                      // "userID": 0
                    }
                    reqArr.push(reqObj);
                  }


                  this._smsService.sendSMS(reqArr)
                    .subscribe(ressponse => {
                      console.log(ressponse, 'SMS Sent');
                      this.alertMessage.alert(this.assignSelectedLanguageValue.smsSent, 'success');
                    }, err => {
                      console.log(err, 'SMS not sent Error');
                    })
                }
              }
            }, err => {
              console.log(err, 'Error in fetching sms templates');
            })
        }



      }, err => {
        console.log(err, 'error while fetching sms types');
      })

  }



  showPrescriptionHistory() {
    console.log("d");
    this.prescriptionHistory = true;
  }
  hidePrescriptionHistory() {
    this.prescriptionHistory = false;
  }
  validNumber: any = false;
  mobileNum(value) {
    if (value.length == 10) {
      this.validNumber = true;
    }
    else {
      this.validNumber = false;
    }
  }
  count: any;
  updateCount() {
    this.count = this.diagnosisProvided.length + '/300';
  }

  drugFrequencySuccess(res) {
    if (res.length > 0)

      this.drugFrequency = res;
  }
  editCurrentPrescription(prescription, index) {
    this.filter(prescription.drugName);
    this.prescriptionForm.form.patchValue({
      "diagnosisProvided": prescription.diagnosisProvided,
      "drugGroupID": prescription.drugGroupID,
      "drugName": prescription.drugName,
      "usage": prescription.usage,
      "dosage": prescription.dosage == this.addNAInStrengthDropdown ? "" : prescription.dosage,
      "frequency": prescription.frequency,
      "noOfDays": prescription.noOfDays,
      "remarks": prescription.remarks
    });
    this.currentPrescription.splice(index, 1);
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
