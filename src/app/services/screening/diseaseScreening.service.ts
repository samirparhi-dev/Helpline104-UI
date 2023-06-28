import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';

@Injectable()
export class DiseaseScreeningService {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService) { };

	address: String = this._config.get104BaseURL();
	common_base_url: any = this._config.getCommonBaseURL();

	getQuestionsListURL: string = "beneficiary/get/questions";
	getAnswersListURL: string = "beneficiary/get/answers";
	getQuestionType_url: string = this.common_base_url + "questionTypeController/get/questionTypeList";


	getQuestionsList(data) {
		return this.http.post(this.address + this.getQuestionsListURL, data).map(this.extractData).catch(this.handleError);
	}

	getAnswersList(data) {
		return this.http.post(this.address + this.getAnswersListURL, data).map(this.extractData).catch(this.handleError);
	}

	getQuestionTypes() {
		return this.http.post(this.getQuestionType_url, {}).map(this.extractData).catch(this.handleError);
	}

	private extractData(res: Response) {
		// console.log("inside extractData:"+JSON.stringify(res.json()));
		// let body = res.json();
		//return body.data || {};
		if (res.json().data) {

			return res.json().data;
		} else {

			return res.json();
		}
	};

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		return Observable.throw(error.json());
	};

}