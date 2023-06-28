import { Injectable } from '@angular/core';

@Injectable()
export class SmartsearchService {
  //service_provider_array:any=[];
  tempArray: Array<any> = [];
  userEnteredWord: any = undefined;
  condition: any;
  constructor() { }

  selectKeyPress($event, arrayFromDB, keyName) {
    
    let firstWordMatchingStatus = 0;
    if ($event.keyCode !== 123)   // To elemenate '{' which key is 123 from the word
    {
      var char = String.fromCharCode($event.keyCode);
      if ($event.keyCode === 8)  // Back space key logic
      {
        if (this.userEnteredWord !== undefined) {
          this.userEnteredWord = this.userEnteredWord.slice(0, -1);
        }
      }
      else  // formation of a word from user entered keys
      {
        this.userEnteredWord === undefined ? this.userEnteredWord = char : this.userEnteredWord += char;
      }
      if (/[a-zA-Z]/.test(this.userEnteredWord) && (/[a-zA-Z]/.test(char) || $event.keyCode === 8)) // allowing only alphabets from keys
      {
        for (var i = 0; i < arrayFromDB.length; i++) {         
          if ( arrayFromDB[i][keyName].toLowerCase().startsWith(String(this.userEnteredWord.toLowerCase()))) {
            if (firstWordMatchingStatus === 0) {
              firstWordMatchingStatus++;
              this.tempArray = [];
            }
            this.tempArray.push(arrayFromDB[i]); // loading matched usernames
          }
        }
        if (firstWordMatchingStatus === 0) {
          this.userEnteredWord = undefined;
          this.tempArray = Object.assign([], arrayFromDB); // clearing user the user entered key and reloading the array from DB
        }
      }
      else if ($event.keyCode === 8) {
        this.tempArray = Object.assign([], arrayFromDB);
      }
    }
    return this.tempArray;
  }
}
