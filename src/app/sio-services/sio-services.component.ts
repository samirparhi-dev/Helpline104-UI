import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

declare var jQuery: any;

@Component({
  selector: 'app-sio-services',
  templateUrl: './sio-services.component.html',
  styleUrls: ['./sio-services.component.css']
})
export class SioServicesComponent implements OnInit {

  current_campaign: any;
  screens: any;
  outboundFor: any;
  currentLanguageSet: any;

  @Output() outBoundOnCall: EventEmitter<any> = new EventEmitter<any>();

  constructor(public getCommonData: dataService, private route : ActivatedRoute,public HttpServices: HttpServices) { 
   
    if(sessionStorage.getItem('service') != undefined) {
      this.outboundFor = sessionStorage.getItem('service');
    }
  }

  ngOnInit() {
    this.current_campaign = this.getCommonData.current_campaign;
    this.screens = this.getCommonData.screens;
    this.currentLanguageSetValue();

  }

  tab: number = 1;

  // changeService(val) {
  //   this.tab = val;
  //   jQuery("#service" + val).parent().find("li").removeClass();
  //   jQuery("#service" + val).addClass("animation-nav-active");

  //   jQuery("#service" + val).parent().find('a').removeClass();
  //   jQuery("#service" + val + " a").addClass("f-c-o");
  // }

  @Input() current_language: any;
  current_language_set: any; // contains the language set which is there through out in the app ; value is set by the value in 'Input() current_language'

  ngOnChanges() {
    if (this.current_language)
      this.current_language_set = this.current_language;

  //  console.log("language in sio-services", this.current_language_set);
  }
  callStatus(value) {
    this.outBoundOnCall.emit(value)
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
