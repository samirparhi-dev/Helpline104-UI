import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRoute,
  ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { dataService } from '../dataService/data.service';
import { Http, Response } from '@angular/http';
import { InterceptedHttp } from './../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { AuthService } from './../../services/authentication/auth.service';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthGuard implements CanActivate {
  _baseURL = this._config.getCommonBaseURL();
  _authorisedUser = this._baseURL + 'user/getLoginResponse';
  _deleteToken = this._baseURL + 'user/userLogout';
  constructor(
    private router: Router, private _config: ConfigService,
    private route: ActivatedRoute, public dataSettingService: dataService, private _http: InterceptedHttp
    , private authService: AuthService) { }

  canActivate(route, state) {
    const key = sessionStorage.getItem('onCall');
    const authkey = sessionStorage.getItem('authToken');

    // if (authkey) {
    //   return this._http.post(this._authorisedUser, {})
    //     .toPromise()
    //     .then(response => {
    //       if (response) {
    //         this.dataSettingService.Userdata = response.json().data;
    //         this.dataSettingService.userPriveliges = response.json().data.previlegeObj;
    //         this.dataSettingService.uid = response.json().data.userID;
    //         // this.dataSettingService.agentID = response.json().data.agentID;
    //         this.dataSettingService.service_providerID =
    //           response.json().data.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID;
    //         this.dataSettingService.providerID =
    //           response.json().data.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID; //17nov
    //         this.dataSettingService.uname = response.json().data.userID;
    //       }
    //       return true;
    //     }).catch(response => {
    //       this._http.post(this._deleteToken, {})
    //         .toPromise()
    //         .then(res => {
    //           this.authService.removeToken();
    //           this.router.navigate(['']);
    //         });
    //       return false;
    //     });
    // }
    if (authkey) {
      if (key === 'yes') {
        alert('You are not allowed to go back');
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  // canActivateChild() {

  // }

}

@Injectable()
export class SaveFormsGuard implements CanDeactivate<dataService> {

  canDeactivate() {
    var key = sessionStorage.getItem('onCall');
    if (key == 'yes') {
      //alert("You are not allowed to go back");
      return true;
    }
    else {
      return false;
    }
  }

}
