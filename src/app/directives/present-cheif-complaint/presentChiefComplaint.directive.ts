import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[presentChiefComplaintValidator]",
})
/* 
created by KA40094929
this directive allows [0-9a-zA-Z.,/()" ]
applicable only for CO
*/
export class PresentChiefComplaintDirective {
  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    const regex = new RegExp(/^[~!@#$%^&*_+\-=\[\]{};`:'\\|<>\?]*$/);
    const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
    event.preventDefault();
  }
 }
