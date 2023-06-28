/*
* Created by Pankush Manchanda 10 August,2017
*/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LoaderState } from './loader';
@Injectable()
export class SessionService {
    private loaderSubject = new Subject<LoaderState>();
    loaderState = this.loaderSubject.asObservable();
    constructor() { }
    show() {
        // this.loaderSubject.next(<LoaderState>{ valid: true });
    }
    hide() {
        // this.loaderSubject.next(<LoaderState>{ valid: false });
    }
}
