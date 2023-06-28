import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appMobileNumber]",
})
export class MyMobileNumberDirective {
  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    const regex = new RegExp(
      /^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};"`':'\\|,.<>\/? ]*$/
    );
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

@Directive({
  selector: "[appstrength]",
})
export class StrengthDirective {
  constructor(element: ElementRef) {
    // This is intentional
  }
  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    var regex = new RegExp(/^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
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
