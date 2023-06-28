import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-view-disease-summary-contents',
  templateUrl: './view-disease-summary-contents.component.html',
  styleUrls: ['./view-disease-summary-contents.component.css']
})
export class ViewDiseaseSummaryContentsComponent implements OnInit {

  showData: any = [];
  currentLanguageSet: any;
  constructor(@Inject(MD_DIALOG_DATA) public input: any,
    private dialogRef: MdDialogRef<ViewDiseaseSummaryContentsComponent>,
    private confirmationDialogsService: ConfirmationDialogsService,
    public HttpServices: HttpServices) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    console.log(this.input, "this.input");
    this.showContents(this.input);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  showContents(inputData) {
    this.showData = inputData.summaryDetails;
  }
  remove(data) {
    this.confirmationDialogsService.confirm('info', this.currentLanguageSet.areYouSureWantToRemove).subscribe((res) => {
      if (res) {
        const index = this.input.summaryDetails.indexOf(data);
        if (index >= 0) {
          this.input.summaryDetails.splice(index, 1);
        }
        if (this.input.summaryDetails.length == 0) {
          this.closeDialog();
        }

      }
    })
  }
  closeDialog() {
    this.dialogRef.close(this.input.summaryDetails);
  }
}
