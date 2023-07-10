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


import { Component, OnInit } from "@angular/core";
import { MdDialog, MdDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-104-consent",
  templateUrl: "./consent-form.component.html",
  styleUrls: ["./consent-form.component.css"],
})
export class ConsentFormComponent implements OnInit {

  assignSelectedLanguageValue: any;

  constructor(
      private router: Router,
      private dialog: MdDialog,
      public dialogRef: MdDialogRef<ConsentFormComponent>,
      private httpServices: HttpServices
    ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  closeConsent(value){
    if(value === "yes") {
    this.dialogRef.close(true);
    } else {
        this.dialogRef.close(false);
    }
  }
}