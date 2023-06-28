import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { selectedSymp } from '../../cdss/selectedSymp';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CDSSService {

  url: String = this._config.get104BaseURL() + 'CDSS/';
  //="http://127.0.0.1:8090/CDSS";
  //url: String = "http://10.152.3.99:8080/104api-v1.0/CDSS/";
  constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService) { }


  // saveSymp(data:any):Promise<string[]>{
  //     return this._http.post(this.url+"saveSymptom",data,)
  //               .toPromise()
  //               .then(response => response.json() as string[])
  //               .catch(this.handleError);
  // }

  saveSymp(data) {
    return this._http.post(this.url + 'saveSymptom', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getChiefComplaints():Promise<string[]>{
  //     return this._http.get(this.url+"Symptoms")
  //               .toPromise()
  //               .then(response => response.json() as string[])
  //               .catch(this.handleError);
  // }

  getChiefComplaints(data) {
    return this._http.post(this.url + 'Symptoms', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getQuestions( data:selectedSymp):Promise<any>{
  //   return this._http.post(this.url+"getQuestions",data,)
  //             .toPromise()
  //             .then(response => response.json() as any)
  //             .catch(this.handleError);
  // }

  getQuestions(data) {
    return this._http.post(this.url + 'getQuestions', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getAnswer( data:any):Promise<any>{
  //   return this._http.post(this.url+"getResult",data,)
  //             .toPromise()
  //             .then(response => response.json() as any)
  //             .catch(this.handleError);
  // }

  getAnswer(data) {
    return this._http.post(this.url + 'getResult', data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error); 
  //   return Promise.reject(error.message || error);
  // }

  private extractData(response: Response) {
    //    console.log(response);
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }

  private handleError(error: Response | any) {
    //  console.log(error.json(), 'error in service');
    return Observable.throw(error.json());
  };

}
