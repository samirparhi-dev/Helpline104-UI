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


import { Component, OnInit, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FeedbackTypes } from "../services/common/feedbacktypes.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-change-log-modal',
  templateUrl: './change-log-modal.component.html',
  styleUrls: ['./change-log-modal.component.css']
})
export class ChangeLogModalComponent implements OnInit {
  feedbackLogs: any = [];
  currentLanguageSet: any;

  constructor(
    public dialogRef: MdDialogRef<ChangeLogModalComponent>,
    @Inject(MD_DIALOG_DATA) public input: any,
    private feedbackService: FeedbackTypes,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
    console.log("change log", this.input.feedbackID);
    this.showFeedbackLog();
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  ngDoCheck() {
    this.currentLanguageSetValue();
  }    
  
  showFeedbackLog() {
    this.feedbackService.showFeedbackLog(this.input).subscribe((response) => {
      this.feedbackLogs = response;
    }, (err) => {
      console.log("error", err);
    })
  }
}
