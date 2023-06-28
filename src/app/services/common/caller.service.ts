import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class CallerService {
    _104baseUrl = this._config.get104BaseURL();
    _commonBaseURL = this._config.getCommonBaseURL();
    _storeCallIDURL = this._104baseUrl + "beneficiary/startCall/";
    _setCallHistory = this._104baseUrl + "beneficiary/set/callHistory";
    _getBeneficiaryURL = this._commonBaseURL + "call/beneficiaryByCallID";
    //_getBeneficiaryURL =this._commonBaseURL + "beneficiary/call/getCallHistoryByCallID"; 
    _updateCallerBeneficiaryIDURL = this._104baseUrl + "beneficiary/update/beneficiaryCallID";
    _updateCDICallStatusURL = this._commonBaseURL + "call/updateBeneficiaryCallCDIStatus";
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    getWrapupTime = this._104baseUrl + 'user/role/';
    callDetails$: Observable<Response>;
    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }
   
    updateCallerBeneficiaryID(data: any) {
        return this._http.post(this._updateCallerBeneficiaryIDURL, data)
            .shareReplay()
            .map(this.extractData)
            .catch(this.handleError);
    }
    setCallHistory(data: any) {
        return this._http.post(this._setCallHistory, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getBeneficiaryByCallID(data) {
        return this._http.post(this._getBeneficiaryURL, data)
            .shareReplay()
            .map(this.extractData)
            .catch(this.handleError)

        // return this._http.post(this._getBeneficiaryURL, data)
        //     .map(this.extractData)
        //     .catch(this.handleError);
    }

    updateCDIStatus(data) {
        return this.httpIntercept.post(this._updateCDICallStatusURL, data).map(this.extractData).catch(this.handleError);
    }
    getRoleBasedWrapuptime(roleID) {
        return this.httpIntercept.get(this.getWrapupTime + roleID)
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
    }
}