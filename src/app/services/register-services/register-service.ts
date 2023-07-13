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
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RegisterService {
	domain = this._config.getCommonBaseURL();
	baseUrl = "iEMR";
	constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService) { }

	/*
	* 2 observables to check - KA40094929
	* Starts Here
	*/

	// observable to check is emergency 
	checkIsEmergency: any = [];
	checkIsEmergencyData = new BehaviorSubject<any>(this.checkIsEmergency);
	checkIsEmergency$ = this.checkIsEmergencyData.asObservable();

	// observable to check if demographhic data is available
	isDemographicDataNeeded: any = [];
	isdemographicDetailsAvailable = new BehaviorSubject<any>(this.isDemographicDataNeeded);
	isDemographicDataNeeded$ = this.isdemographicDetailsAvailable.asObservable();

	

	getIsEmergency(checkIsEmergency){
		this.checkIsEmergencyData.next(checkIsEmergency)
	}

	checkForDemographicDetails(isDemographicDataNeeded){
		this.isdemographicDetailsAvailable.next(isDemographicDataNeeded)
	}
 
	/*  ends here 
	*/
	generateReg(values: any) {



		let createData = '{"titleId":1,"firstName":"' + values.FirstName + '",'
			+ '"middleName":"' + values.LastName + '","lastName":"' + values.LastName + '","genderID":1,'
			+ '"maritalStatusID":1,"dOB":"' + values.DOB + '","fatherName":"' + values.FirstName + '",'
			+ '"husbandName":"' + values.FirstName + '","phoneNo":"' + values.PhoneNo + '","phoneTypeID":1,'
			+ '"altPhoneNo":"' + values.PhoneNo + '","altPhoneTypeID":1,'
			+ '"parentBenRegID":"' + values.ParentBenRegID + '","beneficiaryTypeID":1,'
			+ '"registeredServiceID":1,"deleted":false,"createdBy":"CO","govtIdentityTypeID":1,"statusID":1}';


	//	console.log(createData)
		//let createData='{"callType":"'+values.calltype+'","remarks":"'+values.callRemarks+'","invalidType":"'+values.invalidCallType+'"}';
		// let url = this.domain + this.baseUrl + "/benificiary/create";
		return this._http.post('http://10.152.3.152:1040/CommonV1/beneficiary/create', createData)
			.map(this.extractData).catch(this.handleError);
	}

	getRelationships() {
	//	console.log("cndbasmfg")
		let url = this.domain + this.baseUrl + "/get/beneficiaryRelationship";
		return this._http.get("http://10.152.3.152:1040/CommonV1/user/get/beneficiaryRelationship")
			.map(this.extractData).catch(this.handleError);
	}

	retrieveRegHistory(registrationNo: any) {
	//	console.log("retrieveRegHistory")
		//let url = this.domain+this.baseUrl+"/get/beneficiaryRelationship";
		return this._http.get("http://10.152.3.152:1040/CommonV1/beneficiary/searchUser/" + registrationNo)
			.map(this.extractData).catch(this.handleError);
	}

	private extractData(res: Response) {
		// console.log("inside extractData:"+JSON.stringify(res.json()));
		// let body = res.json();
		//return body.data || {};
		if (res.json().data) {
			return res.json().data;
		} else {
			return res.json();
		}
	};

	private handleError(error: Response | any) {

		return Observable.throw(error.json());
	};

}