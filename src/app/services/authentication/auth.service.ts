import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { dataService } from '../dataService/data.service';

@Injectable()
export class AuthService {

    constructor(private getCommonData: dataService, private _http : Http, private _config : ConfigService){}

    common_url = this._config.getCommonBaseURL();
    _agentLogOut = this.common_url + 'cti/doAgentLogout';

    public getToken(): string {
        if (sessionStorage.getItem('authToken')) {
            return sessionStorage.getItem('authToken');
        }
    }
    public removeToken() {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('apiman_key');
    }
    public isAuthenticated(): boolean {
        // get the token
        const token = this.getToken();
        return true;
        // return a boolean reflecting
        // whether or not the token is expired
        // return tokenNotExpired(null, token);
    }
    public cZentrixLogout() {
        const loginObj = { 'agent_id': this.getCommonData.agentID };
        this._http.post(this._agentLogOut, loginObj).map(this.extractData).catch(this.handleError);
    }
    private extractData(res: Response) {
        return res.json().data;
    };

    private handleError(error: Response | any) {
        return Observable.throw(error.json());
    };

}
