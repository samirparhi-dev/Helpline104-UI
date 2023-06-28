import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class OutboundCallAllocationService {

    test = [];
    _baseurl: String = this._config.getCommonBaseURL();
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _allocateurl: string = this._baseurl + "call/outboundAllocation";
    private _getRolesURL: string = this._baseurl + "user/getRolesByProviderID";

    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService) { }

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

    allocateCallsToAgenta(data: any) {
     //   console.log("inside the call config services");
    //    console.log(data);
        return this._http.post(this._allocateurl, data)
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
        // In a real world app, you might use a remote logging infrastructure
        return Observable.throw(error.json());
    };
}