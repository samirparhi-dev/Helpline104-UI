import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()
export class SurveyorReportsService {
  public url: string;
  responseData: any;
  address: any = this._config.get104BaseURL();
  public callReportsUrl = this.address + 'beneficiary/save/callqamapping';
  public getCallReportsUrl = this.address + 'beneficiary//get/CDIqamapping';
  constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService) { }


  saveCallReports(callqaMappingObj) {
    return this._http.post(this.callReportsUrl, JSON.stringify(callqaMappingObj)).map(this.extractData).catch(this.handleError)
  }

  getCallReports(callqaMappingObj) {
    return this._http.post(this.getCallReportsUrl, JSON.stringify(callqaMappingObj)).map(this.extractData).catch(this.handleError)
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
    return Observable.throw(error.json());
  };

  // tslint:disable-next-line:eofline
}