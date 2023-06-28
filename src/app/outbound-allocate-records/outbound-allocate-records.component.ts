import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  DoCheck,
  OnChanges,
} from "@angular/core";
import { enableProdMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { FormGroup, FormControl } from "@angular/forms";
import { OutboundCallAllocationService } from "../services/outboundServices/outbound-call-allocation.service";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-outbound-allocate-records",
  templateUrl: "./outbound-allocate-records.component.html",
  styleUrls: ["./outbound-allocate-records.component.css"],
  //providers:[]
})
export class OutboundAllocateRecordsComponent
  implements OnInit, OnChanges, DoCheck
{
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  roles: Array<any> = [];
  selected_role: any;
  totalNewRecords: any;
  totalRecords: any;
  AllocateNoOfRecords: any;
  users: any;
  userID: any;
  savedRes: any;
  allocateNo: any;
  providerServiceMapID: number;
  @Input() outboundCallRequests: Array<any> = [];
  @Input() allocateRoleID: any;
  @Input() filterAgent: any = {};
  @Output() refreshScreen: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("allocateForm") allocateForm: NgForm;
  initialCount: number;
  maxCount: number;
  assignSelectedLanguageValue: any;

  constructor(
    private _OCAService: OutboundCallAllocationService,
    private saved_data: dataService,
    private message: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  outboundallocateform = new FormGroup({
    totalNewRecords: new FormControl(),
    userID: new FormControl(),
    AllocateNoOfRecords: new FormControl(),
  });

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.initialCount = this.outboundCallRequests.length;
    this.maxCount = this.initialCount;
  }

  ngOnChanges() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.initialCount = this.outboundCallRequests.length;
    this.allocateForm.form.patchValue({
      userID: [],
    });
    if (this.allocateRoleID) {
      this.roleChange(this.allocateRoleID);
    }
    if (Object.keys(this.filterAgent).length > 0) {
      this.roleChange(this.filterAgent.roleID);
    }
  }

  blockKey(e: any) {
    if (
      (e.keyCode > 47 && e.keyCode < 58) ||
      e.keyCode == 8 ||
      e.keyCode == 9
    ) {
      return true;
    } else {
      return false;
    }
  }

  validate(key, value) {
    var tempObj = {};
    if (value < 1 || value == 0) {
      tempObj[key] = undefined;
      this.allocateForm.form.patchValue(tempObj);
    } else if (value > this.maxCount) {
      tempObj[key] = this.maxCount;
      this.allocateForm.form.patchValue(tempObj);
    }
  }

  roleChange(roleID: any) {
    console.log("roleID", roleID);
    this._OCAService
      .getAgents(this.providerServiceMapID, roleID)
      .subscribe((response) => {
        this.users = response;
        //filtering agent for reallocation logic
        if (
          Object.keys(this.filterAgent).length > 0 &&
          this.filterAgent.roleID == roleID
        ) {
          this.users = this.users.filter((obj) => {
            return (
              obj.firstName + " " + obj.lastName != this.filterAgent.agentName
            );
          });
        }
        console.log("users: " + JSON.stringify(this.users));
      });
    this.allocateForm.form.patchValue({
      userID: [],
    });
  }

  onCreate(val: any) {
    // debugger;
    let outBoundCallReqIDArray = [];
    for (var i = 0; i < val.outboundCallRequests.length; i++) {
      outBoundCallReqIDArray.push({
        outboundCallReqID: val.outboundCallRequests[i].outboundCallReqID,
      });
    }

    let obj = {
      userID: val.userID,
      allocateNo: val.allocateNo,
      outboundCallRequests: outBoundCallReqIDArray,
    };
    console.log(obj);
    //	val.role = (Object.keys(this.filterAgent).length == 0) ? this.allocateRoleID : this.filterAgent.roleID;
    console.log("AllocateCallsToAgenta Request: " + JSON.stringify(val));
    this._OCAService.allocateCallsToAgenta(obj).subscribe(
      (response) => {
        console.log(
          "allocateCallsToAgenta response: " + JSON.stringify(response)
        );
        this.message.alert(this.assignSelectedLanguageValue.successfullyAllocatedCalls, "success");
        this.refreshScreen.emit();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  OnSelectChange() {
    console.log(this.allocateForm.value);
    if (
      this.allocateForm.value.userID[0] === "all" &&
      this.allocateForm.value.userID.length === 1
    ) {
      this.updateUserIDarray();
    } else if (
      this.allocateForm.value.userID[0] === "all" &&
      this.allocateForm.value.userID.length > 1 &&
      this.allocateForm.value.userID.length <= this.users.length + 1
    ) {
      this.updateUserIDarray();
    }

    var tempValue = Math.floor(
      this.outboundCallRequests.length /
        (this.allocateForm.value.userID.length != 0
          ? this.allocateForm.value.userID.length
          : 1)
    );
    this.allocateForm.form.patchValue({
      allocateNo: tempValue,
    });
    this.maxCount = tempValue;
  }

  switch: any = 0;
  updateUserIDarray() {
    if (this.switch == 0) {
      let all_userIDs = [];
      for (let i = 0; i < this.users.length; i++) {
        all_userIDs.push(this.users[i].userID);
      }
      this.allocateForm.form.patchValue({ userID: all_userIDs });
      this.switch = 1;
      console.log(this.allocateForm.value, "AFTER CHANGE1");
      // this.OnSelectChange();
    } else {
      this.allocateForm.form.patchValue({ userID: [] });
      this.switch = 0;
      console.log(this.allocateForm.value, "AFTER CHANGE2");
      // this.OnSelectChange();
    }
  }
  /*
   * JA354063 - Created on 23-07-2021
   */
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  /* Ends*/
}
