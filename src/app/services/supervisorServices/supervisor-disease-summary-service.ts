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
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor'
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()

export class SupervisorDiseaseSummaryService {

  commonBaseURL: any;
  base104Url: any;
  diseaseSummaryListUrl: any;
  saveDiseaseSummaryUrl: any;
  updateDiseaseSummaryUrl: any;
  deleteDiseaseSummaryUrl: any;

  constructor(private _http: SecurityInterceptedHttp,
    private config: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.commonBaseURL = this.config.getCommonBaseURL();
    this.base104Url = this.config.get104BaseURL();
    this.diseaseSummaryListUrl = this.base104Url + 'diseaseController/getDisease';
    this.saveDiseaseSummaryUrl = this.base104Url + 'diseaseController/saveDisease';
    this.updateDiseaseSummaryUrl = this.base104Url + 'diseaseController/updateDisease';
    this.deleteDiseaseSummaryUrl = this.base104Url + 'diseaseController/deleteDisease';
  }

  getDiseaseSummaryList(reqObj) {
    return this.httpIntercept.post(this.diseaseSummaryListUrl, reqObj).map(this.handleSuccess).catch(this.handleError);
  }
  saveDiseaseSummary(saveRequest) {
    return this.httpIntercept.post(this.saveDiseaseSummaryUrl, saveRequest).map(this.handleSuccess).catch(this.handleError);
  }
  updateDiseaseSummary(updateRequest) {
    return this.httpIntercept.post(this.updateDiseaseSummaryUrl, updateRequest).map(this.handleSuccess).catch(this.handleError);
  }
  deleteSummary(deleteReq) {
    return this.httpIntercept.post(this.deleteDiseaseSummaryUrl, deleteReq).map(this.handleSuccess).catch(this.handleError);
  }
  handleSuccess(response: Response) {
    if (response.json()) {
      return response.json();
    } else {
      return Observable.throw(response.json());
    }
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  };

}