import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { dataService } from './../services/dataService/data.service';
import { CallServices } from './../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';
import { QualityAuditService } from 'app/services/supervisorServices/quality-audit-service.service';


@Component({
  selector: 'app-block-unblock-number',
  templateUrl: './block-unblock-number.component.html',
  styleUrls: ['./block-unblock-number.component.css']
})
export class BlockUnblockNumberComponent implements OnInit {

  phoneNumber: number;
  maxDate: Date;
  blockedDate: any;
  blockedTill: any;
  isBlockedType: boolean;
  showTable: boolean = false;
  isBlocked: boolean = undefined;
  isUnBlocked: boolean = undefined;
  reason: any;
  blockedBy: string;
  blockForm: FormGroup;
  serviceId: any;
  blackList: any = [];
  searchByPhone: boolean = false;
  data: any = [];
  showRecordings:boolean=false;
  recording_data:any=[];
  audio_path:any;
  currentLanguageSet: any;
  audioResponse: any;
  recordingArray: any = [];
  dispFlag: any;
  apiCall = true;

  constructor(private commonData: dataService, private callService: CallServices,
    private message: ConfirmationDialogsService,public HttpServices: HttpServices,
    private qualityAuditService: QualityAuditService,) { }

  ngOnInit() {
   this.assignSelectedLanguage();
    // this.isBlockedType = undefined;
    this.serviceId = this.commonData.current_service.serviceID;
    this.maxDate = new Date();
    this.addToBlockList();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  getBlockedTillDate(date) {
    this.blockedTill = date.setDate(date.getDate() + 7);
    console.log(this.blockedTill);
  }

  addToBlockList() {
    const searchObj = {};
    searchObj['providerServiceMapID'] = this.serviceId;
    searchObj['phoneNo'] = this.phoneNumber;
    // searchObj['isBlocked'] = this.isBlockedType;
    this.isBlocked = Boolean(this.isBlocked);
    this.callService.getBlackListCalls(searchObj).subscribe((response) => {
      this.showTable = true;
      this.showRecordings = false;
      this.setBlackLists(response);
    }, (err) => {
      this.showTable = false;
    });
  }
  setBlackLists(blackListData: any) {
    this.data = blackListData;
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  unblock(phoneBlockID: any) {
    const blockObj = {};
    blockObj['phoneBlockID'] = phoneBlockID;
    this.callService.UnBlockPhoneNumber(blockObj).subscribe((response) => {
      this.message.alert(this.currentLanguageSet.successfullyUnblocked, 'success');
      this.addToBlockList();
    }, (err) => {
      this.message.alert(err.status, 'error');
    })
  }
  block(phoneBlockID: any) {
    const blockObj = {};
    blockObj['phoneBlockID'] = phoneBlockID;
    this.callService.blockPhoneNumber(blockObj).subscribe((response) => {
      this.message.alert(this.currentLanguageSet.successfullyBlocked, 'success');
      this.addToBlockList();
    }, (err) => {
      this.message.alert(err.status, 'error');
    })
  }
  getBlackList(e: any) {
    if (!e.checked) {
      this.phoneNumber = undefined;
      this.addToBlockList();
    }

  }
  getRecording(obj)
  {
    this.dispFlag = 0;
    if(obj)
    {
      let requestObj={
        "calledServiceID":this.serviceId,
        "phoneNo":obj.phoneNo,
        "count":obj.noOfNuisanceCall
      }

      this.callService.getRecording(requestObj).subscribe(response=>this.getRecordingsSuccessHandeler(response,obj.phoneNo));
    }
    
  }
ph_no="";
  getRecordingsSuccessHandeler(response,ph_no)
  {
    console.log(response,"get RECORDINGS SUCCESS");
    if(response !== undefined && response !== null)
    {
      this.recording_data=response.workList;
      this.showRecordings=true;
      // this.audio_path=response[0].recordingPath;
    }

    this.ph_no=ph_no;
    
  }

  check(agentID, sessionID, index) {
    console.log("AgentID", agentID);
    console.log("sessionID", sessionID);

    this.audioResponse = null;

    if (agentID > 0 && sessionID > 0) {
      if (this.recordingArray.length > 0) {
        this.recordingArray.forEach((element) => {
          if (sessionID === element.sessionId && agentID === element.agentId) {
            this.audioResponse = element.path;
            this.dispFlag = index;
            this.apiCall = false;
          }
        });
      }
      if (this.apiCall) {
        this.qualityAuditService.getAudio(agentID, sessionID).subscribe(
          (response) => {
            console.log("RESPONSEss", response.response);
            this.audioResponse = response.response;
            this.dispFlag = index;

            console.log("Audio Response1", this.audioResponse);
            this.recordingArray.push({
              sessionId: sessionID,
              agentId: agentID,
              path: this.audioResponse,
            });
            console.log("RecordingArray", this.recordingArray);
          },
          (err) => {
            this.message.alert(
             this.currentLanguageSet.failedToGetTheVoiceFilePath,
              "error"
            );
            console.log("ERROR", err);
          }
        );
      } else {
        this.apiCall = true;
      }
    }
  }
}
