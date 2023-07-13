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


import { Component, OnInit, Output, EventEmitter, ViewChild, DoCheck } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { dataService } from '../services/dataService/data.service';
import { AvailableServices } from '../services/common/104-services';
import { NgForm } from '@angular/forms';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

declare var jQuery: any;

@Component({
	selector: 'app-outbound-search-records',
	templateUrl: './outbound-search-records.component.html',
	styleUrls: ['./outbound-search-records.component.css'],
	//providers:[]
})

export class OutboundSearchRecordsComponent implements OnInit, DoCheck {
	public showCreateFlag = false;
	serviceProviders:Array<any>= [];
	data: any;
	count: any;
	records: any;
	showFlage: boolean = false;
	//_unAllocatedCalls: any;
	serviceProviderMapID: number;

	tot_unAllocatedCalls: any;
	outbondWorklist: any;
	sioOutbondWorklist:Array<any> = [];
	//bpOutbondWorklist: any[];
	//diabeticBPOutbondWorklist = [];
	moOutbondWorklist:Array<any> = [];
	coOutbondWorklist :Array<any>= [];
	haoOutbondWorklist :Array<any>= [];
	pdOutboundWorklist:Array<any> = [];
	startDate: any;
	endDate: any;
	//services: any = [];
	requestObj: any = {};
	diabeticBPOutbondWorklist: any;
	postData: any;
	roleID: any;
	featureRoleMapArray: Array<any> = [];
	screenName: any;
	today: any;
	end_date: any;
	start_date: Date;
	maxStartDate: any;
	maxEndDate: any;

	@ViewChild('searchForm') searchForm: NgForm;
	assignSelectedLanguageValue: any;

	constructor(
		private _OSRService: OutboundSearchRecordService,
		private saved_data: dataService,
		private _availableServices: AvailableServices,
		private httpServices: HttpServices
	) {

	}

	ngOnInit() {
		this.assignSelectedLanguage();
		this.serviceProviderMapID = this.saved_data.current_service.serviceID;		

		this.requestObj = {
			"providerServiceMapID": this.saved_data.current_service.serviceID
		};
	
	    this.start_date = new Date();
		let start = new Date((this.start_date.getTime()) - 1 * (this.start_date.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
		this.end_date = new Date();
		let end = new Date((this.end_date.getTime()) - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.000Z";

		let obj = {
			"providerServiceMapID": this.serviceProviderMapID,
			"filterStartDate": start,
			"filterEndDate": end
		}
		this._OSRService.getUnallocatedCallswithFilter(obj)
			.subscribe(resProviderData => {
		//this._unAllocatedCalls = resProviderData.data;
		this.outbondWorklist = resProviderData.data;
		if (this.outbondWorklist) {
		this.tot_unAllocatedCalls = this.outbondWorklist.length;					
					
              this._OSRService.getFeatureRoleMapping(this.requestObj)
			  .subscribe((response) => {
			  console.log(response, "featureRoleMapArray");
			  this.featureRoleMapArray = response.data;				
			  this.filterWorkList();
			  },
		      (error) => {
			  console.log(error);
			  });
			}
			});

		this.today = new Date();

		// this.start_date = new Date();
		// this.start_date.setDate(this.today.getDate());
		// this.start_date.setHours(0, 0, 0, 0);

		// this.end_date = new Date();
		// this.end_date.setDate(this.today.getDate());
		// this.end_date.setHours(23, 59, 59, 0);

		this.maxStartDate = new Date();
		this.maxStartDate.setDate(this.today.getDate() + 30);
		this.maxStartDate.setHours(0, 0, 0, 0);

		this.maxEndDate = new Date();
		this.maxEndDate.setDate(this.today.getDate() + 30);
		this.maxEndDate.setHours(23, 59, 59, 0);
	}
	
	getMinValueForEndDate(sDate) {
		this.start_date.setHours(0, 0, 0, 0);
	}

	setEndDate(eDate) {
		this.end_date.setHours(23, 59, 59, 0);
	}

	blockKey(e: any) {
		if (e.keyCode === 9) {
			return true;
		}
		else {
			return false;
		}
	}

	allocationDone() {
		this.showFlage = false;
		//refreshing after allocation
		if (this.postData == undefined) {
			this.start_date = new Date();
			let start = new Date((this.start_date.getTime()) - 1 * (this.start_date.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
			this.end_date = new Date();
			let end = new Date((this.end_date.getTime()) - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.000Z";

			this.serviceProviderMapID = this.saved_data.current_service.serviceID;
			let obj = {
				"providerServiceMapID": this.serviceProviderMapID,
				"filterStartDate": start,
				"filterEndDate": end
			}
			this._OSRService.getUnallocatedCallswithFilter(obj)
				.subscribe(resProviderData => {
					//this._unAllocatedCalls = resProviderData.data;
					this.outbondWorklist = resProviderData.data;
					if (this.outbondWorklist) {
						this.tot_unAllocatedCalls = this.outbondWorklist.length;
						this.filterWorkList();
					}
				});
		}
		else {
			this._OSRService.getUnallocatedCallswithFilter(this.postData)
				.subscribe((res) => {
					this.outbondWorklist = res.data;
					if (this.outbondWorklist) {
						this.tot_unAllocatedCalls = this.outbondWorklist.length;
						this.filterWorkList();
					}
				})
		}
	}

	onSearchDate(values: any) {
		console.log(values);
		let startDate = new Date((values.startDate) - 1 * (values.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
		// startDate.setHours(0);
		// startDate.setMinutes(0);
		// startDate.setSeconds(0);
		// startDate.setMilliseconds(0);
		let endDate = new Date((values.endDate) - 1 * (values.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
		// endDate.setHours(23);
		// endDate.setMinutes(59);
		// endDate.setSeconds(59);
		// endDate.setMilliseconds(999);
		this.postData = {
			"providerServiceMapID": this.serviceProviderMapID,
			"filterStartDate": startDate,
			"filterEndDate": endDate
		}
		console.log(JSON.stringify(this.postData));
		this._OSRService.getUnallocatedCallswithFilter(this.postData)
			.subscribe((res) => {
				this.showFlage = false;
				this.outbondWorklist = res.data;
				if (this.outbondWorklist) {
					this.tot_unAllocatedCalls = this.outbondWorklist.length;
					this.filterWorkList();
				}
			})
	}

	filterWorkList() {

		this.sioOutbondWorklist = [];
		this.coOutbondWorklist = [];
		this.moOutbondWorklist = [];
		this.haoOutbondWorklist = [];
		this.pdOutboundWorklist = [];

		if (this.outbondWorklist) {
			let totWorkListItems = this.outbondWorklist.length;

			for (let i = 0; i < totWorkListItems; i++) {
			this.addtoWorklistByFeatureName(this.outbondWorklist[i].requestedFeature,this.outbondWorklist[i]);

			/*	if (this.outbondWorklist[i].requestedFeature) {
					if (this.outbondWorklist[i].requestedFeature.includes('Blood'))
						this.sioOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Epidemic Outbreak Service'))
						this.sioOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Organ Donation'))
						this.sioOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Food safety'))
						this.sioOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Counselling'))
						this.coOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Medical'))
						this.moOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Health'))
						this.haoOutbondWorklist.push(this.outbondWorklist[i]);
					else if (this.outbondWorklist[i].requestedFeature.includes('Psychiatrist'))
						this.pdOutboundWorklist.push(this.outbondWorklist[i]);
				} */
				
			}
		}

	}

	addtoWorklistByFeatureName(featureName,worklistItem) {
      
    var tempFilterArr = [];
    tempFilterArr = this.featureRoleMapArray.filter((obj) => {
      return obj.screen.screenName == featureName;
    }, this);
    console.log(tempFilterArr, "tempFilterArr");
    let roleID = tempFilterArr ? tempFilterArr[0].roleID : null;

    for (let i = 0; i < this.featureRoleMapArray.length; i++) {
      if ((this.featureRoleMapArray[i].roleID == roleID) && this.featureRoleMapArray[i].screen.screenName == 'Health_Advice') {
        this.haoOutbondWorklist.push(worklistItem);
        break;
      }
      else if ((this.featureRoleMapArray[i].roleID == roleID) && this.featureRoleMapArray[i].screen.screenName == 'Medical_Advice') {
        this.moOutbondWorklist.push(worklistItem);
        break;
      }
      else if ((this.featureRoleMapArray[i].roleID == roleID) && this.featureRoleMapArray[i].screen.screenName == 'Counselling') {
        this.coOutbondWorklist.push(worklistItem);
        break;
      }
      else if ((this.featureRoleMapArray[i].roleID == roleID) && this.featureRoleMapArray[i].screen.screenName == 'Psychiatrist') {
        this.pdOutboundWorklist.push(worklistItem);
        break;
      }
      else if ((this.featureRoleMapArray[i].roleID == roleID) && this.featureRoleMapArray[i].screen.screenName == 'Service_Improvements') {
        this.sioOutbondWorklist.push(worklistItem);
        break;
      }
      
    }
   
  }
    /*
	getSubserviceID(serviceName: any) {
		let subServiceID;
		for (let i = 0; i < this.services.length; i++) {
			if (this.services[i].subServiceName.indexOf(serviceName) != -1) {
				subServiceID = this.services[i].subServiceID;
				break;
			}
		}
		console.log("serviceName " + serviceName + " subServiceID: " + subServiceID);
		return subServiceID;
	} */

	allocateCalls(values: any, screenName, event) {

		console.log("allocateCalls: " + JSON.stringify(values), "screenName:", screenName);
		this.screenName = screenName;

		if (event.target.className == "mat-button-wrapper") {
			for (var i = 0; i < event.target.parentNode.parentNode.parentNode.parentNode.children.length; i++) {
				event.target.parentNode.parentNode.parentNode.parentNode.children[i].className = "";
			}
			event.target.parentNode.parentNode.parentNode.className = "highlightTrBg";
		}
		else {
			for (var i = 0; i < event.target.parentNode.parentNode.parentNode.children.length; i++) {
				event.target.parentNode.parentNode.parentNode.children[i].className = "";
			}
			event.target.parentNode.parentNode.className = "highlightTrBg";
		}
		this.showFlage = true;
		var tempFilterArr = [];
		tempFilterArr = this.featureRoleMapArray.filter((obj) => {
			return obj.screen.screenName == this.screenName;
		}, this);
		console.log(tempFilterArr, "filteredConfig");
		this.roleID = tempFilterArr[0].roleID;
		this.records = values;
	}
	 /*
   * JA354063 - Created on 23-07-2021
   */
	 assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
	  }
	  ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	  /* Ends*/
}
