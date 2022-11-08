import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { UtilitiesService } from '../../../../../services/utilities.service';
import { MaintenanceOrderService } from '../../../../../services/dto-services/maintenance-equipment/maintenance-order.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'maintenance-order-new',
  templateUrl: './new.component.html'
})
export class NewMaintenanceOrderComponent implements OnInit, OnDestroy {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    maintenanceOrderId: null,
    actualStartDate: null,
    address: null, //
    assembly: null, //
    equipmentName: null,
    mainWorkStationName: null,
    dateBasicStart: null,
    datePriority: null, //
    dateRevision: null, //
    datebasicFinish: null,
    equipmentId: null, //
    maintenanceOrderType: null,
    plannerGroupId: null, //
    plannerGroup: null,
    mainWorkStationId: null, //
    planningPlantId: null, //
    maintenanceSystemConditionId: null, //
    maintenanceActivityType: null, //
    maintenanceCategoryId: null, //
    maintenanceFunctionalLocationId: null, //
    maintenanceNotificationId: null,
    maintenanceReasonId: null, //
    maintenanceStatus: 'OUTSTANDING', //
    priority: null, //
    problemDefination: null, //
    responsebyId: null, //
    responseby: null,
    description: null
  };

  modal = {
    active: false,
    type: null
  }
  activeTabIndex = 0;
  sub: Subscription;
  selectedPlant: any;
  maintenanceOrderTypes;
  maintenanceActivityTypes;

  constructor(private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _enumSvc: EnumService,
    private _userSvc: UsersService,
    private _translateSvc: TranslateService,
    private mStrategyService: MaintenanceOrderService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.planningPlantId = this.selectedPlant.plantId;
    }
    this.dataModel.maintenanceOrderType = 'UNPLANNED';
    this.dataModel.priority = 'MEDIUM';
    this.dataModel.datePriority = 'MEDIUM';
  }

  ngOnInit() {
    // this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
    //   if ((res) && res.plantId) {
    //     this.dataModel.planningPlantId = res.plantId;
    //   } else {
    //     this.dataModel.planningPlantId = null;
    //   }
    // });

    this._enumSvc.getMaintenanceOrderTypeEnum().then(result => this.maintenanceOrderTypes = result).catch(error => console.log(error));
    this._enumSvc.getMaintenanceActivityTypeEnum().then(result => this.maintenanceActivityTypes = result).catch(error => console.log(error));
  }

  modalShow(type) {
    this.modal.active = true;
    this.modal.type = type;
  }

  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
      this.dataModel.equipmentName = equipment.equipmentName;
      this.dataModel.mainWorkStationId = equipment.maintenanceWorkstation ? equipment.maintenanceWorkstation.workStationId : null;
      // this.dataModel.plannerGroup = equipment.equipmentPlannerGroup;
      // this.dataModel.plannerGroupId = equipment.equipmentPlannerGroup ? equipment.equipmentPlannerGroup.plannerGroupId : null;
    } else {
      this.dataModel.equipmentId = null;
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.dataModel.mainWorkStationId = event.workStationId;
      this.dataModel.mainWorkStationName = event.workStationName;
    } else {
      this.dataModel.mainWorkStationId = null;

    }
  }

  // setSelectedActivityType(event) {
  //   if (event) {
  //     this.dataModel.maintenanceActivityTypeId = event.maintenanceActivityTypeId;
  //     this.dataModel.maintenanceActivityTypeName = event.description;
  //   } else {
  //     this.dataModel.maintenanceActivityTypeId = null;

  //   }
  // }

  setSelectedCategory(event) {
    if (event) {
      this.dataModel.maintenanceCategoryId = event.maintenanceCategoryId;
      this.dataModel.description = event.description;
    } else {
      this.dataModel.maintenanceCategoryId = null;

    }
  }

  setSelectedFunctionalLocation(event) {
    if (event) {
      this.dataModel.maintenanceFunctionalLocationId = event.maintenanceFunctionalLocationId;
      this.dataModel.description = event.description;
    } else {
      this.dataModel.maintenanceFunctionalLocationId = null;

    }
  }

  setSelectedNotification(event, mymodal) {
    if (event) {
      if (!event.equipment) {
        this.utilities.showWarningToast(this._translateSvc.instant('notification-has-not-equipment'),
          this._translateSvc.instant('choose-another'));
        return 0;
      }
      if (!event.plannerGroup) {
        this.utilities.showWarningToast(this._translateSvc.instant('notification-has-not-planner-group'),
          this._translateSvc.instant('choose-another'));
        return 0;
      }
      this.dataModel.maintenanceNotificationId = event.maintenanceNotificationId;
      this.dataModel.equipmentId = event.equipment ? event.equipment.equipmentId : null;
      this.dataModel.equipmentName = event.equipment ? event.equipment.equipmentName : null;
      this.dataModel.maintenanceFunctionalLocationId = event.maintenanceFunctionalLocation ? event.maintenanceFunctionalLocation.maintenanceFunctionalLocationId : null;
      this.dataModel.plannerGroup = event.equipmentPlannerGroup ? event.equipmentPlannerGroup : null;
      this.dataModel.problemDefination = event.problemDefination;
      this.dataModel.mainWorkStationId = event.workStation ? event.workStation.workStationId : null;
      this.dataModel.mainWorkStationName = event.workStation ? event.workStation.workStationName : null;
      this.dataModel.priority = event.priority;
      this.dataModel.datePriority = event.priority;
      this.dataModel.plannerGroupId = event.equipmentPlannerGroup ? event.equipmentPlannerGroup.plannerGroupId : null;
      mymodal.hide();
    } else {
      this.dataModel.maintenanceNotificationId = null;
      mymodal.hide();

    }
  }

  // setSelectedOrderType(event) {
  //   if (event) {
  //     this.dataModel.maintenanceOrderTypeId = event.maintenanceOrderTypeId;
  //     if (event.maintenanceOrderType === 'Break down') {
  //       this.dataModel.priority = 'VERY_HIGH';
  //       this.dataModel.datePriority = 'VERY_HIGH';
  //     } else {
  //       this.dataModel.priority = 'MEDIUM';
  //       this.dataModel.datePriority = 'MEDIUM';
  //     }
  //   } else {
  //     this.dataModel.maintenanceOrderTypeId = null;

  //   }
  // }

  setSelectedReason(event) {
    if (event) {
      this.dataModel.maintenanceReasonId = event.maintenanceReasonId;
    } else {
      this.dataModel.maintenanceReasonId = null;

    }
  }

  setSelectedSystemCondition(event) {
    if (event) {
      this.dataModel.maintenanceSystemConditionId = event.maintenanceSystemConditionId;
    } else {
      this.dataModel.maintenanceSystemConditionId = null;

    }
  }

  setSelectedPlannerGroup(event) {
    if (event) {
      this.dataModel.plannerGroupId = event.plannerGroupId;
    } else {
      this.dataModel.plannerGroupId = null;

    }
  }


  setSelectedPlanningPlant(plant) {
    if (plant) {
      this.dataModel.planningPlantId = plant.plantId;
    } else {
      this.dataModel.planningPlantId = null;
    }
  }

  setSelectedEmployee(event) {
    if (event) {
      this.dataModel.responseby = event;
      this.dataModel.responsebyId = event.employeeId;
    } else {
      this.dataModel.responsebyId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    // this.dataModel.actualStartDate = new Date().toISOString();
    this.mStrategyService.save(this.dataModel)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        // this.saveAction.emit('saved');
        setTimeout(() => {
          this.dataModel.maintenanceOrderId = result.maintenanceId;
          this.activeTabIndex = 1;
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      maintenanceOrderId: null,
      actualStartDate: null,
      address: null,
      assembly: null,
      dateBasicStart: null,
      mainWorkStationName: null,
      equipmentName: null,
      datePriority: null,
      dateRevision: null,
      datebasicFinish: null,
      equipmentId: null,
      mainWorkStationId: null,
      maintenanceActivityType: null,
      maintenanceCategoryId: null,
      maintenanceFunctionalLocationId: null,
      maintenanceNotificationId: null,
      maintenanceOrderType: null,
      maintenanceReasonId: null,
      maintenanceStatus: null,
      maintenanceSystemConditionId: null,
      plannerGroupId: null,
      plannerGroup: null,
      planningPlantId: null,
      priority: null,
      problemDefination: null,
      responsebyId: null,
      responseby: null,
      description: null
    }
  }

  ngOnDestroy(): void {
    // this.saveAction.emit('close');
  }
}
