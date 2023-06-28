import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { InterceptedHttp } from '../../http.interceptor';

@Injectable()
export class CallTypeReportService {

  _104baseUrl = this._config.get104BaseURL();
  _getServicesURL = this._104baseUrl + 'beneficiary/get/services';

  constructor(private interceptedHTTP: InterceptedHttp, private _http: SecurityInterceptedHttp, private _config: ConfigService) { }


  getServices(data) {
    return this._http.post(this._getServicesURL, data)
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
    return Observable.throw(error.json());
  };
}
