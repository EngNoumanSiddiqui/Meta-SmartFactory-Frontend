import { UtilitiesService } from "app/services/utilities.service";

import { PlantService } from "./../../services/dto-services/plant/plant.service";
import { UsersService } from "app/services/users/users.service";
import { Component, ViewChild, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth-service";
import { EditProfileComponent } from "../../views/profile/edit-profile/edit-profile.component";
import { ChangePasswordComponent } from "../../views/profile/change-password/change-password.component";
import { AppStateService } from "app/services/dto-services/app-state.service";

import { TranslateService } from "@ngx-translate/core";
import { ConfirmationService } from "primeng";
import { CompanyService } from "../../services/dto-services/company/company.service";
import { RoleAuthService } from "../../services/auth/role-auth.service";
import { OrganizationService } from "app/services/dto-services/organization/organization.service";
import { Utf8Service } from "../../services/utf8.service";
import { StockOrderSimulationService } from "app/services/dto-services/stock-order-simulation/stock-order-simulation.service";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.css"],
})
export class AppHeaderComponent implements OnInit {
  status: { isopen: boolean } = { isopen: false };
  user;
  selectedPlant: any = {
    plantId: null,
    plantName: null,
  };
  selectedOrganization = null;
  preSelectedPlant: any;
  companies = [];
  selectedPlantCompanyName: string;
  plantList: any;
  organizationList: any;
  @ViewChild(EditProfileComponent) editProfileComponent: EditProfileComponent;
  @ViewChild(ChangePasswordComponent)
  changePasswordComponent: ChangePasswordComponent;

  constructor(
    private _auth: AuthService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private plantSvc: PlantService,
    private organizationService: OrganizationService,
    private _userSvc: UsersService,
    private _stockSvc: StockOrderSimulationService,
    private utf8Service: Utf8Service,
    private _roleSvc: RoleAuthService
  ) {
    // this.getSelectPlant();
    // this.checkIfPlantAlreadySelected();
    this.setSelectedJoinPlant();
    this.user = this._auth.getUserData();
  }

  formatName(name: string): string {
    return this.utf8Service.utf8decode(name);
  }

  ngOnInit() {
    this.getAllPlants();
    // this.getCompanyDetails();
    // this.appStateService.$plantchanged.asObservable().subscribe(res => {
    //   if (res) {
    //     this.getAllPlants();
    //   }
    // });
  }

  // getCompanyDetails() {
  //   debounceTime(400);
  //   this._companySvc.getAllCompanies().then((res: any) => {
  //     this.companies = res;
  //     this.companies.forEach((value, index) => {
  //        if (index === 0) {
  //         this.selectedPlantCompanyName = value.companyName;
  //       }
  //     });
  //     this.selectedPlant = JSON.parse(this._userSvc.getPlant());
  //     if (this.selectedPlant && this.selectedPlant.company) {
  //       this.selectedPlantCompanyName = this.selectedPlant.company.companyName;
  //     }
  //   }).catch(err => console.error(err));
  // }

  getAllPlants() {
    this.plantSvc.getAllPlants().then((res: any) => {
      if (res) {
        this.appStateService.plantListSubscription$.next(res);
        this.plantList = res as [];
        if (this.plantList && this.plantList.length > 1) {
          // Mustafa wants it asc by plantId
          this.plantList = this.plantList.sort(
            (n1, n2) => n1.plantId - n2.plantId
          );
          //   this.plantList = this.plantList.sort((n1, n2) => {
          //     if (n1.plantName.toLowerCase() > n2.plantName.toLowerCase()) {
          //       return 1;
          //     } else {
          //       return -1;
          //     }
          //   });
        }

        if (this.user?.plant) {
          const plant = this.plantList.find(
            (itm) => this.user?.plant.plantId === itm.plantId
          );
          if (plant) {
            this.selectedPlant = plant;
            this._userSvc.setPlant(this.selectedPlant);
            this.appStateService.announceMission(this.selectedPlant);
            this.selectedPlantCompanyName =
              this.selectedPlant.company?.companyName;
          } else {
            this.selectedPlant = this.plantList[0];
            this._userSvc.setPlant(this.selectedPlant);
            this.appStateService.announceMission(this.selectedPlant);
            this.selectedPlantCompanyName =
              this.selectedPlant.company?.companyName;
          }
        } else if (this.selectedPlant) {
          const plant = this.plantList.find(
            (itm) => this.selectedPlant.plantId === itm.plantId
          );
          if (plant) {
            this.selectedPlant = plant;
            this._userSvc.setPlant(this.selectedPlant);
            this.appStateService.announceMission(this.selectedPlant);
            this.selectedPlantCompanyName =
              this.selectedPlant.company?.companyName;
          } else {
            this.selectedPlant = this.plantList[0];
            this._userSvc.setPlant(this.selectedPlant);
            this.appStateService.announceMission(this.selectedPlant);
            this.selectedPlantCompanyName =
              this.selectedPlant.company?.companyName;
          }
        } else {
          this.selectedPlant = this.plantList[0];
          this._userSvc.setPlant(this.selectedPlant);
          this.appStateService.announceMission(this.selectedPlant);
          this.selectedPlantCompanyName =
            this.selectedPlant.company?.companyName;
        }
        this.getAllOrganizations();
      }
    });
  }

  getAllOrganizations() {
    this.organizationService
      .getByPlant(this.selectedPlant.plantId)
      .then((organizations: any) => {
        this.organizationList = [...organizations];
        this.selectedOrganization = null;
        // if(this.selectedOrganization) {
        this.appStateService.announceOrganization(this.selectedOrganization);
        // }
      })
      .catch((err) => console.error(err));
  }

  toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  change(value: boolean): void {
    this.status.isopen = value;
  }

  showEditProfile() {
    this.editProfileComponent.initialize();
  }

  showChangePassword() {
    this.changePasswordComponent.showDialog();
  }

  setSelectedJoinPlant() {
    const setPlant = this._userSvc.getPlant();
    this.preSelectedPlant = JSON.parse(setPlant);
    if (this.preSelectedPlant) {
      this.selectedPlant = this.preSelectedPlant;
      this.selectedPlantCompanyName = this.selectedPlant.company?.companyName;
      // this.getAllOrganizations();
      // this.appStateService.announceMission(this.selectedPlant);
    } else {
      this.selectedPlant = null;
    }
  }

  getSelectPlant() {
    this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    console.log(this.selectedPlant);
    this.triggerSelectedPlant();
  }

  triggerSelectedPlant() {
    this.appStateService.announceMission(this.selectedPlant);
  }

  checkIfPlantAlreadySelected() {
    this.preSelectedPlant = this._userSvc.getPlant();
    if (this.preSelectedPlant) {
      this.setSelectedPlant(JSON.parse(this.preSelectedPlant));
      this.appStateService.announceMission(JSON.parse(this.preSelectedPlant));
    }
  }

  setSelectedPlant(event: any) {
    if (event) {
      this.selectedPlant = JSON.parse(this._userSvc.getPlant());
      if (this.selectedPlant) {
        if (JSON.stringify(this.selectedPlant) !== JSON.stringify(event)) {
          this._confirmationSvc.confirm({
            message: this._translateSvc.instant(
              "do-you-want-to-change-the-plant"
            ),
            header: this._translateSvc.instant("change-confirmation"),
            icon: "",
            accept: () => {
              this.selectedPlant = event;
              this._userSvc.setPlant(event);
              this.appStateService.announceMission(event);
              this.selectedPlantCompanyName = event.company?.companyName;
              this.getAllOrganizations();
              this._stockSvc.plantUpdate();
            },
            reject: () => {
              this.checkIfPlantAlreadySelected();
              this.utilities.showInfoToast("cancelled-operation");

              // this._userSvc.setPlant(null);
              // this.selectedPlant.plantId = null;
              // this.selectedPlant.plantName = null;
              // this.setSelectedPlant(null);
              // this.appStateService.announceMission(null);
            },
          });
        }
      } else {
        // this._confirmationSvc.confirm({
        //   message: this._translateSvc.instant('do-you-want-to-change-the-plant'),
        //   header: this._translateSvc.instant('change-confirmation'),
        //   icon: '',
        //   accept: () => {
        this._userSvc.setPlant(event);
        this.appStateService.announceMission(event);
        this.selectedPlantCompanyName = event.company?.companyName;
        this.getAllOrganizations();
        //   },
        //   reject: () => {
        //     this.checkIfPlantAlreadySelected();
        //     this.utilities.showInfoToast('cancelled-operation');

        //     // this._userSvc.setPlant(null);
        //     // this.selectedPlant.plantId = null;
        //     // this.selectedPlant.plantName = null;
        //     // this.setSelectedPlant(null);
        //     // this.appStateService.announceMission(null);
        //   }
        // });
      }
    } else {
      this._userSvc.removePlant();
      this.selectedPlantCompanyName = "";
      this.appStateService.announceMission(null);
    }
  }

  setOrganization(event: any) {
    if (event) {
      this.selectedOrganization = event;
      this.appStateService.announceOrganization(event);
    } else {
      this.selectedOrganization = null;
      this.appStateService.announceOrganization(this.selectedOrganization);
    }
  }

  hasPlantSelectPermission() {
    return this._roleSvc.isAuthorized("ROLE_PLANT_SELECTION");
  }
}
