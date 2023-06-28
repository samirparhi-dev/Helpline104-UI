import { Directive, forwardRef, HostListener } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
  selector: "[appMail]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MyEmailDirective),
      multi: true,
    },
  ],
})
export class MyEmailDirective implements Validator {
  pattern =
    /^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|in|co.in|ORG|COM|IN|CO.IN)\b$/;

  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } {
    const input = control.value;
    if (input === "" || input === null) {
      return null;
    }

    const flag = this.pattern.test(input);
    return flag
      ? null
      : {
          valid: false,
        };
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
