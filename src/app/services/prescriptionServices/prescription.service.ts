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
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()
export class PrescriptionService {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, private httpInter: InterceptedHttp) { };
	address: String = this._config.get104BaseURL();


	getDrugListURL: string = 'beneficiary/get/drugList';
	savePrescriptionURL: string = 'beneficiary/save/prescription';
	getPrescriptionListURL: string = 'beneficiary/get/prescriptionList';
	getlatestValidPescriptionURL: string = 'beneficiary/get/latestValidPescription';
	getStrengthUrl: string = this.address + "beneficiary/get/drugStrength"

	getDrugGroup_url = this.address + "beneficiary/get/drugGroups";
	getDrugList_url = this.address + "beneficiary/get/drugList";
	gerDrugFrequencyURL = this.address + "beneficiary/get/drugFrequency";
	getDrugListUrl = this.address + 'beneficiary/getDrugDetailList';

	// getDrugList(data) {
	// 	return this.http.post(this.address + this.getDrugListURL, data, this.options).map(this.extractData).catch(this.handleError);
	// }

	getDrugGroup(serviceProviderID) {
		return this.http.post(this.getDrugGroup_url, { "serviceProviderID": serviceProviderID }).map(this.extractData).catch(this.handleError);
	}
	getDrugList(providerServiceMapID) {
		return this.http.post(this.getDrugListUrl, { "providerServiceMapID": providerServiceMapID } )
		.map(this.extractData)
		.catch(this.handleError)

	}
	// getDrugList(providerServiceMapID, drugGroupID) {
	// 	return this.http.post(this.getDrugList_url, { "providerServiceMapID": providerServiceMapID, "drugGroupID": drugGroupID }).map(this.extractData).catch(this.handleError);
	// }

	savePrescription(data) {
		return this.httpInter.post(this.address + this.savePrescriptionURL, data)
			.map(this.extractData).catch(this.handleError);
	}

	getPrescriptionList(data) {
		return this.http.post(this.address + this.getPrescriptionListURL, data).map(this.extractData).catch(this.handleError);
	}

	getlatestValidPescription(data) {
		return this.http.post(this.address + this.getlatestValidPescriptionURL, data).map(this.extractData).catch(this.handleError);
	}

	getDrugFrequency() {
		let obj = {};
		return this.http.post(this.gerDrugFrequencyURL, obj).map(this.extractData).catch(this.handleError);
	}
	getStrength(serviceProviderID) {

		return this.http.post(this.getStrengthUrl, { "serviceProviderID": serviceProviderID }).map(this.extractData).catch(this.handleError);

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
		// In a real world app, you might use a remote logging infrastructure
		// let errMsg: string;
		// if (error instanceof Response) {
		// 	const body = error.json() || '';
		// 	const err = body.error || JSON.stringify(body);
		// 	errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		// } else {
		// 	errMsg = error.message ? error.message : error.toString();
		// }
		// console.error(errMsg);
		return Observable.throw(error.json());
	};

}