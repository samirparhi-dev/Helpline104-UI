import { Component, OnInit, Input, DoCheck, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";

@Component({
  selector: "app-104-supervisor",
  templateUrl: "./104-supervisor.component.html",
  styleUrls: ["./104-supervisor.component.css"],
})
export class Supervisor_104_Component implements OnChanges, OnInit, DoCheck {
  assignSelectedLanguageValue: any;
  // setting default as agent status screen
  Activity_Number: "2";

  constructor(public router: Router, private httpServices: HttpServices) {}

  ngOnChanges() {
    this.assignSelectedLanguage();
  }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  /*
   * JA354063 - Created on 22-07-2021
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

  show(value) {
    this.Activity_Number = value;
  }

  dashboard() {
    this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
  }
}
