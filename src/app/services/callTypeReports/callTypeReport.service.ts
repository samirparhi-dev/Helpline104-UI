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
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { InterceptedHttp } from '../../http.interceptor';

@Injectable()
export class CallTypeReportService {

  _104baseUrl = this._config.get104BaseURL();
  _getServicesURL = this._104baseUrl + 'beneficiary/get/services';

  constructor(private interceptedHTTP: InterceptedHttp, private _http: SecurityInterceptedHttp, private _config: ConfigService) { }


  getServices(data) {
    return this._http.post(this._getServicesURL, data)
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(response: Response) {
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
