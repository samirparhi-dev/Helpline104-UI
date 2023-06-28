import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { ConfigService } from "../services/config/config.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  styleUrls: ['./agent-status.component.css']
})
export class AgentStatusComponent implements OnInit {

  agentStausScreenURL: any;
  currentLanguageSet: any;

  constructor(private saved_data: dataService,
  private _config: ConfigService,
  public sanitizer: DomSanitizer,public HttpServices: HttpServices) { }

  selection: any = "";
  onlineAgents: any;
  logoutRes: any;

  ngOnInit() {
    this.assignSelectedLanguage();
   // this.getOnlineAgents();
  this.agentStausScreenURL = this._config.getTelephonyServerURL()+"remote_login.php?username="+this.saved_data.Userdata.userName+"&key="+this.saved_data.loginKey;
  this.agentStausScreenURL = this.sanitizer.bypassSecurityTrustResourceUrl( this.agentStausScreenURL );
  console.log("agentStausScreenURL: "+this.agentStausScreenURL);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

/*
  getOnlineAgents() {
    this.czentrixServices.getOnlineAgents("4002", "10.208.93.249").subscribe(response => this.onlineAgents = this.successhandler(response));
  }

  agentLogout() {
    this.czentrixServices.agentLogout("4004", "10.208.93.249").subscribe(response => this.logoutRes = this.successhandler(response));
  }

  successhandler(response) {
    return response.response;
  } */

}
