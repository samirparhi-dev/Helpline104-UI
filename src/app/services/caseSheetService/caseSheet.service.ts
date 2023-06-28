import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';

@Injectable()
export class CaseSheetService {
	_104baseUrl = this._config.get104BaseURL();
	commenBaseUrl = this._config.getCommonBaseURL();
	_1097baseUrl = this._config.get1097BaseURL();
	// _104baseUrl = "http://localhost:8080/";
	constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }
	headers = new Headers({ 'Content-Type': 'application/json' });
	options = new RequestOptions({ headers: this.headers });

	getPreviousCovidVaccineData(data) {
		return this.httpIntercept.post(this.commenBaseUrl + "covid/getCovidVaccinationDetails", data)
			.map(this.extractDataCovidVaccine)
			.catch(this.handleError);
	}
	saveCovidVaccineData(data) {
		return this.httpIntercept.post(this.commenBaseUrl + "covid/saveCovidVaccinationDetails", data)
			.map(this.extractDataCovidVaccine)
			.catch(this.handleError);
	}
	getCovidVaccineMasterData() {
		return this.httpIntercept.get(this.commenBaseUrl + "covid/master/VaccinationTypeAndDoseTaken")
			.map(this.extractDataCovidVaccine)
			.catch(this.handleError);
	}
	getCaseSheetData(data) {
		return this.httpIntercept.post(this.commenBaseUrl + "beneficiary/get104BenMedHistory", data)
			.map(this.extractData)
			.catch(this.handleError);
	}
	getValidCaseSheetData(data) {
		return this._http.post(this._104baseUrl + "beneficiary/get/latestValidPescription", data)
			.map(this.extractData)
			.catch(this.handleError);
	}
	saveCaseSheetData(data) {
		return this.httpIntercept.post(this._104baseUrl + "beneficiary/save/benCaseSheet", data)
			.map(this.extractData)
			.catch(this.handleError);
	}
	
	getCategories(obj) {
		return this.httpIntercept.post(this.commenBaseUrl + "service/category", obj)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getSubCategories(categoryID) {
		return this.httpIntercept.post(this.commenBaseUrl + "service/subcategory", { "categoryID": categoryID })
			.map(this.extractData)
			.catch(this.handleError);
	}
	getDetails(array) {
		return this.httpIntercept.post(this.commenBaseUrl + "service/getSubCategoryFilesWithURL", array)
			.map(this.extractData)
			.catch(this.handleError);
	}
	getPresentCaseSheet(obj){
		return this.httpIntercept.post(this._104baseUrl + 'beneficiary/getPresentCaseSheet',obj).map(this.extractData).catch(this.handleError);
	}
	getDiseaseName() {
		return this.httpIntercept.post(this._104baseUrl + 'diseaseController/getAvailableDiseases', {}).map(this.extractData).catch(this.handleError);
	}
	getDiseaseData(diseaseObj) {
		return this.httpIntercept.post(this._104baseUrl + 'diseaseController/getDiseasesByID', diseaseObj).map(this.extractData).catch(this.handleError);
	}
	private extractData(response: Response) {
	//	console.log(response);
		if (response.json().data) {
			return response.json().data;
		} else {
			return Observable.throw(response.json());
		}
	}
	private extractDataCovidVaccine(response: Response) {
		//	console.log(response);
			if (response.json()) {
				return response.json();
			} else {
				return Observable.throw(response.json());
			}
		}
	private handleError(error: Response | any) {
		return Observable.throw(error.json());
	};

	getHihlMasterData() {
		return this.httpIntercept.get(this._104baseUrl + "hihl/get/masters")
			.map(this.extractData)
			.catch(this.handleError);
	}	

	saveHihlFormData(data){
		return this.httpIntercept.post(this._104baseUrl + "hihl/save/casesheet", data)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getInstituteData(reqObj){
		return this.httpIntercept.post(this.commenBaseUrl + "institute/getInstituteTypes" , reqObj)
		.map(this.extractData)
		.catch(this.handleError);
	  }

	  getInstituteNameData(institutionTypeID){
		return this.httpIntercept.get(this.commenBaseUrl + "institute/getInstituteName/" + institutionTypeID)
		.map(this.extractData)
		.catch(this.handleError);
	  }

	  getHihlCounsellingData(benRegId){
		return this.httpIntercept.get(this._104baseUrl + "hihl/getHihlCasesheetHistoryInfo/" + benRegId)
			.map(this.extractData)
			.catch(this.handleError);
	  }

	  searchDiagnosisBasedOnPageNo1(searchTerm, pageNo) {
		let reqObj = {
		  term: searchTerm,
		  pageNo: pageNo,
		};
		return this.httpIntercept.post(this.commenBaseUrl + "snomed/getSnomedCTRecordList", reqObj)
			.map(this.extractData)
			.catch(this.handleError);
	}
	
}