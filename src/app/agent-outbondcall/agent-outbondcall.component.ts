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
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
declare var jQuery:any;
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-agent-outbondcall',
  templateUrl: './agent-outbondcall.component.html',
  styleUrls: ['./agent-outbondcall.component.css']
})
export class AgentOutbondcallComponent implements OnInit {
	callDuration:number=0;
	timerSubscription: Subscription;
	currentLanguageSet: any;

	constructor(public getCommonData: dataService, public router: Router,
		public HttpServices: HttpServices) {
	// 	setInterval(() => {
    //   this.callDuration = this.callDuration + 1;
    // }, 1000);
		const timer = Observable.interval(1000);
        this.timerSubscription = timer.subscribe(()=>{
            this.callDuration = this.callDuration + 1;
        });
	 }

	data: any = this.getCommonData.Userdata;

	selectedBenData:any={
		'id':'',
		'fname':'',
		'lname':'',
		'mob':''
	};

  ngOnInit() {
	this.assignSelectedLanguage();
  	var idx = jQuery('.carousel-inner div.active').index();
		console.log("index", idx);
  	
  	jQuery('#closureLink').on('click', function() 
  	{
    	jQuery('#myCarousel').carousel(idx+3);
    	jQuery("#four").parent().find("a").removeClass('active-tab');
		jQuery("#four").find("a").addClass("active-tab");
    	
	});
	jQuery('#cancelLink').on('click', function() 
  	{
    	jQuery('#myCarousel').carousel(idx);
    	jQuery("#one").parent().find("a").removeClass('active-tab');
		jQuery("#one").find("a").addClass("active-tab");
	});

	jQuery('#one').on('click', function() 
  	{
    	jQuery('#viewHistoryCarousel').carousel(idx);
    	
    	jQuery(this).parent().find("a").removeClass('active-tab');
		jQuery(this).find("a").addClass("active-tab");
	});
	jQuery('#two').on('click', function() 
  	{
    	jQuery('#myCarousel').carousel(idx+1);
    	
    	jQuery(this).parent().find("a").removeClass('active-tab');
		jQuery(this).find("a").addClass("active-tab");
	});



	jQuery('#three').on('click', function() 
  	{
    	jQuery('#myCarousel').carousel(idx+2);
    	jQuery(this).parent().find("a").removeClass('active-tab');
		jQuery(this).find("a").addClass("active-tab");
    	
	});

	jQuery('#four').on('click', function() 
  	{
    	jQuery('#myCarousel').carousel(idx+3);
    	jQuery(this).parent().find("a").removeClass('active-tab');
		jQuery(this).find("a").addClass("active-tab");
    	
	});



	jQuery("#previous").on('click',function()
	{

		var idx = jQuery('.carousel-inner div.active').index();
		console.log('chala with', idx);
		if(idx===0)
		{
			console.log('chala')
			jQuery("#one").parent().find("a").removeClass('active-tab');
			jQuery("#one").find("a").addClass("active-tab");
		}
		if (idx === 1) {
			jQuery("#two").parent().find("a").removeClass('active-tab');
			jQuery("#two").find("a").addClass("active-tab");

		}
		if (idx ===2) {
			jQuery("#three").parent().find("a").removeClass('active-tab');
			jQuery("#three").find("a").addClass("active-tab");

		}
		if (idx === 3) {

			jQuery("#four").parent().find("a").removeClass('active-tab');
			jQuery("#four").find("a").addClass("active-tab");
		}
	});


	jQuery("#next").on('click', function() {

		var idx = jQuery('.carousel-inner div.active').index();
		console.log('chala with', idx);
		if (idx === 0) {
			jQuery("#one").parent().find("a").removeClass('active-tab');
			jQuery("#one").find("a").addClass("active-tab");
		}
		if (idx === 1) {
			jQuery("#two").parent().find("a").removeClass('active-tab');
			jQuery("#two").find("a").addClass("active-tab");

		}
		if (idx === 2) {
			jQuery("#three").parent().find("a").removeClass('active-tab');
			jQuery("#three").find("a").addClass("active-tab");

		}
		if (idx === 3) {
			jQuery("#four").parent().find("a").removeClass('active-tab');
			jQuery("#four").find("a").addClass("active-tab");
		}
	});
	
	// this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': [''] } }]);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
	const getLanguageJson = new SetLanguageComponent(this.HttpServices);
	getLanguageJson.setLanguage();
	this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  addActiveClass(val:any)
	{
		jQuery('#'+val).parent().find("a").removeClass('active-tab');
		jQuery('#'+val).find("a").addClass("active-tab");
	}

	getSelectedBenDetails(data:any)
	{
		console.log('data recieved',data,data.beneficiaryRegID);
		this.selectedBenData.id="BEN"+data.beneficiaryRegID;
		this.selectedBenData.fname=data.firstName;
		this.selectedBenData.lname=data.lastName;
		this.selectedBenData.mob=data.phoneNo;
	}

  // 	change(no:any){
	  
		// if (no === '1') {
			
		// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['registerBeneficiary'] } }]);
		// }
		// if (no === '2') {
		// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['servicesForBeneficiary'] } }]);
		// }
		// if (no === '3') {
		// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['updates'] } }]);
		// }
		// if (no === '4') {
		// 	this.router.navigate(['/InnerpageComponent', { outlets: { 'innerpage_router': ['closure'] } }]);
	 //    }
		
  // 	}
	historyObj:any;
	fetchModalData(modaldata:any)
	{
	
		this.historyObj=modaldata;
		var idx = jQuery('.carousel-inner div.active').index();
		console.log("index", idx);
		jQuery('#viewHistoryCarousel').carousel(idx+1);
    	jQuery(this).parent().find("a").removeClass('active-tab');
		jQuery(this).find("a").addClass("active-tab");
	}

	viewCallHistory(){

		//console.log("clickedddd")
		var idx = jQuery('.carousel-inner div.active').index();
		console.log("index", idx);
		jQuery('#viewHistoryCarousel').carousel(idx+1);
    	jQuery(this).parent().find("a").removeClass('active-tab');
		jQuery(this).find("a").addClass("active-tab");
	}

	viewClosure(val:any){

		console.log("view questions", val);
		
		if(val==="questions"){
			jQuery("#viewQuestionsModal").modal("show");
		}
		else{
			var idx = jQuery('.carousel-inner div.active').index();
			console.log("index", idx);
			jQuery('#viewHistoryCarousel').carousel(idx+1);
			jQuery(this).parent().find("a").removeClass('active-tab');
			jQuery(this).find("a").addClass("active-tab");
		}
	}

	ngOnDestroy(){
		this.timerSubscription.unsubscribe();
	}
  
}
