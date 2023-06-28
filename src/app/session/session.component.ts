import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SessionService } from './../services/common/session.service';
import { LoaderState } from './../services/common/loader';
import { Router } from '@angular/router';
@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  private subscription: Subscription;
  constructor(private loaderService: SessionService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        if (!state.show) {
          this.router.navigate(['']);
        }
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
