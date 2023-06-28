import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CoReferralService {

    test = [];
    _baseurl = this._config.get1097BaseURL();
    _commonUrl = this._config.getCommonBaseURL();
    _104baseURl = this._config.get104BaseURL();
    _categoryurl = this._baseurl + "api/helpline1097/co/get/category"
    _subcategoryurl = this._baseurl + "api/helpline1097/co/get/subcategory"
    _getDetailsURL = this._baseurl + "iEMR/saveBenCalReferralMapping"
    _getReferralHistoryURL = this._baseurl + "services/getReferralsHistory";
    _servicetypesurl = this._baseurl + "api/helpline1097/co/get/servicetypes";
    getReferralInstituteDetailsURL = this._commonUrl + 'directory/getInstitutesDirectories';

    savingDirectorySearchHistory_url = this._104baseURl + 'beneficiary/save/directorySearchHistory';
    getDirectorySearchHistory_url = this._104baseURl + 'beneficiary/getdirectorySearchHistory';

    constructor(
        private _http: SecurityInterceptedHttp,
        private _config: ConfigService,
        private _httpInter: InterceptedHttp
    ) { }
    // getCategories ()
    // {
    //     return this._http.post( this._categoryurl, this.options )
    //         .map( this.extractData )
    //         .catch( this.handleError );
    // }
    // getSubCategories ( id: any )
    // {
    //     let data = { "categoryID": id };
    //     return this._http.post( this._subcategoryurl, data, this.options )
    //         .map( this.extractData )
    //         .catch( this.handleError );
    // }


    // getDetails(request_array) {

    //     console.log("Request: " + JSON.stringify(request_array));

    //     return this._httpInter.post(this._getDetailsURL, request_array)
    getDetails(instituteDirectoryID: number, instituteSubDirectoryID: number, stateID: number, districtID: number, districtBranchMappingID: number, createdBy: string, beneficiaryRegID: number, serviceID1097: number,
        benCallID: number) {
        let data = [{
            "beneficiaryRegID": beneficiaryRegID, "benCallID": benCallID, "serviceID1097": serviceID1097, "createdBy": createdBy,
            "instituteDirectoryID": instituteDirectoryID, "instituteSubDirectoryID": instituteSubDirectoryID, "stateID": stateID,
            "districtID": districtID, "districtBranchMappingID": districtBranchMappingID
        }];



        return this._httpInter.post(this._getDetailsURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getReferralInstituteDetails(data) {
        return this._httpInter.post(this.getReferralInstituteDetailsURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getReferralHistoryByID(id: any) {
        return this._http.post(this._getReferralHistoryURL, { "beneficiaryRegID": id }).map(this.extractData).catch(this.handleError);
    }

    getTypes() {
        return this._http.post(this._servicetypesurl, {})
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveDirectorySeachHistory(requestArray) {
        return this._http.post(this.savingDirectorySearchHistory_url, requestArray)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDirectorySeachHistory(reqObj) {
        return this._http.post(this.getDirectorySearchHistory_url, reqObj)
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
};



