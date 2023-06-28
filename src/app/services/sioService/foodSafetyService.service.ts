import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class FoodSafetyServices {

	constructor(private http: SecurityInterceptedHttp, private _config: ConfigService, private _httpInterceptor: InterceptedHttp) { }

	address: String = this._config.get104BaseURL();
	//address: string = "http://localhost:8080/";

	getFoodSafetyComplaintsURL: string = "beneficiary/get/foodComplaintDetails";
	setFoodSafetyComplaintURL: string = "beneficiary/save/foodComplaintDetails";
	getComplaintTypesURL: string = "beneficiary/get/bloodComponentTypes";


	getComplaintTypes() {
		return this.http.post(this.address + this.getComplaintTypesURL, {})
			.map(this.extractData).catch(this.handleError);
	}

	getFoodSafetyComplaintsByBenID(data) {
		return this.http.post(this.address + this.getFoodSafetyComplaintsURL, data)
			.map(this.extractData).catch(this.handleError);
	}

	saveFoodSafetyComplaint(foodSafetyRequestObj: any) {
	//	console.log(foodSafetyRequestObj);
		return this.http.post(this.address + this.setFoodSafetyComplaintURL, foodSafetyRequestObj)
			.map(this.extractData).catch(this.handleError);
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

