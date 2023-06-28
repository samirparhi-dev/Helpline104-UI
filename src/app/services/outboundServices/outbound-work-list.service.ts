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
