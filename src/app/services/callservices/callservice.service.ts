import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { Router } from '@angular/router';

@Injectable()
export class CallServices {

 // _baseUrl = this._config.get1097BaseURL();
  _commonURL = this._config.getCommonBaseURL();
  _104URL = this._config.get104BaseURL();
  _storeCallIDURL = this._commonURL + "call/startCall/";
  _closecallurl = this._commonURL + 'call/closeCall/';
  //_callsummaryurl = this._baseUrl + 'services/getCallSummary/';
  _calltypesurl = this._commonURL + 'call/getCallTypesV1/';
  _isavailedurl = this._commonURL + 'call/isAvailed/';
  _outboundCalls = this._commonURL + 'call/outboundCallList/';
  _outbouncClose_url = this._commonURL + 'call/updateOutboundCall/';
  _blacklistCalls = this._commonURL + 'call/getBlacklistNumbers/';
  _blockPhoneNo = this._commonURL + 'call/blockPhoneNumber/';
  _unblockPhoneNo = this._commonURL + 'call/unblockPhoneNumber';
  callTraversalHistory_URL = this._commonURL + 'call/getCallHistoryByCallID';
  _getRecording_url = this._commonURL + "call/nueisanceCallHistory";
  _postResponse = this._104URL + '/beneficiary/save/callDisconnectedData'

  constructor(
    private _http: SecurityInterceptedHttp,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp,
    public router: Router,
    // public successAppointment : boolean = true
  ) { }

  storeCallID(data: any) {
  //  console.log("storeCallID,data: " + JSON.stringify(data));
    return this._http.post(this._storeCallIDURL, data)
      .shareReplay()
      .map(this.extractData)
      .catch(this.handleError);

  }
  updateOutBoundCall(obj) {

    return this._httpInterceptor.post(this._outbouncClose_url, obj).map(this.extractData).catch(this.handleCustomError);
  }
  closeCall(values: any) {

  //  console.log('data to be updated in service is', values);
    return this._httpInterceptor.post(this._closecallurl, values)
    .shareReplay()
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCallTraversalHistory(callID) {
    return this._http.post(this.callTraversalHistory_URL, { "callID": callID }).map(this.extractData).catch(this.handleError);
  }
  /*
  getCallSummary(values: any) {
    console.log('Call summary to be retreived for ', values)
    return this._http.post(this._callsummaryurl, values).map(this.extractData).catch(this.handleError);
  } */
  getCallTypes(values: any) {
  //  console.log('call types to be retreived for ', values)
    return this._http.post(this._calltypesurl, values).map(this.extractData).catch(this.handleError);
  }
  getBlockMaster(values: any) {
    //  console.log('call types to be retreived for ', values)
      return this._http.post(this._calltypesurl, values).map(this.extractData).catch(this.handleError);
    }
  getServiceAvailedStatus(values: any) {
   // console.log('service availed status retrieved for ', values)
    return this._httpInterceptor.post(this._isavailedurl, values).map(this.extractData).catch(this.handleError);
  }
  getOutboundCallList(serviceID: any, userID?: any) {
    const obj = {};
    if (userID) {
      obj['providerServiceMapID'] = serviceID;
      obj['assignedUserID'] = userID;
    } else {
      obj['providerServiceMapID'] = serviceID;
    }
    return this._http.post(this._outboundCalls, obj).map(this.extractData).catch(this.handleError);
  }
  getBlackListCalls(objSearch: any) {
    return this._httpInterceptor.post(this._blacklistCalls, objSearch).map(this.extractData).catch(this.handleCustomError);
  }
  extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }
  blockPhoneNumber(phoneBlockID: any) {
    return this._httpInterceptor.post(this._blockPhoneNo, phoneBlockID).map(this.extractData).catch(this.handleCustomError);
  }
  UnBlockPhoneNumber(phoneBlockID: any) {
    return this._httpInterceptor.post(this._unblockPhoneNo, phoneBlockID).map(this.extractData).catch(this.handleCustomError);

  }
  handleError(error: Response) {
    return Observable.throw(error.json());
  }
  handleCustomError(error: Response) {
    return Observable.throw(error.json());
  }
  getRecording(obj) {
    return this._httpInterceptor.post(this._getRecording_url, obj).map(this.extractData).catch(this.handleCustomError);
  }
  postResponse(obj){
    return this._httpInterceptor.post(this._postResponse, obj).map(this.extractData).catch(this.handleCustomError);
  }
  clearSessionValuesAfterCallClose() {
    console.log("Clear sessions before moving to dashboard");
		sessionStorage.removeItem("onCall");
		sessionStorage.removeItem("CLI");
		// sessionStorage.removeItem("session_id");
		this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
	}

}
