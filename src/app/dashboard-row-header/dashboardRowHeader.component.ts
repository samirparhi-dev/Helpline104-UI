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