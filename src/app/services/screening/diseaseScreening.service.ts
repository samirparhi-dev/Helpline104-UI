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
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()
export class DiseaseScreeningService {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService) { };

	address: String = this._config.get104BaseURL();
	common_base_url: any = this._config.getCommonBaseURL();

	getQuestionsListURL: string = "beneficiary/get/questions";
	getAnswersListURL: string = "beneficiary/get/answers";
	getQuestionType_url: string = this.common_base_url + "questionTypeController/get/questionTypeList";


	getQuestionsList(data) {
		return this.http.post(this.address + this.getQuestionsListURL, data).map(this.extractData).catch(this.handleError);
	}

	getAnswersList(data) {
		return this.http.post(this.address + this.getAnswersListURL, data).map(this.extractData).catch(this.handleError);
	}

	getQuestionTypes() {
		return this.http.post(this.getQuestionType_url, {}).map(this.extractData).catch(this.handleError);
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
		return Observable.throw(error.json());
	};

}