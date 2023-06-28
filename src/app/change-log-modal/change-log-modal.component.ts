import { Component, OnInit, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FeedbackTypes } from "../services/common/feedbacktypes.service";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-change-log-modal',
  templateUrl: './change-log-modal.component.html',
  styleUrls: ['./change-log-modal.component.css']
})
export class ChangeLogModalComponent implements OnInit {
  feedbackLogs: any = [];
  currentLanguageSet: any;

  constructor(
    public dialogRef: MdDialogRef<ChangeLogModalComponent>,
    @Inject(MD_DIALOG_DATA) public input: any,
    private feedbackService: FeedbackTypes,public HttpServices: HttpServices) { }

  ngOnInit() {
    this.currentLanguageSetValue();
    console.log("change log", this.input.feedbackID);
    this.showFeedbackLog();
  }

  currentLanguageSetValue() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  
  ngDoCheck() {
    this.currentLanguageSetValue();
  }    
  
  showFeedbackLog() {
    this.feedbackService.showFeedbackLog(this.input).subscribe((response) => {
      this.feedbackLogs = response;
    }, (err) => {
      console.log("error", err);
    })
  }
}
