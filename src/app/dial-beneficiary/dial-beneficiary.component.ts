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
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
  selector: 'app-dial-beneficiary',
  templateUrl: './dial-beneficiary.component.html',
  styleUrls: ['./dial-beneficiary.component.css']
})
export class DialBeneficiaryComponent implements OnInit {
  currentLanguageSet: any;

  constructor(private czentrixServices: CzentrixServices, public httpServices: HttpServices) { }
  dialRes: any;
  resultsFound: boolean = false;

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

  dialBeneficiaryForm = new FormGroup({
    phoneNumber: new FormControl('', CustomValidators.phoneNumber)
  });

  dialBeneficiary() {

    let bodyString = this.dialBeneficiaryForm.value;
    let phoneNumber = parseInt(bodyString.phoneNumber);
    console.log("dialBeneficiary bodyString " + bodyString);
    this.czentrixServices.manualDialaNumber("4004", phoneNumber).subscribe(response => this.dialRes = this.successhandler(response));


  }
  func() {
    console.log("D");
  }
  successhandler(response) {
    return response;
  }

  findBenByPh() {
    this.resultsFound = true;
  }
}
