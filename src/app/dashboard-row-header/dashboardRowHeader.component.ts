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


import {Component, OnInit} from '@angular/core';
import { dataService } from '../services/dataService/data.service';


@Component({
    selector: 'dashboard-row-header',
    templateUrl: './dashboardRowHeader.html',
})
export class DashboardRowHeaderComponent implements OnInit{
	constructor(public getCommonData:dataService)
	{

	} 
	current_role:any;
	current_roleName:any;
	current_service: any;
	data: any = this.getCommonData.Userdata;

	ngOnInit() {
		console.log("am here");
		console.log()
	this.current_role = this.getCommonData.current_role;
	this.current_roleName = this.getCommonData.current_roleName;
	this.current_service = this.getCommonData.current_service;
			console.log(this.current_role,this.current_service);
			

	}
}