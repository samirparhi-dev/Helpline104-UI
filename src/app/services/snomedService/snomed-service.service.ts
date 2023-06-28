import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs/Observable';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class SnomedService {
	_104baseUrl = this._config.get104BaseURL();


	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService) { }

	getSnomedCTRecord(term) {
		return this.http.post(this._104baseUrl + "snomed/getSnomedCTRecord/", { "term": term }).map(this.extractData).catch(this.handleError);
	}

	private extractData(response: Response) {
		//console.log(response);
		if (response.json().data) {
			return response.json().data;
		} else {
			return Observable.throw(response.json());
		}
	}
	private handleError(error: Response | any) {
		return Observable.throw(error.json());
	};


}
