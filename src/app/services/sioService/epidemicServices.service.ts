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
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class EpidemicServices {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, private _httpInterceptor: InterceptedHttp) { }

	address: String = this._config.get104BaseURL();

	getEpidemicHistoryURL: string = "beneficiary/get/epidemicOutbreakComplaint";
	setEpidemicDetailURL: string = "beneficiary/save/epidemicOutbreakComplaint";
	getNatureOfEpidemicComplaintURL: string = "beneficiary/get/natureOfComplaintTypes";

	getNatureOfEpidemicComplaint(serviceLineID: any, feedbackTypeID: any) {
		return this.http.post(this.address + this.getNatureOfEpidemicComplaintURL, { "providerServiceMapID": serviceLineID, "feedbackTypeID": feedbackTypeID })
			.map(this.extractData).catch(this.handleError);
	}

	getEpidemicDetailsByBenID(obj: any) {
		return this.http.post(this.address + this.getEpidemicHistoryURL, obj)
			.map(this.extractData).catch(this.handleError);
	}

	saveEpidemicDetailsByBenID(epidemicComplaintObj: any) {
		return this._httpInterceptor.post(this.address + this.setEpidemicDetailURL, epidemicComplaintObj)
			.map(this.extractData).catch(this.handleError);
	}

	private extractData(response: Response) {
	//	console.log("ressss", response);
		if (response.json().data) {
			return response.json().data;
		} else {
			return response.json();
		}
	}
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

