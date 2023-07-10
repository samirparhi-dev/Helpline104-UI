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


import { Component, OnInit, Inject, Input, HostListener } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { CoFeedbackService } from "../services/coService/co_feedback.service";
import { FeedbackTypes } from "../services/common/feedbacktypes.service";
import { ActivatedRoute, Params } from '@angular/router';
import { dataService } from '../services/dataService/data.service';
import { RegisteredBeneficiaryModal104 } from '../beneficiary-registration-104/beneficiary-registration-104.component';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';

import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
declare var jQuery: any;
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { SmartsearchService } from '../services/common/smartsearch-service.service';

import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
	selector: 'app-sio-grievience-service',
	templateUrl: './sio-grievience-service.component.html',
	styleUrls: ['./sio-grievience-service.component.css']
})
export class SioGrievienceServiceComponent implements OnInit {


	countryID: any = 1;
	isHealthCareWorker: boolean = false;
	data: any = [];
	beneficiaryDetails: any;
	benficiaryRegId: any;


	feedbackTypeID: any;

	genericFeedbackID: any;
	ashaFeedbackID: any;


	isAshaComplaintType: any = false;
	showFormCondition: boolean = false;
	showTableCondition: boolean = true;

	state: any;
	district: any;
	taluk: any;
	sdtb: any;
	institutionId: any;
	designation: any;
	feedbackType: any = "";
	severity: any;
	doi: any;

	feedbackDescription: any;
	//userid: any 	userID: any;;
	userID: any;

	states: Array<any> = [];
	districts:Array<any> = [];
	taluks:Array<any> = [];
	blocks:Array<any> = [];
	institutes:Array<any> = [];
	institutesName:Array<any>=[];
	designations:Array<any> = [];
	feedbackTypes:Array<any> = [];
	feedbackSeverities:Array<any> = [];
	firstName: any;
	lastName: any;
	gender: any;
	age: any;
	agentData: any;
	calledServiceID: any;
	benCallID: any;
	msg: any;
	serviceID: any;
	count: any;
	remarks: any;
	maxDate: Date;
	wrongDate: boolean = false;
	today: any = new Date;
	grievanceAgainst: any;
	healthcareWorkerTypeID: any;
	districtDropdown: boolean = false;
	temp_districts_array: Array<object> = [];
	keyName: any;
	originalArray:Array<any> = [];
	is_a_healthcare_worker: any = 'No';
	providerServiceMapID: any;

	categories = [];
	subcategories = [];
	categoryDisableFlag = false;
	category: any;
	subcategory: any;
	distID: number=-1;
	instID: number=-1;
	filteredFeedbackList: any;
	filterTerm;
	remarksAHEX:any;
	showFeedBackData: boolean;
	searchType:any = "GrievanceId";
	viewALL: any = true;
	current_role: any;
	minLength: number = 1;
	maxLength: number = 30;
	currentLanguageSet: any;
	institutionName: any;


	constructor(
		public dialog: MdDialog,
		private _smsService: SmsTemplateService,
		private _userBeneficiaryData: UserBeneficiaryData,
		private _locationService: LocationService,
		private _coFeedbackService: CoFeedbackService,
		private _feedbackTypes: FeedbackTypes,
		private router: ActivatedRoute,
		public commonAppData: dataService,
		private alertMesage: ConfirmationDialogsService,
		public smartsearch: SmartsearchService,
		public HttpServices: HttpServices
	) {
		this.beneficiaryDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
		//	console.log("beneficiaryDetails: " + JSON.stringify(this.beneficiaryDetails));
		if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
			this.healthcareWorkerTypeID = this.beneficiaryDetails.i_beneficiary.i_bendemographics.healthCareWorkerID ? this.beneficiaryDetails.i_beneficiary.i_bendemographics.healthCareWorkerID : "";

			this.benficiaryRegId = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
			this.firstName = this.beneficiaryDetails.i_beneficiary.firstName;
			this.lastName = this.beneficiaryDetails.i_beneficiary.lastName;
			this.gender = this.beneficiaryDetails.i_beneficiary.m_gender.genderID;
			this.benCallID = this.beneficiaryDetails.benCallID;
		}
		else if (this.commonAppData.benRegID) {
			this.benficiaryRegId = this.commonAppData.benRegID;
		}
	}

	setFilterArray(keyName, dropdownArray) {

		this.keyName = keyName;
		this.originalArray = dropdownArray;

	}

	/*
	  removeFocus()
	  {
		this.keyName = "";
		//this.originalArray = [];	 
		console.log("Focus lost");
	  } */

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		var char = String.fromCharCode(event.keyCode);
		//	console.log(char + " Pressed");
		if ((/[a-zA-Z]/.test(char) || event.keyCode === 8)) {

			if (this.keyName == 'districtName') {
				this.temp_districts_array = this.smartsearch.selectKeyPress(event, this.originalArray, this.keyName);
			}

		}

	}
	//** end **/

	showForm() {
		this.feedbackType = "";
		this.category = "";
		this.subcategory = "";
		this.state = "";
		this.district = "";
		this.taluk = "";
		this.sdtb = "";
		this.institutionId = "";
		this.institutionName = "";
	
		this.doi = new Date();
		this.grievanceAgainst = "";
		this.showFormCondition = true;
		this.showTableCondition = false;
		this.showFeedBackData = false;
		this.filterTerm = "";
		this.viewALL = true;
		this.searchType = "GrievanceId";
		

	}

	showTable() {
		this.showFormCondition = false;
		this.showTableCondition = true;
		this.showFeedBackData = false;
		this.filterTerm = "";
		this.viewALL = true;
		this.searchType = "GrievanceId";
	}

	revertFullTable() {
		this.filterTerm = "";
		this.viewALL = true;
		this.minLength = 1;
   		this.maxLength = 30;
		this.searchType = "GrievanceId";
		this._coFeedbackService.getFeedbackHistoryById(this.benficiaryRegId, this.calledServiceID)
			.subscribe(response => this.setFeedbackHistoryByID(response));
	}
	ngOnInit() {
        this.assignSelectedLanguage();
		this.providerServiceMapID = this.commonAppData.current_service.serviceID;


		this._feedbackTypes.getFeedbackTypeID(this.commonAppData.current_service.serviceID).subscribe(response => this.getFeedbackTypeIDSuccessHandeler(response));
		this.doi = new Date;
		this.maxDate = new Date;

		this.agentData = this.commonAppData.Userdata;
		this.calledServiceID = this.commonAppData.current_service.serviceID;
		this.GetInstitutes();
		//	this.serviceID = this.commonAppData.current_service.serviceID;


		this._coFeedbackService.getDesignations()
			.subscribe(response => this.setDesignation(response));

		this.initialized();
		this._feedbackTypes.getFeedbackSeverityData(this.commonAppData.current_service.serviceID)
			.subscribe(response => this.setFeedbackSeverity(response));

		this.current_role = this.commonAppData.current_role;

	}

	ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }



	preventTyping(e: any) {
		if (e.keyCode === 9) {
			return true;
		}
		else {
			return false;
		}
	}


	initialized() {
		let data = {
			"providerServiceMapID": this.commonAppData.current_service.serviceID
		};
		this._userBeneficiaryData.getUserBeneficaryData(data)
			.subscribe(response => this.SetUserBeneficiaryFeedbackData(response));
	}
	getFeedbackTypeIDSuccessHandeler(response) {
		//	console.log("FEEDBACK ID TYPE ***###***", JSON.stringify(response));
		for (let i = 0; i < response.length; i++) {
			if (response[i].feedbackTypeName === "Asha Complaints") {
				this.ashaFeedbackID = response[i].feedbackTypeID;
			}
			if (response[i].feedbackTypeName === "Generic Complaint") {

				this.genericFeedbackID = response[i].feedbackTypeID;
			}
		}

		this.setBenRegID(this.beneficiaryDetails);


		if (this.ashaFeedbackID && this.genericFeedbackID)
			this._coFeedbackService.getFeedbackHistoryById(this.benficiaryRegId, this.calledServiceID)
				.subscribe(response => this.setFeedbackHistoryByID(response));
	}

	getCategory(feedbackID) {
		this._coFeedbackService.getCategory(this.providerServiceMapID, feedbackID)
			.subscribe(response => {
				this.category = undefined;
				this.subcategory = undefined;
				this.categories = response.data;
				//	console.log(response,"category");
				if (response.data.length === 0) {
					this.categoryDisableFlag = true;
				} else {
					this.categoryDisableFlag = false;
				}
			}, err => {
				console.log(err, 'error while fetching categories based on feedback ID');
			});
	}

	getSubCategory(categoryID) {
		this._coFeedbackService.getSubCategory(categoryID)
			.subscribe(response => {
				this.subcategory = undefined;
				this.subcategories = response.data;
				//	console.log(response,"sub category");
			}, err => {
				console.log(err, 'error while fetching sub-categories based on category ID');
			});
	}

	SetUserBeneficiaryFeedbackData(regData: any) {
		if (regData.states) {
			this.states = regData.states.filter(item => {
				return item.stateID === this.commonAppData.current_stateID_based_on_role;
			});;
			this.state = this.commonAppData.current_stateID_based_on_role;
			this.GetDistricts(this.state);
		}
	}

	GetDistricts(state: number) {
		this.distID=-1;
	    this.instID=-1;
		this._locationService.getDistricts(state)
			.subscribe(response => this.SetDistricts(response));
	}
	SetDistricts(response: any) {
		this.districts = response;
		this.temp_districts_array = response;
		this.taluks = [];
		this.taluk = undefined;
	}
	GetTaluks(district: number) {
		this.distID=district;
		if(this.instID!=-1)
		{
                this.GetInstitutesName(this.instID);
		}
		
		this._locationService.getTaluks(district)
			.subscribe(response => this.SetTaluks(response));
	}
	SetTaluks(response: any) {
		this.taluks = response;
		this.sdtb = undefined;
		this.blocks = [];
	}
	GetBlocks(taluk: number) {
		this._locationService.getBranches(taluk)
			.subscribe(response => this.SetBlocks(response));
	}
	SetBlocks(response: any) {
		this.blocks = response;
	}

	GetInstitutes() {
		let object = { "providerServiceMapID": this.calledServiceID };
		this._locationService.getInstituteList(object)
			.subscribe(response => this.SetInstitutes(response));
	}
	SetInstitutes(response: any) {
		//	console.log(response, "institutes");
		this.institutes = response;
	}
	GetInstitutesName(institutionTypeId)
	{
		this.instID=institutionTypeId;
         		
		this._locationService.getInstituteNames(institutionTypeId+"/"+this.distID)
			.subscribe(response => this.SetInstitutesName(response));

	}
	SetInstitutesName(response: any) {
		//	console.log(response, "institutes");
		this.institutesName = response;
		console.log("RespInstNames:",response)
		console.log("InstName",this.institutesName)
	}
	// getDesignation ( val: any )
	// {
	// 	console.log( "its" + val );
	// 	if ( val === '1' )
	// 	{
	// 		this.designations = [ "d1", "d2", "d3" ];
	// 	}
	// 	if ( val === '2' )
	// 	{
	// 		this.designations = [ "d1.1", "d2.2", "d3.3" ];
	// 	}
	// 	if ( val === '3' )
	// 	{
	// 		this.designations = [ "d1.1.1", "d2.2.2", "d3.3.3" ];
	// 	}
	// }
	setDesignation(response: any) {
		//	console.log("designations", response);
		this.designations = response.data;
	}
	setFeedbackTypes(response: any) {
		this.feedbackTypes = response;


	}

	setFeedbackSeverity(response: any) {
		this.feedbackSeverities = response;
	}

	feedbacksArray: any = [];
	modalArray: any = [];

	submitFeedback(object: any) {

		// console.log( object, this.feedbackDescription.value );
		//	console.log(object);
		//"serviceAvailDate": object.doi,
		// let feedbackObj = [{
		// 	"institutionID": object.institutionId, "designationID": object.designation, "severityID": object.severity,
		// 	"feedback": object.feedbackDescription,
		// 	"beneficiaryRegID": this.benficiaryRegId, "serviceID": this.calledServiceID, "createdBy": this.agentData.userName, "benCallID": this.benCallID, "1097ServiceID": 0,
		// 	"userID":this.agentData.userID
		// }];
		let feedbackObjs: any = [];
		let feedbackObj: any = {};
		if(object.institutionName !=undefined && object.institutionName.institutionID !=undefined)
		feedbackObj.institutionID=object.institutionName.institutionID;
		feedbackObj.instituteTypeID = object.institutionId;
		if(object.institutionName !=undefined && object.institutionName.institutionID !=undefined)
		feedbackObj.instiName = object.institutionName.institutionName;
		feedbackObj.designationID = object.designation;
		feedbackObj.feedbackNatureID = object.feedbackType; // nature of complaint ID
		feedbackObj.feedbackTypeID = this.feedbackTypeID;// based on General Public or Health Worker
		feedbackObj.severityID = object.severity;
		feedbackObj.categoryID = object.category;
		feedbackObj.subCategoryID = object.subcategory;
		feedbackObj.stateID = object.state;
		feedbackObj.districtID = object.district;
		feedbackObj.districtBranchID = object.sdtb;
		feedbackObj.blockID = object.taluk;
		feedbackObj.feedback = object.feedbackDescription ? object.feedbackDescription.trim() : null;
		feedbackObj.beneficiaryRegID = this.benficiaryRegId;
		feedbackObj.serviceID = object.calledServiceID;
		feedbackObj.createdBy = this.agentData.userName;
		feedbackObj.benCallID = object.benCallID;
		feedbackObj.serviceID = this.commonAppData.current_service.serviceID;
		feedbackObj.userID = this.commonAppData.uid;
		feedbackObj.feedbackAgainst = object.grievanceAgainst;
		if (this.commonAppData.benCallID) {
			feedbackObj.benCallID = this.commonAppData.benCallID;
		}
		else {
			feedbackObj.benCallID = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
		}
		//feedbackObj.feedbackStatusID = this.commonAppData.feedbackStatusID;
		if (object.doi) {
			feedbackObj.serviceAvailDate = new Date((object.doi) - 1 * (object.doi.getTimezoneOffset() * 60 * 1000)).toJSON();
		} else {
			feedbackObj.serviceAvailDate = undefined;
		}
		feedbackObjs[0] = feedbackObj;
		//	console.log(JSON.stringify(feedbackObj));
		this._coFeedbackService.createFeedback(feedbackObjs)
			.subscribe((response) => {
				this.showtable(response, object);
			}, (err) => {
				this.alertMesage.alert(err.status, 'error');
			});
	}

	showtable(response, obj) {
		//	console.log('after registering feedback', response.data.feedBackId, "dddddddddddddddd");
		// var object = {
		// 	"feedbackID": "",
		// 	"feedback": "",
		// 	"severityID": "",
		// 	"feedbackTypeID": "",
		// 	"createdBy": "",
		// 	"feedbackStatusID": ""
		// };

		// var fdbkID = response.feedBackId;//this.generatefeedbackID();
		// object.id = fdbkID;
		// object.dor = new Date();
		// object.status = 'open';
		// object.agentID = "CO0111120";
		// console.log( object );
		// this.feedbacksArray.push( object );
		// object.feedbackID = response.data.feedBackId;
		// object.feedback = obj.feedbackDescription;
		// object.severityID = obj.severity;
		// object.feedbackTypeID = obj.feedbackType;
		// object.createdBy = this.agentData.userName;
		// object.feedbackStatusID = '1';
		// console.log(object);
		//	this.feedbacksArray.push(object);

		//this.data.push(object);
		this._coFeedbackService.getFeedbackHistoryById(this.benficiaryRegId, this.calledServiceID)
			.subscribe(response => this.setFeedbackHistoryByID(response));
		this.commonAppData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page
		this.msg = this.currentLanguageSet.grievanceRegisteredWithFeedbackID;
		var message = this.msg + response.data.requestID;
		// this.alertMesage.alert(message, 'success');

		let dialogReff = this.dialog.open(RegisteredBeneficiaryModal104, {
			// height: '280px',
			width: '420px',
			disableClose: true,
			data: {
				"generatedId": message,
				"Title": "Success"
			}
		});

		dialogReff.afterClosed().subscribe(result => {
			if (result != 'close' && result !='') {
				this.sendSMS(result, response.data, this.isHealthCareWorker);
			}
			jQuery('#feedbckForm').trigger("reset");
			this.showTable();
			this.isHealthCareWorker = false;
			this.count = 0 + '/300';
			this.doi = new Date;
			this.initialized();

		});
		

	}

	sendSMS(alternate_number, grievanceObj, isHealthCareWorker) {
		let sms_template_id = '';
		let smsTypeID = '';
		let currentServiceID = this.commonAppData.current_serviceID;

		let smsType = '';
		if (isHealthCareWorker) {
			smsType = 'Health Worker Grievance SMS';
		}
		else {
			smsType = 'Generic Grievance SMS';
		}
		this._smsService.getSMStypes(currentServiceID)
			.subscribe(response => {
				if (response != undefined) {
					if (response.length > 0) {
						for (let i = 0; i < response.length; i++) {
							if (response[i].smsType.toLowerCase() === smsType.toLowerCase()) {
								smsTypeID = response[i].smsTypeID;
								break;
							}
						}
					}
				}

				if (smsTypeID != '') {
					this._smsService.getSMStemplates(this.providerServiceMapID,
						smsTypeID).subscribe(res => {
							if (res != undefined) {
								if (res.length > 0) {
									for (let j = 0; j < res.length; j++) {
										if (res[j].deleted === false) {
											sms_template_id = res[j].smsTemplateID;
											break;
										}
									}
								}

								if (smsTypeID != '') {

									let reqArr = [];

									let reqObj = {
										"alternateNo": alternate_number,
										'beneficiaryRegID': this.benficiaryRegId,
										"feedbackID": grievanceObj.feedBackId,
										"createdBy": this.commonAppData.Userdata.userName,
										"is1097": false,
										"providerServiceMapID": this.providerServiceMapID,
										"smsTemplateID": sms_template_id,
										"smsTemplateTypeID": smsTypeID
										// "userID": 0
									}
									reqArr.push(reqObj);

									this._smsService.sendSMS(reqArr)
										.subscribe(ressponse => {
											console.log(ressponse, 'SMS Sent');
											this.alertMesage.alert(this.currentLanguageSet.smsSent,'success');
										}, err => {
											console.log(err, 'SMS not sent Error');
										})
								}
							}
						}, err => {
							console.log(err, 'Error in fetching sms templates');
						})
				}
			}, err => {
				console.log(err, 'error while fetching sms types');
			})
	}

	updateCount() {
		this.count = this.feedbackDescription.length + '/300';
	}
	modalData(object) {
		this.modalArray.push(object);
	}

	setFeedbackHistoryByID(response: any) {
		//	console.log('the response for feedback history is', response);
		let ashaID = this.ashaFeedbackID;
		let genericID = this.genericFeedbackID;
		this.feedbacksArray = response.data.filter(function (obj) {
			if (obj.feedbackTypeID == ashaID || obj.feedbackTypeID == genericID) {
				return obj;
			}
		})
		this.data = this.feedbacksArray;
		this.filteredFeedbackList = this.feedbacksArray;

	}

	setBenRegID(beneficiaryDetails: any) {
		let healthcareWorkerTypeID;
		if (this.healthcareWorkerTypeID) {
			healthcareWorkerTypeID = this.healthcareWorkerTypeID;
		}
		else {
			healthcareWorkerTypeID = this.commonAppData.healthcareTypeID;
		}

		this.feedbackTypeID = this.genericFeedbackID;
		let data: any = {};
		data.providerServiceMapID = this.calledServiceID;
		data.feedbackTypeID = this.genericFeedbackID;
		this._feedbackTypes.getFeedbackTypesData(data)
			.subscribe(response => this.setFeedbackTypes(response));
	}

	filterFeedbackList(searchTerm: string) {
		if (!searchTerm)
			this.filteredFeedbackList = this.data;
		else {
			let object = { 
				"phoneNum":this.searchType == 'MobileNumber' ? searchTerm : null,
				"requestID":this.searchType == 'GrievanceId' ? searchTerm : null
			 };
			 console.log(JSON.stringify(object));			 
			this.filteredFeedbackList = [];
			this.viewALL = false;
			this._coFeedbackService.getFeedbackHistoryByPh(object)
				.subscribe(response => this.setFeedbackHistoryByID(response));
		}
	}
	onSearchChange(type) {
		if (type === 'MobileNumber')
		{
		  this.minLength = 10;
		  this.maxLength = 10;
		}
		else{
		  this.minLength = 1;
		  this.maxLength = 30;
		}
	}
	//   showFeedback(feedback) {


	//     let dialogReff=this.dialog.open(FeedbackResponseModel, {
	//         height: '620px',
	//         width: '680px',
	//         disableClose:false,
	//         data: feedback
	//       });
	//     //   var idx = jQuery('.carousel-inner div.active').index();
	//     //   jQuery('#myCarousel').carousel(idx + 1);
	//     //   jQuery(this).parent().find("a").removeClass('active-tab');
	//     //   jQuery(this).find("a").addClass("active-tab");
	//   }



	ngOnChanges() {
		// if (this.currentLanguageSet) {
		// 	this.msg = "Grievance registered with feedback ID:";
		// }
	}
	checkHealthCareWorker(value: any) {
		if (value === "Yes") {
			this.isHealthCareWorker = true;
			this.feedbackTypeID = this.ashaFeedbackID;
			let data: any = {};
			data.providerServiceMapID = this.calledServiceID;
			data.feedbackTypeID = this.ashaFeedbackID;
			this._feedbackTypes.getFeedbackTypesData(data)
				.subscribe(response => this.setFeedbackTypes(response));
		}
		if (value === "No") {
			this.isHealthCareWorker = false;
			this.feedbackTypeID = this.genericFeedbackID;
			let data: any = {};
			data.providerServiceMapID = this.calledServiceID;
			data.feedbackTypeID = this.genericFeedbackID;
			this._feedbackTypes.getFeedbackTypesData(data)
				.subscribe(response => this.setFeedbackTypes(response));
		}
	}
}


@Component({
	selector: 'feedback-model',
	templateUrl: './feedback-response-model.html'
})
export class FeedbackResponseModel {
	currentLanguageSet: any;
	constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
	public HttpServices: HttpServices,
		public dialogReff: MdDialogRef<FeedbackResponseModel>) { }


	ngOnInit() {

    this.assignSelectedLanguage();  
	}

	ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}
