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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { Observable } from 'rxjs/Observable'
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class FeedbackService {
    test = [];
    private _commonBaseURL = this._config.getCommonBaseURL();
    private _helpline1097BaseURL = this._config.get1097BaseURL();

    private _feedbackListURL: string = this._config.getCommonBaseURL() + 'feedback/getFeedbacksList';
    private _requestFeedbackURL: string = this._config.getCommonBaseURL() + 'feedback/saveFeedbackRequest';
    private _updateResponseURL: string = this._config.getCommonBaseURL() + 'feedback/updateResponse';

    private _getFeedbackStatus: string = this._config.getCommonBaseURL() + 'feedback/getFeedbackStatus'
    private _getEmailStatus: string = this._config.getCommonBaseURL() + 'feedback/getEmailStatus'
    // private _feedbackListURL: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/getFeedback"
    // private _updateurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/updateFeedback"
    // //  private _updateurl:string="http://localhost:8080/Helpline-104-API/grievance/updateFeedback"
    // private _statusurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/updateFeedbackStatus"
    // private _searchurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/searchFeedback1"
    // private _responurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/responceFeedback"
    // private _responceurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/getAllFeedbackById1"

    // private _feedbackListURL: string = this._config.getCommonBaseURL() + "feedback/getFeedback"
    // private _requestFeedbackURL: string = this._config.getCommonBaseURL() + "feedback/updateFeedback"
    //  private _updateurl:string=this._config.getCommonBaseURL()+"feedback/updateFeedback"
    // private _statusurl: string = this._config.getCommonBaseURL() + "feedback/updateFeedbackStatus"
    // private _searchurl: string = this._config.getCommonBaseURL() + "feedback/searchFeedback1"
    // private _responurl: string = this._config.getCommonBaseURL() + "feedback/responceFeedback"
    // private _responceurl: string = this._config.getCommonBaseURL() + "feedback/getAllFeedbackById1"
    private _fetchEmailIDs = this._config.getCommonBaseURL() + 'emailController/getAuthorityEmailID';
    private sendEmailurl = this._config.getCommonBaseURL() + 'emailController/SendEmail';

    constructor(
        private _http: SecurityInterceptedHttp,
        private _config: ConfigService,
        private httpIterceptor: InterceptedHttp
    ) { }
    getFeedback(data: any) {

        return this.httpIterceptor.post(this._feedbackListURL, data).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    getFeedbackStatuses() {
        let data = {};
        return this._http.post(this._getFeedbackStatus, data).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    getEmailStatuses() {
        let data = {};
        return this._http.post(this._getEmailStatus, data).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    requestFeedback(data: any) {

        //console.log(data);
        return this._http.post(this._requestFeedbackURL, data).map(this.handleSuccess).catch(this.handleError);

        // .map(( response: Response ) => response.json() );

    }
    // updateStatus ( sdata: any )
    // {
    //     return this._http.post( this._statusurl, sdata ).map( this.handleSuccess ).catch( this.handleError );
    //     // .map(( response: Response ) => response.json() );
    // }
    // searchFeedback ( searchdata: any )
    // {

    //     return this._http.post( this._searchurl, searchdata ).map( this.handleSuccess ).catch( this.handleError );
    //     // .map(( response: Response ) => response.json() );

    // }
    updateResponce(resData: any) {
        return this._http.post(this._updateResponseURL, resData).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }
    fetchEmails(obj: any) {
        return this.httpIterceptor.post(this._fetchEmailIDs, obj).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }
    sendEmail(obj) {
        return this.httpIterceptor.post(this.sendEmailurl,obj).map(this.handleSuccess).catch(this.handleSuccess);
    }

    // responce ( responce: any )
    // {
    //     return this._http.post( this._responceurl, responce ).map( this.handleSuccess ).catch( this.handleError );
    //     // .map(( response: Response ) => response.json() );

    // }

    handleSuccess(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }
    handleError(response: Response) {
        return Observable.throw(response.json());
    }
}