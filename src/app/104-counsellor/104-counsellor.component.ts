import { Component, OnInit, Output, EventEmitter, Input, OnChanges, DoCheck } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MdDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CheifComplaintSnomedSearchComponent } from "app/cheif-complaint-snomed-search/cheif-complaint-snomed-search.component";
import { CaseSheetService } from "app/services/caseSheetService/caseSheet.service";
import { ValidationUtils } from "app/services/common/validation.utility";
import { dataService } from "app/services/dataService/data.service";
import { ConfirmationDialogsService } from "app/services/dialog/confirmation.service";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-104-counsellor",
  templateUrl: "./104-counsellor.component.html",
  styleUrls: ["./104-counsellor.component.css"],
})
export class Counsellor_104_Component implements OnInit {
  @Input('counsellorForm')
  counsellorForm: FormGroup;

  formUtility:any;

  complaintDuration = ["Hours", "Days", "Weeks", "Months", "Years"];
  workStatus: any;
  issueWorkStatus : any;
  householdWorkType: any;
  familyGatherStatus : any;
  precipitateFactor : any;
  psychiatricConditions : any = [];
  treatmentTypes : any;
  progressStatus : any;
  courseStatusValue : any;
  pastMedicalStatus : any;
  familyConditions : any;
  relationshipStatus : any;
  bowelValues : any;
  bladderValue : any;
  benChiefComplaints: any;
  treatmentDetails:any;
  relationOfCurrentIllness:any;
  otherValue:any;
  currentDrugs:any;
  personalSocialHistory:any;
  mentalExamination:any;
  summary:any;

  cheifComplaintData: any;
  chiefComplaintTemporarayList = [];
  selectedChiefComplaintList = [];
  suggestedChiefComplaintList = [];
  assignSelectedLanguageValue: any;
  visitComplaintDet: any;
  appetiteRole: any;
  sleepValue : any;
  hygieneValues: any;
  libidoValue: any;
  screens: any;
  displayHistory: boolean = false;
  counsellorHistoryData: Array<any> = [];
  filteredCheifComplaintData: any =[];
  filteredpastPyschiarticConditionData: any = [];
  selectedPastPyschiarticList: any = [];
  filteredPastMedicalConditions: any = [];
  previousSelectedPastMedicalConditionsList: any = [];
  previousSelectedDiseaseList = [];
  diseaseSelectList = [];
  enableOther: boolean = false;
  benToMcts: any;
  disableNonePrecipatingFactor: boolean = false;
  showAllPrecipatingFactor: boolean = true;
  disableSleepValue: boolean = null;
  disableFactorValue: boolean = null;
  
  pastHistoryForReqObj: any = [];
  pastPychiarticConditionsReqObj: any;
  chiefComplaintsReqObj: any;
  pastPychiarticConditionsForReqObj: any;
  conditionInFamilyListForReqObj: any;
  enableMedication: boolean = false;
  selectedSnomedTerm: any;
  countForSearch: any;
  componentFlag: boolean = false;
  enablePastOtherMedication: boolean = false;
  enableOtherPyschiarticCondition: boolean = false;
  enableOtherPrepFactor: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpServices: HttpServices,
    private saved_data: dataService,
    private caseSheetService: CaseSheetService,
    public confirmservice: ConfirmationDialogsService,
    private dialog: MdDialog,
    public router: Router) 
    { 
    this.counsellorForm = this.fb.group({
      summary: null,
      appetite:null,
      sleep:null,
      selectedValue:null,
      bowelValue:null,
      libidoValue:null,
      goingToWork:null,
      issueAtWork:null,
      householdWork: null,
      familyUnity:null,
      treatmentDetails:null,
      precipitatingFactor:null,
      otherPossibleFactor: null,
      relationOfCurrentIllness:null,
      pastPsychiatric:null,
      unitOfDuration:null,
      treatmentType:null,
      medicationType:null,
      psychiatricDrugs:null,
      progress:null,
      courseStatus:null,
      pastMedical:null,
      otherValue:null,
      medicalDuration:null,
      medicalUnitOfDuration:null,
      currentDrugs:null,
      familyCondition:null,
      relationship:null,
      personalSocialHistory:null,
      mentalExamination:null,
      bladderStatus:null,
      chiefComplaint: null, 
      description: null,
      complaints: this.fb.array([
        this.createPatientChiefComplaintsForm()
      ]),
      pastPsychiatricCondition: this.fb.array([
        this.createPatientPastPsychiatricConditionsForm()
      ]),
      pastMedicalCondition: this.fb.array([
        this.createPatientPastMedicalConditionForm()
      ]),
      familyDiseaseList: this.fb.array([
        this.createPatientFamilyConditionForm()
      ]),
    })
    }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getCounsellingFormData();
    this.screens = this.saved_data.screens;
    this.enableOther = false;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
 
  }

  getMasterData(){
    this.caseSheetService.getHihlMasterData().subscribe(
      (res) => {
          if (res !== null && res !== undefined) {
            this.cheifComplaintData = res.psychiatricChiefComplaints;
            this.appetiteRole = res.m_104appetite;
            this.sleepValue = res.m_104sleep;
            this.hygieneValues = res.m_104hygieneselfcare;
            this.bladderValue = res.m_104bladder;
            this.bowelValues = res.m_104bowel;
            this.workStatus = res.m_104regularworok;
            this.issueWorkStatus = res.m_104issuesatworkplace;
            this.householdWorkType = res.m_104householdwork;
            this.familyGatherStatus = res.m_104gettingwithfamily;
            this.precipitateFactor = res.m_104precipitatingfactor;
            this.psychiatricConditions = res.m_104pastpsychiatriccondition;
            this.treatmentTypes = res.m_104treatmenttype;
            this.progressStatus = res.m_104progress;
            this.courseStatusValue = res.m_104course;
            this.pastMedicalStatus = res.m_104pastmedicalcondition;
            this.familyConditions = res.m_104familycondition;
            this.relationshipStatus = res.m_104relationship;
            // this.addCheifComplaint();
            this.filteredCheifComplaintData[0] = this.cheifComplaintData;
            this.filteredpastPyschiarticConditionData[0] = this.psychiatricConditions;
            this.filteredPastMedicalConditions[0] = this.pastMedicalStatus
            this.diseaseSelectList[0] = this.familyConditions;
            this.handleChiefComplaintData();
            this.handlePastPsychrticData();
            this.handlePastMedicalData();
            this.handleFamilyHistoryData();
            this.libidoValue = res.m_104libido;
            if(this.saved_data.ben_gender_name === "Female") {
              if(res.m_104libido != null && res.m_104libido != undefined) {
                this.libidoValue = res.m_104libido.filter(item => {
                  if(item.libidoName.toLowerCase() == "normal") {
                    this.libidoValue.push(item);
                    return item.libidoName;
                  }
                  if(item.libidoName.toLowerCase() == "increased sexual desire") {
                    this.libidoValue.push(item);
                    return item.libidoName;
                  }
                  if(item.libidoName.toLowerCase() == "impotence") {
                    this.libidoValue.push(item);
                    return item.libidoName;
                  }
                  if(item.libidoName.toLowerCase() == "decreased sexual urge") {
                    this.libidoValue.push(item);
                    return item.libidoName;
                  }
                })
              }
            }
          }
      },
      (err) => {
        this.confirmservice.alert(err.errorMessage, "error");
      }
    );
  }
  
  saveHilhFormData(){
    // console.log(this.counsellorForm.controls.complaints.value.chiefComplaint.psychiatricChiefComplaintId)
    if( this.counsellorForm.controls.complaints.value !== null){
    this.chiefComplaintsReqObj = this.counsellorForm.controls.complaints.value.map((complaint) => {
      if(complaint && complaint.chiefComplaint && complaint.chiefComplaint.psychiatricChiefComplaintId !== null){
        if(complaint.chiefComplaint.psychiatricChiefComplaintName && complaint.chiefComplaint.psychiatricChiefComplaintName === "Other"){
      return {
        chiefComplaintID: complaint.chiefComplaint.snomedCtCode,
        chiefComplaint: complaint.otherCheifComplaint,
        // otherCheifComplaint: complaint.chiefComplaint.otherCheifComplaint,
        // snomedId: complaint.chiefComplaint.snomedCtCode,
        description: complaint.description,
        duration: complaint.duration,
        unitOfDuration: complaint.unitOfDuration,
      };
    } else {
      return {
        chiefComplaintID: complaint.chiefComplaint.psychiatricChiefComplaintId,
        chiefComplaint: complaint.chiefComplaint.psychiatricChiefComplaintName,
        description: complaint.description,
        duration: complaint.duration,
        unitOfDuration: complaint.unitOfDuration,
      };
    }
    }
    });  
  } else {
    this.chiefComplaintsReqObj = null;
  }
    if(this.counsellorForm.controls.pastPsychiatricCondition.value !== null){  
      this.pastPychiarticConditionsForReqObj = this.counsellorForm.controls.pastPsychiatricCondition.value.map((condition) => {
      if(condition && condition.pastPsychiatricCondition && condition.pastPsychiatricCondition.pastPsychiatricConditionId !== null){
      return {
        pastPsychiatricCondition: condition.pastPsychiatricCondition.pastPsychiatricConditionName,
        pastPsychiatricConditionID: condition.pastPsychiatricCondition.pastPsychiatricConditionId,
        mediciationType: condition.mediciationType,
        psychiatricDrugsMedicationDetails: condition.psychiatricDrugsMedicationDetails,
        duration: condition.duration,
        unitOfDuration: condition.unitsOfDuration,
        progress: condition.progress,
        course: condition.course,
        typeOfTreatment: condition.typeOfTreatment
      };
    }
    }); 
  } else {
    this.pastPychiarticConditionsForReqObj = null;
  }

    if(this.counsellorForm.controls.pastMedicalCondition.value !== null){
    this.pastHistoryForReqObj = this.counsellorForm.controls.pastMedicalCondition.value.map((condition) => {
      if(condition && condition.pastMedicalCondition && condition.pastMedicalCondition.pastMedicalConditionId !== null){
      return {
        pastMedicalCondition: condition.pastMedicalCondition.pastMedicalConditionName,
        pastMedicalConditionID: condition.pastMedicalCondition.pastMedicalConditionId,
        otherPastMedicalCondition: condition.otherPastMedicalCondition,
        duration: condition.duration,
        unitOfDuration: condition.unitsOfDuration,
    }
  }
    }); 
  } else {
    this.pastHistoryForReqObj = null;
  }

  if(this.counsellorForm.controls.familyDiseaseList.value !== null){
    this.conditionInFamilyListForReqObj = this.counsellorForm.controls.familyDiseaseList.value.map((condition) => {
      if(condition && condition.pastMedicalCondition && condition.pastMedicalCondition.pastMedicalConditionId !== null){
      return {
        diseaseType: condition.familyCondition.familyConditionName,
        otherDiseaseType: condition.otherPastMedicalCondition,
        familyMembers: condition.familyMembers,
    }
  }
    }); 
  } else {
    this.conditionInFamilyListForReqObj = null;
  }

   let reqObj = {
    chiefComplaints : (this.chiefComplaintsReqObj !== null) ? this.chiefComplaintsReqObj: null,
    biologicalFunctioning : { //correct
    appetite: this.counsellorForm.controls.appetite.value,
    sleep: this.counsellorForm.controls.sleep.value,
    hygieneAndTakingCare: this.counsellorForm.controls.selectedValue.value,
    bladder: this.counsellorForm.controls.bladderStatus.value,
    bowel: this.counsellorForm.controls.bowelValue.value,
    sexualLibido: this.counsellorForm.controls.libidoValue.value,
    },
    occupationalFunctioning : { //correct
    goingToWork: this.counsellorForm.controls.goingToWork.value,
    issuesAtWorkplace: this.counsellorForm.controls.issueAtWork.value,
    },
    socialFunctioning: { //correct
    householdWork : this.counsellorForm.controls.householdWork.value,
    gettingAlong : this.counsellorForm.controls.familyUnity.value,
    },
    treatmentDetails: this.counsellorForm.controls.treatmentDetails.value, //correct
    precipitatingFactors : this.counsellorForm.controls.precipitatingFactor.value, //correct
    concurrentMedicalCondition: this.counsellorForm.controls.relationOfCurrentIllness.value, //correct
    pastHistory : { //correct
      pastPsychiatricConditions: this.pastPychiarticConditionsForReqObj,
    pastMedicalConditions: this.pastHistoryForReqObj,
    },
    currentDrugsMedication : this.counsellorForm.controls.currentDrugs.value, //correct
    conditionInFamilyList : this.counsellorForm.controls.familyDiseaseList.value, //correct
    personalAndSocialHistory : this.counsellorForm.controls.personalSocialHistory.value, //correct
    mentalStatusExamination : this.counsellorForm.controls.mentalExamination.value, //correct
    summary : this.counsellorForm.controls.summary.value, //doubt
    beneficiaryRegID : this.saved_data.benRegID,
    benCallID: this.saved_data.beneficiaryDataAcrossApp.beneficiaryDetails.benCallID,
    providerServiceMapID : this.saved_data.userPriveliges[0].providerServiceMapID,
    createdBy: this.saved_data.Userdata.userName
   }
   console.log(reqObj);

   this.caseSheetService.saveHihlFormData(reqObj).subscribe((res)=>{
      if( res != null ){
        this.confirmservice.alert(res.response,'success');
        this.counsellorForm.reset();
      }
       else {
        this.confirmservice.alert(res.errorMessage, 'error')
      }
   })
  }

  filterComplaints(chiefComplaintValue, i) {

    let arr = this.cheifComplaintData.filter(item => {
      return item.chiefComplaint == chiefComplaintValue.chiefComplaint;
    })

    if (this.selectedChiefComplaintList && this.selectedChiefComplaintList[i]) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        if (t != i) {
          item.push(this.selectedChiefComplaintList[i]);
          this.sortChiefComplaintList(item);
        }
      })
    }

    if (arr.length > 0) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        let index = item.indexOf(arr[0]);
        if (index != -1 && t != i)
          item = item.splice(index, 1);
      })
      this.selectedChiefComplaintList[i] = arr[0];
    }
  }

  filterPastPyschiarticConditions(chiefComplaintValue, i) {

    let arr = this.psychiatricConditions.filter(item => {
      return item.pastPsychiatricConditionId == chiefComplaintValue.pastPsychiatricConditionId;
    })

    if (this.selectedPastPyschiarticList && this.selectedPastPyschiarticList[i]) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        if (t != i) {
          item.push(this.selectedPastPyschiarticList[i]);
          this.sortPastPyschiarticList(item);
        }
      })
    }

    if (arr.length > 0) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        let index = item.indexOf(arr[0]);
        if (index != -1 && t != i)
          item = item.splice(index, 1);
      })
      this.filteredpastPyschiarticConditionData[i] = arr[0];
    }
  }

  filterPastMedicalConditions(Value, i) {

    let arr = this.psychiatricConditions.filter(item => {
      return item.pastMedicalConditionId == Value.pastMedicalConditionId;
    })

    if (this.previousSelectedPastMedicalConditionsList && this.previousSelectedPastMedicalConditionsList[i]) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        if (t != i) {
          item.push(this.previousSelectedPastMedicalConditionsList[i]);
          this.sortPastMedicalConditions(item);
        }
      })
    }

    if (arr.length > 0) {
      this.chiefComplaintTemporarayList.map((item, t) => {
        let index = item.indexOf(arr[0]);
        if (index != -1 && t != i)
          item = item.splice(index, 1);
      })
      this.filteredPastMedicalConditions[i] = arr[0];
    }
  }


  removeAllIllnessExceptNone() {
    let pastIllnessList = <FormArray>this.counsellorForm.controls['pastIllness'];

    while (pastIllnessList.length > 1) {
      let i = pastIllnessList.length - 1;

      let removedValue = this.previousSelectedPastMedicalConditionsList[i];
      if (removedValue)
        this.filteredPastMedicalConditions[0].push(removedValue);

      pastIllnessList.removeAt(i);
      this.filteredPastMedicalConditions.splice(i, 1);

      this.previousSelectedPastMedicalConditionsList.splice(i, 1);

    }

    this.sortPastMedicalConditions(this.filteredPastMedicalConditions[0]);
  }


  addCheifComplaint() {
    const complaintFormArray = <FormArray>this.counsellorForm.controls['complaints'];
    const complaintFormArrayValue = complaintFormArray.value;
    if(this.cheifComplaintData){
    let temp = this.cheifComplaintData.filter(item => {
      let arr = complaintFormArrayValue.filter((value) => {
        if (value.chiefComplaint.psychiatricChiefComplaintId != null)
        return value.chiefComplaint.psychiatricChiefComplaintId == item.psychiatricChiefComplaintId;
      });
      let flag = arr.length == 0 ? true : false;
      return flag;
    });
    if (temp.length > 0) {
      this.filteredCheifComplaintData.push(temp.slice());
    }
  }
    complaintFormArray.push(this.createPatientChiefComplaintsForm());
  }

  addPastPsychiatricCondition() {
    const pastPsychiartricFormArray = <FormArray>this.counsellorForm.controls['pastPsychiatricCondition'];
    const pastPsychiartricFormArrayValue = pastPsychiartricFormArray.value;
    if(this.psychiatricConditions){
    let temp = this.psychiatricConditions.filter(item => {
      let arr = pastPsychiartricFormArrayValue.filter((value) => {
        if (value.pastPsychiatricCondition.pastPsychiatricConditionId != null)
        return value.pastPsychiatricCondition.pastPsychiatricConditionId == item.pastPsychiatricConditionId;
      });
      let flag = arr.length == 0 ? true : false;
      return flag;
    });
    if (temp.length > 0) {
      this.filteredpastPyschiarticConditionData.push(temp.slice());
    }
  }
  pastPsychiartricFormArray.push(this.createPatientPastPsychiatricConditionsForm());
  }

  
  addPastMedicalConditions() {
    const pastMedicalConditionArray = <FormArray>this.counsellorForm.controls['pastMedicalCondition'];
    const pastMedicalConFormArray = pastMedicalConditionArray.value;

    if (this.pastMedicalStatus) {
      let result = this.pastMedicalStatus.filter((item) => {
        let arr = pastMedicalConFormArray.filter((value) => {
          if (value.pastMedicalCondition.pastMedicalConditionName != null && value.pastMedicalCondition.pastMedicalConditionName != "Other")
            return value.pastMedicalCondition.pastMedicalConditionId == item.pastMedicalConditionId;
          else
            return false;
        });

        if (item.pastMedicalConditionName === "None" && pastMedicalConFormArray.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
      });
      this.filteredPastMedicalConditions.push(result.slice());
    }
    pastMedicalConditionArray.push(this.createPatientPastMedicalConditionForm());
  }


  createPatientChiefComplaintsForm(): FormGroup {
    return this.fb.group({
      chiefComplaint:  null,
      snomedCtCode: null,
      duration:  null,
      unitOfDuration:  null,
      description:  null,
      otherCheifComplaint: null
    })
  }

  createPatientPastPsychiatricConditionsForm(): FormGroup {
    return this.fb.group({
      pastPsychiatricCondition:  null,
      duration:  null,
      unitsOfDuration:  null,
      typeOfTreatment:  null,
      mediciationType: null,
      psychiatricDrugsMedicationDetails: null,
      progress: null,
      course: null,
      otherPastPsychariticCondition: null,
    })
  }

  createPatientPastMedicalConditionForm(): FormGroup {
    return this.fb.group({
      pastMedicalCondition:  null,
      otherPastMedicalCondition: null,
      duration:  null,
      unitsOfDuration:  null,
    })
  }

  createPatientFamilyConditionForm(): FormGroup {
    return this.fb.group({
      familyCondition:  null,
      familyMembers: null,
    })
  }
  removeCheifComplaint(i: number, complaintForm?: FormGroup) {
    this.confirmservice.confirm(`warn`, this.assignSelectedLanguageValue.warn).subscribe(result => {
      if (result) {
        let complaintFormArray = <FormArray>this.counsellorForm.controls['complaints'];

        if (complaintFormArray.length == 1 && !!complaintForm) {
          complaintForm.reset();
          this.counsellorForm.markAsDirty();
        } else {
          let removedValue = this.selectedChiefComplaintList[i];
          if (removedValue) {
            this.filteredCheifComplaintData.map((item, t) => {
              if (t != i && removedValue.illnessType != 'Other') {
                item.push(removedValue);
                this.sortChiefComplaintList(item);
              }
            })
          }

          if (i == 0) {
            let temp = this.filteredCheifComplaintData[i].filter(t => t.psychiatricChiefComplaintName == "None");
            if (temp && temp[0]) {
              this.filteredCheifComplaintData[i + 1].push(temp[0]);
              this.sortChiefComplaintList(this.filteredCheifComplaintData[i + 1]);
            }
          }

          this.selectedChiefComplaintList.splice(i, 1);
          this.filteredCheifComplaintData.splice(i, 1);
          complaintFormArray.removeAt(i);
      }
    }
  });

  }

  removePastPyschiarticConditions(i: number, pastPsysharticForm?: FormGroup) {
    this.confirmservice.confirm(`warn`, this.assignSelectedLanguageValue.warn).subscribe(result => {
      if (result) {
        let pastPsysharticFormArray = <FormArray>this.counsellorForm.controls['pastPsychiatricCondition'];

        if (pastPsysharticFormArray.length == 1 && !!pastPsysharticForm) {
          pastPsysharticForm.reset();
          this.counsellorForm.markAsDirty();
        } else {
          let removedValue = this.selectedPastPyschiarticList[i];
          if (removedValue) {
            this.filteredpastPyschiarticConditionData.map((item, t) => {
              if (t != i && removedValue.illnessType != 'Other') {
                item.push(removedValue);
                this.sortPastPyschiarticList(item);
              }
            })
          }

          if (i == 0) {
            let temp = this.filteredpastPyschiarticConditionData[i].filter(t => t.illnessType == "None");
            if (temp && temp[0]) {
              this.filteredpastPyschiarticConditionData[i + 1].push(temp[0]);
              this.sortPastPyschiarticList(this.filteredCheifComplaintData[i + 1]);
            }
          }

          this.selectedPastPyschiarticList.splice(i, 1);
          this.filteredpastPyschiarticConditionData.splice(i, 1);
          pastPsysharticFormArray.removeAt(i);
      }
    }
  });

  }

  removePastMedicalConditions(i: number, pastMedicalConForm?: FormGroup) {
    this.confirmservice.confirm(`warn`, this.assignSelectedLanguageValue.warn).subscribe(result => {
      if (result) {
        let pastMedConFormArray = <FormArray>this.counsellorForm.controls['pastMedicalCondition'];

        if (pastMedConFormArray.length == 1 && !!pastMedicalConForm) {
          pastMedicalConForm.reset();
          this.counsellorForm.markAsDirty();
        } else {
          let removedValue = this.previousSelectedPastMedicalConditionsList[i];
          if (removedValue) {
            this.filteredPastMedicalConditions.map((item, t) => {
              if (t != i && removedValue.illnessType != 'Other') {
                item.push(removedValue);
                this.sortPastMedicalConditions(item);
              }
            })
          }

          if (i == 0) {
            let temp = this.filteredPastMedicalConditions[i].filter(t => t.illnessType == "None");
            if (temp && temp[0]) {
              this.filteredPastMedicalConditions[i + 1].push(temp[0]);
              this.sortPastPyschiarticList(this.filteredCheifComplaintData[i + 1]);
            }
          }

          this.previousSelectedPastMedicalConditionsList.splice(i, 1);
          this.filteredPastMedicalConditions.splice(i, 1);
          pastMedConFormArray.removeAt(i);
      }
    }
  });

  }


  displayChiefComplaint(complaint) {
    return complaint && complaint.chiefComplaint;
  }

  sortChiefComplaintList(complaintList) {
    complaintList.sort((a, b) => {
      if (a.psychiatricChiefComplaintId == b.psychiatricChiefComplaintId) return 0;
      if (a.psychiatricChiefComplaintId < b.psychiatricChiefComplaintId) return -1;
      else return 1;
    })
  }

  sortPastPyschiarticList(pastPyschiartic) {
    pastPyschiartic.sort((a, b) => {
      if (a.pastPsychiatricConditionID == b.pastPsychiatricConditionID) return 0;
      if (a.pastPsychiatricConditionID < b.pastPsychiatricConditionID) return -1;
      else return 1;
    })
  }

  sortPastMedicalConditions(illnessList) {
    illnessList.sort((a, b) => {
      if (a.pastMedicalConditionId == b.pastMedicalConditionId) return 0;
      if (a.pastMedicalConditionId < b.pastMedicalConditionId) return -1;
      else return 1;
    })
  }

  validateDuration(formGroup: FormGroup, event?: Event) {
    let duration = null;
    let durationUnit = null;
    let flag = true;

    if (formGroup.value.duration)
      duration = formGroup.value.duration;

    if (formGroup.value.unitOfDuration)
      durationUnit = formGroup.value.unitOfDuration;

    if (duration != null && durationUnit != null)
      flag = new ValidationUtils().validateDuration(duration, durationUnit, this.saved_data.age);

    if (!flag) {
      this.confirmservice.alert(this.assignSelectedLanguageValue.alerts.info.durationGreaterThanAge);
      formGroup.patchValue({ duration: null, unitOfDuration: null })
    }
  }

  handleChiefComplaintData() {
    let formArray = this.counsellorForm.controls['complaints'] as FormArray;
    let temp = [];
    if (this.visitComplaintDet)
      temp = this.visitComplaintDet.slice();

    for (let i = 0; i < temp.length; i++) {
      let chiefComplaintType = this.cheifComplaintData.filter(item => {
        return item.chiefComplaint == temp[i].chiefComplaint;
      });

      if (chiefComplaintType.length > 0)
        temp[i].chiefComplaint = chiefComplaintType[0];


      if (temp[i].chiefComplaint) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterComplaints(temp[i].chiefComplaint, i);
      }

      if (i + 1 < temp.length)
        // this.addChiefComplaint();
        this.addCheifComplaint()
    }
  }
  showHistory(){
    this.benToMcts = "";
    this.displayHistory = true;
    this.getCounsellingFormData();
    // this.router.navigate(["/104-counsellor/104-counsellor-history"]);
  }

  onLinkClick(event) {
    if (event.index == 1) {
      this.benToMcts = this.saved_data.benRegID;
    }
  }
  pastPyschiarticCondition(value){
    if(value === "None"){
      this.counsellorForm.controls.pastPsychiatricCondition.reset();
    }
  }


  pastMedicationCondition(value) {
      if(value === "None"){
        this.counsellorForm.controls.pastMedicalCondition.reset();
      }
  }
  enableOtherCheif(value){
    // console.log('success',this.counsellorForm.controls['complaints'].value.chiefComplaint.psychiatricChiefComplaintName)
    if(value[0].chiefComplaint.psychiatricChiefComplaintName === "Other"){
      this.enableOther = true;
    }else{ 
      this.enableOther = false;
    }
  }

  enableOtherFactor(value) {
    if(value.includes("Other")){
      this.enableOtherPrepFactor = true;
    }else{ 
      this.enableOtherPrepFactor = false;
    }
  }
  
  enableOtherTreatment(value){
    // console.log('success',this.counsellorForm.controls['complaints'].value.chiefComplaint.psychiatricChiefComplaintName)
    if(value[0].typeOfTreatment === "Medication"){
      this.enableMedication = true;
    }else{ 
      this.enableMedication = false;
    }
  }

  handlePastPsychrticData() {
    let formArray = this.counsellorForm.controls['pastPsychiatricCondition'] as FormArray;
    let temp = [];
    if (this.visitComplaintDet)
      temp = this.visitComplaintDet.slice();

    for (let i = 0; i < temp.length; i++) {
      let pastPyschiartic = this.psychiatricConditions.filter(item => {
        return item.pastPsychiatricConditionID == temp[i].pastPsychiatricConditionID;
      });

      if (pastPyschiartic.length > 0)
        temp[i].pastPsychiatricConditionID = pastPyschiartic[0];


      if (temp[i].pastPsychiatricCondition) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterPastPyschiarticConditions(temp[i].pastPsychiatricCondition, i);
      }

      if (i + 1 < temp.length)
        // this.addChiefComplaint();
        this.addPastPsychiatricCondition()
    }
  }

  handlePastMedicalData() {
    let formArray = this.counsellorForm.controls['pastMedicalCondition'] as FormArray;
    let temp = [];
    if (this.visitComplaintDet)
      temp = this.visitComplaintDet.slice();

    for (let i = 0; i < temp.length; i++) {
      let pastMedicalStatus = this.pastMedicalStatus.filter(item => {
        return item.pastMedicalConditionId == temp[i].pastMedicalConditionId;
      });

      if (pastMedicalStatus.length > 0)
        temp[i].pastMedicalConditionId = pastMedicalStatus[0];


      if (temp[i].pastMedicalCondition) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterPastMedicalConditions(temp[i].pastMedicalCondition, i);
      }

      if (i + 1 < temp.length)
        // this.addChiefComplaint();
        this.addPastMedicalConditions()
    }
  }

handleFamilyHistoryData() {
  let formArray = this.counsellorForm.controls['familyDiseaseList'] as FormArray;
  let temp = [];
  if (this.visitComplaintDet)
    temp = this.visitComplaintDet.slice();

  for (let i = 0; i < temp.length; i++) {
    let familyConditionType = this.familyConditions.filter(item => {
      return item.familyConditionId == temp[i].familyConditionId;
    });

    if (familyConditionType.length > 0)
      temp[i].familyConditionId = familyConditionType[0];


    if (temp[i].familyConditionId) {
      let k = formArray.get('' + i);
      k.patchValue(temp[i]);
      k.markAsTouched();
      this.filterFamilyDiseaseList(temp[i].familyConditionId, i);
    }

    if (i + 1 < temp.length)
      // this.addChiefComplaint();
      this.addFamilyDisease()
  }
}

  checkComplaintFormValidity(complaintForm) {
    let temp = complaintForm.value;
    if (temp.chiefComplaint && temp.duration && temp.unitOfDuration) {
      return false;
    } else {
      return true;
    }
  }
 
  checkMedicalFormValidity(pastMedicalConForm){
  let temp = pastMedicalConForm.value;
  if(temp.pastMedicalCondition && temp.duration && temp.unitsOfDuration){
    return false;
  }else{
    return true;
  }
  }

  checkPsychiatricFormValidity(pastMedicalConForm){
    let temp = pastMedicalConForm.value;
    if(temp.pastPsychiatricCondition && temp.duration && temp.unitsOfDuration){
      return false;
    }else{
      return true;
    }
    }

  addFamilyDisease() {
    const familyDiseaseList = <FormArray>this.counsellorForm.controls['familyDiseaseList'];
    const temp = familyDiseaseList.value;

    if (this.familyConditions) {
      let result = this.familyConditions.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.familyCondition.familyConditionId !== null)
            return value.familyCondition.familyConditionId == item.familyConditionId;
        });
        let flag = arr.length == 0 ? true : false;
        return flag;
      });
      if (temp.length > 0) {
        this.diseaseSelectList.push(result.slice());
      }
      
        // let flag = arr.length == 0 ? true : false;
        // return flag;
    }
    familyDiseaseList.push(this.createPatientFamilyConditionForm());
  }

  filterFamilyDiseaseList(disease, i, familyDiseaseForm?: FormGroup) {
    let previousValue = this.previousSelectedDiseaseList[i];
    if (disease.diseaseType == 'None') {
      this.removeFamilyDiseaseExecptNone();
    }
    if(familyDiseaseForm !== undefined && familyDiseaseForm !== null){
    if (familyDiseaseForm && disease.diseaseType != 'Other'){
      familyDiseaseForm.patchValue({ otherDiseaseType: null ,snomedCode : disease.snomedCode, snomedTerm : disease.snomedTerm});
    } else {
      familyDiseaseForm.patchValue({ snomedCode : null, snomedTerm :null})
    }
  }

    if (previousValue) {
      this.diseaseSelectList.map((item, t) => {
        if (t != i && previousValue.diseaseType != 'Other') {
          item.push(previousValue);
          this.sortDiseaseList(item);
        }
      })
    }

  // if(disease.snomedCode){
  // familyDiseaseForm.patchValue({c})
  // }

    this.diseaseSelectList.map((item, t) => {
      let index = item.indexOf(disease);
      if (index != -1 && t != i && disease.diseaseType != 'Other')
        item = item.splice(index, 1);
    })

    this.previousSelectedDiseaseList[i] = disease;
  }

  removeFamilyDiseaseExecptNone() {
    let familyDiseaseList = <FormArray>this.counsellorForm.controls['familyDiseaseList'];
    while (familyDiseaseList.length > 1) {
      let i = familyDiseaseList.length - 1;

      let removedValue = this.previousSelectedDiseaseList[i];
      if (removedValue)
        this.diseaseSelectList[0].push(removedValue);
        
      this.sortDiseaseList(this.diseaseSelectList[0]);
      familyDiseaseList.removeAt(i);
      this.previousSelectedDiseaseList.splice(i, 1);
      this.diseaseSelectList.splice(i, 1);
    }
  }

  removeFamilyDisease(i, counsellorForm?: FormGroup) {
    this.confirmservice.confirm(`warn`, this.assignSelectedLanguageValue.warn).subscribe(result => {
      if (result) {
        let familyDiseaseList = <FormArray>this.counsellorForm.controls['familyDiseaseList'];
        if (!!counsellorForm && familyDiseaseList.length == 1) {
          counsellorForm.reset();
        } else {
          let removedValue = this.previousSelectedDiseaseList[i];
          if(removedValue){
          this.diseaseSelectList.map((item, t) => {
            if (t != i && removedValue && removedValue.diseaseType != 'Other') {
              item.push(removedValue);
              this.sortDiseaseList(item);
            }
          })
        }

        if (i == 0) {
          let temp = this.diseaseSelectList[i].filter(t => t.familyConditionName == "None");
          if (temp && temp[0]) {
            this.diseaseSelectList[i + 1].push(temp[0]);
            this.sortDiseaseList(this.diseaseSelectList[i + 1]);
          }
        }
          this.previousSelectedDiseaseList.splice(i, 1);
          this.diseaseSelectList.splice(i, 1);
          familyDiseaseList.removeAt(i);
        }
      }
    });
  }

  initFamilyDiseaseList() {
    return this.fb.group({
      diseaseTypeID: null,
      diseaseType: null,
      otherDiseaseType: null,
      familyMembers: null,
      snomedCode: null,
      snomedTerm: null
    });
  }

  sortDiseaseList(diseaseList) {
    diseaseList.sort((a, b) => {
      if (a.diseaseType == b.diseaseType) return 0;
      if (a.diseaseType < b.diseaseType) return -1;
      else return 1;
    })
  }

  checkValidity(diseaseForm) {
    let temp = diseaseForm.value;
    if (temp.familyCondition && temp.familyMembers) {
      return false;
    } else {
      return true;
    }
  }

  checkFormVadility(){
    if(this.counsellorForm.touched)
    return false;
    else 
    return true;
  }

  searchComponents(term: string, i, complaintForm?: FormGroup): void {
    
    let searchTerm = term;

    console.log("searchTerm",this.counsellorForm.controls.complaints.value.otherCheifComplaint);
    if (searchTerm.length > 2) {
        let dialogRef = this.dialog.open(CheifComplaintSnomedSearchComponent,
          {data: { searchTerm: searchTerm}});

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result)
            if (result) {
              if( this.counsellorForm.value.complaints != null &&  complaintForm.value.chiefComplaint.psychiatricChiefComplaintName === "Other"){
              this.selectedSnomedTerm = result.component;
              // complaintForm.controls.chiefComplaint.patchValue({ psychiatricChiefComplaintName: result.component });
              complaintForm.patchValue({ snomedCtCoode: result.componentNo });
              complaintForm.patchValue({ otherCheifComplaint: result.component });
              this.countForSearch = i;      
              }
              this.componentFlag=true;
            } else {
              complaintForm.controls.otherCheifComplaint = null;

            }
            // else
            // {
            //   this.snomedTerm==null;
            //   this.snomedCode==null;
            //  }

        });
  }
}

removeSnomedCode(complaintForm , index){
  console.log("value" ,complaintForm.value + "indexx" ,index + "searchTime", this.countForSearch);
  if(complaintForm.value.otherCheifComplaint == undefined){
    this.countForSearch = index;
    this.selectedSnomedTerm = complaintForm.value.chiefComplaint.psychiatricChiefComplaintName;
  }
 
  if(this.countForSearch < index){
    this.selectedSnomedTerm = null;
  }
}

  // if(this.countForSearch == 0){
  //   this.confirmationService.alert("Please select a valid snomed code");
  //   allergyForm.patchValue({ snomedTerm: null });
  //   this.countForSearch = 0;

  // }

   
  getCounsellingFormData(){
    let beneficiaryRegID = this.saved_data.benRegID;
  this.caseSheetService.getHihlCounsellingData(beneficiaryRegID).subscribe((res)=>{
    if (res !== null && res !== undefined) {
      this.counsellorHistoryData = res;
    }
  })
}


resetOtherSleepValues() {
  let sleepList = this.counsellorForm.value.sleep;
  let flag = false;
  if(sleepList.length <= 0) {
    flag = null
  }
  else {

    sleepList.forEach(item => {
    if (item === 'Normal') {
      flag = true;
    }
  })
}
  this.disableSleepValue = flag;

}

resetOtherFactorValues() {
  let factorList = this.counsellorForm.value.precipitatingFactor;
  let flag = false;
  if(factorList.length <= 0) {
    flag = null
  }
  else {

    factorList.forEach(item => {
    if (item === 'None') {
      flag = true;
    }
  })
}
  this.disableFactorValue = flag;

}
}

@Component({
  selector: "app-104-counsellor-history",
  templateUrl: "./104-counsellor-history.html",
})
export class CounsellorHistory {
  assignSelectedLanguageValue: any;
  counsellorHistoryData: any;

  // constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
  //   public dialogReff: MdDialogRef<CaseSheetHistoryModal>) { }
  constructor(public httpServices: HttpServices,
    private saved_data: dataService,private caseSheetService: CaseSheetService) {}
  @Input() cocasesheet: any;
  @Input() current_language: any;
  data: any;
  displayHistory: boolean = false;

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.getCounsellingFormData();
    //  this.data = JSON.parse(this.cocasesheet);

    // const tableData = Object.keys(data).map(key => {
    //   return { field: key, value: data[key] };
    // });

    // const tableJson = JSON.stringify(tableData);
    // console.log('success',tableJson)
    this.data = this.cocasesheet;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  ngOnChanges() {
    this.data = this.cocasesheet

  }

  getCounsellingFormData(){
    let beneficiaryRegID = this.saved_data.benRegID;
  this.caseSheetService.getHihlCounsellingData(beneficiaryRegID).subscribe((res)=>{
    if (res !== null && res !== undefined) {
      this.counsellorHistoryData = res;
    }
  })
}
}
