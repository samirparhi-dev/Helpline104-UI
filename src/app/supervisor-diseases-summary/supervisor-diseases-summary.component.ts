import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupervisorDiseaseSummaryService } from "../services/supervisorServices/supervisor-disease-summary-service";
import { dataService } from "../services/dataService/data.service";
import { ViewDiseaseSummaryContentsComponent } from "../view-disease-summary-contents/view-disease-summary-contents.component";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-supervisor-diseases-summary",
  templateUrl: "./supervisor-diseases-summary.component.html",
  styleUrls: ["./supervisor-diseases-summary.component.css"],
})
export class SupervisorDiseasesSummaryComponent implements OnInit {
  currentLanguageSet: any;

  diseasesSummaryForm: FormGroup;
  providerServiceMapID: any;
  rowsPerPage: any = "5";
  pageNo: any = 1;
  pageCount: any;
  bufferCount: any = 0;
  diseaseSummaryID: any;

  /*Arrays */
  diseaseSummaryList: any = [];
  filteredDiseaseSummaryList: any = [];
  bufferArray: any = [];
  formContentArray: any = [];
  formQuestionContentArray: any = [];
  formCauseContentArray: any = [];
  formdosContentArray: any = [];
  formSignContentArray: any = [];
  formMedicalContentArray: any = [];
  formRiskFactorContentArray: any = [];
  formTreatmentContentArray: any = [];
  formSelfCareArray: any = [];
  formInvestigationArray: any = [];
  availableDiseaseNames: any = [];

  summaryArray: any = "";
  questionsArray: any = "";
  causesArray: any = "";
  doAndDontsArray: any = "";
  signsAndSymptomsArray: any = "";
  medicalAdviceArray: any = "";
  riskFactorsArray: any = "";
  treatmentArray: any = "";
  selfCareArray: any = "";
  investigationArray: any = "";
  pager: any = {
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    startIndex: 0,
    endIndex: 0,
    pages: 0,
  };

  /*Boolean */
  enableCreationField: Boolean = false;
  diseaseNameExist: Boolean = false;
  updateDiseases: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private supervisorDiseaseSummaryService: SupervisorDiseaseSummaryService,
    private dataService: dataService,
    private dialog: MdDialog,
    private confirmationDialogsService: ConfirmationDialogsService,
    public HttpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();

    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.createDiseasesSummaryForm();
    this.getDiseaseSummaryList(this.pageNo, this.rowsPerPage);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  createDiseasesSummaryForm() {
    this.diseasesSummaryForm = this.formBuilder.group({
      diseaseName: [null, Validators.required],
      diseaseSummary: null,
      causes: null,
      questions: null,
      doAndDonts: null,
      signsAndSymptoms: null,
      medicalAdvice: null,
      riskFactors: null,
      treatment: null,
      selfCare: null,
      investigations: null,
    });
  }
  /*
   * Fetch all disease summary
   */
  getDiseaseSummaryList(pageNo, rowsPerPage) {
    let reqObj = {
      pageNo: pageNo,
      pageSize: parseInt(rowsPerPage),
    };
    this.supervisorDiseaseSummaryService
      .getDiseaseSummaryList(reqObj)
      .subscribe(
        (response) => {
          if (response.statusCode == 200) {
            this.diseaseSummaryList = response.data.DiseaseList;
            this.replaceDollarWithLineBreak();
            this.filteredDiseaseSummaryList = this.diseaseSummaryList;
            console.log(
              "this.filteredDiseaseSummaryList",
              this.filteredDiseaseSummaryList
            );
            this.diseaseSummaryList.forEach((disease) => {
              this.availableDiseaseNames.push(disease.diseaseName);
            });
            this.pageCount = response.data.totalPages;
            this.pager = this.getPager(pageNo);
          } else {
            console.log("error");
          }
        },
        (err) => {
          console.log("error", err.errorMessage);
        }
      );
  }
  /*
   * To show the disease details line by line
   */
  replaceDollarWithLineBreak() {
    this.diseaseSummaryList.forEach((replaceString) => {
      replaceString.summary = replaceString.summary
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.couldbedangerous = replaceString.couldbedangerous
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.causes = replaceString.causes
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.dos_donts = replaceString.dos_donts
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.symptoms_Signs = replaceString.symptoms_Signs
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.medicaladvice = replaceString.medicaladvice
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.riskfactors = replaceString.riskfactors
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.treatment = replaceString.treatment
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.self_care = replaceString.self_care
        .substring(1)
        .replace(/\$/g, "\n");
      replaceString.investigations = replaceString.investigations
        .substring(1)
        .replace(/\$/g, "\n");
    });
  }
  checkPager(pager, page, pageSize) {
    if (page == 1 && pager.currentPage != 1) {
      this.setPage(page, pageSize);
    } else if (pager.currentPage < page) {
      this.setPage(page, pageSize);
    }
  }
  setPage(page: number, pageSize) {
    if (page <= this.pageCount && page >= 1) {
      this.getDiseaseSummaryList(page, pageSize);
      // get pager object
      this.pager = this.getPager(page);
    }
  }
  getPager(page) {
    // Total page count
    let totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (page > totalPages) {
      page = totalPages;
    }
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (page <= 2) {
        startPage = 1;
        endPage = 5;
      } else if (page + 2 >= totalPages) {
        startPage = totalPages - 5;
        endPage = totalPages;
      } else {
        startPage = page - 2;
        endPage = page + 2;
      }
    }
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );
    // return object with all pager properties required by the view
    return {
      currentPage: page,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  }
  createSummary(formvalue) {
    console.log(formvalue, "x");
    this.enableCreationField = true;
    this.updateDiseases = false;
    this.bufferArray = [];
  }
  /*
   * Add disease summary
   */
  addSummaryContents(formContent) {
    if (formContent.includes("\n")) {
      // For edit purpose
      let checkEmptyStringinArray = this.formContentArray.concat(
        formContent.split("\n")
      );
      this.formContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formContentArray.push(value);
        }
      });
    } else {
      this.formContentArray.push(formContent);
    }
    this.formContentArray.forEach((details) => {
      this.summaryArray = this.summaryArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["diseaseSummary"].reset();
  }

  viewSummaryContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.summaryArray = "";
        result.forEach((details) => {
          this.summaryArray = this.summaryArray + "$" + details;
        });
      }
    });
  }
  addQuestionsContents(questionContent) {
    if (questionContent.includes("\n")) {
      // For edit purpose
      let checkEmptyStringinArray = this.formQuestionContentArray.concat(
        questionContent.split("\n")
      );
      this.formQuestionContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formQuestionContentArray.push(value);
        }
      });
    } else {
      this.formQuestionContentArray.push(questionContent);
    }
    this.formQuestionContentArray.forEach((details) => {
      this.questionsArray = this.questionsArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["questions"].reset();
  }
  viewQuestionsContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formQuestionContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionsArray = "";
        result.forEach((details) => {
          this.questionsArray = this.questionsArray + "$" + details;
        });
      }
      console.log("this.questionsArray", this.questionsArray);
    });
  }
  addCauseContents(causeContent) {
    if (causeContent.includes("\n")) {
      // For edit purpose
      let checkEmptyStringinArray = this.formCauseContentArray.concat(
        causeContent.split("\n")
      );
      this.formCauseContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formCauseContentArray.push(value);
        }
      });
    } else {
      this.formCauseContentArray.push(causeContent);
    }
    this.formCauseContentArray.forEach((details) => {
      this.causesArray = this.causesArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["causes"].reset();
  }
  viewCauseContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formCauseContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.causesArray = "";
        result.forEach((details) => {
          this.causesArray = this.causesArray + "$" + details;
        });
      }
      console.log("this.causesArray", this.causesArray);
    });
  }
  addDoAndDontsContents(dosContent) {
    if (dosContent.includes("\n")) {
      let checkEmptyStringinArray = this.formdosContentArray.concat(
        dosContent.split("\n")
      );
      this.formdosContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formdosContentArray.push(value);
        }
      });
    } else {
      this.formdosContentArray.push(dosContent);
    }
    this.formdosContentArray.forEach((details) => {
      this.doAndDontsArray = this.doAndDontsArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["doAndDonts"].reset();
  }
  viewDoAndDontsContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formdosContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.doAndDontsArray = "";
        result.forEach((details) => {
          this.doAndDontsArray = this.doAndDontsArray + "$" + details;
        });
      }
      console.log("this.doAndDontsArray", this.doAndDontsArray);
    });
  }
  addSignsAndSymptomsContents(signContent) {
    if (signContent.includes("\n")) {
      let checkEmptyStringinArray = this.formSignContentArray.concat(
        signContent.split("\n")
      );
      this.formSignContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formSignContentArray.push(value);
        }
      });
    } else {
      this.formSignContentArray.push(signContent);
    }
    this.formSignContentArray.forEach((details) => {
      this.signsAndSymptomsArray = this.signsAndSymptomsArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["signsAndSymptoms"].reset();
  }
  viewSignsAndSymptomsContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formSignContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.signsAndSymptomsArray = "";
        result.forEach((details) => {
          this.signsAndSymptomsArray =
            this.signsAndSymptomsArray + "$" + details;
        });
      }
      console.log("this.signsAndSymptomsArray", this.signsAndSymptomsArray);
    });
  }
  addMedicalAdviceContents(medicalContent) {
    if (medicalContent.includes("\n")) {
      let checkEmptyStringinArray = this.formMedicalContentArray.concat(
        medicalContent.split("\n")
      );
      this.formMedicalContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formMedicalContentArray.push(value);
        }
      });
    } else {
      this.formMedicalContentArray.push(medicalContent);
    }
    this.formMedicalContentArray.forEach((details) => {
      this.medicalAdviceArray = this.medicalAdviceArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["medicalAdvice"].reset();
  }
  viewMedicalAdviceContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formMedicalContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.medicalAdviceArray = "";
        result.forEach((details) => {
          this.medicalAdviceArray = this.medicalAdviceArray + "$" + details;
        });
      }
      console.log("this.medicalAdviceArray", this.medicalAdviceArray);
    });
  }
  addRiskFactorsContents(riskFactorsContent) {
    if (riskFactorsContent.includes("\n")) {
      let checkEmptyStringinArray = this.formRiskFactorContentArray.concat(
        riskFactorsContent.split("\n")
      );
      this.formRiskFactorContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formRiskFactorContentArray.push(value);
        }
      });
    } else {
      this.formRiskFactorContentArray.push(riskFactorsContent);
    }
    this.formRiskFactorContentArray.forEach((details) => {
      this.riskFactorsArray = this.riskFactorsArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["riskFactors"].reset();
  }
  viewRiskFactorsContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formRiskFactorContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.riskFactorsArray = "";
        result.forEach((details) => {
          this.riskFactorsArray = this.riskFactorsArray + "$" + details;
        });
      }
      console.log("this.riskFactorsArray", this.riskFactorsArray);
    });
  }
  addTreatmentContents(treatmentContent) {
    if (treatmentContent.includes("\n")) {
      let checkEmptyStringinArray = this.formTreatmentContentArray.concat(
        treatmentContent.split("\n")
      );
      this.formTreatmentContentArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formTreatmentContentArray.push(value);
        }
      });
    } else {
      this.formTreatmentContentArray.push(treatmentContent);
    }
    this.formTreatmentContentArray.forEach((details) => {
      this.treatmentArray = this.treatmentArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["treatment"].reset();
  }
  viewTreatmentContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formTreatmentContentArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.treatmentArray = "";
        result.forEach((details) => {
          this.treatmentArray = this.treatmentArray + "$" + details;
        });
      }
      console.log("this.treatmentArray", this.treatmentArray);
    });
  }
  addSelfCareContents(selfCareContent) {
    if (selfCareContent.includes("\n")) {
      let checkEmptyStringinArray = this.formSelfCareArray.concat(
        selfCareContent.split("\n")
      );
      this.formSelfCareArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formSelfCareArray.push(value);
        }
      });
    } else {
      this.formSelfCareArray.push(selfCareContent);
    }
    this.formSelfCareArray.forEach((details) => {
      this.selfCareArray = this.selfCareArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["selfCare"].reset();
  }
  viewSelfCareContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formSelfCareArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selfCareArray = "";
        result.forEach((details) => {
          this.selfCareArray = this.selfCareArray + "$" + details;
        });
      }
      console.log("this.selfCareArray", this.selfCareArray);
    });
  }
  addInvestigationsContents(investigationContent) {
    if (investigationContent.includes("\n")) {
      let checkEmptyStringinArray = this.formInvestigationArray.concat(
        investigationContent.split("\n")
      );
      this.formInvestigationArray = [];
      checkEmptyStringinArray.forEach((value) => {
        if (value != "") {
          this.formInvestigationArray.push(value);
        }
      });
    } else {
      this.formInvestigationArray.push(investigationContent);
    }
    console.log("this.formInvestigationArray", this.formInvestigationArray);
    this.formInvestigationArray.forEach((details) => {
      this.investigationArray = this.investigationArray + "$" + details;
    });
    this.diseasesSummaryForm.controls["investigations"].reset();
  }
  viewInvestigationsContents() {
    let dialogRef = this.dialog.open(ViewDiseaseSummaryContentsComponent, {
      width: "30%",
      data: {
        summaryDetails: this.formInvestigationArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.investigationArray = "";
        result.forEach((details) => {
          this.investigationArray = this.investigationArray + "$" + details;
        });
      }
      console.log("this.investigationArray", this.investigationArray);
    });
  }
  back() {
    this.enableCreationField = false;
    this.reset();
    this.bufferArray = [];
  }
  reset() {
    this.diseasesSummaryForm.reset();
    this.summaryArray = "";
    this.questionsArray = "";
    this.causesArray = "";
    this.doAndDontsArray = "";
    this.signsAndSymptomsArray = "";
    this.medicalAdviceArray = "";
    this.riskFactorsArray = "";
    this.treatmentArray = "";
    this.selfCareArray = "";
    this.investigationArray = "";
    this.formContentArray = [];
    this.formQuestionContentArray = [];
    this.formCauseContentArray = [];
    this.formdosContentArray = [];
    this.formSignContentArray = [];
    this.formMedicalContentArray = [];
    this.formRiskFactorContentArray = [];
    this.formTreatmentContentArray = [];
    this.formSelfCareArray = [];
    this.formInvestigationArray = [];
  }
  remove_obj(index) {
    this.bufferArray.splice(index, 1);
  }
  /*
   * Check disease name existance
   */
  checkExistance(diseaseName) {
    this.diseaseNameExist = this.availableDiseaseNames.includes(diseaseName);
    console.log(this.diseaseNameExist);
  }

  addObj(formValue) {
    let reqObj = {
      diseaseName: formValue.diseaseName.trim(),
      summary: (formValue.diseaseSummary !== undefined && formValue.diseaseSummary !== null)
        ? this.summaryArray + "$" + formValue.diseaseSummary.trim()
        : this.summaryArray,
      couldbedangerous: (formValue.questions !== undefined && formValue.questions !== null)
        ? this.questionsArray + "$" + formValue.questions.trim()
        : this.questionsArray,
      causes: (formValue.causes !== undefined && formValue.causes !== null)
        ? this.causesArray + "$" + formValue.causes.trim()
        : this.causesArray,
      dos_donts: (formValue.doAndDonts !== undefined && formValue.doAndDonts !== null)
        ? this.doAndDontsArray + "$" + formValue.doAndDonts.trim()
        : this.doAndDontsArray,
      symptoms_Signs: (formValue.signsAndSymptoms !== undefined && formValue.signsAndSymptoms !== null)
        ? this.signsAndSymptomsArray + "$" + formValue.signsAndSymptoms.trim()
        : this.signsAndSymptomsArray,
      medicaladvice: (formValue.medicalAdvice !== undefined && formValue.medicalAdvice !== null)
        ? this.medicalAdviceArray + "$" + formValue.medicalAdvice.trim()
        : this.medicalAdviceArray,
      riskfactors: (formValue.riskFactors !== undefined && formValue.riskFactors !== null)
        ? this.riskFactorsArray + "$" + formValue.riskFactors.trim()
        : this.riskFactorsArray,
      treatment: (formValue.treatment !== undefined && formValue.treatment !== null)
        ? this.treatmentArray + "$" + formValue.treatment.trim()
        : this.treatmentArray,
      self_care: (formValue.selfCare !== undefined && formValue.selfCare !== null)
        ? this.selfCareArray + "$" + formValue.selfCare.trim()
        : this.selfCareArray,
      investigations: (formValue.investigations !== undefined && formValue.investigations !== null)
        ? this.investigationArray + "$" + formValue.investigations.trim()
        : this.investigationArray,
      providerServiceMapID: this.providerServiceMapID,
      createdBy: this.dataService.Userdata.userName,
    };
    console.log("reqObj", reqObj);
    this.checkDuplicates(reqObj);
  }
  checkDuplicates(diseaseObj) {
    if (this.bufferArray.length == 0) {
      this.bufferArray.push(diseaseObj);
    } else if (this.bufferArray.length > 0) {
      for (let a = 0; a < this.bufferArray.length; a++) {
        if (this.bufferArray[a].diseaseName === diseaseObj.diseaseName) {
          this.bufferCount = this.bufferCount + 1;
          console.log("Duplicate Exists", this.bufferCount);
        }
      }
      if (this.bufferCount > 0) {
        this.confirmationDialogsService.alert(
          this.currentLanguageSet.alreadyExists
        );
        this.bufferCount = 0;
      } else {
        this.bufferArray.push(diseaseObj);
      }
    }
    this.bufferArray.forEach((bufferitem) => {
      bufferitem.summary = bufferitem.summary.substring(1).replace(/\$/g, "\n");
      bufferitem.medicaladvice = bufferitem.medicaladvice
        .substring(1)
        .replace(/\$/g, "\n");
    });
    this.reset();
    console.log("buffer", this.bufferArray);
  }
  save(rowsPerPage) {
    let saveDiseaseObj = this.bufferArray;
    saveDiseaseObj.forEach((diseaseItem) => {
      diseaseItem.summary = "$" + diseaseItem.summary.replace(/\n/g, "$");
      diseaseItem.medicaladvice =
        "$" + diseaseItem.medicaladvice.replace(/\n/g, "$");
    });
    console.log("saveDiseaseObj", saveDiseaseObj);
    this.supervisorDiseaseSummaryService
      .saveDiseaseSummary(saveDiseaseObj)
      .subscribe(
        (saveResponse) => {
          if (saveResponse) {
            this.confirmationDialogsService.alert(
              this.currentLanguageSet.savedSuccessfully,
              "success"
            );
            this.bufferArray = [];
            this.enableCreationField = false;
            this.getDiseaseSummaryList(this.pageNo, rowsPerPage);
          } else {
            console.log("error");
          }
        },
        (err) => {
          console.log("error", err.errorMessage);
        }
      );
  }
  editSummaryData(summaryData) {
    console.log(summaryData);
    this.enableCreationField = true;
    this.updateDiseases = true;
    this.diseaseSummaryID = summaryData.diseasesummaryID;
    this.diseasesSummaryForm.patchValue({
      diseaseName: summaryData.diseaseName,
      diseaseSummary: summaryData.summary,
      questions: summaryData.couldbedangerous,
      causes: summaryData.causes,
      doAndDonts: summaryData.dos_donts,
      signsAndSymptoms: summaryData.symptoms_Signs,
      medicalAdvice: summaryData.medicaladvice,
      riskFactors: summaryData.riskfactors,
      treatment: summaryData.treatment,
      selfCare: summaryData.self_care,
      investigations: summaryData.investigations,
    });
  }
  updateDisease(formValue, rowsPerPage) {
    let updateDiseaseObj = {
      diseaseName: formValue.diseaseName.trim(),
      summary: (formValue.diseaseSummary !== undefined && formValue.diseaseSummary !== null)
        ? this.summaryArray + "$" + formValue.diseaseSummary.trim().replace(/\n/g, "$")
        : this.summaryArray,
      couldbedangerous: (formValue.questions !== undefined && formValue.questions !== null)
        ? this.questionsArray + "$" + formValue.questions.trim().replace(/\n/g, "$")
        : this.questionsArray,
      causes: (formValue.causes !== undefined && formValue.causes !== null)
        ? this.causesArray + "$" + formValue.causes.trim().replace(/\n/g, "$")
        : this.causesArray,
      dos_donts: (formValue.doAndDonts !== undefined && formValue.doAndDonts !== null)
        ? this.doAndDontsArray + "$" + formValue.doAndDonts.trim().replace(/\n/g, "$")
        : this.doAndDontsArray,
      symptoms_Signs: (formValue.signsAndSymptoms !== undefined && formValue.signsAndSymptoms !== null)
        ? this.signsAndSymptomsArray +
          "$" +
          formValue.signsAndSymptoms.trim().replace(/\n/g, "$")
        : this.signsAndSymptomsArray,
      medicaladvice: (formValue.medicalAdvice !== undefined && formValue.medicalAdvice !== null)
        ? this.medicalAdviceArray +
          "$" +
          formValue.medicalAdvice.trim().replace(/\n/g, "$")
        : this.medicalAdviceArray,
      riskfactors: (formValue.riskFactors !== undefined && formValue.riskFactors !== null)
        ? this.riskFactorsArray +
          "$" +
          formValue.riskFactors.trim().replace(/\n/g, "$")
        : this.riskFactorsArray,
      treatment: (formValue.treatment !== undefined && formValue.treatment !== null)
        ? this.treatmentArray + "$" + formValue.treatment.trim().replace(/\n/g, "$")
        : this.treatmentArray,
      self_care: (formValue.selfCare !== undefined && formValue.selfCare !== null)
        ? this.selfCareArray + "$" + formValue.selfCare.trim().replace(/\n/g, "$")
        : this.selfCareArray,
      investigations: (formValue.investigations !== undefined && formValue.investigations !== null)
        ? this.investigationArray +
          "$" +
          formValue.investigations.trim().replace(/\n/g, "$")
        : this.investigationArray,
      providerServiceMapID: this.providerServiceMapID,
      createdBy: this.dataService.Userdata.userName,
      diseasesummaryID: this.diseaseSummaryID,
    };
    this.supervisorDiseaseSummaryService
      .updateDiseaseSummary(updateDiseaseObj)
      .subscribe(
        (updatedResponse) => {
          if (updatedResponse.statusCode == 200) {
            this.confirmationDialogsService.alert(
              this.currentLanguageSet.updatedSuccessfully,
              "success"
            );
            this.enableCreationField = false;
            this.reset();
            this.getDiseaseSummaryList(this.pageNo, rowsPerPage);
          } else {
            console.log("error");
          }
        },
        (err) => {
          console.log(err.errorMessage, "error");
        }
      );
  }
  status: any;
  deleteSummary(formValue, deleteFlag) {
    if (deleteFlag === true) {
      this.status = this.currentLanguageSet.deactivate;
    } else {
      this.status = this.currentLanguageSet.activate;
    }
    this.confirmationDialogsService
      .confirm(
        "Confirm",
        this.currentLanguageSet.areYouSureYouWantTo + " " + this.status + "?"
      )
      .subscribe((response) => {
        if (response) {
          let deleteObj = Object.assign(formValue, { deleted: deleteFlag });
          console.log("deleteObj", deleteObj);
          this.supervisorDiseaseSummaryService
            .deleteSummary(deleteObj)
            .subscribe(
              (deleteResponse) => {
                if (deleteResponse.statusCode == 200) {
                  this.confirmationDialogsService.alert(
                    deleteResponse.data.response,
                    "success"
                  );
                } else {
                  console.log("error");
                }
              },
              (err) => {
                console.log("error", err.errorMessage);
              }
            );
        }
      });
  }
}
