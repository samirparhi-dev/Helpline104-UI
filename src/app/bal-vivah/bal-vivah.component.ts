import { Component, OnInit, Injectable, Input } from '@angular/core';
import { dataService } from 'app/services/dataService/data.service';
import { SearchService } from 'app/services/searchBeneficiaryService/search.service';
import { LocationService } from '../services/common/location.service';
import { UserBeneficiaryData } from 'app/services/common/userbeneficiarydata.service';

import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { BalVivahServiceService } from 'app/services/sioService/bal-vivah-service.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

declare var jQuery: any;

@Component({
  selector: 'app-bal-vivah',
  templateUrl: './bal-vivah.component.html',
  styleUrls: ['./bal-vivah.component.css'],
})
@Injectable()
export class BalVivahComponent implements OnInit {
  beneficiaryDetails: any;
  benficiaryRegId: any;
  benCallID: any;
  providerServiceMapID: any;
  subjectOfComplaint: any;
  childName: any;
  childFatherName: any;
  childAge: any;
  childGender: any;
  childStateID: any;
  fatherStateID: any;
  childState: any;
  fatherState: any;
  childCityID: any;
  fatherCityID: any;
  childDistrict: any;
  fatherDistrict: any;
  childsubDistrict: any;
  CsubDistricts: any;
  FsubDistricts: any;
  fatherSubDistrict: any;
  childVillage: any;
  fatherVillage: any;
  marriageDate: any = new Date();
  complaintDate: any;
  providerServiceID: any;
  states: any;
  Cdistricts: any;
  Fdistricts: any;
  Cvillages: any;
  Fvillages: any;
  selected_state: any = '';
  distID: number;
  instID: number;
  institutes: Array<any> = [];
  institutesName: Array<any> = [];
  feedbackTypes: Array<any> = [];
  feedbackSeverities: Array<any> = [];
  temp_districts_array1: Array<object> = [];
  temp_districts_array2: Array<object> = [];
  wrongDate: any;
  today: any = new Date();
  doi: Date;
  maxDate: Date;
  public child: any = false;
  isDisabled: any = true;
  genderErrFlag: any = false;
  genderFlag: any = false;
  commonData: any = [];
  genders: any;
  disableFlag: boolean = true;
  minlength: any;
  ageFlag: boolean = false;
  CurrentDate: any = new Date();
  agentData: any;
  saved_successfully: any = 'Bal-Vivah Complaint saved successfully';
  age: any;
  minDate: Date;
  showTable: boolean = true;
  filteredBalVivahList: any;
  currentCampaign: any;
  filterTerm: string;
  data: any;
  searchType: any = 'ComplaintID';
  viewALL: any = true;
  current_role: any;
  minLength: number = 1;
  maxLength: number = 30;
  currentLanguageSet: any;
  constructor(
    public commonAppData: dataService,
    private _util: SearchService,
    private _locationService: LocationService,
    private balVivahService: BalVivahServiceService,
    private _userBeneficiaryData: UserBeneficiaryData,
    private _userData: UserBeneficiaryData,
    public alertMessage: ConfirmationDialogsService,
    public HttpServices: HttpServices
  ) {
    this.beneficiaryDetails =
      this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails;
    if (this.beneficiaryDetails && this.beneficiaryDetails.i_beneficiary) {
      this.benficiaryRegId =
        this.beneficiaryDetails.i_beneficiary.beneficiaryRegID;
      this.benCallID = this.beneficiaryDetails.benCallID;
    } else if (this.commonAppData.benRegID) {
      this.benficiaryRegId = this.commonAppData.benRegID;
    }
  }

  ngOnInit() {
  this.assignSelectedLanguage();
    this.doi = new Date();
    this.agentData = this.commonAppData.Userdata;
    this.currentCampaign = this.commonAppData.current_campaign;
    this.providerServiceMapID = {
      providerServiceMapID: this.commonAppData.current_service.serviceID,
    };

    

    this.initialized();
    let data = {
      providerServiceMapID: this.commonAppData.current_service.serviceID,
    };
    this._userData
      .getUserBeneficaryData(data)
      .subscribe((response) => (this.commonData = response));
    if (this.commonAppData.current_campaign == 'INBOUND') {
      let obj = {
        beneficiaryRegID: this.benficiaryRegId,
      };
      this.getBalVivahWorklist(obj);
    } //In case of outbound particular history need to fetch on the basis of rqstID, after all the master data gets loaded .....
    else {
      this.showTable = false;
    }
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
    
  getBalVivahWorklist(obj) {
    this.balVivahService
      .getbalVivahWorklist(obj)
      .subscribe((response) => this.balVivahHistorySuccesshandeler(response));
  }
  balVivahHistorySuccesshandeler(response) {
    this.setTableArray(response);
  }

  setTableArray(data) {
    this.data = data;
    this.filteredBalVivahList = data;
  }

  initialized() {
    const data = {
      providerServiceMapID: this.commonAppData.current_service.serviceID,
    };
    this._userBeneficiaryData
      .getUserBeneficaryData(data)
      .subscribe((response) => this.SetUserBeneficiaryFeedbackData(response));
  }

  SetUserBeneficiaryFeedbackData(regData: any) {
    if (regData.states) {
      this.states = regData.states.filter((item) => {
        return (
          item.stateID === this.commonAppData.current_stateID_based_on_role
        );
      });
      this.childState = this.commonAppData.current_stateID_based_on_role;
      this.childGetDistricts(this.childState);
      this.fatherState = this.commonAppData.current_stateID_based_on_role;
      this.fatherGetDistricts(this.fatherState);
    }
  }

  childGetDistricts(childState: number) {
    this.distID = -1;
    this.instID = -1;
    this._locationService
      .getDistricts(childState)
      .subscribe((response) => this.childSetDistricts(response));
  }
  fatherGetDistricts(fatherState: number) {
    this.distID = -1;
    this.instID = -1;
    this._locationService
      .getDistricts(fatherState)
      .subscribe((response) => this.fatherSetDistricts(response));
  }
  childSetDistricts(response: any) {
    this.Cdistricts = response;
    this.CsubDistricts = [];
    this.childsubDistrict = undefined;
  }
  fatherSetDistricts(response: any) {
    this.Fdistricts = response;
    this.FsubDistricts = [];
    this.fatherSubDistrict = undefined;
  }
  childGetTaluks(childDistrict: number) {
    this.distID = childDistrict;
    if (this.instID !== -1) {
      this.GetInstitutesName(this.instID);
    }

    this._locationService
      .getTaluks(childDistrict)
      .subscribe((response) => this.childSetTaluks(response));
  }
  fatherGetTaluks(fatherDistrict: number) {
    this.distID = fatherDistrict;
    if (this.instID !== -1) {
      this.GetInstitutesName(this.instID);
    }

    this._locationService
      .getTaluks(fatherDistrict)
      .subscribe((response) => this.fatherSetTaluks(response));
  }
  childSetTaluks(response: any) {
    this.CsubDistricts = response;
    this.childVillage = undefined;
    this.Cvillages = [];
  }
  fatherSetTaluks(response: any) {
    this.FsubDistricts = response;
    this.fatherVillage = undefined;
    this.Fvillages = [];
  }
  childGetBlocks(childVillage: number) {
    this._locationService
      .getBranches(childVillage)
      .subscribe((response) => this.childSetBlocks(response));
  }
  fatherGetBlocks(fatherdVillage: number) {
    this._locationService
      .getBranches(fatherdVillage)
      .subscribe((response) => this.fatherSetBlocks(response));
  }
  childSetBlocks(response: any) {
    this.Cvillages = response;
  }
  fatherSetBlocks(response: any) {
    this.Fvillages = response;
  }
  SetInstitutesName(response: any) {
    this.institutesName = response;
    console.log('RespInstNames:', response);
    console.log('InstName', this.institutesName);
  }
  GetInstitutesName(institutionTypeId) {
    this.instID = institutionTypeId;

    this._locationService
      .getInstituteNames(institutionTypeId + '/' + this.distID)
      .subscribe((response) => this.SetInstitutesName(response));
  }

  preventTyping(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  genderchange(value) {
    if (value === '') {
      this.genderErrFlag = true;
      this.genderFlag = true;
    } else {
      this.genderErrFlag = false;
      this.genderFlag = false;
      this.retrieveGenderName(value);
    }
  }
  retrieveGenderName(value) {
    if (this.commonData.m_genders !== undefined) {
      this.genders = this.commonData.m_genders.filter(function (obj) {
        return obj.genderID === value;
      });
    }
  }
  ageInput(value) {
    if (value == undefined) {
    } else if (value >= 1 && value <= 17) {
      this.ageFlag = false;
    } else {
      this.ageFlag = true;
      jQuery('#age').addClass('field-error');
    }
  }
  registerComplaint(object: any) {
    let balVivahComplaint: any = [];
    let balVivahComplaintObj: any = {};
    (balVivahComplaintObj.beneficiaryRegID = this.benficiaryRegId),
      (balVivahComplaintObj.benCallID = object.benCallID),
      (balVivahComplaintObj.subjectOfComplaint = object.subjectOfComplaint ? object.subjectOfComplaint.trim() : null),
      (balVivahComplaintObj.childName = object.childsName),
      (balVivahComplaintObj.childFatherName = object.fathersName),
      (balVivahComplaintObj.childAge = object.age),
      (balVivahComplaintObj.childGender = object.childGender),
      (balVivahComplaintObj.childState = object.childState),
      (balVivahComplaintObj.childFatherState = object.fatherState),
      (balVivahComplaintObj.childDistrict = object.childDistrict),
      (balVivahComplaintObj.childFatherDistrict = object.fatherDistrict),
      (balVivahComplaintObj.childSubDistrict = object.childsubDistrict),
      (balVivahComplaintObj.childFatherSubDistrict = object.fatherSubDistrict),
      (balVivahComplaintObj.childVillage = object.childVillage),
      (balVivahComplaintObj.childFatherVillage = object.fatherVillage),
      (balVivahComplaintObj.marriageDate = object.marriageDate),
      (balVivahComplaintObj.ComplaintDate = this.doi),
      (balVivahComplaintObj.providerServiceMapID =
        this.commonAppData.current_service.serviceID),
      (balVivahComplaintObj.createdBy = this.agentData.userName);
    if (this.commonAppData.benCallID) {
      balVivahComplaintObj.benCallID = this.commonAppData.benCallID;
      console.log('val yes' + balVivahComplaintObj.benCallID);
    } else {
      balVivahComplaintObj.benCallID =
        this.commonAppData.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID;
      console.log('val no' + balVivahComplaintObj.benCallID);
    }
    console.log(JSON.stringify(balVivahComplaintObj));

    const data = JSON.stringify(balVivahComplaintObj);

    this.balVivahService.getbalVivahdDetails(data).subscribe(
      (response) => {
        data;
        let responseData = response.requestID;

        //  calling worklist
        const obj = {
          beneficiaryRegID: this.benficiaryRegId,
        };
        this.getBalVivahWorklist(obj);
        this.showTable = true;
        console.log(response);

        this.alertMessage.alert(
          this.currentLanguageSet.balVivahComplaintSavedSuccessfullyAndComplaintIdIs +
            response.requestID,
          'success'
        );
        this.commonAppData.serviceAvailed.next(true);
      },
      (err) => {
        this.alertMessage.alert(err.status, 'error');
      }
    );
  }
  showForm() {
    this.showTable = false;
    this.filterTerm = '';
  }
  showHistory() {
    this.showTable = true;
    this.filterTerm = '';
    this.revertFullTable();
  }



  ngOnChanges() {

  }
  onSearchChange(type) {
    if (type === 'MobileNumber') {
      this.minLength = 10;
      this.maxLength = 10;
    } else {
      this.minLength = 1;
      this.maxLength = 30;
    }
  }
  revertFullTable() {
    this.filterTerm = '';
    this.viewALL = true;
    this.searchType = 'ComplaintID';
    this.minLength = 1;
    this.maxLength = 30;
    const data = '{"beneficiaryRegID":"' + this.benficiaryRegId + '"}'
    const obj = {
      beneficiaryRegID: this.benficiaryRegId,
    };
    this.getBalVivahWorklist(obj);
  }
  filterFeedbackList(searchTerm: string) {
    if (!searchTerm) this.filteredBalVivahList = this.data;
    else {
      let object = {
        phoneNum: this.searchType == 'MobileNumber' ? searchTerm.trim() : null,
        requestID: this.searchType == 'ComplaintID' ? searchTerm.trim() : null,
      };
      console.log(JSON.stringify(object));
      this.filteredBalVivahList = [];
      this.viewALL = false;
      this.balVivahService.getbalVivahWorklist(object).subscribe((res) => {
        this.filteredBalVivahList = res;
      });
    }
  }
}
