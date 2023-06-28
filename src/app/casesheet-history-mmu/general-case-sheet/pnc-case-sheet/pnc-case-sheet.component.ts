import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-pnc-case-sheet',
  templateUrl: './pnc-case-sheet.component.html',
  styleUrls: ['./pnc-case-sheet.component.css']
})
export class PncCaseSheetComponent implements OnInit, DoCheck {
  @Input('data')
  caseSheetData: any;
  pNCCaseSheetData: any
  assignSelectedLanguageValue: any;

  constructor(private httpServices: HttpServices) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.caseSheetData && this.caseSheetData.nurseData && this.caseSheetData.nurseData.pnc)
      this.pNCCaseSheetData = this.caseSheetData.nurseData.pnc.PNCCareDetail;
  }
 /*
   * JA354063 - Created on 27-07-2021
   */
 assignSelectedLanguage() {
  const getLanguageJson = new SetLanguageComponent(this.httpServices);
  getLanguageJson.setLanguage();
  this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  ngDoCheck() {
  this.assignSelectedLanguage();
  }
  /* Ends*/
}
