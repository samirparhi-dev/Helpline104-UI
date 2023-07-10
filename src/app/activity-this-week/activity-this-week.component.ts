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


import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
	selector: 'activity-this-week',
	templateUrl: './activity-this-week.component.html',
})
export class ActivityThisWeekComponent implements OnInit {
	@Output() hide_component: EventEmitter<any> = new EventEmitter<any>();

	campaign: any;
	providerServiceMapID: any;
	current_roleID: any;
	training_resource_count: any = 0;
	kmconfig: any = [];
	kmFiles: any = [];
	role:  any;
	screens: any;
	currentLanguageSet: any;

	constructor(public getCommonData: dataService, public router: Router,
		public notificationService: NotificationService,
		public dialog: MdDialog, public HttpServices: HttpServices) {

		
		console.log("Current campaign " + this.getCommonData.current_campaign);
	}
	ngOnInit() {
		this.assignSelectedLanguage();
		// console.log("Current campaign "+this.getCommonData.current_campaign);
		this.role = this.getCommonData.current_role;
		this.current_roleID = this.getCommonData.current_roleID;
		this.providerServiceMapID = this.getCommonData.current_service.serviceID;
		this.campaign = this.getCommonData.current_campaign;
		this.screens = this.getCommonData.screens;

		this.getNotificationTypes();
	};

	ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

	getNotificationTypes() {
		this.notificationService.getNotificationTypes(this.providerServiceMapID)
			.subscribe(response => {
				this.kmconfig = response.filter((item) => {
					return item.notificationType === 'KM';
				});
				if (this.kmconfig != undefined) {
					if (this.kmconfig.length > 0) {
						this.getKMdocs(this.kmconfig);
					}
				}
			}, err => {
				console.log('Error while fetching kmconfig', err);
			});
	}
	close() {
		this.hide_component.emit("1");
	};
	// a() {
	// 	this.router.navigate(['/MultiRoleScreenComponent/InnerpageComponent']);
	// }
	openTrainingDialog() {
		let dialog = this.dialog.open(MessageDialogComponent, {
			width: '700px',
			disableClose: false,
			data: {
				type: this.currentLanguageSet.kmDocs,
				kmdocs: this.kmFiles
			}
		});
	}
	getKMdocs(KMconfig) {
		let startDate = new Date();
		let endDate = new Date();

		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 0);
		const data = {
			'providerServiceMapID': this.providerServiceMapID,
			'notificationTypeID': KMconfig[0].notificationTypeID,
			'roleIDs': [this.current_roleID],
			'validFrom': new Date(),
			'validTill': new Date()
		}

		this.notificationService.getKMs(data).subscribe(
			response => {
				if (response.data.length > 0) {
					console.log(response.data, 'RESPONSE SUCCESS AFTER KM DOCS FETCH');
					this.kmFiles = response.data;
					this.training_resource_count = this.kmFiles.length;
				}
			}, err => {
				console.log('Error while fetching KM files in dashboard', err);
			}
		);
	}
}