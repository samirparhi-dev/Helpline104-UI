import { Component, OnInit } from '@angular/core';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
  selector: 'app-dial-beneficiary',
  templateUrl: './dial-beneficiary.component.html',
  styleUrls: ['./dial-beneficiary.component.css']
})
export class DialBeneficiaryComponent implements OnInit {
  currentLanguageSet: any;

  constructor(private czentrixServices: CzentrixServices, public httpServices: HttpServices) { }
  dialRes: any;
  resultsFound: boolean = false;

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

  dialBeneficiaryForm = new FormGroup({
    phoneNumber: new FormControl('', CustomValidators.phoneNumber)
  });

  dialBeneficiary() {

    let bodyString = this.dialBeneficiaryForm.value;
    let phoneNumber = parseInt(bodyString.phoneNumber);
    console.log("dialBeneficiary bodyString " + bodyString);
    this.czentrixServices.manualDialaNumber("4004", phoneNumber).subscribe(response => this.dialRes = this.successhandler(response));


  }
  func() {
    console.log("D");
  }
  successhandler(response) {
    return response;
  }

  findBenByPh() {
    this.resultsFound = true;
  }
}
