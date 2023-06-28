import {Component, DoCheck, OnInit} from '@angular/core';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { dataService } from '../services/dataService/data.service';

@Component({
    selector: 'dashboard-navigation',
    templateUrl: './dashboardNavigation.html',
})
export class DashboardNavigationComponent implements OnInit, DoCheck{
	assignSelectedLanguageValue: any;

constructor(public getCommonData: dataService,
	private httpServices:HttpServices) {}

	current_role: any;
	ngOnInit() {
		this.assignSelectedLanguage();
		this.current_role = this.getCommonData.current_role;
	}
	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
	  }
	ngDoCheck() {
		this.assignSelectedLanguage();
	}
}