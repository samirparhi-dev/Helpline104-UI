import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OutboundListnerService {
    private subjectOut = new Subject<any>();

    sendingBenID(data: any) {
        this.subjectOut.next({ benID: data });
    }
    clearData() {
        this.subjectOut.next();
    }
    receivingBenID(): Observable<any> {
        return this.subjectOut.asObservable();
    }

    inOutCampaign = new Subject();
    onCall = new Subject();
}
