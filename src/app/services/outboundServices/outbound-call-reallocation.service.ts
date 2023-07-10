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


import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class OutboundReAllocationService {

    test = [];
    data: any;
    _baseurl: String = this._config.getCommonBaseURL();

    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private _https : InterceptedHttp) {


    }
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _getRolesURL: string = this._baseurl + "user/getRolesByProviderID";
    private _getReallocationDataURL: string = this._baseurl + "call/outboundCallList";
    private moveToBinURL: string = this._baseurl + "call/resetOutboundCall";

    getAgents(providerServiceMapID: number, roleID: any) {
        let body = {};
        body["providerServiceMapID"] = providerServiceMapID;
        body["RoleID"] = roleID;
        return this._http.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRoles(data) {
        return this._http.post(this._getRolesURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getReallocationCalls(data) {
        return this._https.post(this._getReallocationDataURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    moveToBin(data) {
        return this._http.post(this.moveToBinURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(response: Response) {

        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    };

    private handleError(error: Response | any) {

        // In a real world app, you might use a remote logging infrastructur
        return Observable.throw(error.json());
    };
}