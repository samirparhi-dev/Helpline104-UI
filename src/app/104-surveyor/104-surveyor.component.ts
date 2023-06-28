import { Component, OnInit, Input, DoCheck, OnChanges } from "@angular/core";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-104-surveyor",
  templateUrl: "./104-surveyor.component.html",
})
export class surveyor_104_Component implements OnChanges, OnInit, DoCheck {
  assignSelectedLanguageValue: any;
  Activity_Number: any;

  constructor(private httpServices: HttpServices) {}
  /*
   * JA354063 - Created on 22-07-2021
   */
  ngOnChanges() {
    this.assignSelectedLanguage();
  }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  show(value) {
    this.Activity_Number = value;
  }

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
