import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { ForceLogoutService } from './../services/supervisorServices/forceLogoutService.service';
import { NgForm } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.css']
})
export class ForceLogoutComponent implements OnInit {

  @ViewChild('flform') flform: NgForm;
  currentLanguageSet: any;

  constructor(public alertService: ConfirmationDialogsService,
    public forceLogoutService: ForceLogoutService, private _dataServivce: dataService, public httpServices: HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
 
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  kickout(obj) {
    obj.providerServiceMapID = this._dataServivce.current_service.serviceID;
    console.log(obj, 'object values');
    this.alertService.confirm('', this.currentLanguageSet.doYouReallyWantToKickout + " " +obj.userName + '?')
      .subscribe(response => {
        if (response) {
          this.forceLogoutService.forcelogout(obj).subscribe(res => {
            console.log(res, 'success post force logout');
            if (res.response.toLowerCase() === 'success'.toLowerCase()) {
              this.alertService.alert(this.currentLanguageSet.userLoggedOutSuccessfully, 'success');
              this.flform.reset();
            } else {
              this.alertService.alert(res.errorMessage, 'failure');
              this.flform.reset();
            }
          }, err => {
            console.log(err, 'error post force logout');
            this.alertService.alert(err.errorMessage, 'error');
            this.flform.reset();
          });
        }
      });

  }

}
