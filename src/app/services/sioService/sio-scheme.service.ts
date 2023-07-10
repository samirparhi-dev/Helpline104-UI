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
import { InterceptedHttp } from './../../http.interceptor'
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class SchemeService {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }

	address: String = this._config.get104BaseURL();
	commonUrl: String = this._config.getCommonBaseURL();
	// address: string = "http://localhost:8080/";
	getSchemeListURL: string = "beneficiary/get/schemeList";
	getNKSHPschemeListsURL: string = "beneficiary/get/schemeList";
	saveNKSHPschemeListsURL: string = "beneficiary/save/schemeDetails";
	acti_DeactivateSchemeURL: string = "beneficiary/scheme/deleteScheme";
	saveSearchScheme_url: string = "beneficiary/save/schemeSearchHistory";
	schemeSearchHistory_url: string = "beneficiary/getSchemeSearchHistory";

	saveScheme(data) {
		return this.httpIntercept.post(this.commonUrl + this.saveNKSHPschemeListsURL, data)
			.map(this.extractData).catch(this.handleError);
	}
	getNKSHPschemeLists(data) {
		return this.http.post(this.commonUrl + this.getNKSHPschemeListsURL, data)
			.map(this.extractData).catch(this.handleError);
	}
	getSchemeList(obj) {
		return this.http.post(this.commonUrl + this.getSchemeListURL, obj)
			.map(this.extractData).catch(this.handleError);
	}
	acti_DeactivateScheme(obj) {
		return this.http.post(this.commonUrl + this.acti_DeactivateSchemeURL, obj)
			.map(this.extractData).catch(this.handleError);
	}
	saveSearchScheme(req_array) {
		return this.http.post(this.address + this.saveSearchScheme_url, req_array)
		.map(this.extractData).catch(this.handleError);
	}

	schemeSearchHistory(req_obj) {
		return this.http.post(this.address + this.schemeSearchHistory_url, req_obj)
		.map(this.extractData).catch(this.handleError);
	}
	private extractData(response: Response) {
		if (response.json().data) {
			return response.json().data;
		} else {
			return Observable.throw(response.json());
		}
	}

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		return Observable.throw(error.json());
	};


}

