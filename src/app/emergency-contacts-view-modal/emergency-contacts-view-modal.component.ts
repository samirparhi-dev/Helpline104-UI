import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-emergency-contacts-view-modal',
  templateUrl: './emergency-contacts-view-modal.component.html',
  styleUrls: ['./emergency-contacts-view-modal.component.css']
})
export class EmergencyContactsViewModalComponent implements OnInit {

  //arrays
  contacts:Array<any> = [];

  //variables
  providerServiceMapID: any;
  emergencyContactID: any;
  currentLanguageSet: any;

  constructor(private dialog: MdDialog, public dialogRef: MdDialogRef<EmergencyContactsViewModalComponent>,
    private dataService: dataService, private notificationService: NotificationService, private alertService: ConfirmationDialogsService, public httpServices: HttpServices) { }
    ngDoCheck() {
      this.assignSelectedLanguage();
    }
   
    assignSelectedLanguage() {
      const getLanguageJson = new SetLanguageComponent(this.httpServices);
      getLanguageJson.setLanguage();
      this.currentLanguageSet = getLanguageJson.currentLanguageObject;
      }
  ngOnInit() {
    this.assignSelectedLanguage();
    this.httpServices.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response, "notification Types in emergency contact component");
        this.emergencyContactID = response.filter((notification) => {
          return notification.notificationType == "Emergency Contact";
        });
        let data = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.emergencyContactID[0].notificationTypeID
        }
        this.notificationService.getEmergencyContacts(data).subscribe(response => {
          this.handleEmergencyContacts(response)
        },
          (err) => {
            this.alertService.alert(err.errorMessage, 'error');
            console.log(err);
          });
      },
      (err) => {
        console.log(err);
      });
  }

  handleEmergencyContacts(res) {
    this.contacts = res;
  }
}
