import { Component, OnInit } from "@angular/core";
import { MdDialog, MdDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-104-consent",
  templateUrl: "./consent-form.component.html",
  styleUrls: ["./consent-form.component.css"],
})
export class ConsentFormComponent implements OnInit {

  assignSelectedLanguageValue: any;

  constructor(
      private router: Router,
      private dialog: MdDialog,
      public dialogRef: MdDialogRef<ConsentFormComponent>,
      private httpServices: HttpServices
    ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  closeConsent(value){
    if(value === "yes") {
    this.dialogRef.close(true);
    } else {
        this.dialogRef.close(false);
    }
  }
}