import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRoute, RouterStateSnapshot, CanDeactivate  } from '@angular/router';
import { dataService } from '../dataService/data.service';

@Injectable()
export class AuthGuard2 implements CanActivate {

  constructor(
    private router: Router,
    private route: ActivatedRoute, public dataSettingService: dataService) { }

  canActivate(route, state) {
   // console.log(route.params.service);

    //console.log(state);
    var key = sessionStorage.getItem("onCall");
    var key2  = sessionStorage.getItem("key");
    if(key == "yes" || sessionStorage.getItem('service') == 'Blood Request') {
      return true;;
    }

    else {
    	      alert("Please wait for call to come");

      return false;
    }
  }

  // canActivateChild() {

  // }

}

