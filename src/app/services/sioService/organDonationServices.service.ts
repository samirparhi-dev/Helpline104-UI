import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class OrganDonationServices {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, private _httpInterceptor: InterceptedHttp) { }

	address: String = this._config.get104BaseURL();
	OrganDonationHistoryURL: string = "beneficiary/get/organDonationRequestDetails";
	OrganDonationRequestURL: string = "beneficiary/save/organDonationRequestDetails";
	OrganDonationTypesURL: string = "beneficiary/get/organDonationTypes";
	DonatableOrgansURL: string = "beneficiary/get/DonatableOrgans";
	savingOrganDonationInstitutionUrl = "beneficiary/save/organDonationInstituteDetails";
	UpdateOrganDonationRequestURL="beneficiary/update/organDonationRequestDetails";
	getOrganDonationHistoryByBenID(id: any) {
		return this.http.post(this.address + this.OrganDonationHistoryURL, id)
			.map(this.extractData).catch(this.handleError);
	}

	saveOrganDonationRequest(organ_Donation_Request_Obj: any) {
		return this._httpInterceptor.post(this.address + this.OrganDonationRequestURL, organ_Donation_Request_Obj)
			.map(this.extractData).catch(this.handleError);
	}

	updateOrganDonationRequest(organ_Donation_Request_Obj: any) {
		return this._httpInterceptor.post(this.address + this.UpdateOrganDonationRequestURL, organ_Donation_Request_Obj)
			.map(this.extractData).catch(this.handleError);
	}

	getOrganDonationTypes() {
		return this.http.post(this.address + this.OrganDonationTypesURL, {})
			.map(this.extractData).catch(this.handleError);
	}

	getDonatableOrgans() {
		return this.http.post(this.address + this.DonatableOrgansURL, {})
			.map(this.extractData).catch(this.handleError);
	}
	savingOrganDonationInstitution(obj) {
		return this._httpInterceptor.post(this.address + this.savingOrganDonationInstitutionUrl, obj)
			.map(this.extractData).catch(this.handleError);
	}
	private extractData(response: Response) {
	//	console.log("ooo", response);
		if (response.json().data) {
		//	console.log(response);
		//	console.log(response.json());
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

