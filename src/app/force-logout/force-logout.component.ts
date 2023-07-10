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
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ForceLogoutService } from './../services/supervisorServices/forceLogoutService.service';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.css']
})
export class ForceLogoutComponent implements OnInit {

  @ViewChild('flform') flform: NgForm;
  currentLanguageSet: any;

  constructor(public alertService: ConfirmationDialogsService,
    public forceLogoutService: ForceLogoutService, private _dataServivce: dataService, public httpServices: HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
 
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  kickout(obj) {
    obj.providerServiceMapID = this._dataServivce.current_service.serviceID;
    console.log(obj, 'object values');
    this.alertService.confirm('', this.currentLanguageSet.doYouReallyWantToKickout + " " +obj.userName + '?')
      .subscribe(response => {
        if (response) {
          this.forceLogoutService.forcelogout(obj).subscribe(res => {
            console.log(res, 'success post force logout');
            if (res.response.toLowerCase() === 'success'.toLowerCase()) {
              this.alertService.alert(this.currentLanguageSet.userLoggedOutSuccessfully, 'success');
              this.flform.reset();
            } else {
              this.alertService.alert(res.errorMessage, 'failure');
              this.flform.reset();
            }
          }, err => {
            console.log(err, 'error post force logout');
            this.alertService.alert(err.errorMessage, 'error');
            this.flform.reset();
          });
        }
      });

  }

}
