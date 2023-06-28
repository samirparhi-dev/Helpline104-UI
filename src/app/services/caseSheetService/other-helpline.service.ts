import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

@Injectable()
export class OtherHelplineService {

  constructor(private _config : ConfigService, private interHTTP : InterceptedHttp) { }

  commenBaseUrl = this._config.getCommonBaseURL();
  mmuBaseUrl = this._config.getMMUBaseURL();
  tmBaseUrl=this._config.getTMBaseURL();

  getMctsCallHistoryURL = "mctsOutboundHistoryController/getMctsCallHistory";
  getMctsCallResponseURL = "mctsOutboundHistoryController/getMctsCallResponse";
  getMmuBenCasesheetURL = "common/getBeneficiaryCaseSheetHistory";
  getCasesheetDataURL = "common/get/Case-sheet/printData";

  getMctsCallHistory(obj) {
    return this.interHTTP.post(this.commenBaseUrl + this.getMctsCallHistoryURL, obj).map(this.extractData).catch(this.handleError);
  }

  getMctsCallResponse (obj){
    return this.interHTTP.post(this.commenBaseUrl + this.getMctsCallResponseURL, obj).map(this.extractData).catch(this.handleError);
  }

  getTmOrMmuBenCasesheet(obj,isTm) {
    if(isTm) 
    return this.interHTTP.post(this.tmBaseUrl + this.getMmuBenCasesheetURL, obj).map(this.extractData).catch(this.handleError)
    else
    return this.interHTTP.post(this.mmuBaseUrl + this.getMmuBenCasesheetURL, obj).map(this.extractData).catch(this.handleError)
    }

  getCasesheetData(obj, isTm) {
    if(isTm)
    return this.interHTTP.post(this.tmBaseUrl + this.getCasesheetDataURL, obj).map(this.extractData).catch(this.handleError);
    else
    return this.interHTTP.post(this.mmuBaseUrl + this.getCasesheetDataURL, obj).map(this.extractData).catch(this.handleError);
  }


  private extractData(res : Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  }
}
