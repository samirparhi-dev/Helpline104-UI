import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from "../services/config/config.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-supervisor-reports',
  templateUrl: './supervisor-reports.component.html',
  styleUrls: ['./supervisor-reports.component.css']
})
export class SupervisorReportsComponent implements OnInit { 
  
  currentLanguageSet: any;

  reportsURL: any;

  constructor(private saved_data: dataService,
  private _config: ConfigService,
  public sanitizer: DomSanitizer, 
  public HttpServices: HttpServices) { }

  ngOnInit() { 
    this.assignSelectedLanguage();
    
 //http://10.201.13.17/remote_login.php?username=[value]&key=
  this.reportsURL = this._config.getTelephonyServerURL()+"remote_login.php?username="+this.saved_data.Userdata.userName+"&key="+this.saved_data.loginKey;
  this.reportsURL = this.sanitizer.bypassSecurityTrustResourceUrl( this.reportsURL );
  console.log("reportsURL: "+this.reportsURL);
  }
   ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

}
