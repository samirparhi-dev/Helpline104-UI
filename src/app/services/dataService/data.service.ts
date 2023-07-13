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


import { Injectable } from '@angular/core';
 
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
 
@Injectable()
export class dataService {
 
    providerID: any;
    providerServiceMapID:any;
    // checking stash save
    Userdata: any;
    userPriveliges: any;
    uid: any;
    uname:any;
    benData:any;
    ipAddress: any;
    agentID: any;
    loginKey: any;
    benCallID: any;
    current_role: any;
    current_roleName: any;
    current_roleID: any;
    current_workingLocationID: any;
    current_service: any;    // current_service.serviceID contains providerServiceMapId
    current_serviceID: any = 3;
    current_campaign: any;
    current_feature: any;
    screens: any;
    callData: any = {};
    beneficiaryData: any = {};
    beneficiaryDetails:any;
    sessionID :any;
    sio_outbond_providerlist: any={};
    screeningService_selected:any;
    beneficiaryDataAcrossApp:any={};
    benRegID: any;
    ph:any="";
    benHealthID:any;
    outboundBenID: any;
    outboundCallReqID: any;
    inOutBound: any;
    outboundBloodReqtID: any;
    avoidingEvent: boolean = false;
    transactionId:any;
    
    // bpQuestionTypeId = 18;
    // diabeticQuestionTypeId = 19;
 //    diabeticRiskFactorsQuestionTypeId = 20;
 
     // qualitativeQuestionTypeId = 21;
     // utilityQuestionTypeId = 22;
     // quantitativeQuestionTypeId = 23;
 
    // callTypeID = 10 ;// for valid calls
    callTypeID:any;
    feedbackStatusID = 2; // Id for feedback status Open
 
    service_providerID : any; 
 
    roleSelected = new Subject();
    callDisconnected = new Subject();
    sendBMI = new Subject();
    sendHeaderStatus = new Subject();
    isSelf = new Subject();
    isEmergency = new Subject();
    /*Edited By:Diamond Khanna , Date:28 september,2017 */
    current_stateID_based_on_role: any;
    firstName: any;
    lastName: any;
    age: any;
    gender: any;
    districtID: any;
    blockID : any;
    ben_gender_name:any;
    dummyPh: any;
    callID: any;
    healthcareTypeID;
    serviceAvailed = new Subject();
    sendRoutine = new Subject();
    caste: any;
    educationID: any;
    outboundRequestID: any;
 
    roleChanged = new Subject();
    
    closeCallerCount:number=0;
    setUniqueCallIDForInBound: Boolean = false; // restricted multiple triggering start call API for inbound
    setUniqueCallIDForOutbound: Boolean = false; //restricted multiple triggering start call API for outbound
    benDataInRO: any;
    apiCalledForInbound=false;
	appLanguage:any="English";
    
};
