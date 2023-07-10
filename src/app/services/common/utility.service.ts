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


import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class UtilityService {
     _104baseUrl = this._config.get104BaseURL();
    //_104baseUrl = "http://localhost:9000/";
    // _commonBaseURL = "http://localhost:9090/helpline1097APIV1/";
    //_commonBaseURL = "http://10.152.3.152:1040/Helpline-104-API/";
    
    constructor(private _http: SecurityInterceptedHttp,private _config: ConfigService) { }

    DOB: any;
	age: any= "";
    today = new Date();
    // to Calculate the age on the basis of date of birth
	calculateAge(date) {
		date = new Date(date); 
		this.age = this.today.getFullYear() - date.getFullYear();
		const month = this.today.getMonth() - date.getMonth();
		if (month < 0 || (month === 0 && this.today.getDate() < date.getDate())) {
			this.age--;
		}
		this.ageInput(this.age);
		if(isNaN(this.age)){
            this.age = "";
        } 

		return this.age;
	}
	// calculate date of birth on the basis of age
	calculateDOB(age) {
	//	console.log("Age is ", age);
		const currentYear = this.today.getFullYear();

		let date = new Date();
		date.setFullYear(currentYear - parseInt(age, 10));
		date.setMonth(1);
		date.setDate(1);
		
		// int parsing in decimal format
		this.DOB = date;
	//	console.log("DOB is", this.DOB);
	}
    
    ageFlag: any = true;
    ageInput(value) {
		if (value == undefined) {
		}
		else if (value >= 1 && value <= 120) {
			this.ageFlag = false;
			
		}
		else {
			this.ageFlag = true;
			
		}
	}


	transformDatetoUTC(value: string): any {

    if (!value) {
      return '';
    }

    const dateValue = new Date(value);

    const dateWithNoTimezone = new Date(
      dateValue.getUTCFullYear(),
      dateValue.getUTCMonth(),
      dateValue.getUTCDate(),
      dateValue.getUTCHours(),
      dateValue.getUTCMinutes(),
      dateValue.getUTCSeconds()
    );
   // console.log('UTC FILTER', value, dateWithNoTimezone);
    return dateWithNoTimezone;
  }
}