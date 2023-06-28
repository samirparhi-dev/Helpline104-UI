import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
import { ConfigService } from "../config/config.service";
@Injectable()
export class SioService {
    public url: string;
    responseData: any;
    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService) { }

    address: any = this._config.get104BaseURL();

    /*** not using : same functionality their in bloodoncall service */
    saveBloodRequest(patientDetails: any, hospitalDetails: any) {
        let dateOfOutbound = "";
        let outboundRequired = 0;
        if (hospitalDetails.dateOfOutbound != undefined) {
            dateOfOutbound = hospitalDetails.dateOfOutbound;
        }
        if (hospitalDetails.outboundRequired) {
            outboundRequired = 1;
        }
        let data = '{"beneficiaryRegID":"123",' +
            '"recipientName":"' + patientDetails.firstName + '",' +
            '"recipientAge":"23",' +
            '"recipientGender":"' + patientDetails.gender + '",' +
            '"typeOfRequest": "' + patientDetails.firstName + '",' +
            '"componentTypeID":"1",' +
            '"componentID":"1",' +
            '"hospitalAdmitted":"' + hospitalDetails.HospitalName + '",' +
            '"districtID":"1",' +
            '"outboundNeeded":"' + outboundRequired + '",' +
            '"outboundDate":"' + dateOfOutbound + '",' +
            '"bloodBank":"' + patientDetails.firstName + '",' +
            '"mobileNo":"' + hospitalDetails.outboundPhoneNumber + '",' +
            '"remarks":"' + patientDetails.firstName + '",' +
            '"feedback":"' + patientDetails.firstName + '",' +
            '"createdBy":"' + patientDetails.firstName + '"}';


        return this._http.post(this.address + "beneficiary/save/bloodRequestDetails", data)
            .map(this.extractData).catch(this.handleError);

    }

    getComponentTypes() {
        return this._http.post(this.address + "beneficiary/get/bloodComponentTypes", {}).map(this.extractData).catch(this.handleError);
    }

    getSioHistoryData(data) {
        return this._http.post(this.address + "beneficiary/getSioHistory", data).map(this.extractData).catch(this.handleError);
    }

    private extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    };
}

