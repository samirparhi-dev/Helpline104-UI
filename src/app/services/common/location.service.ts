import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { InterceptedHttp } from 'app/http.interceptor';

@Injectable()
export class LocationService
{
    // _commonBaseURL = "http://localhost:9090/CommonV1/";
    _commonBaseURL = this._config.getCommonBaseURL();
    _104BaseURL = this._config.get104BaseURL();
    _getStateListURL = this._commonBaseURL + "location/states/";
    _getDistrictListURL = this._commonBaseURL + "location/districts/";
    _getTalukListURL = this._commonBaseURL + "location/taluks/";
    _getBlockListURL = this._commonBaseURL + "location/districtblocks/";
    _getBranchListURL = this._commonBaseURL + "location/village/";
    _getInstituteListURL = this._commonBaseURL + 'institute/getInstituteTypes/';
    _getDesignationListURL = this._commonBaseURL + "institute/getDesignationsByInstitute/";
    _getDirectoriesListURL = this._commonBaseURL + "directory/getDirectory/";
    _getSubDirectoriesListURL = this._commonBaseURL + "directory/getSubDirectory/";
    _getCountryURL = this._104BaseURL + "/countryCityController/getCountry";
    _getCityURL = this._104BaseURL + "/countryCityController/getCities/";
    _getInstNameURL = this._commonBaseURL + "/institute/getInstituteNameByTypeAndDistrict/";
    _getInstNameByIdURL = this._commonBaseURL + "/institute/getInstituteName/";
    _getFaciltySupportServiceURL = this._104BaseURL + "/beneficiary/fetchimrmmrmasters";
    _getGovtIDURL = this._commonBaseURL + "beneficiary/getRegistrationDataV1";
    

    //test = [];
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    constructor( private _http: SecurityInterceptedHttp,private _config: ConfigService,private httpIntercept: InterceptedHttp ) { }
    getStates ( countryId: number )
    {
        return this._http.get( this._getStateListURL + countryId )
            .map( this.extractData )
            .catch( this.handleError );
    }
    getDistricts ( stateId: number )
    {
        return this._http.get( this._getDistrictListURL + stateId )
            .map( this.extractData )
            .catch( this.handleError );

    }
    getTaluks ( districtId: number )
    {
        return this._http.get( this._getTalukListURL + districtId )
            .map( this.extractData )
            .catch( this.handleError );

    }
    getSTBs ( talukId: number )
    {
        return this._http.get( this._getBlockListURL + talukId )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getBranches ( blockId: number )
    {
        return this._http.get( this._getBranchListURL + blockId )
            .map( this.extractData )
            .catch( this.handleError );

    }
    getDirectory ()
    {
        let data = {};
        return this._http.post( this._getDistrictListURL, data )
            .map( this.extractData )
            .catch( this.handleError );

    }
    getSubDirectory ( directoryId: number )
    {
        let data = {};
        data = { "instituteDirectoryID": directoryId };
        return this._http.post( this._getSubDirectoriesListURL, data )
            .map( this.extractData )
            .catch( this.handleError );

    }
    getInstituteList ( object: any )
    {
        // let data = { "stateID": object.stateID, "districtID": object.districtID, "districtBranchMappingID": object.districtBranchMappingID };
        return this._http.post( this._getInstituteListURL, object )
            .map( this.extractData )
            .catch( this.handleError );
    }
    getInstituteNames(obj)
    {
        return this._http.get( this._getInstNameURL + obj )
        .map( this.extractData )
        .catch( this.handleError );
    }
    getInstituteNamesByID(obj)
    {
        return this._http.get( this._getInstNameByIdURL + obj )
        .map( this.extractData )
        .catch( this.handleError );
    }
    getFacilitySupportService()
    {

        return this._http.get( this._getFaciltySupportServiceURL)
            .map( this.extractData )
            .catch( this.handleError );
    }

    getCommonData(providerserviceMapID: number) {
        let data = {};
        data = { "providerserviceMapID": providerserviceMapID };
        return this._http.post( this._getGovtIDURL, data)
        .map(this.extractData)
        .catch(this.handleError);
    }
   
    

    private extractData ( response: Response )
	{
		if ( response.json().data )
		{
			return response.json().data;
		} else
		{
            return Observable.throw(response.json());
		}
	}

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		// let errMsg: string;
		// if (error instanceof Response) {
		// 	const body = error.json() || '';
		// 	const err = body.error || JSON.stringify(body);
		// 	errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		// } else {
		// 	errMsg = error.message ? error.message : error.toString();
		// }
		// console.error(errMsg);
		return Observable.throw(error.json());
    };
    
    getCountry()
    {
               
        return this._http.get( this._getCountryURL)
        .map( this.extractData )
        .catch( this.handleError );
    }

    getCity(CountryId : number)
    {
               
        return this._http.get( this._getCityURL + CountryId)
        .map( this.extractData )
        .catch( this.handleError );
    }
};