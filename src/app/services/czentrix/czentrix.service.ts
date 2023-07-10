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
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { dataService } from '../dataService/data.service';
import { InterceptedHttp } from '../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CzentrixServices {
    common_url = this._config.getOpenCommonBaseURL();
    address = this._config.getTelephonyServerURL();
    path = 'apps/appsHandler.php?';
    resFormat = 3;
    transaction_id: any;
    agent_id: any;
    ip: any;
    phone_num: number;
    _agentLogin = this.common_url + 'cti/doAgentLogin';
    _agentLogOut = this.common_url + 'cti/doAgentLogout';
    _dialBeneficiary = this.common_url + 'cti/callBeneficiary';
    _disconnectCall = this.common_url + 'cti/disconnectCall';
    _getAgentStatus_url = this.common_url + 'cti/getAgentState';
    _getTransferableCampaign = this.common_url + 'cti/getTransferCampaigns';
    _transferCall = this.common_url + 'cti/transferCall';
    _callDisposition = this.common_url + 'cti/setCallDisposition';
    _createVocalFile = this.common_url + 'cti/createVoiceFile';
    _getVocalFile = this.common_url + 'cti/getVoiceFile';
    _getCallDetails = this.common_url + 'cti/getAgentCallStats';
    _getOnlineAgents = this.common_url + 'cti/getOnlineAgents';
    _switchToInbound_url = this.common_url + 'cti/switchToInbound';
    _switchToOutbound_url = this.common_url + 'cti/switchToOutbound';
    _getIpAddress = this.common_url + 'cti/getAgentIPAddress';
    _getLoginKey = this.common_url + 'cti/getLoginKey';
    _getCampaign = this.common_url + 'cti/getCampaignNames';
    _getCTILoginToken = this.common_url + 'cti/getLoginKey';
    _getCampaignSkillsUrl = this.common_url + 'cti/getCampaignSkills';


    constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, private data_service: dataService,
        private httpInterceptor: InterceptedHttp, private normalHTTP: Http) { }

    agentLogin(agentId, ipAddress) {
        const loginObj = { 'agent_id': agentId };
        return this.httpInterceptor.post(this._agentLogin, loginObj).map(this.extractData).catch(this.handleError);

        // this.transaction_id = "CTI_LOGIN";
        // this.agent_id = agentId;
        // this.ip = ipAddress;
        // // apps/appsHandler.php?transaction_id=CTI_LOGIN&agent_id=4071&ip=192.168.1.89&resFormat=1
        // let params = "transaction_id=" + this.transaction_id +
        // "&agent_id=" + this.agent_id + "&ip=" + this.ip + "&resFormat=" + this.resFormat;
        // return this.callAPI(params);
    }

    getCampaignSkills(campaign_name) {
        return this.httpInterceptor.post(this._getCampaignSkillsUrl,
            { 'campaign_name': campaign_name })
            .map(this.extractData).catch(this.handleError);
    }

    agentLogout(agentId, ipAddress?: any) {

        const loginObj = { 'agent_id': agentId };
        return this.httpInterceptor.post(this._agentLogOut, loginObj).map(this.extractData).catch(this.handleError);

        // this.transaction_id = 'CTI_LOGOUT';
        // this.agent_id = agentId;
        // this.ip = ipAddress;

        // let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id +
        //     '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        // return this.callAPI(params);
    }

    getOnlineAgents(agentId, ipAddress) {
        const Obj = { 'agent_id': agentId };
        return this.httpInterceptor.post(this._getOnlineAgents, Obj).map(this.extractData).catch(this.handleError);

        // this.transaction_id = 'CTI_ONLINE_AGENTS';
        // this.agent_id = agentId;
        // this.ip = ipAddress;

        // let params = 'transaction_id=' + this.transaction_id + '&agent_id=' +
        //     this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        // return this.callAPI(params);
    }

    manualDialaNumber(agentId, phoneNum) {
        const dialObj = { 'agent_id': agentId, 'phone_num': phoneNum };
        return this.httpInterceptor.post(this._dialBeneficiary, dialObj).map(this.extractData).catch(this.handleError);

        // this.transaction_id = "CTI_DIAL";
        // this.agent_id = agentId;
        // this.ip = ipAddress;
        // this.phone_num = phoneNum;

        // let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id + 
        // "&ip=" + this.ip + "&phone_num=" + this.phone_num + "&resFormat=" + this.resFormat;
        // return this.callAPI(params);
    }


    switchToInbound(agentID) {
        const agentObj = { 'agent_id': agentID };
        return this.httpInterceptor.post(this._switchToInbound_url, agentObj).map(this.extractData).catch(this.handleError);
    }
    switchToOutbound(agentID) {
        const agentObj = { 'agent_id': agentID };
        return this.httpInterceptor.post(this._switchToOutbound_url, agentObj).map(this.extractData).catch(this.handleError);
    }

    disconnectCall(agentId, ipAddress?: any) {
        const discObj = { 'agent_id': agentId };
        return this.httpInterceptor.post(this._disconnectCall, discObj).map(this.extractData).catch(this.handleError);

        // this.transaction_id = "CTI_DISCONNECT";
        // this.agent_id = agentId;
        // this.ip = ipAddress;

        // let params = "transaction_id=" + this.transaction_id + "&agent_id=" + this.agent_id +
        //  "&ip=" + this.ip get+ "&resFormat=" + this.resFormat;
        // return this.callAPI(params);
    }

    // not available in the list
    callHoldUnhold(agentId, ipAddress, state) { // state : HOLD / UNHOLD
        this.transaction_id = 'CTI_HOLD';
        this.agent_id = agentId;
        this.ip = ipAddress;

        const params = 'transaction_id=' + this.transaction_id +
            '&agent_id=' + this.agent_id + '&state=' + state + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }
    // not available in the list
    checkAgentStatus(agentId, ipAddress) {
        this.transaction_id = 'CTI_CHECK_AGENT_STATE';
        this.agent_id = agentId;
        this.ip = ipAddress;

        const params = 'transaction_id=' + this.transaction_id + '&agent_id='
            + this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }

    blockNumber() {

    }

    getIpAddress(agentId) {
        const discObj = { 'agent_id': agentId };
        return this.httpInterceptor.post(this._getIpAddress, discObj).map(this.extractData).catch(this.handleError);
        // this.transaction_id = 'CTI_GET_AGENTIP';
        // this.agent_id = agentId;
        // let params = 'apps/cust_appsHandler.php?transaction_id='
        //     + this.transaction_id + '&agent_id=' + this.agent_id + '&resFormat=' + this.resFormat;

        // return this.http.get(this.address + params).map((res: Response) => this.extractData(res));
    }

    callAPI(params) {
        return this.http.get(this.address + this.path + params).map((res: Response) => this.extractData(res));
    }

    getTodayCallReports(agentId) {
        const discObj = { 'agent_id': agentId };
        return this.http.post(this._getCallDetails, discObj).map(this.extractData).catch(this.handleError);
        // return this.http
        //     .get(this.address + 'apps/cust_appsHandler.php?transaction_id=CTI_AGENT_CALL_RECORD&agent_id=' + agentId + '&resFormat=3')
        //     .map(this.extractData).catch(this.handleError);
    }

    getLoginKey(uname, password) {

        const Obj = { 'username': uname, 'password': password };
        return this.httpInterceptor.post(this._getLoginKey, Obj).map(this.extractData).catch(this.handleError);

        // return this.http.
        // get(this.address + 'apps/cust_appsHandler.php?transaction_id=
        // CTI_LOGIN_KEY & username=' + uname + ' & password=' + password + ' & resFormat=3')
        // .map(this.extractData).catch(this.handleError);

    }

    getCTILoginToken(uname, password) {

        const Obj = { 'username': uname, 'password': password };
        return this.httpInterceptor.post(this._getCTILoginToken, Obj).map(this.extractData).catch(this.handleError);

        // return this.http.get(this.address + 'apps/cust_appsHandler.php?transaction_id=CTI_LOGIN_KEY & username=' + uname + ' & password=' + password + ' & resFormat=3')
        //      .map(this.extractData).catch(this.handleError);

    }

    getCampaigns() {
        return this.http.get(this.address + 'apps/cust_appsHandler.php?transaction_id=CTI_GET_CAMPAIGNS&campaign_type=BLENDED&resFormat=3').map(this.extractData).catch(this.handleError);
    }

    getTransferableCampaigns(agentId, ipAddress) {
        const Obj = { 'agent_id': agentId };
        return this.httpInterceptor.post(this._getTransferableCampaign, Obj).map(this.extractData).catch(this.handleError);
        // //apps/appsHandler.php?transaction_id=CTI_TRANSFERABLE_CAMPAIGNS&agent_id=2004&ip=10.208.25.16&resFormat=3
        // return this.http.get(this.address + 'apps/appsHandler.php?
        // transaction_id = CTI_TRANSFERABLE_CAMPAIGNS & agent_id=' + agentId + ' & ip=' +
        //  ipAddress + ' & resFormat=3').map(this.extractData).catch(this.handleError);
    }
    // Yet To come
    transferToCampaign(agentId, ipAddress, toCampaign, benCallID?, skillTransferFlag?, skill?, callType?, callTypeID?) {
        let Obj = {};
        if (skillTransferFlag != undefined && skill != undefined) {
            Obj = {
                'transfer_from': agentId,
                'transfer_campaign_info': toCampaign,
                'skill_transfer_flag': skillTransferFlag,
                'skill': skill,
                'agentIPAddress': ipAddress,
                'benCallID': benCallID,
                'callType': callType,
                'callTypeID': callTypeID

            };

            if (skill === '') {
                Obj['skill'] = undefined;
            }
        } else {
            Obj = {
                'transfer_from': agentId,
                'transfer_campaign_info': toCampaign,
                'skill_transfer_flag': skillTransferFlag,
                'agentIPAddress': ipAddress,
                'benCallID': benCallID
                // 'skill': skill
            };
        }

       
        return this.httpInterceptor.post(this._transferCall, Obj).map(this.extractData).catch(this.handleError);

        // return this.http.get(this.address + 'apps/appsHandler.php?transaction_id=CTI_TRANSFER_CAMPAIGN&agent_id=' + agentId + '&transfer_campaign_info=' + toCampaign + '&ip=' + ipAddress + '&resFormat=3').map(this.extractData).catch(this.handleError);
    }

    getAgentStatus() {
        this.agent_id = this.data_service.agentID;
        const obj = { 'agent_id': this.agent_id };

        return this.http.post(this._getAgentStatus_url, obj).map(this.extractData).catch(this.handleError);
    }

    getCallDetails() {
        this.agent_id = this.data_service.agentID;

        const obj = { 'agent_id': this.agent_id };
        return this.http.post(this._getCallDetails, obj).map(this.extractData).catch(this.handleError);
    }



    transferCall(transferFromAgentId, transferToAgentId, ipAddress) {
        // const dialObj = { 'agent_id': agentId, 'phone_num': phoneNum };
        // return this.http.post(this._dialBeneficiary, dialObj).map(this.extractData).catch(this.handleError);


        this.transaction_id = 'CTI_TRANSFER_AGENT';
        this.ip = ipAddress;

        let params = 'transaction_id=' + this.transaction_id + '&transfer_ from=' +
            transferFromAgentId + '&transfer_to=' + transferToAgentId + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }

    transferEmergencyCall(agentID, ip, phone_num) {


        this.transaction_id = 'CTI_CONFERENCE_DIAL';
        this.agent_id = agentID;
        this.ip = ip;
        this.resFormat = 3;
    //    console.log(agentID, ip, phone_num, 'PARAMETERS');
        let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id +
            '&ip=' + this.ip + '&phone_no=' + phone_num + '&dialType=EXTERNAL&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }

    getAgentPhoneNumber(agentId) {
        this.transaction_id = 'CTI_GETNUMBER';
        this.agent_id = agentId;

        const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }

    switchToReadyMode(agentId, ipAddress) {
        this.transaction_id = 'CTI_READY';
        this.agent_id = agentId;
        this.ip = ipAddress;

        const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id
            + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }

    switchBreakFree(agentId, ipAddress, state) { // state : BREAK / FREE
        this.transaction_id = 'CTI_PAUSE';
        this.agent_id = agentId;
        this.ip = ipAddress;

        const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id +
            '&state=' + state + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
        return this.callAPI(params);
    }
    private extractData(res: Response) {
        // console.log("inside extractData:"+JSON.stringify(res.json()));
        // let body = res.json();
        // return body.data || {};
       // return res.json().data;
       if (res.json().data) {
        return res.json().data;
      } else {
        return Observable.throw(res.json());
      }
    };

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        // let errMsg: string;
        // if (error instanceof Response) {
        //     const body = error.json() || '';
        //     const err = body.error || JSON.stringify(body);
        //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        // } else {
        //     errMsg = error.message ? error.message : error.toString();
        // }
        // console.error(errMsg);
        //  return Observable.throw(error.json());
        return Observable.throw(error.json());
    };


}

