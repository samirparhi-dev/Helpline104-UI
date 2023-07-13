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
import { ConfigService } from "../config/config.service";
import { Observable } from 'rxjs/Observable';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class OutboundWorklistService {

    test = [];
    _baseurl: String = this._config.getCommonBaseURL();
    _104BaseUrl: String = this._config.get104BaseURL();
    //_104BaseUrl: String = "http://localhost:8080/";
    private _callList: string = this._baseurl + "call/outboundCallList";
    private _saveBloodBankDetailsUrl: string = this._104BaseUrl + "beneficiary/save/bloodBankDetails";
    private _updateBloodBankDetailsUrl: string = this._104BaseUrl + "beneficiary/update/bloodBankDetails";
    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService,
        private _httpinterceptor: InterceptedHttp) { }

    getCallWorklist(val: any) {

        return this._httpinterceptor.post(this._callList, val)
            .map(this.extractData).catch(this.handleError);
    }

     saveBloodBankDetails(data) {

         return this._httpinterceptor.post(this._saveBloodBankDetailsUrl, data)
             .map(this.extractData).catch(this.handleError);
     }

    updateBloodBankDetails(data) {
        return this._httpinterceptor.post(this._updateBloodBankDetailsUrl, data)
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
        // In a real world app, you might use a remote logging infrastructure
        return Observable.throw(error.json());
    };


}
