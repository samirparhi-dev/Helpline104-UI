import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { FeedbackResponseModel } from '../../sio-grievience-service/sio-grievience-service.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()
export class BloodOnCallServices {

    constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, public dialog: MdDialog,
        private _httpInterceptor: InterceptedHttp) { }


    address: String = this._config.get104BaseURL();

    getBloodonCallHistoryURL: string = "beneficiary/get/bloodRequestDetails";
    setBloodonCallDetailURL: string = "beneficiary/save/bloodRequestDetails";
    getComponentTypesURL: string = "beneficiary/get/bloodComponentTypes";
    getBloodGroupsURL: string = "beneficiary/get/bloodGroups";
    getBloodBankURL: string = "beneficiary/get/bloodBankURL";
    saveBloodBankURL: string = "beneficiary/save/bloodBankURL";
    getOutboundDetailsURL: string = "beneficiary/get/bloodRequestDetails";
    getComponentTypes() {
        return this.http.post(this.address + this.getComponentTypesURL, {}).map(this.extractData).catch(this.handleError);
    }

    getBloodGroups() {
        return this.http.post(this.address + this.getBloodGroupsURL, {}).map(this.extractData).catch(this.handleError);
    }

    getBloodRequestsByBenID(beneficiaryRegID: any, bloodReqID: any) {
        return this.http.post(this.address + this.getBloodonCallHistoryURL, { "beneficiaryRegID": beneficiaryRegID, "bloodReqID": bloodReqID }).map(this.extractData).catch(this.handleError);
    }

    saveBloodRequest(bloodRequestObj: any) {
    //    console.log(bloodRequestObj, "BRobj")
        return this._httpInterceptor.post(this.address + this.setBloodonCallDetailURL, bloodRequestObj)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getBloodBankUrl(providerServiceMapID) {
        return this._httpInterceptor
            .post(this.address + this.getBloodBankURL, { 'providerServiceMapID': providerServiceMapID })
            .map(this.extractData).catch(this.handleError);
    }

    saveBloodBankUrl(data) {
        return this._httpInterceptor.post(this.address + this.saveBloodBankURL, data).map(this.extractData).catch(this.handleError);
    }
    getOutboundRequestDetails(obj) {
        return this._httpInterceptor.post(this.address + this.getOutboundDetailsURL, obj)
            .map(this.extractData).catch(this.handleError);
    }
    private extractData(response: Response) {
    //    console.log("responsee", response);
        if (response.json().data) {
            return response.json().data;
        } else {

            return response.json();
        }
    }

    private handleError(error: Response | any) {

        // console.log("errorr", error);
        // // In a real world app, you might use a remote logging infrastructure
        // let errMsg: string;
        // if (error instanceof Response) {
        //     const body = error.json() || '';
        //     const err = body.error || JSON.stringify(body);
        //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        // } else {
        //     errMsg = error.message ? error.message : error.toString();
        // }

        return Observable.throw(error.json());
    };

}

