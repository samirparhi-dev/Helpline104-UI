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


import { Component, OnInit } from '@angular/core';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
    selector: 'app-training-resources',
    templateUrl: './training-resources.component.html',
    styleUrls: ['./training-resources.component.css']
})
export class TrainingResourcesComponent implements OnInit {

    roleID: any;
    service: any;
    profile: any;
    kmConfig: any;
    kmfiles: any;
    kmPostData: any;
    currentLanguageSet: any;
    constructor(private dashboardHttpServices: DashboardHttpServices, private dataService: dataService, private notificationService: NotificationService, public dialog: MdDialog,public HttpServices: HttpServices) { }


    ngOnInit() {
        this.assignSelectedLanguage();
        this.roleID = this.dataService.current_roleID;
        this.service = this.dataService.current_service;
        console.log("providerServiceMapID" + this.service.serviceID);
        this.notificationService.getNotificationTypes(this.service.serviceID)
            .subscribe((response) => {
                console.log(response,"RELATED TO KM");
                // let currentDate = this.getOffsetTime();
                let currentDate=new Date();
                if(response.data){
                    this.kmConfig = response.data.filter((notification) => {
                        return notification.notificationType == "KM";
                    });
                    if (this.kmConfig.length > 0) {
                        // if(this.role.RoleName!="Supervisor"){
                        //     this.kmPostData = {
                        //         "providerServiceMapID": this.service.serviceID,
                        //         "notificationTypeID": this.kmConfig[0].notificationTypeID,
                        //         "roleIDs": [this.role.RoleID],
                        //         "validFrom": new Date().toISOString().slice(0,10) + "T00:00:00.000Z",
                        //         //currently alerts and notifications from current date to one week(7*24*60*60*1000)
                        //         "validTill": new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10) + "T23:59:59.999Z"
                        //     };
                        // }
                        // else {
                        this.kmPostData = {
                            "providerServiceMapID": this.service.serviceID,
                            "notificationTypeID": this.kmConfig[0].notificationTypeID,
                            "roleIDs": [this.roleID],
                            // "validFrom": new Date().toISOString().slice(0, 10) + "T00:00:00.000Z",
                            "validFrom": currentDate,
                            //currently alerts and notifications from current date to one week(7*24*60*60*1000)
                            // "validTill": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "T23:59:59.999Z"
                            "validTill": currentDate
                        };
                        // }
                    }
                }
                this.getKmFiles();
            },
            (err) => {
                console.log(err);
            });


    }
    ngDoCheck() {
        this.assignSelectedLanguage();
    }

    assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.HttpServices);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
    getKmFiles() {
        // console.log(this.alertPostData);
        // console.log(this.notificationPostData);
        if (this.kmPostData) {
            console.log(this.kmPostData);
            // if (this.role.RoleName != "Supervisor") {
            this.notificationService.getKMs(this.kmPostData)
                .subscribe((response) => {
                    console.log(response,"KM files response");

                    this.kmfiles = response.data;
                },
                (err) => {
                    console.log(err);
                });
            // }
            // else {
            //     this.notificationService.getSupervisorNotifications(this.kmPostData)
            //         .subscribe((response) => {
            //             console.log(response);
            //             this.kmfiles = response.data;
            //         },
            //         (err) => {
            //             console.log(err);
            //         });
            // }
        }
    }

    kmClicked(km, event) {
        event.preventDefault();
        let dialog = this.dialog.open(MessageDialogComponent, {
            width: '400px',
			disableClose: true,
            data: {
                message: km.notificationDesc,
                type: "KM",
                kmFilePath: km.kmFilePath
            }
        });
    }

    // getOffsetTime() {
    //     let date = new Date();
    //     return new Date((date.getTime() - 1 * (date.getTimezoneOffset() * 60 * 1000)));
    // }
}
