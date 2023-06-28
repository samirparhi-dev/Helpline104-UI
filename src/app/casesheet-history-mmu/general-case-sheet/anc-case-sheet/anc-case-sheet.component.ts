import { Component, OnInit, Input } from '@angular/core';
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-anc-case-sheet',
  templateUrl: './anc-case-sheet.component.html',
  styleUrls: ['./anc-case-sheet.component.css']
})
export class AncCaseSheetComponent implements OnInit {
  @Input('data')
  caseSheetData: any
  aNCDetailsAndFormula: any;
  aNCImmunization: any;
  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
  }

  ngOnChanges() {
    this.currentLanguageSetValue();
    if (this.caseSheetData && this.caseSheetData.nurseData && this.caseSheetData.nurseData.anc) {
      this.aNCDetailsAndFormula = this.caseSheetData.nurseData.anc.ANCCareDetail;
      this.aNCImmunization = this.caseSheetData.nurseData.anc.ANCWomenVaccineDetails;
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

}
