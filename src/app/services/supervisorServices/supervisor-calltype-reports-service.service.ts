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
export class SupervisorCallTypeReportService {

  commonBaseURL: any;
  filterCallList_URL: any;
  getCallTypes_URL: any;

  constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) {
    this.commonBaseURL = this._config.getCommonBaseURL();
    this.filterCallList_URL = this.commonBaseURL + 'call/filterCallListPage';
    this.getCallTypes_URL = this.commonBaseURL + 'call/getCallTypesV1';
  }

  filterCallList(requestObject) {
    return this.httpIntercept.post(this.filterCallList_URL, requestObject).map(this.handleSuccess).catch(this.handleError);
  }

  getCallTypes(requestObject) {
    return this._http.post(this.getCallTypes_URL, requestObject).map(this.handleSuccess).catch(this.handleError);
  }

  handleSuccess(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  };

}