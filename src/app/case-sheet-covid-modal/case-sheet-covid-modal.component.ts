import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { dataService } from 'app/services/dataService/data.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";


@Component({
  selector: 'app-case-sheet-covid-modal',
  templateUrl: './case-sheet-covid-modal.component.html',
  styleUrls: ['./case-sheet-covid-modal.component.css']
})
export class CaseSheetCovidModalComponent implements OnInit {
  validNumber: boolean=false;
  altNum: any = false;
  mobileNumber: any;
  current_campaign: any;
  currentLanguageSet: any;
  constructor(@Inject(MD_DIALOG_DATA) public data: any,
  public dialog: MdDialog,
  public dialogReff: MdDialogRef<CaseSheetCovidModalComponent>,
  public getCommonData: dataService,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  ngDoCheck() {
    this.currentLanguageSetValue();
  }    
  
  mobileNum(value) {
		if (value.length == 10) {
			this.validNumber = true;
		}
		else {
			this.validNumber = false;
		}
  }
  
}
