import { Component, OnInit } from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-dashboard-reports',
  templateUrl: './dashboard-reports.component.html',
  styleUrls: ['./dashboard-reports.component.css']
})
export class DashboardReportsComponent implements OnInit {
  assignSelectedLanguageValue: any;

  constructor(private httpServices:HttpServices) {
   }

  ngOnInit() {
    this. assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
 /*
  * JA354063 - Created on 20-07-2021
  */
 assignSelectedLanguage() {
  const getLanguageJson = new SetLanguageComponent(this.httpServices);
  getLanguageJson.setLanguage();
  this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
}
}
