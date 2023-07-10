/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component, OnInit } from '@angular/core';

import { CDSSService  } from '../services/cdssService/cdss.service';
import  {Router} from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
  selector: 'app-insert-complaint',
  templateUrl: './insert-complaint.component.html',
  styleUrls: ['./insert-complaint.component.css'],
  host: {'(window:keydown)': 'hotkeys($event)'},
  providers: [CDSSService ]
})
export class InsertComplaintComponent implements OnInit {
  currentLanguageSet: any;

 hotkeys(event){
      if (event.keyCode == 13 && event.ctrlKey){
         this.submit() ;
      }
   }

  data: any;
  constructor(private _httpService: CDSSService ,private route:Router, private confirm : ConfirmationDialogsService,
    public httpServices: HttpServices) { }

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

  submit() {
    let data = {};
    data["Msg"] = this.data ? this.data.trim() : null;
    this._httpService.saveSymp(data).subscribe(any => this.result(any));
  }

  result(data: any) {
    // alert(data.message);
    if(data.message.toString().toLowerCase() =='sucess'){
      this.confirm.alert(this.currentLanguageSet.uploadedSuccessfully, "success");

     this.data="";
    }
    else if(data.message.toString().toLowerCase() == 'data already exist in database') {
      this.confirm.alert(this.currentLanguageSet.dataAlreadyExists);
    }
    else {
      this.confirm.alert( data.message);
    }

  }

}
