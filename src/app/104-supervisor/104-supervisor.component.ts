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


import { Component, OnInit, Input, DoCheck, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-104-supervisor",
  templateUrl: "./104-supervisor.component.html",
  styleUrls: ["./104-supervisor.component.css"],
})
export class Supervisor_104_Component implements OnChanges, OnInit, DoCheck {
  assignSelectedLanguageValue: any;
  // setting default as agent status screen
  Activity_Number: "2";

  constructor(public router: Router, private httpServices: HttpServices) {}

  ngOnChanges() {
    this.assignSelectedLanguage();
  }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  /*
   * JA354063 - Created on 22-07-2021
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

  show(value) {
    this.Activity_Number = value;
  }

  dashboard() {
    this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }
}
