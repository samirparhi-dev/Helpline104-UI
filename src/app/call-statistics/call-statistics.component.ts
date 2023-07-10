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


import { Component, OnInit, EventEmitter, Input, Output, DoCheck } from '@angular/core';
import { CzentrixServices } from './../services/czentrix/czentrix.service'
import { dataService } from '../services/dataService/data.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
    selector: 'app-call-statistics',
    templateUrl: './call-statistics.component.html',
})
export class CallStatisticsComponent implements OnInit {
    @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
    public totalCalls;
    public totalInvalidCalls;
    public totalCallDuration;
    public totalFreeTime;
    public totalBreakTime;

    current_date: any;
    timerSubscription: Subscription;
    currentLanguageSet: any;

    ngOnInit() {
        // this.HttpServices.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
        this.currentLanguageSetValue();
        this.todayCallLists();
        this.current_date = new Date();
        const timer = Observable.interval(60*1000);
        this.timerSubscription = timer.subscribe(()=>{
            this.todayCallLists()
        });
    };

    constructor(private callService: CzentrixServices,
        public _dataService: dataService,public HttpServices: HttpServices) { };

        currentLanguageSetValue() {
            const getLanguageJson = new SetLanguageComponent(this.HttpServices);
            getLanguageJson.setLanguage();
            this.currentLanguageSet = getLanguageJson.currentLanguageObject;
          }
          
          ngDoCheck() {
            this.currentLanguageSetValue();
          }    

    todayCallLists() {

        this.callService.getTodayCallReports(this._dataService.agentID).subscribe((response) => {
            // this.totalCalls = 'Total Calls : ' + response.total_calls;
            // this.totalInvalidCalls = 'Total Invalid Calls : ' + response.total_invalid_calls;
            // this.totalCallDuration = 'Total Call Duration :' + response.total_call_duration;
            // this.totalBreakTime = 'Total Break Time :' + response.total_break_time;
            // this.totalFreeTime = 'Total Free Time :' + response.total_free_time;
            if (response !== undefined && response !== null) {
                this.totalCalls = response.total_calls;
                this.totalInvalidCalls = response.total_invalid_calls;
                this.totalCallDuration = response.total_call_duration;
                this.totalBreakTime = response.total_break_time;
                this.totalFreeTime = response.total_free_time;
            }
           
        }, (err) => {
            console.log('Error in Total Call Report', err);
        })
    }
    close() {
        this.hide_component.emit('6');
    };
    ngOnDestroy(){
        this.timerSubscription.unsubscribe();
    }
}