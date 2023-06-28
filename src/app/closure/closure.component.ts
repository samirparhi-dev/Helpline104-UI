import {
  Component,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { NgForm } from "@angular/forms";
import { dataService } from "../services/dataService/data.service";
import { CallServices } from "../services/callservices/callservice.service";
import { FeedbackResponseModel } from "../sio-grievience-service/sio-grievience-service.component";
import { MdDialog } from "@angular/material";
import { Observable } from "rxjs/Rx";
//import { Router } from '@angular/router';
import { Router } from "@angular/router";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { AvailableServices } from "../services/common/104-services";
import { CzentrixServices } from "../services/czentrix/czentrix.service";
import { ListnerService } from "../services/common/listner.service";
import { OutboundSearchRecordService } from "../services/outboundServices/outbound-search-records.service";
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { SearchService } from "../services/searchBeneficiaryService/search.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import { CaseSheetService } from "app/services/caseSheetService/caseSheet.service";
import { ScheduleAppointmentComponent } from "app/schedule-appointment/schedule-appointment.component";
import { map } from "jquery";


declare var jQuery: any;
@Component({
  selector: "app-closure",
  templateUrl: "./closure.component.html",
  styleUrls: ["./closure.component.css"],
})
// export class ClosureComponent implements AfterViewInit
export class ClosureComponent implements OnInit {
  @Input() beneficiarySelected: any;
  @Output() callClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() callContinue: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("Form") closureForm: NgForm;
  @Input() transferCondition: any;
  @Output() roleChanged: EventEmitter<any> = new EventEmitter<any>();

  //summaryList: any = [];
  showCallSummary: boolean = false;
  remarks: any;
  callClosureType: any;
  calltypes: Array<any> = [];
  callSubTypes: any;
  callTypeObj: any;
  isFollowupRequired: any = "0";
  selectedFeature: any;
  preferredDateTime: any;
  callTypeID: any;
  beneficiaryDetails: any;
  current_role: any;
  minDate: Date;
  doFollow: any = false;
  showRadio: any;
  ticks: any;
  callType: any;
  subCallTypeID: any;
  //requestObj:any = {};
  services: Array<any> = [];
  subServiceID: any;
  ipAddress: any;
  followupOn: any;
  transferableCampaigns: Array<any> = [];
  toBeTransfered: boolean;
  screens: any;
  features: Array<any> = [];
  instituteTypeData: any = [];
  instituteNameData: any = [];
  kept_in_transfer: any;
  configure_campaign: any;
  login_to_softphone: any;
  invalid_without_beneficiary: any;
  select_subType: any;
  transfer_to: any;
  current_campaign: any;
  doTransfer: boolean = false;
  nuisanceBLock: boolean = false;
  validTrans: boolean = true;
  transferCall: any;
  hasHAOPrivilege: boolean = false;
  privleges: Array<any> = [];
  transferToService: any;
  transferCampaign: any;
  showFollowUp: boolean = true; // this will be made false only in case of casesheet saved as other
  //timeRemaining = 30;
  // showSlider: boolean;
  featureRoleMapArray: Array<any> = [];
  disableTransfer: boolean = false;
  coRoleID: any;
  coServiceAvailed: any;
  coServiceName: any;
  coServiceOBJ = {};
  coServiceRemoved: boolean = false;
  transferSkills: Array<any> = [];
  transferSkill: any;
  beneficiarySelectedRegID: any;
  commonData: Array<any> = [];
  currentLanguageSet: any;
  coRoleName: any;
  isFeedbackRequiredFlag: boolean = false;
  showFeedbackRequiredFlag: boolean = false;
  // CR Requirement
  externalRefferal: any;
  instituteType : any;
  instituteName : any;
  institutionID: any;
  enableInstitute: boolean = false;
  varRefral : any;
  appointmnetSuccessFlag : boolean;
  
  constructor(
    public dialog: MdDialog,
    public _userdata: UserBeneficiaryData,
    private _callServices: CallServices,
    private benService: SearchService,
    private saved_data: dataService,
    private caseSheetService: CaseSheetService,
    public router: Router,
    private listnerService: ListnerService,
    private message: ConfirmationDialogsService,
    private _availableServices: AvailableServices,
    private czentrixServices: CzentrixServices,
    private _OSRService: OutboundSearchRecordService,
    private OCRService: OutboundReAllocationService,
    public HttpServices: HttpServices
  ) {
    this.listnerService.disableFollowUp.subscribe((data) => {
      //  console.log(data);
      this.changeRadioButtonVisibility(data);
    });
  }
  reset: any;
  isSelf: boolean = true;
  agentData: any;
  serviceAvailed = false;
  caste: any;
  education: any;
  outboundBenRegID: any;
  disableCallType : boolean = false;

  ngOnInit() {
    console.log("@@@@@@@@@@@@@@@@@@@@");
    this.currentLanguageSetValue();
    let today = new Date();
    this.followupOn = today;
    this.minDate = today;
    this.current_role = this.saved_data.current_role;
    // this.appointmnetSuccessFlag = this._callServices.successAppointment;
    this.current_campaign = this.saved_data.current_campaign;
    this.screens = this.saved_data.screens;
    this.getOutboundCallFeatures();
    this.getInstituteType();
    // this.getInstituteName();
    this.toBeTransfered = false;
    //  console.log(this.current_role);
    this.privleges = this.saved_data.userPriveliges;
    this.checkHAOPrivilege();
    this.agentData = this.saved_data.Userdata;
    let requestObject = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
    };
    if (this.current_campaign == "INBOUND") {
      requestObject["isInbound"] = true;
    } else {
      requestObject["isOutbound"] = true;
    }

    this._callServices.getCallTypes(requestObject).subscribe(
      (response) => {
        this.callTypeObj = response;
        this.populateCallTypes(response);
      },
      (err) => {}
    );

    this.saved_data.serviceAvailed.subscribe((data) => {
      this.serviceAvailed = true;
    });
    this._availableServices
      .getServices(requestObject)
      .subscribe((response) => this.successHandler(response));

    this.showRadio = false;
    this.ipAddress = this.saved_data.ipAddress;

    if (this.ipAddress == undefined) {
      //  console.log("fetch ipAddress");
      this.czentrixServices.getIpAddress(this.saved_data.agentID).subscribe(
        (response) => {
          this.ipSuccessHandler(response);
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
    } else {
      this.getTransferableCampaigns();
    }
    // this.showSlider = false;
    // let timer = Observable.timer(2000,1000);
    // timer.subscribe(t=>{
    //   this.ticks=(this.timeRemaining-t);
    //   if(t==this.timeRemaining){
    //     this.router.navigate(['/MultiRoleScreenComponent', { outlets: { 'postLogin_router': ['dashboard'] } }]);
    //   }
    // });
    requestObject = {
      providerServiceMapID: this.saved_data.current_service.serviceID,
    };
    this._OSRService.getFeatureRoleMapping(requestObject).subscribe(
      (response) => {
        console.log(response, "featureRoleMapArray");
        this.featureRoleMapArray = response.data;
        this.getCORoleID();
      },
      (error) => {
        console.log(error);
      }
    );
    this.saved_data.callDisconnected.subscribe(() => {
      this.closureForm.form.patchValue({ transferCall: "" });
      this.disableTransfer = true;
      console.log("callDisconnected");
    });

    if (this.current_campaign == "OUTBOUND") {
      let res = this.saved_data.isSelf;

      if (res) {
        this.isSelf = true;
      } else {
        this.isSelf = false;
      }
    }

    this.saved_data.isEmergency.subscribe((data) => {
      //  console.log("data: " + data);
      this.handleEmergency(data);
    });

    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.beneficiarySelectedRegID =
        this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
    } else {
      this.beneficiarySelectedRegID = this.saved_data.benRegID;
    }
    if (this.current_campaign == "OUTBOUND") {
      this.outboundBenRegID = this.saved_data.outboundBenID;
    }
    if (this.current_role != "RO")
      this._userdata
        .getUserBeneficaryData({
          providerServiceMapID: this.saved_data.current_service.serviceID,
        })
        .subscribe((response) => this.IDsuccessHandeler(response));
  }
  IDsuccessHandeler(res) {
    this.commonData = res;
    if (this.saved_data.caste) {
      this.caste = this.saved_data.caste;
    }
    if (this.saved_data.educationID && this.current_role == "CO") {
      this.education = this.saved_data.educationID.toString();
    }
  }
  handleEmergency(data) {
    // populate call type as valid if emergency is selected
    console.log("data.emergency: " + data.emergency);
    if (data.emergency) {
      this.callType = "Valid";
      this.getCallSubType("Valid");
    } else {
      this.callType = "";
    }
    this.enableOrDisableCoService(data.emergency);
  }
  

  enableOrDisableCoService(isEmergency) {
    // let found = false;
    // for (var i = 0; i < this.services.length; i++) {
    //   if (this.services[i].Name == this.coServiceName) {
    //     found = true;
    //     break;
    //   }
    // }
    if (isEmergency) {
      if (
        this.coServiceRemoved &&
        !this.services[this.services.length - 1].subServiceName
          .toLowerCase()
          .includes(this.coServiceName)
      ) {
        this.services.push(this.coServiceOBJ);
        console.log(this.coServiceName + " added to services");
      }
    } else {
      if (
        this.coServiceRemoved &&
        this.services[this.services.length - 1].subServiceName
          .toLowerCase()
          .includes(this.coServiceName)
      ) {
        // remove CO service from services
        var index = this.services.indexOf(this.coServiceName);
        this.services.splice(index, 1);
        console.log(this.coServiceName + " removed from services");
      }
    }
  }

  successHandler(response) {
    this.services = response;
    this.getSubserviceID();
  }

  ipSuccessHandler(response) {
    this.ipAddress = response.agent_ip;
    this.saved_data.ipAddress = this.ipAddress;
    this.getTransferableCampaigns();
  }

  getOutboundCallFeatures() {
    this.features = [];
    if (this.current_role == "HAO") this.features.push("Health_Advice");
    else if (this.current_role == "CO") this.features.push("Counselling");
    else if (this.current_role == "MO") this.features.push("Medical_Advice");
    else if (this.current_role == "PD") this.features.push("Psychiatrist");

    if (this.screens.includes("Blood Request"))
      this.features.push("Blood Request");
  }

  getSubserviceID() {
    for (let i = 0; i < this.services.length; i++) {
      if (this.current_role == "HAO") {
        if (this.services[i].subServiceName.indexOf("Health") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "CO") {
        if (this.services[i].subServiceName.indexOf("Counselling") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "MO") {
        if (this.services[i].subServiceName.indexOf("Medical") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      } else if (this.current_role == "SIO") {
        if (this.services[i].subServiceName.indexOf("Blood") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        } else if (this.services[i].subServiceName.indexOf("Organ") != -1) {
          this.subServiceID = this.services[i].subServiceID;
          break;
        }
      }
    }
  }

  populateCallTypes(response: any) {
    
    if(this.current_role==="HAO" || this.current_role==="MO"){
      this.calltypes = response.map(function (item) {
        return { callTypeDesc: item.callGroupType };
        
      });
    }
    else{
      this.calltypes = response.filter(function (item){
        return item.callGroupType.toLowerCase() != "referral"
      }).map(function (item) {
          return { callTypeDesc: item.callGroupType };
      });
    }
    
    var valid = response.filter(function (item) {
      if (item.callGroupType === "Valid") {
        return item.callGroupType;
      }
    });
    this.callType = valid[0].callGroupType;
    
    if (this.callType === "Valid") {
      this.getCallSubType(this.callType, true);
    }
  }

  getCallSubType(callType: any, firstTime?) {
    this.subCallTypeID = undefined;
    this.callType = callType;
    // this.current_role=sessionStorage.getItem("current_role")
  //   if(this.current_role=="Supervisor"){
  //       this.roleFlag=false;

    if (callType == "Valid" || callType == "Transfer" || callType == "Referral") {
      this.validTrans = true;
      this.nuisanceBLock = false;
    } else {
      this.validTrans = false;
      this.nuisanceBLock = true; // this is done to disable S & COntinue in case of incomplete
    }

    this.callSubTypes = this.callTypeObj
      .filter(function (item) {
        return item.callGroupType === callType;
      })
      .map(function (previousData, item) {
        return previousData.callTypes;
      })[0];

    var valid = this.callSubTypes.filter(function (item) {
      if (item.callType === "Valid") {
        return item;
      }
    });

    if (firstTime) {
      this.subCallTypeID =
        valid[0].callTypeID +
        "," +
        valid[0].fitToBlock +
        "," +
        valid[0].fitForFollowUp;
      this.radioVisibility(this.subCallTypeID);
    }
    if (callType.toUpperCase() === 'Valid'.toUpperCase()) {
      this.showFeedbackRequiredFlag = true;
    }
    if (callType.toUpperCase() != 'Valid'.toUpperCase()) {
      this.isFeedbackRequiredFlag = false;
      this.showFeedbackRequiredFlag = false;
   
    }
    // if(this.current_role=="HAO" || this.current_role=="hao"){
      if (callType.toLowerCase() === 'referral' && this.beneficiarySelectedRegID != undefined &&
        this.beneficiarySelectedRegID != null &&
        this.beneficiarySelectedRegID != ""){
        let mdDialogRef = this.dialog.open(
          ScheduleAppointmentComponent,
          {
            width:"70%",
            height:"70%",
            disableClose: true,
          }
        );

        mdDialogRef.afterClosed().subscribe((result) => {
          if(result==true){
            this.disableCallType=true;
          }
          else{
            this.callType="Valid";
            this.getCallSubType("Valid");
          }
        }
        );
      }
      else if(callType.toLowerCase() === 'referral'){
        this.message.alert(
          this.currentLanguageSet.callCantMarkedReferraldWithoutBeneficiarySelection
        ); 
            this.callType="Valid";
            this.getCallSubType("Valid");
      }
    // }
    // if (callType.toLowerCase() === 'referral'){
    //   let mdDialogRef = this.dialog.open(
    //     ScheduleAppointmentComponent,
    //     {
    //       width:"50%",
    //       disableClose: true,
    //     }
    //   );

    // }
  }

  isEmergency: boolean = false;
  Emergency(event) {
    if (event) {
      this.isEmergency = true;
      this.isSuicidal = false;
    } else {
      this.isEmergency = false;
    }
    this.enableOrDisableCoService(event);
  }

  isSuicidal: boolean = false;
  Suicidal(event) {
    if (event) {
      this.isSuicidal = true;
      this.isEmergency = false;
    } else {
      this.isSuicidal = false;
    }
    this.enableOrDisableCoService(event);
  }

  isFeedbackRequired(ev) {
    this.isFeedbackRequiredFlag = ev.checked;
  }

  closeCall(values: any, btnType: any) {
    values.callType = this.callType;
    this.setbenRegID(values);
    let validBen = this.populateInfoMsgOnValidCallTypes(values);
    if (validBen) {
      this.setEmergencyTypeForRORole(values);
      this.updateCasteForBen(values);
      console.log('before transfer to campaign');
      // if (this.toBeTransfered || this.doTransfer) {
      //   this.transferCallToCampaign(values);
      // }
      values.isSelf = this.isSelf;
      values.callType = this.callType;
      values.providerServiceMapID = this.saved_data.current_service.serviceID;
      values.externalRefferal = this.externalRefferal;
      values.instTypeId = this.institutionID;
      values.instNames = this.instituteName;
      values.isFollowupRequired = this.doFollow;
      values.isTransfered = this.doTransfer;
      values.isFeedback = this.isFeedbackRequiredFlag;

      if (values.isFollowupRequired == undefined) {
        values.isFollowupRequired = false;
      }

      if (values.isFollowupRequired && this.subServiceID)
        values.requestedServiceID = this.subServiceID;

      if (this.followupOn) {
        this.followupOn = new Date(this.followupOn);
        this.followupOn = new Date(
          this.followupOn -
            1 * (this.followupOn.getTimezoneOffset() * 60 * 1000)
        ).toJSON();
      } else {
        this.followupOn = undefined;
      }
      values.prefferedDateTime = this.followupOn;
      values.createdBy = this.agentData.userName;
      values.requestedFor = this.remarks;
      console.log("values.callTypeID: " + values.callTypeID);
      values.fitToBlock = values.callTypeID.split(",")[1];
      values.callTypeID = values.callTypeID.split(",")[0];
      values.agentID = this.saved_data.agentID;
      values.callID = sessionStorage.getItem("session_id");
      values.agentIPAddress = this.ipAddress;
      values.callID = sessionStorage.getItem("session_id");
      if (btnType == "submitClose") {
        values.endCall = true;
        values.callEndUserID = this.saved_data.uid;
      }

      if (this.doFollow) {
        values.requestedFeature = this.selectedFeature
          ? this.selectedFeature
          : this.features[0];
      }
      if (
        (this.saved_data !== undefined &&
          this.saved_data.benCallID !== undefined &&
          this.saved_data.benCallID !== null) ||
        (this.beneficiaryDetails !== undefined &&
          this.beneficiaryDetails.benCallID !== undefined &&
          this.beneficiaryDetails.benCallID !== null)
      ) {
        if (this.saved_data.benCallID) {
          values.benCallID = this.saved_data.benCallID;
        } else {
          values.benCallID = this.beneficiaryDetails.benCallID;
        }
         console.log(JSON.stringify(values));
        this._callServices.closeCall(values).subscribe(
          (response) => {
            if (response !== undefined && response !== null) {
              if (this.current_campaign == "OUTBOUND") {
                values.beneficiaryRegID = this.saved_data.outboundBenID;
                values.isCompleted = true;
                this.updateOutboundCallStatus(values);
              }
              this.checkForSubmitCloseBtnType(btnType);
            }
          },
          (err) => {
            console.log(err);
            this.message.alert(err.status, "error");
          }
        );
      } else {
        this.message.alert(
          this.currentLanguageSet.benCallIDIsNullNotAbleToCloseCall
        );
      }
      this.submitContinueBtnType(btnType);
    }
  }
  
  setbenRegID(values) {
    if (this.saved_data !== undefined && this.saved_data !== null) {
      this.beneficiaryDetails =
        this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails;
    }
    if (this.current_campaign == "OUTBOUND") {
      values.beneficiaryRegID = this.saved_data.outboundBenID;
    } else {
      values.beneficiaryRegID = this.beneficiarySelectedRegID;
    }
  }
  populateInfoMsgOnValidCallTypes(values) {
    if (
      values.callType.toLowerCase() == "valid" &&
      values.beneficiaryRegID == undefined &&
      values.beneficiaryRegID == null && 
      this.current_role == "RO" && values.transferCall == undefined && values.transferCall == null
    ) {
      this.showAlert(
        this.currentLanguageSet.callCantMarkedValidWithoutBeneficiarySelection
      );
      return false;
    } else if (
      values.callType.toLowerCase() == "valid" && values.transferCall == undefined && values.transferCall == null &&
      !this.serviceAvailed &&
      this.current_role != "RO" && this.current_role != "CO"
    ) {
      this.showAlert(
        this.currentLanguageSet.callCantBeMarkedAsValidWithoutAvailingAnyService
      );
      return false;
    }
    return true;
  }
  setEmergencyTypeForRORole(values) {
    if (this.current_role == "RO") {
      let eType;

      if (!this.isEmergency && !this.isSuicidal) {
        eType = 0;
      } else if (this.isEmergency && !this.isSuicidal) {
        eType = 1;
      } else if (!this.isEmergency && this.isSuicidal) {
        eType = 2;
      }
      values.emergencyType = eType;
    }
  }
  updateCasteForBen(values) {
    if (this.current_role != "RO" && values.beneficiaryRegID) {
      let obj = {
        beneficiaryRegID: values.beneficiaryRegID,
        i_bendemographics: {
          communityID: values.caste,
          educationID: this.current_role == "CO" ? values.education : undefined,
        },
      };

      this.benService.updateOtherBenDetails(obj).subscribe(
        (res) => {
          console.log("Successfully updated caste from closure");
        },
        (err) => {
          this.message.alert(
            this.currentLanguageSet.errorWhileUpdatingCasteFromClosure,
            "error"
          );
        }
      );
    } // to save/update the caste  from this component
  }
  updateOutboundCallStatus(values) {
    let outboundObj = {};
    outboundObj["outboundCallReqID"] = this.saved_data.outboundCallReqID;
    outboundObj["callTypeID"] = values.callTypeID.split(",")[0];
    if (this.callType == "Valid" || values.callType == "Valid") {
      outboundObj["isCompleted"] = true;
    } else {
      outboundObj["isCompleted"] = false;
    }
    this._callServices.updateOutBoundCall(outboundObj).subscribe(
      (response) => {
        //  this.closeOutboundCall();
      },
      (err) => {
        this.message.alert(err.status, "error");
      }
    );
  }
  checkForSubmitCloseBtnType(btnType) {
    if (btnType == "submitClose") {
      if (this.hasROPrivilege()) {
        this.saved_data.current_role = "RO";
        this.saved_data.current_feature = "Registration";
        //this.roleChanged.emit("RO");
      }
      if (!(this.toBeTransfered || this.doTransfer)) {
        this.showAlert(
          this.currentLanguageSet.callClosedSuccessfully,
          "success"
        );
      }
      this.callClosed.emit();
    } else {
      if (this.current_role == "RO" || this.hasROPrivilege()) {
        jQuery("#myCarousel").carousel(0);
        jQuery("#one").parent().find("a").removeClass("active-tab");
        jQuery("#one").find("a").addClass("active-tab");
        this.saved_data.current_role = "RO";
        this.callContinue.emit();
        this.roleChanged.emit("RO");
        this.reset = "yes";
      } else {
        // transfer call to RO
        let roCampaignName;

        let transferRole = this.getTransferRoleFromFeature("Registration");
        if (transferRole == undefined)
          roCampaignName = this.getCampaignName("ro");
        else roCampaignName = this.getCampaignName(transferRole);

        console.log("RO CampaignName: " + roCampaignName);

        if (roCampaignName) {
          this.transferCallToCampaign1(roCampaignName, undefined);
        } else {
          this.showAlert(this.currentLanguageSet.pleaseConfigureRoCampaign);
        }
      }
    }
  }
  submitContinueBtnType(btnType) {
    if (btnType == "submitContinue") {
      this.isEmergency = false;
      this.isSuicidal = false;
      this.transferCall = undefined;
      this.remarks = "";
      this.transferSkill = undefined;
      var valid = this.calltypes.filter((item) => {
        if (item.callTypeDesc === "Valid") {
          return item.callTypeDesc;
        }
      });
      this.callType = valid[0].callTypeDesc;
      if (this.callType === "Valid") {
        this.getCallSubType(this.callType, true);
      }
    } else {
      this.closureForm.reset();
      this.externalRefferal = "";
      this.instituteName = "";
      this.institutionID = "";
    } 
  }
  hasROPrivilege() {
    return this.screens.includes("Registration");
  }

  checkExternalRefferal(value) {
    if(value === "Yes") {
      this.enableInstitute = true;
    } else{
      this.enableInstitute = false;
      this.instituteName = null;
      this.institutionID = null;
    }
  }

  followupDateChange(currentVal) {
    currentVal = new Date(currentVal);
    currentVal.setHours(0);
    currentVal.setMinutes(0);
    currentVal.setSeconds(0);
    currentVal.setMilliseconds(0);
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    if (currentVal.getTime() < today.getTime() || currentVal.getTime() < 0) {
      this.followupOn = undefined;
    }
  }

  getTransferableCampaigns() {
    this.czentrixServices
      .getTransferableCampaigns(this.saved_data.agentID, this.ipAddress)
      .subscribe(
        (response) => {
          if (response !== undefined && response !== null) {
            this.transferableCampaigns = response.campaign;
          }
          console.log(
            "transferableCampaigns: " +
              JSON.stringify(this.transferableCampaigns)
          );
          // filter services should get called only after fetching CO Service availed status
          if (this.coServiceAvailed !== undefined) {
            this.filterServices();
          }

          /*emergency call transferscampaigns are inserted manually as these campaigns are external & can't be configured in C-Zentrix */
          /*  this.transferableCampaigns.push({ "campaign_id": "dummy1", "campaign_name": "EMERGENCY_108" });
        this.transferableCampaigns.push({ "campaign_id": "dummy2", "campaign_name": "EMERGENCY_102" });   */
        },
        (err) => {
          this.message.alert(err.errorMessage, "error");
        }
      );
  }

  transferCallToCampaign1(transferToCampaign, values) {
    console.log("transfer camapign");
    if (values) {
      sessionStorage.setItem("callTransferred", transferToCampaign);
      this.doTransfer = true;
      this.transferCondition = transferToCampaign;
      this.setbenRegID(values);
      //this.closeCall(values, "submitClose");
      this.transferCallToCampaign(values);
    } else {
      if (
        (this.saved_data !== undefined &&
          this.saved_data.benCallID !== undefined &&
          this.saved_data.benCallID !== null) ||
        (this.beneficiaryDetails !== undefined &&
          this.beneficiaryDetails.benCallID !== undefined &&
          this.beneficiaryDetails.benCallID !== null)
      ) {
        this.czentrixServices
          .transferToCampaign(
            this.saved_data.agentID,
            this.ipAddress,
            transferToCampaign,
            this.saved_data.benCallID
              ? this.saved_data.benCallID
              : this.beneficiaryDetails.benCallID,
              values.callType,
              values.callTypeID.split(",")[0]
          )
          .subscribe(
            (response) => {
              if (response.status == "SUCCESS") {
                this.showAlert(
                  this.currentLanguageSet.callTransferredTo +
                    " " +
                    transferToCampaign,
                  "success"
                );
                sessionStorage.removeItem("onCall");
                sessionStorage.removeItem("CLI");
                this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
                this.doTransfer = false;
                //  console.log("transferToCampaign response: " + JSON.stringify(response));
              }
            },
            (err) => {
              console.log("Error in getCampaigns", err);
            }
          );
      } else {
        this.message.alert(
          this.currentLanguageSet.benCallIDIsNullNotAbleToCloseCall
        );
      }
    }
  }

  transferEmergencyCallSuccessHandeler(response, transferToCampaign) {
    console.log(response, "emergency transfer");
    this.message.alert(
      this.currentLanguageSet.callIsKeptInConferenceWith + transferToCampaign,
      "success"
    );
  }

  getCampaignName(role) {
    if (this.transferableCampaigns.length > 0) {
      try {
        return this.transferableCampaigns.filter(function (item) {
          console.log(
            "campaign_name: " + item.campaign_name + " role: " + role
          );
          return item.campaign_name.toLowerCase().indexOf(role) != -1;
        })[0].campaign_name;
      } catch (err) {
        //  this.showAlert('Please configure RO campaign.');
        return undefined;
      }
    } else {
      console.log("No Campaigns");
    }
  }

  showAlert(msg, str?) {
    this.message.alert(msg, str);
  }
  showMenu: boolean;
  checkCampaigns() {
    console.log("close call after long time");
    this.showMenu = false;
    if (!this.transferableCampaigns || this.transferableCampaigns.length == 0)
      this.message.alert(this.currentLanguageSet.pleaseConfigureTheCampaigns);
    else if (!this.ipAddress) {
      this.message.alert(this.currentLanguageSet.pleaseLoginToSoftPhone);
      sessionStorage.removeItem("onCall");
      sessionStorage.removeItem("CLI");
      // sessionStorage.removeItem("session_id");
      this.router.navigate(["/MultiRoleScreenComponent/dashoard"]);
    } else if (this.subCallTypeID == undefined) {
      this.message.alert(this.currentLanguageSet.pleaseSelectSubtypeToTransfer);
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }

  changeRadioButtonVisibility(data) {
    this.showFollowUp = data.disable;
    this.isSelf = data.isSelf;
  }

  radioVisibility(val) {
    let fitToFollow = val.split(",")[2];
    if (fitToFollow == "true") {
      this.showRadio = true;
    } else {
      this.showRadio = false;
    }
  }

  isFollow(value: any) {
    //  console.log(value);
    this.selectedFeature = undefined;
    if (value == "1") {
      this.doFollow = true;
    } else {
      this.doFollow = false;
    }
  }

  @Input() current_language: any;
  current_language_set: any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'

  ngOnChanges() {
    this.currentLanguageSetValue();
    if (this.beneficiarySelected) {
      this.beneficiarySelectedRegID = this.beneficiarySelected;
      this.checkCOServiceAvailedStatus(this.beneficiarySelected);
    }
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  ngDoCheck() {
    this.currentLanguageSetValue();
  }

  transferCallToCampaign(values) {
    /*  if (this.transferCondition === "EMERGENCY_108") {
        this.czentrixServices.transferEmergencyCall(this.saved_data.agentID, this.ipAddress, 108).subscribe(response => this.transferEmergencyCallSuccessHandeler(response, this.transferCondition));
      }
      else if (this.transferCondition === "EMERGENCY_102") {
        this.czentrixServices.transferEmergencyCall(this.saved_data.agentID, this.ipAddress, 102).subscribe(response => this.transferEmergencyCallSuccessHandeler(response, this.transferCondition));
      } */
      let validBen = this.populateInfoMsgOnValidCallTypes(values);
      if (validBen) {
        console.log('before transfer to campaign');
        if (this.toBeTransfered || this.doTransfer) {
         // this.transferCallToCampaign(values);
         let skill_transfer_flag = "0";
    let skill = "";
    if (
      this.transferSkill != "" &&
      this.transferSkill != undefined &&
      this.transferSkill != null
    ) {
      // WRITE CODE HERE TO PASS VALUES
      skill_transfer_flag = this.transferSkill ? "1" : "0";
      skill = this.transferSkill;
    }
    this.setBencallID(values);
    if (values.benCallID !== undefined && values.benCallID !== null) {
      this.czentrixServices
        .transferToCampaign(
          this.saved_data.agentID,
          this.ipAddress,
          this.transferCondition,
          values.benCallID,
          skill_transfer_flag,
          skill,
          values.callType,
          values.callTypeID.split(",")[0]
        )
        .subscribe(
          (response) => {
            if (response.status == "SUCCESS") {this.callTransferSuccessAlert();
              this.closeCall(values, "submitClose");
            }
          },
          (err) => {
            this.message.alert(err.errorMessage, "error");
            console.log("Error in getCampaigns (call is closed)", err);
            this.doTransfer = false;
          }
        );
    } else {
      console.log("ben call id is null, Not able to transfer call");
      this.message.alert(
        this.currentLanguageSet.benCallIDIsNullNotAbleToCloseCall
      );
    }
        }
      }
    
  }
  setBencallID(values) {
    if (
      (this.saved_data !== undefined &&
        this.saved_data.benCallID !== undefined &&
        this.saved_data.benCallID !== null) ||
      (this.beneficiaryDetails !== undefined &&
        this.beneficiaryDetails.benCallID !== undefined &&
        this.beneficiaryDetails.benCallID !== null)
    ) {
      if (this.saved_data.benCallID) {
        values.benCallID = this.saved_data.benCallID;
      } else {
        values.benCallID = this.beneficiaryDetails.benCallID;
      }
    }
  }
  callTransferSuccessAlert() {
    console.log("Transferred call alert");
    this.message.alert(
      this.currentLanguageSet.callTransferredTo + " " + this.transferCondition,
      "success"
    );
    sessionStorage.removeItem("onCall");
    sessionStorage.removeItem("CLI");
    // sessionStorage.removeItem("session_id");
    this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }

  chooseService(serviceName) {
    if (serviceName) {
      serviceName = serviceName.toLowerCase();
      this.transferToService = serviceName;
      let errorMsg;

      let featureName;
      let transferRole;
      if (
        serviceName.indexOf("102") == -1 &&
        serviceName.indexOf("108") == -1
      ) {
        featureName = this.getFeatureNameFromSubservice(serviceName);
        console.log("Feature name: " + featureName);
        transferRole = this.getTransferRoleFromFeature(featureName);
      }

      if (
        serviceName.indexOf("health advisory") != -1 &&
        this.hasHAOPrivilege &&
        this.current_role != "HAO" && this.current_role != "RO"
      ) {
        return;
      } else if (
        serviceName.indexOf("health advisory") != -1 ||
        serviceName.indexOf("diabetic") != -1 ||
        serviceName.indexOf("hypertension") != -1
      ) {
        this.transferCampaign = this.getCampaignName("hao");

        errorMsg = this.currentLanguageSet.pleaseConfigureHaoCampaign;
      } else if (serviceName.indexOf("directory") != -1) {
        // this.transferCampaign = this.getCampaignName('hao');
        this.transferCampaign = this.getCampaignName(transferRole);

        errorMsg =
          this.currentLanguageSet.pleaseConfigureCampaignForDirectoryServices;
      } else if (serviceName.indexOf("blood") != -1) {
        //this.transferCampaign = this.getCampaignName('sio');
        this.transferCampaign = this.getCampaignName(transferRole);
        errorMsg =
          this.currentLanguageSet.pleaseConfigureCampaignForBloodRequest;
      } else if (serviceName.indexOf("organ") != -1) {
        // this.transferCampaign = this.getCampaignName('sio');
        this.transferCampaign = this.getCampaignName(transferRole);
        errorMsg =
          this.currentLanguageSet.pleaseConfigureCampaignForOrganDonation;
      } else if (serviceName.indexOf("service improvements") != -1) {
        this.transferCampaign = this.getCampaignName("sio");
        errorMsg = this.currentLanguageSet.pleaseConfigureSioCampaign;
      } else if (serviceName.indexOf("health schemes") != -1) {
        // this.transferCampaign = this.getCampaignName('sio');
        this.transferCampaign = this.getCampaignName(transferRole);
        errorMsg =
          this.currentLanguageSet.pleaseConfigureCampaignForHealthSchemes;
      } else if (serviceName.indexOf("epidemic outbreak service") != -1) {
        // this.transferCampaign = this.getCampaignName('sio');
        this.transferCampaign = this.getCampaignName(transferRole);
        errorMsg =
          this.currentLanguageSet.pleaseConfigureCampaignForEpidemicOutbreak;
      } else if (serviceName.indexOf("food safety") != -1) {
        // this.transferCampaign = this.getCampaignName('sio');
        this.transferCampaign = this.getCampaignName(transferRole);
        errorMsg = this.currentLanguageSet.pleaseConfigureCampaignForFoodSafety;
      } else if (serviceName.indexOf("counselling") != -1) {
        this.transferCampaign = this.getCampaignName("co");
        errorMsg = this.currentLanguageSet.pleaseConfigureCoCampaign;
      } else if (serviceName.indexOf("medical") != -1) {
        this.transferCampaign = this.getCampaignName("mo");
        errorMsg = "Please configure MO campaign.";
      } else if (serviceName.indexOf("psychiatrist") != -1) {
        this.transferCampaign = this.getCampaignName("pd");
        errorMsg = this.currentLanguageSet.pleaseConfigurePdCampaign;
      } else if (serviceName.indexOf("102") != -1) {
        this.transferCampaign = this.getCampaignName("102");
        errorMsg = this.currentLanguageSet.pleaseConfigure102Campaign;
      } else if (serviceName.indexOf("108") != -1) {
        this.transferCampaign = this.getCampaignName("108");
        errorMsg = this.currentLanguageSet.pleaseConfigure108Campaign;
      }

      console.log("transferToCampaign " + this.transferCampaign);
      // Diamond Khanna,5 June,2018
      if (this.current_role == "MO" || this.current_role == "HAO" || this.current_role == "RO") {
        this.getTransferSkills(this.transferCampaign);
      }
      // --- Ends --- //

      if (!this.transferCampaign) {
        this.message.alert(errorMsg, "error");
        this.closureForm.form.patchValue({ transferCall: "" });
        this.transferSkills = [];
      }
    }
    if (serviceName === undefined) {
      this.transferSkills = [];
    }
  }

  // Diamond Khanna,5 June,2018
  getTransferSkills(campaignName) {
    this.czentrixServices.getCampaignSkills(campaignName).subscribe(
      (response) => {
        if (response != undefined) {
          this.transferSkills = [];
          this.transferSkill = "";
          this.transferSkills = response.response.skills;
        }
      },
      (err) => {
        console.log("error", err.errorMessage);
        // this.message.alert(err.errorMessage, 'error');
        this.transferSkills = [];
      }
    );
  }
  // --- Ends --- //

  callTransfer(transfer, values) {
    values.callType = this.callType;
    if (
      (this.beneficiarySelectedRegID === undefined ||
      this.beneficiarySelectedRegID === null ||
      this.beneficiarySelectedRegID === "") && this.current_role != "RO"  && this.current_role != "HAO"
    ) {
      this.showAlert(
        this.currentLanguageSet.canNotTransferCallWithoutSelectingBeneficiary
      );
    } 
    else {
      // if (
      //   this.transferToService.indexOf("health advisory") != -1 &&
      //   this.hasHAOPrivilege &&
      //   this.current_role != "HAO"
      // ) {
      //   console.log("navigateToHAO");
      //   this.navigateToHAO();
      // } 
      // else {
        this.transferCallToCampaign1(this.transferCampaign, values);
      // }
    }
  }
  checkHAOPrivilege() {
    for (let i = 0; i < this.privleges.length; i++) {
      if (this.privleges[i].serviceName == "104") {
        for (let j = 0; j < this.privleges[i].roles.length; j++) {
          for (
            let k = 0;
            k < this.privleges[i].roles[j].serviceRoleScreenMappings.length;
            k++
          ) {
            if (
              this.privleges[i].roles[j].serviceRoleScreenMappings[k].screen
                .screenName == "Health_Advice"
            ) {
              console.log("Agent has HAO privilege");
              this.hasHAOPrivilege = true;
            }
          }
        }
      }
    }
  }
  navigateToHAO() {
    //  console.log('navigateToHAO called');
    this.saved_data.current_role = "HAO";
    this.roleChanged.emit("HAO");
  }

  getTransferRoleFromFeature(screenName) {
    let transferRole;
    var tempFilterArr = [];
    tempFilterArr = this.featureRoleMapArray.filter((obj) => {
      return obj.screen.screenName == screenName;
    }, this);
    //  console.log(tempFilterArr, "tempFilterArr");
    let roleID = tempFilterArr[0].roleID;

    for (let i = 0; i < this.featureRoleMapArray.length; i++) {
      if (
        this.featureRoleMapArray[i].roleID == roleID &&
        this.featureRoleMapArray[i].screen.screenName == "Health_Advice"
      ) {
        transferRole = "hao";
        break;
      } else if (
        this.featureRoleMapArray[i].roleID == roleID &&
        this.featureRoleMapArray[i].screen.screenName == "Medical_Advice"
      ) {
        transferRole = "mo";
        break;
      } else if (
        this.featureRoleMapArray[i].roleID == roleID &&
        this.featureRoleMapArray[i].screen.screenName == "Counselling"
      ) {
        transferRole = "co";
        break;
      } else if (
        this.featureRoleMapArray[i].roleID == roleID &&
        this.featureRoleMapArray[i].screen.screenName == "Psychiatrist"
      ) {
        transferRole = "pd";
        break;
      } else if (
        this.featureRoleMapArray[i].roleID == roleID &&
        this.featureRoleMapArray[i].screen.screenName == "Service_Improvements"
      ) {
        transferRole = "sio";
        break;
      }
      /*   else if ((this.featureRoleMapArray[i].roleID == roleID) && this.featureRoleMapArray[i].screen.screenName == 'Registration') {
          transferRole = 'ro';
          break;
        } */
    }

    console.log("transferRole: " + transferRole);

    return transferRole;
  }

  getCORoleID() {
    var tempFilterArr = [];
    tempFilterArr = this.featureRoleMapArray.filter((obj) => {
      return obj.screen.screenName == "Counselling";
    }, this);
    //  console.log(tempFilterArr, "tempFilterArr");
    this.coRoleID = tempFilterArr[0].roleID;

    //Todo get the role name by calling Roles API (user/getRolesByProviderID)
    if (this.coRoleID) {
      this.getRoleName(this.coRoleID);
    }
  }

  getRoleName(roleID) {
    const roleId = roleID;
    this.OCRService.getRoles({
      providerServiceMapID: this.saved_data.current_service.serviceID,
    }).subscribe((response) => {
      if (response !== undefined && response !== null) {
        const role = response.filter((obj) => {
          if (obj.roleID === roleId) {
            return obj;
          }
        });
        this.coRoleName = role[0].roleName;
        //  console.log("coRoleName:" + this.coRoleName);
        this.checkCOServiceAvailedStatus(this.beneficiarySelectedRegID);
      }
    });
  }

  checkCOServiceAvailedStatus(beneficiaryID) {
    let requestObject = {
      beneficiaryRegID: beneficiaryID,
      receivedRoleName: this.coRoleName,
    };

    this._callServices.getServiceAvailedStatus(requestObject).subscribe(
      (response) => {
        this.coServiceAvailed = response.response;
        console.log("Service availed status: " + this.coServiceAvailed);

        // filter services should get called only after fetching transferrable campaigns
        if (this.transferableCampaigns.length > 0) this.filterServices();
      },
      (err) => {}
    );
  }

  filterServices() {
    //  console.log("filterServices called");

    for (let i = 0; i < this.services.length; i++) {
      let serviceName = this.services[i].subServiceName.toLowerCase();

      if (serviceName.indexOf("health advisory") != -1) {
        if (
          this.screens.includes("Health_Advice") &&
          !this.hasHAOPrivilege &&
          JSON.stringify(this.transferableCampaigns)
            .toLowerCase()
            .indexOf("hao") == -1
        ) {
          this.services.splice(i--, 1);
          console.log("health advisory removed from transfer options");
        }
      } else if (serviceName.indexOf("directory") != -1) {
        if (this.screens.includes("Directory Information Service")) {
          this.services.splice(i--, 1);
          console.log("directory services removed from transfer options");
        }
      } else if (serviceName.indexOf("diabetic") != -1) {
        if (this.screens.includes("Health_Advice")) {
          this.services.splice(i--, 1);
          console.log("diabetic screening removed from transfer options");
        }
      } else if (serviceName.indexOf("hypertension") != -1) {
        if (this.screens.includes("Health_Advice")) {
          this.services.splice(i--, 1);
          console.log("BP screening removed from transfer options");
        }
      } else if (serviceName.indexOf("health schemes") != -1) {
        if (this.screens.includes("Health schemes")) {
          this.services.splice(i--, 1);
          console.log("health schemes removed from transfer options");
        }
      } else if (serviceName.indexOf("epidemic outbreak service") != -1) {
        if (this.screens.includes("Epidemic Outbreak Service")) {
          this.services.splice(i--, 1);
          console.log(
            "epidemic outbreak service removed from transfer options"
          );
        }
      } else if (serviceName.indexOf("food safety") != -1) {
        if (this.screens.includes("Food safety")) {
          this.services.splice(i--, 1);
          console.log("food safety removed from transfer options");
        }
      } else if (serviceName.indexOf("blood") != -1) {
        if (this.screens.includes("Blood Request")) {
          this.services.splice(i--, 1);
          console.log("blood removed from transfer options");
        }
      } else if (serviceName.indexOf("service improvements") != -1) {
        if (this.screens.includes("Service_Improvements")) {
          this.services.splice(i--, 1);
          console.log("service improvements removed from transfer options");
        }
      } else if (serviceName.indexOf("organ") != -1) {
        if (this.screens.includes("Organ Donation")) {
          this.services.splice(i--, 1);
          console.log("Organ removed from transfer options");
        }
      } else if (
        serviceName.indexOf("counselling") != -1 &&
        JSON.stringify(this.transferableCampaigns)
          .toLowerCase()
          .indexOf("co") == -1
      ) {
        if (this.screens.includes("Counselling")) {
          this.services.splice(i--, 1);
          console.log("counselling removed from transfer options");
        }
      }
      /*Validation removed: CR - HAO can able to transfer the call to CO directly*/
      // else if (serviceName.indexOf("counselling") != -1 && this.coServiceAvailed == 'false' && this.current_role != 'MO') {
      //   this.coServiceName = serviceName;
      //   this.coServiceRemoved = true;
      //   this.coServiceOBJ = this.services[i];
      // first availing of counselling through MO only
      //   this.services.splice(i--, 1);
      //   console.log("counselling is not availed :: counselling removed from transfer options")
      // }
      else if (
        serviceName.indexOf("medical") != -1 &&
        JSON.stringify(this.transferableCampaigns)
          .toLowerCase()
          .indexOf("mo") == -1
      ) {
        if (this.screens.includes("Medical_Advice")) {
          this.services.splice(i--, 1);
          console.log("medical removed from transfer options");
        }
      } else if (
        serviceName.indexOf("psychiatrist") != -1 &&
        JSON.stringify(this.transferableCampaigns)
          .toLowerCase()
          .indexOf("pd") == -1
      ) {
        if (this.screens.includes("Psychiatrist")) {
          this.services.splice(i--, 1);
          console.log("Psychiatrist removed from transfer options");
        }
      }
    }

    // insert 102 & 108 if it is configured as transferrable campaign

    if (this.getCampaignName("102") != undefined)
      this.services.push({ subServiceName: "Emergency_102" });
    if (this.getCampaignName("108") != undefined)
      this.services.push({ subServiceName: "Emergency_108" });
  }

  getFeatureNameFromSubservice(serviceName) {
    let featureName;

    if (serviceName.indexOf("health advisory") != -1)
      featureName = "Health_Advice";
    else if (serviceName.indexOf("directory") != -1)
      featureName = "Directory Information Service";
    else if (serviceName.indexOf("diabetic") != -1)
      featureName = "Health_Advice";
    else if (serviceName.indexOf("hypertension") != -1)
      featureName = "Health_Advice";
    else if (serviceName.indexOf("health schemes") != -1)
      featureName = "Health schemes";
    else if (serviceName.indexOf("epidemic outbreak service") != -1)
      featureName = "Epidemic Outbreak Service";
    else if (serviceName.indexOf("food safety") != -1)
      featureName = "Food safety";
    else if (serviceName.indexOf("blood") != -1) featureName = "Blood Request";
    else if (serviceName.indexOf("service improvements") != -1)
      featureName = "Service_Improvements";
    else if (serviceName.indexOf("organ") != -1) featureName = "Organ Donation";
    else if (serviceName.indexOf("counselling") != -1)
      featureName = "Counselling";
    else if (serviceName.indexOf("medical") != -1)
      featureName = "Medical_Advice";
    else if (serviceName.indexOf("psychiatrist") != -1)
      featureName = "Psychiatrist";

    return featureName;
  }

  getInstituteType(){
    let reqObj = {
      'providerServiceMapID' : this.saved_data.userPriveliges[0].providerServiceMapID
    }
    this.caseSheetService.getInstituteData(reqObj).subscribe((res)=>{
      if (res !== null && res !== undefined) {
        this.instituteTypeData = res;
      }
    })
  }
  getInstituteName(){
    let institutionTypeID = this.institutionID;
    this.caseSheetService.getInstituteNameData(institutionTypeID).subscribe((res)=>{
      if (res !== null && res !== undefined) {
        this.instituteNameData = res;
      }
    })
  }
}
