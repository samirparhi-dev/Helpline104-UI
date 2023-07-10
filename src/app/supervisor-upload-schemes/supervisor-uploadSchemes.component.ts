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


import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from "../services/config/config.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../services/notificationService/notification-service';
import { SchemeService } from '../services/sioService/sio-scheme.service';
declare var jQuery: any;
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";

@Component({
  selector: 'app-upload-schemes',
  templateUrl: './supervisor-uploadSchemes.component.html'
})
export class SupervisorSchemeComponent implements OnInit {
  maxFileSize = 5;
  reportsURL: any;
  fileList: FileList;
  error1: boolean = false;
  error2: boolean = false;
  file: any;
  fileContent: any;
  validTill: Date;
  validFrom: Date;
  providerServiceMapID: any;
  createdBy: any;
  userId: any;
  postData: any;
  agentData: any;
  fileName: any;
  dd: any;
  MM: any;
  yyyy: any;
  mode: any;
  notUploaded: boolean = false;
  showTable: boolean = true;
  schemeList:Array<any> = [];
  Scheme_Name: any;
  Scheme_Desp: any;
  create: boolean;
  scheme_ID: any;
  upload: any;
  count: any;
  kmFileManagerID: any;

  valid_file_extensions = ['msg', 'pdf', 'png', 'jpeg', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt'];
  invalid_file_flag: boolean = false;

  @ViewChild('schemeForm') schemeForm: NgForm;
  currentLanguageSet: any;
  invalidFileNameFlag:boolean = false;

  constructor(private saved_data: dataService, private schemeService: SchemeService,
    private _config: ConfigService,
    public sanitizer: DomSanitizer, private message: ConfirmationDialogsService,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.createdBy = this.saved_data.Userdata.userName; 
    this.agentData = this.saved_data.Userdata;
    this.userId = this.saved_data.uid;
    var obj = {
      "providerServiceMapID": this.providerServiceMapID
    }
    this.schemeService.getSchemeList(obj).subscribe(response => this.getSchemesSuccess(response));

  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  onFileUpload(event) {
    this.file = undefined;
    this.fileList = event.target.files;
    if (this.fileList.length == 0) {
      this.error1 = true;
      this.error2 = false;
      this.invalid_file_flag = false;
      this.invalidFileNameFlag=false;
    }
    else {
    this.file = event.target.files[0];
    if (this.file) {

    let fileNameExtension = this.file.name.split(".");
    let fileName = fileNameExtension[0];

    if(fileName !== undefined && fileName !== null && fileName !== "") {
    var validFormat = this.checkExtension(this.file);
    if (validFormat) {
      if ((this.fileList[0].size / 1000 / 1000) > this.maxFileSize) {
        this.error2 = true;
        this.error1 = false;
        this.invalid_file_flag = false;
        this.invalidFileNameFlag=false;
      }
      else {
        this.error1 = false;
        this.error2 = false;
        this.invalid_file_flag = false;
        this.invalidFileNameFlag=false;
        const myReader: FileReader = new FileReader();
        myReader.onloadend = this.onLoadFileCallback.bind(this)
        myReader.readAsDataURL(this.file);
        this.invalid_file_flag = false;
    }
  } else {
      this.invalid_file_flag = true;
      this.error1 = false;
      this.error2 = false;
      this.invalidFileNameFlag=false;
      }
    } 
      else {
      this.invalidFileNameFlag=true;
      this.error1 = false;
      this.error2 = false;
      this.invalid_file_flag = false;
      }
    }
      else {
        this.invalid_file_flag = false;
      }
}

}

  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

  checkExtension(file) {
    var count = 0;
    console.log("FILE DETAILS", file);
    if (file) {
      var array_after_split = file.name.split(".");
      if(array_after_split.length == 2) {
      var file_extension = array_after_split[array_after_split.length - 1];
      for (let i = 0; i < this.valid_file_extensions.length; i++) {
        if (file_extension.toUpperCase() === this.valid_file_extensions[i].toUpperCase()) {
          count = count + 1;
        }
      }

      if (count > 0) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  }
    else {
      return true;
    }
  }

  schemeObj: any = {};
  onSubmit() {

    console.log(this.schemeForm.value);
    if (this.file && this.fileContent) {
      this.schemeObj = {};
      this.schemeObj.providerServiceMapID = this.providerServiceMapID;
      this.schemeObj.schemeName = this.Scheme_Name ? this.Scheme_Name.trim() : null;
      this.schemeObj.schemeDesc = this.schemeForm.value.schemeDesc ? this.schemeForm.value.schemeDesc.trim() : null;
      this.schemeObj.deleted = false;
      this.schemeObj.createdBy = this.agentData.userName;

      this.schemeObj.kmFileManager = {};
      this.schemeObj.kmFileManager.fileName = this.file.name;
      this.schemeObj.kmFileManager.fileExtension = '.' + this.file.name.split('.')[1];
      this.schemeObj.kmFileManager.providerServiceMapID = this.providerServiceMapID;
      this.schemeObj.kmFileManager.userID = this.userId;
      this.schemeObj.kmFileManager.fileContent = this.fileContent.split(',')[1];
      this.schemeObj.kmFileManager.createdBy = this.agentData.userName;


      //this.fileName = this.file.name;
      if (this.scheme_ID) {
        this.schemeObj.schemeID = this.scheme_ID;
      }
    }
    else {
      this.schemeObj = {};
      this.schemeObj.providerServiceMapID = this.providerServiceMapID;
      this.schemeObj.schemeName = this.Scheme_Name ? this.Scheme_Name.trim() : null;
      this.schemeObj.schemeDesc = this.schemeForm.value.schemeDesc ? this.schemeForm.value.schemeDesc.trim() : null;
      this.schemeObj.deleted = false;
      this.schemeObj.createdBy = this.agentData.userName;

      this.schemeObj.kmFileManager = {};
      this.schemeObj.kmFileManager.userID = this.userId;
      this.schemeObj.kmFileManager.createdBy = this.agentData.userName;
      this.schemeObj.kmFileManager.deleted = false;
      this.schemeObj.kmFileManager.providerServiceMapID = this.providerServiceMapID;

      if (this.scheme_ID) {
        this.schemeObj.schemeID = this.scheme_ID;
        if (this.kmFileManagerID) {
          this.schemeObj.kmFileManagerID = this.kmFileManagerID;
        }
      }
    }

    this.schemeService.saveScheme(this.schemeObj).subscribe(response => this.successHandler(response)),
      (error: any) => this.errorHandler(error);

  }
  schemeData: any;
  successHandler(response) {
    this.schemeData = response;
    this.notUploaded = false;
    jQuery("#schemeFormm").trigger("reset");
    var obj = {
      "providerServiceMapID": this.providerServiceMapID
    }
    this.schemeService.getSchemeList(obj).subscribe(response => this.getSchemesSuccess(response));

    if (this.scheme_ID) {
      this.message.alert(this.currentLanguageSet.schemeModifiedSuccessfully, 'success');
      this.scheme_ID = undefined;
    }
    else {
      this.message.alert(this.currentLanguageSet.schemeStoredSuccessfully, 'success');
    }
    this.showTable = true;
    this.count = '0/300';
    this.kmFileManagerID = "";
    this.file = "";
    this.fileContent = "";
    this.file = undefined;
    this.error1 = false;
    this.error2 = false;
    this.invalid_file_flag = false;
    this.invalidFileNameFlag=false;
  }

  errorHandler(error) {
    alert(this.currentLanguageSet.errorOccurred);
    this.notUploaded = true;
  }
  createScheme() {
    this.create = true;
    this.showTable = false;
    jQuery("#schemeFormm").trigger("reset");

  }
  getSchemesSuccess(res) {
    if (res.length > 0)
      this.schemeList = res;
  }
  editScheme(scheme) {
    this.create = false;
    this.showTable = false;
    this.Scheme_Name = scheme.schemeName;
    this.Scheme_Desp = scheme.schemeDesc;
    this.scheme_ID = scheme.schemeID;
    this.kmFileManagerID = scheme.kmFileManagerID;
    this.fileName = scheme.kmFileManager? scheme.kmFileManager.fileName: "";
    this.notUploaded = scheme.kmFileManager? true : false;
    this.updateCount();
  }
  change() {
    this.showTable = true;
    this.invalid_file_flag = false;
    this.file = undefined;
    this.error1 = false;
    this.error2 = false;
    this.invalid_file_flag = false;
    this.invalidFileNameFlag=false;

    this.count = '0/300';
    this.kmFileManagerID = "";
    this.file = "";
    this.fileContent = "";
  }
  acti_Deactivate(id, deleteStatus) {
    var obj = {
      "schemeID": id,
      "deleted": deleteStatus
    }
    this.schemeService.acti_DeactivateScheme(obj).subscribe(response => this.acti_DeactivateSchemesSuccess(response, deleteStatus));

  }
  acti_DeactivateSchemesSuccess(res, deleteStatus) {
    if (res) {
      if (deleteStatus === true) {
        this.message.alert(this.currentLanguageSet.schemeDeactivatedSuccessfully, 'success');
      }
      if (deleteStatus === false) {
        this.message.alert(this.currentLanguageSet.schemeActivatedSuccessfully, 'success');
      }
    }
    var obj = {
      "providerServiceMapID": this.providerServiceMapID
    }
    this.schemeService.getSchemeList(obj).subscribe(response => this.getSchemesSuccess(response));
  }
  updateCount() {
    this.count = this.Scheme_Desp.length + '/300';
  }
}
