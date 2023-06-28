import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appMobileNumberWithCopyPaste]",
})
export class MyMobileNumberDirectiveWithCopyPaste {
  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    const regex = new RegExp(
      /^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};"`':'\\|,.<>\/? ]*$/
    );
    const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  @HostListener("paste", ["$event"]) blockPaste(ev: any,event: KeyboardEvent) {
    let clipboardData =(ev !=undefined) ? ev.clipboardData : undefined;
    let pastedText = (clipboardData !=undefined) ? (clipboardData.getData('text')) : undefined;
    const regex = new RegExp(
        /^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};"`':'\\|,.<>\/? ]*$/
      );
     // const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
      let flag=false;
      if(pastedText !=null && pastedText != undefined && pastedText.length >0)
      {
        Array.from(pastedText).forEach(element => {
            console.log(element);
            if (element !=null && element !=undefined && regex.test(element.toString())) {
                flag=true;
              }
        });
      }
      if(flag)
      ev.preventDefault();
     
  }

//   @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
//     console.log("copy");
//     // const regex = new RegExp(
//     //     /^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};"`':'\\|,.<>\/? ]*$/
//     //   );
//     //   const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
//     //   if (regex.test(key)) {
//     //     event.preventDefault();
//     //   }
//   }

//   @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
//     event.preventDefault();
//   }
}

// @Directive({
//   selector: "[appstrength]",
// })
// export class StrengthDirective {
//   constructor(element: ElementRef) {
//     // This is intentional
//   }
//   @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
//     var regex = new RegExp(/^[a-zA-Z~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
//     var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
//     if (regex.test(key)) {
//       ev.preventDefault();
//     }
//   }
//   @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
//     event.preventDefault();
//   }

//   @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
//     event.preventDefault();
//   }

//   @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
//     event.preventDefault();
//   }
// }
