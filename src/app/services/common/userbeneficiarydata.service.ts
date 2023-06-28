import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class UserBeneficiaryData
{
    // _commonBaseURL = "http://localhost:9090/CommonV1/";
    _commonBaseURL = this._config.getCommonBaseURL();
    _104BaseURL = this._config.get104BaseURL();
    _getUserBeneficaryDataURL = this._commonBaseURL + "beneficiary/getRegistrationDataV1/";
    _storeAltNumberURL =  this._104BaseURL + "beneficiary/save/BeneficiaryPhoneNumber";
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    constructor( private _http: SecurityInterceptedHttp,private _config: ConfigService ) { }
    getUserBeneficaryData (data)
    {      
        return this._http.post( this._getUserBeneficaryDataURL, data )
            .map( this.extractData )
            .catch( this.handleError );
    }

    storeAlternateNumber(data){
         return this._http.post( this._storeAltNumberURL, data )
            .map( this.extractData )
            .catch( this.handleError );
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
	}
}