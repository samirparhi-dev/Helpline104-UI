import { Component, OnInit, Input } from '@angular/core';
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'cancer-examination-case-sheet',
  templateUrl: './cancer-examination-case-sheet.component.html',
  styleUrls: ['./cancer-examination-case-sheet.component.css']
})
export class CancerExaminationCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;

  gynecologicalImageUrl = 'assets/images/gynecologicalExamination.png';
  breastImageUrl = 'assets/images/breastExamination.png';
  abdominalImageUrl = 'assets/images/abdominalExamination.png';
  oralImageUrl = 'assets/images/oralExamination.png';

  signsAndSymptoms: any;
  BenCancerLymphNodeDetails: any;
  oralExamination: any;
  breastExamination: any;
  abdominalExamination: any;
  gynecologicalExamination: any;
  imageAnnotatedData: any;
  beneficiaryDetails: any;

  blankRows = [1, 2, 3, 4]

  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
  }

  ngOnChanges() {
    this.currentLanguageSetValue();
    if (this.casesheetData) {
      if (this.casesheetData.BeneficiaryData)
        this.beneficiaryDetails = this.casesheetData.BeneficiaryData;

      this.signsAndSymptoms = this.casesheetData.nurseData.signsAndSymptoms;
      this.BenCancerLymphNodeDetails = this.casesheetData.nurseData.BenCancerLymphNodeDetails;
      this.oralExamination = this.casesheetData.nurseData.oralExamination;
      this.breastExamination = this.casesheetData.nurseData.breastExamination;
      this.abdominalExamination = this.casesheetData.nurseData.abdominalExamination;
      this.gynecologicalExamination = this.casesheetData.nurseData.gynecologicalExamination;
      this.imageAnnotatedData = this.casesheetData.ImageAnnotatedData;
    }
  }

  getImageAnnotation(imageID) {
    let arr = this.imageAnnotatedData.filter(item => item.imageID == imageID);
    return arr.length > 0 ? arr[0] : null;
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  ngDoCheck() {
    this.currentLanguageSetValue();
  }    

}
