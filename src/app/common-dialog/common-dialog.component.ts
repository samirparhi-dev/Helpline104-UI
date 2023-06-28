import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from "../services/http-services/http_services.service";


@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent implements OnInit {
  @Output() cancelEvent = new EventEmitter();
  public title: string;
  public message: string;
  public status: string;
  public btnOkText?: string;
  public btnCancelText?: string;
  public alert: boolean;
  public confirmAlert: boolean;
  public remarks: boolean;
  currentLanguageSet: any;
  assignSelectedLanguageValue: any;
  constructor(public dialogRef: MdDialogRef<CommonDialogComponent>,
    public HttpServices:HttpServices) { }

  ngOnInit() {
    // this.HttpServices.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  Confirm() {
    this.cancelEvent.emit(null);
  }
  /*
  * JA354063 - Created on 20-07-2021
  */
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }

}
