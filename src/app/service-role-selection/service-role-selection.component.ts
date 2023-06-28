import { Component, OnInit, Output, EventEmitter, DoCheck } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { Router } from "@angular/router";
import { ListnerService } from "./../services/common/listner.service";
declare var jQuery: any;
import { SocketService } from "../services/socketService/socket.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";

@Component({
  selector: "app-service-role-selection",
  templateUrl: "./service-role-selection.component.html",
  styleUrls: ["./service-role-selection.component.css"],
})
export class ServiceRoleSelectionComponent implements OnInit, DoCheck {
  @Output() currentServiceOnload: EventEmitter<any> = new EventEmitter<any>();
  assignSelectedLanguageValue: any;

  constructor(
    public getCommonData: dataService,
    public router: Router,
    private listnerService: ListnerService,
    private httpServices: HttpServices
  ) {}
  privleges: any;
  //privlegesDisp: any;
  hasHAOPrivilege: boolean = false;
  hasROPrivilege: boolean = false;

  ngOnInit() {
    this.assignSelectedLanguage();
    this.listnerService.cZentrixSendData({ hideBar: true });
    this.getCommonData.sendHeaderStatus.next("Role Selection");

    this.onLoad();
    this.privleges = this.getCommonData.userPriveliges;
    console.log(this.privleges, "$$$$$");
    console.log("privleges:" + JSON.stringify(this.privleges));

    // this.router.navigate( [ '/MultiRoleScreenComponent', { outlets: { 'postLogin_router': [ '' ] } }] );
    //console.log(this.privleges[0].roles[2].serviceRoleScreenMappings[0].providerServiceMapping.stateID,"PRIVELEGES");
    this.checkROHAOPrivilege();
    //this.loadPrivlegesDisplay()
  }

  /*	loadPrivlegesDisplay()
		{
	   this.privlegesDisp = this.privleges;
	   if(this.hasHAOPrivilege)
	   {
		  for (let i = 0; i < this.privlegesDisp.length; i++) {
				if (this.privlegesDisp[i].serviceName == '104') {
					for (let j = 0; j < this.privlegesDisp[i].roles.length; j++) {					
	
					for(let k=0;this.privlegesDisp[i].roles[j].serviceRoleScreenMappings.length; k++)
					{
	
					if(this.privlegesDisp[i].roles[j].serviceRoleScreenMappings[k].screen.screenName == "Registration")
					{
					 this.privlegesDisp[i].roles.splice(j, 1);
					 console.log(' RO removed ');
					}
					    
					}
	
	
					}
				}
			} 
	   }
	
		} */

  checkROHAOPrivilege() {
    for (let i = 0; i < this.privleges.length; i++) {
      if (this.privleges[i].serviceName == "104") {
        for (let j = 0; j < this.privleges[i].roles.length; j++) {
          for (
            let k = 0;
            k < this.privleges[i].roles[j].serviceRoleScreenMappings.length;
            k++
          ) {
            if (
              this.privleges[i].roles[j].serviceRoleScreenMappings[k].screen
                .screenName == "Registration"
            ) {
              console.log("Agent has RO privilege");
              this.hasROPrivilege = true;
            } else if (
              this.privleges[i].roles[j].serviceRoleScreenMappings[k].screen
                .screenName == "Health_Advice"
            ) {
              console.log("Agent has HAO privilege");
              this.hasHAOPrivilege = true;
            }
          }
        }
      }
    }
  }

  route2dashboard(role, service) {
    sessionStorage.setItem("apiman_key", service.apimanClientKey);
    this.getCommonData.current_serviceID =
      role.serviceRoleScreenMappings[0].providerServiceMapping.m_ServiceMaster.serviceID;

    let current_feature = this.getSelectedFeature(role);
    this.getScreens(role);

    let roleName = role.RoleName;
    let serviceName = service.serviceName;

    //socket code start

    // this.socketService.getDebugMessage().subscribe((data)=>{
    //   console.log("Received", data.message);
    // })
    let providerServiceMapID = service.providerServiceMapID;
    let finalArray = [
      providerServiceMapID + "_" + roleName,
      providerServiceMapID + "_" + roleName + "_" + role.workingLocationID,
      providerServiceMapID + "_" + role.workingLocationID.toString(),
    ];
    console.log(finalArray);
    // this.socketService.sendRoomsArray({ userId: this.getCommonData.uid , role: finalArray });

    //end of socket code

    this.getCommonData.current_roleName = roleName;
    this.getCommonData.current_workingLocationID = role.workingLocationID;
    let obj = {
      service: service,
      role: roleName,
    };
    if (
      serviceName === "104" &&
      (current_feature === "Registration" ||
        current_feature === "Health_Advice" ||
        current_feature === "Directory Information Service" ||
        current_feature === "Counselling" ||
        current_feature === "Medical_Advice" ||
        current_feature === "Service_Improvements" ||
        current_feature === "Supervising" ||
        current_feature === "Surveyor" ||
        current_feature === "Psychiatrist")
    ) {
      this.getCommonData.current_roleID = role.RoleID;
      this.getCommonData.current_service = service;
      // this is to hide the c-zentrix bar on selection of supervisor
      if (roleName.toLowerCase().trim() === "supervisor") {
        this.listnerService.cZentrixSendData({ hideBar: true });
      } else {
        this.listnerService.cZentrixSendData({
          hideBar: false,
          agentId: role.agentID,
        });
      }
      // if (role.agentID)
      // 	this.getCommonData.agentID = role.agentID;

      // this.getCommonData.roleSelected.next({
      // 	'role': this.getCommonData.current_role,
      // 	'service': service.serviceName
      // })

      this.getCommonData.agentID = role.agentID
        ? role.agentID
        : this.getCommonData.Userdata.agentID
        ? this.getCommonData.Userdata.agentID
        : undefined;
      this.getCommonData.roleSelected.next({
        id: this.getCommonData.agentID,
        role: role.RoleName,
        service: service.serviceName,
      });

      //this.getCommonData.current_service =  serviceName;

      /*this is used to store the current stateID , based on the role selection*/
      this.getCommonData.current_stateID_based_on_role =
        role.serviceRoleScreenMappings[0].providerServiceMapping.stateID;
      this.getCommonData.service_providerID =
        role.serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID;
      console.log(
        "service_providerID: " + this.getCommonData.service_providerID
      );

      console.log("RoleID: " + role.RoleID);
      jQuery("#db_label").show();
      this.router.navigate(["/MultiRoleScreenComponent/dashboard"]);
    }
    if (role === "ADMIN") {
      this.router.navigate(["/MultiRoleScreenComponent/superAdmin"]);
    }
    this.currentServiceOnload.emit(obj);
  }

  getSelectedFeature(role) {
    console.log("Selected Role:" + JSON.stringify(role));

    let current_feature: string = "";
    let current_role = "";

    for (let i = 0; i < role.serviceRoleScreenMappings.length; i++) {
      current_feature = role.serviceRoleScreenMappings[i].screen.screenName;

      if (
        this.hasHAOPrivilege &&
        this.hasROPrivilege &&
        current_feature === "Health_Advice"
      )
        current_feature = "Registration";

      console.log("current_feature:" + current_feature);

      this.getCommonData.current_feature = current_feature;

      if (current_feature == "Registration") {
        current_role = "RO";
        break;
      } else if (current_feature == "Health_Advice") {
        current_role = "HAO";
        break;
      } else if (current_feature == "Counselling") {
        current_role = "CO";
        break;
      } else if (current_feature == "Medical_Advice") {
        current_role = "MO";
        break;
      } else if (current_feature == "Service_Improvements") {
        current_role = "SIO";
        break;
      }
      // else if (current_feature == "Auditing")
      // {
      // 	current_role = "Auditor";
      // 	break;
      // }
      else if (current_feature == "Supervising") {
        current_role = "Supervisor";
        break;
      } else if (current_feature == "Surveyor") {
        current_role = "Surveyor";
        break;
      } else if (current_feature == "Psychiatrist") {
        current_role = "PD";
        break;
      }
    }

    this.getCommonData.current_role = current_role;

    return current_feature;
  }

  getScreens(role) {
    let screens = [];
    for (let i = 0; i < role.serviceRoleScreenMappings.length; i++) {
      screens.push(role.serviceRoleScreenMappings[i].screen.screenName);
    }

    console.log("screens: " + JSON.stringify(screens));

    this.getCommonData.screens = screens;
  }

  onLoad() {
    jQuery(document).ready(function (ev) {
      var toggle = jQuery("#ss_toggle");
      var menu = jQuery("#ss_menu");
      var rot;

      jQuery("#ss_toggle").on("click", function (ev) {
        rot = parseInt(jQuery(this).data("rot")) - 180;
        menu.css("transform", "rotate(" + rot + "deg)");
        menu.css("webkitTransform", "rotate(" + rot + "deg)");
        if ((rot / 180) % 2 == 0) {
          //Moving in
          toggle.parent().addClass("ss_active");
          toggle.addClass("close");
        } else {
          //Moving Out
          toggle.parent().removeClass("ss_active");
          toggle.removeClass("close");
        }
        jQuery(this).data("rot", rot);
      });

      menu.on("transitionend webkitTransitionEnd oTransitionEnd", function () {
        if ((rot / 180) % 2 == 0) {
          jQuery("#ss_menu div i").addClass("ss_animate");
        } else {
          jQuery("#ss_menu div i").removeClass("ss_animate");
        }
      });

      jQuery('[data-toggle="tooltip"]').tooltip();
    });
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
