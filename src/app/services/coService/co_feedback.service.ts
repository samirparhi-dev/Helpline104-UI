import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CoFeedbackService {

    test = [];
    // private _baseurl: string = "http://localhost:9090/helpline1097APIV1/"
    private _baseurl: String = this._config.get1097BaseURL();
    private _commonBaseURL: String = this._config.getCommonBaseURL();
    private _104baseurl: String = this._config.get104BaseURL();

    private _createFeedbackURL: string = this._104baseurl + "beneficiary/saveBenFeedback/"
    private _getDesignationsURL: string = this._commonBaseURL + "institute/getDesignations"
    private _getFeedbackHistoryByID: string = this._commonBaseURL + "feedback/getFeedbacksList"
    private getCategoryUrl: string = this._commonBaseURL + 'category/categories';
    private getSubCategoryUrl: string = this._commonBaseURL + 'service/subcategory';
    private _createImrMmrURL: string = this._104baseurl + "beneficiary/saveIMRMMR/";
    private _getIMRMMRWorklistURL: string = this._104baseurl + "beneficiary/getIMRMMRList/";
    private _updateImrMmrURL: string = this._104baseurl + "/beneficiary/update/ImrMmrComplaint/";
    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private _httpInterceptor: InterceptedHttp) { }

    createImrMmrURL(data: any) {
        return this._httpInterceptor.post(this._createImrMmrURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateImrMmrURL(data: any) {
        return this._httpInterceptor.post(this._updateImrMmrURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getIMRMMRWorklist(data: any) {
        return this._httpInterceptor.post(this._getIMRMMRWorklistURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    createFeedback(data: any) {
        return this._httpInterceptor.post(this._createFeedbackURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDesignations() {
        let data = {};
        return this._http.get(this._getDesignationsURL)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCategory(psmID, feedbackNatureID) {
        let data = {
            'providerServiceMapID': psmID,
            'feedbackNatureID': feedbackNatureID
        }
        return this._httpInterceptor.post(this.getCategoryUrl, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSubCategory(categoryID) {
        let data = {
            'categoryID': categoryID
        }
        return this._httpInterceptor.post(this.getSubCategoryUrl, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(response: Response) {
    //    console.log("inside data" + response);
        if (response.json().data) {
            return response.json();
        } else {
        //    console.log("google");
            return Observable.throw(response.json());
        }
    }
    private handleError(error: Response | any) {
        // console.log("inside error" + error);
        // // In a real world app, you might use a remote logging infrastructure
        // let errMsg: string;
        // if (error instanceof Response) {
        //     const body = error.json() || '';
        //     const err = body.error || JSON.stringify(body);
        //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        // } else {
        //     errMsg = error.message ? error.message : error.toString();
        // }
        // console.error(errMsg);
        return Observable.throw(error.json());
    };

    getFeedbackHistoryById(benId: any, servID: any) {
        return this._http.post(this._getFeedbackHistoryByID, { "beneficiaryRegID": benId, "serviceID": servID }).map(this.extractData).catch(this.handleError);
    }
    getFeedbackHistoryByPh(obj: any) {
		return this._http.post(this._getFeedbackHistoryByID, obj)
			.map(this.extractData).catch(this.handleError);
	}
};



