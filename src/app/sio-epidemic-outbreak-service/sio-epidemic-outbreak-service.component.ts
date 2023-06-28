import { Component, OnInit, Input } from '@angular/core';
import { EpidemicServices } from '../services/sioService/epidemicServices.service';
import { dataService } from '../services/dataService/data.service';
import { LocationService } from '../services/common/location.service';
import { FeedbackResponseModel } from '../sio-grievience-service/sio-grievience-service.component';
import { RegisteredBeneficiaryModal104 } from '../beneficiary-registration-104/beneficiary-registration-104.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
declare var jQuery: any;
import { FeedbackTypes } from "../services/common/feedbacktypes.service";
import { CallServices } from '../services/callservices/callservice.service';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-sio-epidemic-outbreak-service',
  templateUrl: './sio-epidemic-outbreak-service.component.html',
  styleUrls: ['./sio-epidemic-outbreak-service.component.css']
})
export class SioEpidemicOutbreakServiceComponent implements OnInit {

  beneficiaryRegID: any;
  outbreakComplaintID: any = "";

  epidemicOutbreaksArray:Array<any> = [];

  //	showEpidemicForm: boolean = false;
  showTable: boolean = true;

  districtID: any;
  data:Array<any> = [];
  districts:Array<any> = [];
  taluks:Array<any> = [];
  villages:Array<any> = [];
  epidemicComplaintTypes:Array<any> = [];
  agentData: any;
  complaintTypeOBJ: any;  //dummy object just used to data transferring
  beneficiaryDetails: any;
  msg: any;
  feedbackTypeID: any = 1;
  calledServiceID: any;
  altPhNumber: any;
  city_village: any;
  outboundReq: boolean = false;
  minDate: Date;
  dateOfOutbound: any;
  currentCampaign: any;
  epidemicComplaintID: any;
  affectedNumber: any;
  district: any;
  taluk: any;
  remarks: any;
  noc: any;
  providerServiceMapID: any;
  filteredEpidemicList: any[];
  filterTerm;
  searchType:any = "ComplaintID";
	viewALL: any = true;
  minLength: number = 1;
  maxLength: number = 30;
  current_role: any;
  currentLanguageSet: any;
  constructor(public _EpidemicServices: EpidemicServices,
    private _smsService: SmsTemplateService,
    public dialog: MdDialog, private _callServices: CallServices,
    private alertMesage: ConfirmationDialogsService, public commonAppData: dataService, public location: LocationService,
    private _feedbackTypes: FeedbackTypes,public HttpServices: HttpServices) {
    this.beneficiaryDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.beneficiaryRegID = this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    }
    else {
      this.beneficiaryRegID = this.commonAppData.benRegID;
    }

  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.commonAppData.current_service.serviceID;
    this.currentCampaign = this.commonAppData.current_campaign;
    this.dateOfOutbound = new Date();
    this.minDate = new Date();

    if (this.commonAppData.current_campaign == 'INBOUND') {
      let obj = {
        "beneficiaryRegID": this.beneficiaryRegID
      }
      this.getEpidemicDetails(obj);
    } //In case of outbound particular history need to fetch on the basis of rqstID, after all the master data gets loaded ..... 
    else {
      this.showTable = false;
      //	this.showEpidemicForm = true;
    }
    this.agentData = this.commonAppData.Userdata;
		/**
		  here in this function below, the parameters passed are
		  "104" & "3" which is the serviceLineID and feedbackTypeID
		  respectively.
		  1=generic complaint types for feedback
		  2=asha complaints types
		  3=epidemic complaints type
  
		*/
    this.calledServiceID = this.commonAppData.current_service.serviceID;

    // let healthcareWorkerTypeID;

    // if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary)
    // 	healthcareWorkerTypeID = this.beneficiaryDetails.i_beneficiary.i_bendemographics.healthCareWorkerID;

    // if (healthcareWorkerTypeID != undefined && healthcareWorkerTypeID == 1) {
    // 	this.feedbackTypeID = 3;
    // } //commented on 25/9/18 not required, required only in grievance

    let data: any = {};
    data.providerServiceMapID = this.calledServiceID;
    data.feedbackTypeID = this.feedbackTypeID;
    this._feedbackTypes.getFeedbackTypeID(this.commonAppData.current_service.serviceID).subscribe(response => this.getFeedbackTypeIDSuccessHandeler(response));
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

  getEpidemicDetails(obj) {
    this._EpidemicServices.getEpidemicDetailsByBenID(obj).subscribe(response => this.epidemicHistorySuccesshandeler(response));

  }


  getFeedbackTypeIDSuccessHandeler(response) {
    //	console.log("FEEDBACK ID TYPE ***###***", JSON.stringify(response));
    for (let i = 0; i < response.length; i++) {
      if (response[i].feedbackTypeName === "Epidemic Complaints") {
        this.feedbackTypeID = response[i].feedbackTypeID;
      }
    }


    this._EpidemicServices.getNatureOfEpidemicComplaint(this.calledServiceID, this.feedbackTypeID).subscribe(response => this.complaintTypesHandeler(response));

  }

  showForm() {
    this.noc = "";
    this.affectedNumber = "";
    this.district = "";
    this.taluk = "";
    this.city_village = "";
    this.outboundCheckBox(false);
    this.dateOfOutbound = new Date();
    this.remarks = "";

    this.showTable = false;
    //	this.showEpidemicForm = true;
    this.filterTerm = "";
		this.viewALL = true;
		this.searchType = "ComplaintID";
  }

  showHistory() {
    this.showTable = true;
    //	this.showEpidemicForm = false;
    this.filterTerm = "";
		this.viewALL = true;
		this.searchType = "ComplaintID";
  }
  revertFullTable() {
		this.filterTerm = "";
		this.viewALL = true;
    this.searchType = "ComplaintID";
    this.minLength = 1;
    this.maxLength = 30;
		let obj = {
      "beneficiaryRegID": this.beneficiaryRegID
    }
    this.getEpidemicDetails(obj);
	}
  getTaluks(districtID: any, res) {
    this.location.getTaluks(districtID).subscribe(response => {
      this.taluks = this.successHandeler2(response);
      this.city_village = undefined;
      if (this.currentCampaign == 'OUTBOUND') {
        this.taluk = res[0].affectedDistrictBlockID;
        this.getVillages(res[0].affectedDistrictBlockID, res);
      }
    });

  }
  successHandeler2(res) {
    return res;
  }
  getVillages(id: any, res) {
    this.location.getBranches(id).subscribe(response => {
      this.villages = this.successHandeler2(response);
      if (this.currentCampaign == 'OUTBOUND') {
      this.city_village = res[0].affectedVillageID;
      }
    });
  }

  epidemicComplaintOBJ: any = {};
  registerEpidemicComplaint(epidemic_complaint_object) {

    //	console.log(epidemic_complaint_object, "epidemic complaint lodged");
    // this.epidemicComplaintOBJ.affectedCityID = 1;
    this.epidemicComplaintOBJ.affectedDistrictBlockID = epidemic_complaint_object.Taluk;
    this.epidemicComplaintOBJ.affectedDistrictID = epidemic_complaint_object.district;
    this.epidemicComplaintOBJ.beneficiaryRegID = this.beneficiaryRegID;
    this.epidemicComplaintOBJ.natureOfComplaint = epidemic_complaint_object.NOC;
    this.epidemicComplaintOBJ.totalPeopleAffected = epidemic_complaint_object.affectedNumber.toString();
    this.epidemicComplaintOBJ.deleted = false;
    this.epidemicComplaintOBJ.remarks = epidemic_complaint_object.remarks;
    this.epidemicComplaintOBJ.createdBy = this.agentData.userName;
    this.epidemicComplaintOBJ.serviceID = this.calledServiceID;
    this.epidemicComplaintOBJ.affectedVillageID = epidemic_complaint_object.city_village;
    if (this.commonAppData.benCallID) {
      this.epidemicComplaintOBJ.benCallID = this.commonAppData.benCallID;
    }
    else {
      this.epidemicComplaintOBJ.benCallID = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
    }
    if (this.currentCampaign == 'OUTBOUND') {
      this.epidemicComplaintOBJ.requestID = this.commonAppData.outboundRequestID;
      this.epidemicComplaintOBJ.outbreakComplaintID = this.epidemicComplaintID;
    }
    this._EpidemicServices.saveEpidemicDetailsByBenID(this.epidemicComplaintOBJ)
      .subscribe((response) => {
        this.saveRequestHandeler(response);
        if (this.outboundReq) {
          this.takeFollowUp(epidemic_complaint_object, response.requestID);
        }
      }, (err) => {
        this.alertMesage.alert(err.status, 'error');
      });

  }

  outboundCheckBox(ev) {
    this.outboundReq = ev.checked;
  }

  takeFollowUp(values, requestID) {

    let benDetails = this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    let id
    if (this.commonAppData.benCallID) {
      id = this.commonAppData.benCallID;
    }
    else {
      id = benDetails.benCallID;
      //	console.log("benCallID: " + benDetails.benCallID);
    }
    let obj = {
      "endCall": false,
      "beneficiaryRegID": this.beneficiaryRegID,
      "providerServiceMapID": this.calledServiceID,
      "isFollowupRequired": true,
      "prefferedDateTime": values.dateOfOutbound,
      "createdBy": this.agentData.userName,
      "requestedFeature": "Epidemic Outbreak Service",
      "requestedFor": values.remarks,
      "requestNo": requestID,
      "benCallID": id

    }
    this._callServices.closeCall(obj).subscribe((response) => { this.followUpSuccess(response) },
      (err) => {
        this.alertMesage.alert(this.currentLanguageSet.errorWhileTakingFollowUpEpidemic, 'error')
        console.log(err)
      });
  }

  followUpSuccess(res) {
    console.log(res);
  }

  epidemicHistorySuccesshandeler(response) {
    //	console.log('the epidemic response is', response);
    // this.epidemicOutbreaksArray = response;
    this.setTableArray(response);
  }

  setTableArray(data) {
    this.data = data;
    this.filteredEpidemicList = data;
  }

  successHandeler(response) {
    //	console.log('response is ', response);
    if (this.currentCampaign == 'OUTBOUND') {
      this.commonAppData.serviceAvailed.next(true);  //no need to avail any service in OUTBOUND so sending true
      this.getHistoryForOutbound();
    }
    return response;
  }
  getHistoryForOutbound() {
    if (this.commonAppData.outboundRequestID !== undefined && this.commonAppData.outboundRequestID !== null) {
      let obj = {
        "requestID": this.commonAppData.outboundRequestID
      }
      this._EpidemicServices.getEpidemicDetailsByBenID(obj).subscribe(response => this.outboundHistorySuccess(response),
        (err) => {
          this.alertMesage.alert(this.currentLanguageSet.errorInFetchingEpidemicHistory, 'error');
        });
    } else {
      console.log("outbound request ID is not there");
    }
   
  }
  outboundHistorySuccess(res) {
    if (res !== undefined || res !== null) {
      this.epidemicComplaintID = res[0].outbreakComplaintID;

      this.noc = res[0].natureOfComplaint;
      this.affectedNumber = res[0].totalPeopleAffected;
      this.district = res[0].affectedDistrictID;
      this.getTaluks(res[0].affectedDistrictID, res);
      this.remarks = res[0].remarks;
    }
    
  }
  complaintTypesHandeler(response) {
    for (let i = 0; i < response.length; i++) {
      this.epidemicComplaintTypes.push(response[i].m_feedbackNature[0]);
    }
    this.location.getDistricts(this.commonAppData.current_stateID_based_on_role).subscribe(response => {
      this.districts = this.successHandeler(response);
    });

  }

  saveRequestHandeler(response) {
    //	console.log('epidemic req saved', response);
    this.outbreakComplaintID = response.requestID;
    this.commonAppData.serviceAvailed.next(true); // service availed, now call can be marked as valid in closure page

    this.msg = this.currentLanguageSet.epidemicOutbreakInformationRegisteredSuccessfully + this.outbreakComplaintID;
    if (response.outbreakComplaintID != undefined) {
      if (this.currentCampaign == 'INBOUND') {
        this.msg = this.currentLanguageSet.epidemicOutbreakInformationRegisteredSuccessfully + this.outbreakComplaintID;

        let obj = {
          "beneficiaryRegID": this.beneficiaryRegID
        }
        this.getEpidemicDetails(obj);

        this.showTable = true;
        //	this.showEpidemicForm = false;
        jQuery("#epidemic_form").trigger("reset");
      }
      else {
        this.msg = this.currentLanguageSet.epidemicOutbreakInformationUpdatedSuccessfully + this.outbreakComplaintID;
        this.getHistoryForOutbound();
      }
      var dialogReff = this.dialog.open(RegisteredBeneficiaryModal104, {
        // height: '280px',
        width: '420px',
        disableClose: true,
        data: {
          "generatedId": this.msg,
          "Title": "Success"
        }
      });

      dialogReff.afterClosed().subscribe(result => {
        if (result != 'close' && result != '') {
          this.altPhNumber = result;

          // sms code
          this.sendSMS(this.altPhNumber, response);
        }


      });
    }
    if (response.statusCode == 5000) {

      this.alertMesage.alert(this.currentLanguageSet.errorOccuredPleaseTryAgain, 'error');
    }
  }

  sendSMS(alternate_number, epidemicObj) {
    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.commonAppData.current_serviceID;

    this._smsService.getSMStypes(currentServiceID)
      .subscribe(response => {
        if (response != undefined) {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              if (response[i].smsType.toLowerCase() === 'Epidemic Outbreak Complaint SMS'.toLowerCase()) {
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
                    'beneficiaryRegID': this.beneficiaryRegID,
                    "outbreakComplaintID": epidemicObj.outbreakComplaintID,
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
                      this.alertMesage.alert(this.currentLanguageSet.smsSent, 'success');
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

  filterEpidemicList(searchTerm: string) {
		if (!searchTerm)
			this.filteredEpidemicList = this.data;
		else {
      let obj = { 
				"phoneNum":this.searchType == 'MobileNumber' ? searchTerm.trim() : null,
				"requestID":this.searchType == 'ComplaintID' ? searchTerm.trim() : null
       };
      this.viewALL = false;
			this.filteredEpidemicList = [];
      this._EpidemicServices.getEpidemicDetailsByBenID(obj).subscribe(response => this.filteredEpidemicList = response);
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

  

  ngOnChanges() {
  
  }
}