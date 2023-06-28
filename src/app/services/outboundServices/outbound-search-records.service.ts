import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
import { InterceptedHttp } from './../../http.interceptor';


@Injectable()
export class OutboundSearchRecordService {

    test = [];
    data: any;
    _baseurl: String = this._config.getCommonBaseURL();

    constructor(private _http: SecurityInterceptedHttp,
         private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp) {

    }

    //private _geturl: string = this._baseurl+"/agentcallallocationcontroller/get/unallocatedcalls";
    private _geturl: string = this._baseurl + "call/outboundCallList";
    private _allocateurl: string = this._baseurl + "";
    private _getFeatureRoleMappingURL: string = this._baseurl + "user/getRoleScreenMappingByProviderID";


    getUnallocatedCalls(val: any) {

    //    console.log("data in servise", this.data);
        return this._httpInterceptor.post(this._geturl, { 'providerServiceMapID': val })
            .map(this.extractData).catch(this.handleError);;
    }

    getUnallocatedCallswithFilter(data) {
        return this._httpInterceptor.post(this._geturl, data)
            .map(this.extractData).catch(this.handleError);;
    }

    getSubRecords(data: any, key: any, val: any) {

        return data.json().filter(data => data.key == val);
    }

    getOutbondCount(val: any) {

        return this._http.post(this._geturl, val)
            .map((response: Response) => response.json()).catch(this.handleError);;
    };

    getFeatureRoleMapping(obj: any) {

        return this._httpInterceptor.post(this._getFeatureRoleMappingURL, obj)
            .map(this.extractData).catch(this.handleError);
    };

    private extractData(res: Response) {

    //    console.log("service log: ", res);
        if (res.json().data) {
            return res.json();
        } else {
            return res.json();
        }
    };
    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        return Observable.throw(error.json());
    };

}