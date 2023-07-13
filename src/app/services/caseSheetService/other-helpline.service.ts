/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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
