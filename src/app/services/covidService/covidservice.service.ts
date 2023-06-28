import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CovidserviceService {
  _104baseUrl = this._config.get104BaseURL();
  commenBaseUrl = this._config.getCommonBaseURL();
  constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }

  getCovidMasterData(providerServiceMapID) {
    return this._http.get(this._104baseUrl + "master/patient/covidDetails/" + providerServiceMapID)
      .map(this.extractData).catch(this.handleError);
  }
  saveCovidData(data) {
		return this.httpIntercept.post(this._104baseUrl + "master/save/covidScreeningData", data)
			.map(this.extractData)
			.catch(this.handleError);
	}
  private extractData(response: Response) {
    //	console.log(response);
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }
  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  };
}
