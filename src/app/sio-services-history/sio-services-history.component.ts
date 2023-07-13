/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component, OnInit, Input } from '@angular/core';
import { SioService } from '../services/sioService/sio.service';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-sio-services-history',
  templateUrl: './sio-services-history.component.html',
  styleUrls: ['./sio-services-history.component.css']
})
export class SioServicesHistoryComponent implements OnInit {
	beneficiaryDetails:any;
	beneficiaryRegID:any;
	sioHistory: any = [];
	currentLanguageSet: any;
	constructor(public sioService: SioService,public saved_data: dataService,public HttpServices: HttpServices) {
		 this.beneficiaryDetails = this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
	 }

	ngOnInit() {
		this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
		let data='{"benificiaryRegID":'+this.beneficiaryRegID+'}';
		this.sioService.getSioHistoryData(data).subscribe(response => this.successHandeler(response));
		this.currentLanguageSetValue();
	}

	successHandeler(response) {
		this.sioHistory = response;
		console.log(response);
	}

	@Input() current_language:any;
    current_language_set:any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'
    
    ngOnChanges()
    {
			if(this.current_language) {
      this.current_language_set=this.current_language;
			console.log("language in sio-services-history",this.current_language_set);
			}
    }

	currentLanguageSetValue() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
	  
	  ngDoCheck() {
		this.currentLanguageSetValue();
	  }    
}
