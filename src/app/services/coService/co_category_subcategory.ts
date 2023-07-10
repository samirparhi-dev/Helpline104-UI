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
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class coCategoryService
{

    test = [];

    private _baseurl: String = this._config.getCommonBaseURL();
    private _categoryurl: string = this._baseurl + "/"
    private _subcategoryurl: string = this._baseurl + "/"
    constructor( private _http: SecurityInterceptedHttp, private _config: ConfigService) { }
    getCategories ()
    {
        return this._http.post( this._categoryurl, {} )
            .map( this.extractData ).catch( this.handleError );
    }
    getSubCategories ( data: any )
    {

        //console.log(data);
        return this._http.post( this._subcategoryurl, data )

            .map( this.extractData ).catch( this.handleError );

    }

    public category = function ( uname: any, pwd: any )
    {


        return this.http.get( this._baseurl + 'iEMR/Admin/userAuthenticate/' + uname + '/' + pwd )
            .map( this.extractData )
            .catch( this.handleError );
    };

    getSecurityQuestions ( uname: any ): Observable<any>
    {

        return this._http.get( 'http://10.152.3.152:1040/Admin1.1/iEMR/Admin/forgetPassword/' + uname )
            .map( this.extractData )
            .catch( this.handleError );
    };


    private extractData ( response: Response )
	{
		if ( response.json().data )
		{
			return response.json().data;
		} else
		{
            return Observable.throw(response.json());
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
};



