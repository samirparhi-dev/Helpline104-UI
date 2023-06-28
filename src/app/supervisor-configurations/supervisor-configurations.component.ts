import { Component, OnInit } from '@angular/core';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-supervisor-configurations',
  templateUrl: './supervisor-configurations.component.html',
  styleUrls: ['./supervisor-configurations.component.css']
})
export class SupervisorConfigurationsComponent implements OnInit {

  currentLanguageSet: any;

  constructor(public HttpServices: HttpServices) { }

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

}
