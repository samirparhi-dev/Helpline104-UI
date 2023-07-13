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
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const commonIP = 'http://10.208.122.38:8080/';
const IP1097 = 'http://10.208.122.38:8080/';
const telephonyServerIP = 'http://10.208.122.99/';
const adminIP = 'http://10.208.122.38:8080/';
const IP104 = 'http://10.208.122.38:8080/';
const mmuIP = 'http://10.208.122.38:8080/';
const tmIP = 'http://10.208.122.38:8080/';
const FHIRIP = "http://10.208.122.38:8080";

@Injectable()
export class ConfigService {

    // private _commonBaseURL: String = "http://deviemr.piramalswasthya.org:8080/commonapi-v1.1/";
    // private _helpline1097BaseURL: String = "http://deviemr.piramalswasthya.org:8080/1097api-v1.0/";
    // private _helpline104BaseURL: String = "http://deviemr.piramalswasthya.org:8080/104api-v1.0/";
    // private _adminBaseURL: String = "http://deviemr.piramalswasthya.org:8080/adminapi-v1.0/";
    // private _telephonyServerURL: String = "http://helplines.piramalswasthya.org/"; 


    private _helpline1097BaseURL: string = `${IP1097}1097api-v1.0/`;
    private _telephonyServerURL: string = `${telephonyServerIP}`;
    private _commonBaseUrlForLicense: string = `${commonIP}commonapi-v1.0/`;
    private _commonBaseURL: string = `${commonIP}commonapi-v1.0/`;
    private _opencommonBaseURL: string = `${commonIP}commonapi-v1.0/`;
    private _helpline104BaseURL: string = `${IP104}104api-v1.0/`;
    private _adminBaseURL: string = `${adminIP}adminapi-v1.0/`;
    private _mmuBaseURL: string = `${mmuIP}mmuapi-v1.0/`;
    private _tmBaseURL: string = `${tmIP}tmapi-v1.0/`;
    private _fhirBaseURL = `${FHIRIP}/fhirapi-v1.0/`;
    // private czentrics ='http://10.208.122.99/';
    // private _commonBaseURL: String = `http://localhost:8080/`;
    // private _helpline104BaseURL: String = `http://localhost:8080/`;
    // private _opencommonBaseURL: String = `http://localhost:8080/`;
    // private _commonBaseUrlForLicense: String = `http://localhost:8080/`;

    // private _commonBaseURL: String = "http://10.208.122.38:8080/apiman-gateway/IEMR/Common/1.0/";
    // private _opencommonBaseURL: String="http://10.208.122.38:8080/apiman-gateway/IEMR/Common/open/";
    //   private _helpline104BaseURL: String = "http://10.208.122.38:8080/apiman-gateway/IEMR/104/1.0/";

    // 10.208.122.38
    //NOTE: Socket URL is mentioned in Socket Service has  as it is giving cyclic dependency error if given here

    //    private _commonBaseURL: String = "http://l-442002723.wipro.com:8080/commonapi-v1.1/";
    // private _helpline104BaseURL: String = "http://l-285002006.wipro.com:8080/104api-v1.0/";
    // private _helpline1097BaseURL: String = "http://l-285002006.wipro.com:8080/helpline1097APIV1/";
    // private _adminBaseURL: String = "http://l-285002006.wipro.com:8080/adminapi-v1.0/"; 
    // private _telephonyServerURL: String = "http://10.208.122.99/";  

    // private _commonBaseURL: String = "http://localhost:8080/commonapi-v1.1/";
    // private _helpline104BaseURL: String = "http://localhost:8080/104api-v1.0/";
    // private _helpline1097BaseURL: String = "http://localhost:8080/helpline1097APIV1/";
    // private _adminBaseURL: String = "http://localhost:8080/adminapi-v1.0/"; 
    // private _telephonyServerURL: String = "http://10.208.122.99/";  

    public defaultWrapupTime: any = 30;

    getCommonBaseURL() {
        return this._commonBaseURL;
    }
    getCommonBaseURLLicense() {
        return this._commonBaseUrlForLicense;
    }
    getOpenCommonBaseURL() {
        return this._opencommonBaseURL;
    }
    get1097BaseURL() {
        return this._helpline1097BaseURL;
    }
    get104BaseURL() {
        return this._helpline104BaseURL;
    }
    getAdminBaseURL() {
        return this._adminBaseURL;
    }
    getTelephonyServerURL() {
        return this._telephonyServerURL;
    }
    getMMUBaseURL() {
        return this._mmuBaseURL;
    }
    getTMBaseURL() {
        return this._tmBaseURL;
    }
    getFHIRBaseURL() {
        return this._fhirBaseURL;
    }
    // getczentricsURL(){
    //     return this.czentrics;
    // }
    

}
