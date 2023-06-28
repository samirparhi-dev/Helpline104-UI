import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()
export class SearchService {
    public url: string;
    _commonBaseUrl = this._config.getCommonBaseURL();
    _104BaseUrl = this._config.get104BaseURL();
    responseData: any;
    _getuserdata = "beneficiary/searchUserByID/";
    _updatebeneficiaryurl = "beneficiary/update/";
    _getuserdatabyno: any;
    _searchBeneficiaryURL: any;
    _fhirBaseUrl =this._config.getFHIRBaseURL();
    _updatebeneficiaryincall = this._commonBaseUrl + 'call/updatebeneficiaryincall';
    updateOtherURL = '/beneficiary/updateCommunityorEducation';
    _getHealthIdURL = '/healthID/getBenhealthID'

    /*Edited by: Diamond Khanna, Date:28,september,2017*/
    getStates_url: any;
    getDistricts_url: any;
    getSubDistricts_url: any;
    getFacilityMaster_url: any;
    getSaveAppointment_url
    getVillages_url: any;
    /*end*/

    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) {
        this._getuserdatabyno = this._commonBaseUrl + 'beneficiary/searchUserByPhone/';
        this._searchBeneficiaryURL = this._commonBaseUrl + "beneficiary/searchBeneficiary";

        /*Edited by: Diamond Khanna, Date:28,september,2017*/
        this.getStates_url = this._adminUrl + "m/role/state";
        this.getDistricts_url = this._104BaseUrl + "location/districts/";
        this.getSubDistricts_url = this._commonBaseUrl + "location/taluks/";
        this.getVillages_url = this._commonBaseUrl + "location/village/";
        this.createBenURL = this._commonBaseUrl + "beneficiary/create";
        /*end*/
        this.getFacilityMaster_url = this._commonBaseUrl + "uptsu/get/facilityMaster/";
        this.getSaveAppointment_url = this._commonBaseUrl + "uptsu/save/appointment-details";
    }
    createBenURL: any;
    address: any = this._config.get104BaseURL();
    _adminUrl = this._config.getAdminBaseURL();


    searchBenficiary(values: any) {
        // var headers = new Headers();
        // headers.append('Accept', 'application/json');
        // headers.append('Content-Type', 'application/json');
        // let lastName = "";
        // let firstName = "";
        // let fatherNameHusbandNameSearch = "";
        // let gender = "";
        // let beneficiaryID = "";
        // let district = "";
        // let talukSearch = "";
        // if (values.firstName != undefined) {
        //     firstName = values.firstName;
        // }
        // if (values.lastName != undefined) {
        //     lastName = values.lastName;
        // }
        // if (values.fatherNameHusbandNameSearch != undefined) {
        //     fatherNameHusbandNameSearch = values.fatherNameHusbandNameSearch;
        // }
        // if (values.gender != undefined) {
        //     gender = values.gender;
        // }
        // if (values.beneficiaryID != undefined) {
        //     beneficiaryID = values.beneficiaryID;
        // }
        // if (values.districtSearch != undefined) {
        //     district = values.districtSearch;
        // }
        // if (values.talukSearch != undefined) {
        //     talukSearch = values.talukSearch;
        // }


        // let createData = '{"firstName":"' + firstName + '","lastName":"' + lastName + '","fatherName":"' + fatherNameHusbandNameSearch + '",'
        //     + '"genderID":"' + gender + '","beneficiaryID": "' + beneficiaryID + '","i_bendemographics":[{'
        //     + '"stateID":"' + district + '",'
        //     + '"cityID":"' + talukSearch + '"'
        //     + '}]}';
        // console.log(JSON.stringify(createData));
        // console.log(createData);

        // return this.httpIntercept.post(this.address + '/beneficiary/searchBeneficiary', createData)
        //     .map(this.extractData).catch(this.handleError);
        return this._http.post(this._searchBeneficiaryURL, values)
            .map(this.extractData).catch(this.handleError);
    }

    updatebeneficiaryincall(callData: any) {
        callData.is1097 = false;
    //    console.log('Data for call update: ' + callData);
        return this._http.post(this._updatebeneficiaryincall, callData)
          .map(this.extractData)
          .catch(this.handleError);
      }

    // retrieveRegHistoryByPhoneNo(phoneNo: any) {
    //     console.log("retrieveRegHistoryByPhone")
    //     let data = { "phoneNo": "" + phoneNo, "pageNo": 1, "rowsPerPage": 1000 };
    //     return this._http.post(this.address + "/beneficiary/searchUserByPhone/", data)
    //         .map(this.extractData).catch(this.handleError);
    // }
    retrieveRegHistoryByPhoneNo(phoneNo: any) {
        const data = { 'phoneNo': phoneNo, 'pageNo': 1, 'rowsPerPage': 1000 };
        return this.httpIntercept.post(this._getuserdatabyno, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*Edited by: Diamond Khanna, Date:28,september,2017*/
    getDistricts(stateID) {
        return this._http.get(this.address + "location/districts/" + stateID)
            .map(this.extractData).catch(this.handleError);
    }

    getSubDistricts(districtID) {
        return this._http.get(this.getSubDistricts_url + districtID)
            .map(this.extractData).catch(this.handleError);
    }

    getVillages(subDistrictID) {
        return this._http.get(this.getVillages_url + subDistrictID)
            .map(this.extractData).catch(this.handleError);
    }

    /*end*/
    getFaciliyMaster(requestObj) {
        return this._http.get(this.getFacilityMaster_url + requestObj.providerServiceMapID + "/"+ requestObj.blockName, requestObj)
            .map(this.extractData).catch(this.handleError);
    }

    saveAppointmentDetails(requestObj){
        return this._http.post(this.getSaveAppointment_url , requestObj)
            .map(this.extractData).catch(this.handleError);

    }

    getHealthCareWorkerTypes() {
        return this._http.post(this.address + "/beneficiary/get/healthCareWorkerTypes", {})
            .map(this.extractData).catch(this.handleError);
    }
    registerBeneficiary(data) {

        var headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        return this.httpIntercept.post(this.createBenURL, data)
            .map(this.extractData).catch(this.handleError);

    }
    /*Edited by: Diamond Khanna, Date:28,september,2017*/
    getProviderStates(serviceProviderID) {
        return this._http.post(this.getStates_url, { "serviceProviderID": serviceProviderID })
            .map(this.extractData)
            .catch(this.handleError);
    }
    /*end*/
    getCommonData() {
        return this.httpIntercept.post(this._commonBaseUrl + "beneficiary/getRegistrationDataV1", {}).map(this.extractData).catch(this.handleError);
    }

    getRelationships() {
        return this._http.get(this._commonBaseUrl + "+/user/get/beneficiaryRelationship").map(this.extractData).catch(this.handleError);
    }

    retrieveRegHistory(registrationNo: any) {
    //    console.log("retrieveRegHistory")
        return this.httpIntercept.post(this._commonBaseUrl + this._getuserdata, registrationNo).map(this.extractData).catch(this.handleError);
    }

    updateBeneficiaryData(values: any) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

    //    console.log('data to be updated in service is', values)
        return this.httpIntercept.post(this._commonBaseUrl + this._updatebeneficiaryurl, values)
            .map(this.extractData).catch(this.handleError);
        // }
    }
    //SH20094090,23-092021,HealthID Integration changes on Innerpage
    fetchHealthIdDetails(obj)
    {
        return this._http.post(this._fhirBaseUrl + this._getHealthIdURL, obj).map(this.extractData).catch(this.handleError);
    }
    updateOtherBenDetails(obj){
        return this._http.post(this._commonBaseUrl + this.updateOtherURL, obj).map(this.extractData).catch(this.handleError);
    }
    private extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    }
    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        return Observable.throw(error.json());
    };

}

