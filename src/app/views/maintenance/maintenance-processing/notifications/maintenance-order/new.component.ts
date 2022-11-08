import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceOrderService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { UsersService } from 'app/services/users/users.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'new-maintenance-order',
  templateUrl: './new.component.html'
})
export class MaintenanceNewOrderComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();

  dataModel = {
    maintenanceOrderId: null,
    actualStartDate: null,
    address: null, //
    assembly: null, //
    equipmentName: null,
    mainWorkStationName: null,
    dateBasicStart: null,
    actualFinishDate: null,
    datePriority: null, //
    dateRevision: null, //
    datebasicFinish: null,
    equipmentId: null, //
    maintenanceOrderTypeId: null, //
    maintenanceActivityTypeName: null,
    plannerGroupId: null, //
    plannerGroup: null,
    mainWorkStationId: null, //
    planningPlantId: null, //
    maintenanceSystemConditionId: null, //
    maintenanceActivityTypeId: null, //
    maintenanceCategoryId: null, //
    maintenanceFunctionalLocationId: null, //
    maintenanceNotificationId: null,
    maintenanceReasonId: null, //
    maintenanceStatus: 'OUTSTANDING', //
    priority: null, //
    problemDefination: null, //
    responsebyId: null, //
    responseby: null
  };

  selectedWorkstation: any;
  notificationPriorityList = [];
  selectedPlant: any;
  @Input('data') set setData (data) {
    if (data) {
      this.dataModel.equipmentId = data.equipment ? data.equipment.equipmentId : null;
      this.dataModel.mainWorkStationId = data.workStation ? data.workStation.workStationId : null;
      this.selectedWorkstation = data.workStation ? data.workStation : null;
      this.dataModel.planningPlantId = data.mainPlant ? data.mainPlant.plantId : null;
      this.dataModel.maintenanceFunctionalLocationId =
      data.maintenanceFunctionalLocation ? data.maintenanceFunctionalLocation.maintenanceFunctionalLocationId : null;
      this.dataModel.maintenanceNotificationId = data.maintenanceNotificationId;
      this.dataModel.plannerGroupId = data.equipmentPlannerGroup ? data.equipmentPlannerGroup.plannerGroupId : null;
      this.dataModel.plannerGroup = data.equipmentPlannerGroup ? data.equipmentPlannerGroup : null;
      this.dataModel.problemDefination = data.problemDefination;
      // this.dataModel.dateBasicStart = data.requiredStart ? new Date(data.requiredStart) : null;
      this.dataModel.datebasicFinish = data.requiredEnd ? new Date(data.requiredEnd) : null;
      if (data.breakdown) {
        this.dataModel.actualStartDate = data.malfunctionStart ? new Date(data.malfunctionStart) : null;
        this.dataModel.actualFinishDate = data.malfunctionEnd ? new Date(data.malfunctionEnd) : null;
      } else {
        this.dataModel.actualStartDate = data.requiredStart ? new Date(data.requiredStart) : null;
        this.dataModel.actualFinishDate = data.requiredEnd ? new Date(data.requiredEnd) : null;
      }
    }
  }
  modal = {
    active: false,
    type: null
  }

  activeTabIndex = 0;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private enumService: EnumService,
              private _translateSvc: TranslateService,
              private _userSvc: UsersService,
              private mStrategyService: MaintenanceOrderService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  // this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }

  }

  ngOnInit() {
    this.enumService.getMaintenanceNotificationPriorityEnum().then((res: any) => this.notificationPriorityList = res);
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

  setSelectedActivityType(event) {
    if (event) {
      this.dataModel.maintenanceActivityTypeId = event.maintenanceActivityTypeId;
      this.dataModel.maintenanceActivityTypeName = event.description;
    } else {
      this.dataModel.maintenanceActivityTypeId = null;

    }
  }

  setSelectedCategory(event) {
    if (event) {
      this.dataModel.maintenanceCategoryId = event.maintenanceCategoryId;
    } else {
      this.dataModel.maintenanceCategoryId = null;

    }
  }

  setSelectedFunctionalLocation(event) {
    if (event) {
      this.dataModel.maintenanceFunctionalLocationId = event.maintenanceFunctionalLocationId;
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

  setSelectedOrderType(event) {
    if (event) {
      this.dataModel.maintenanceOrderTypeId = event.maintenanceOrderTypeId;
      if (event.maintenanceOrderType === 'Break down') {
        this.dataModel.priority = 'VERY_HIGH';
        this.dataModel.datePriority = 'VERY_HIGH';
      } else {
        this.dataModel.priority = 'MEDIUM';
        this.dataModel.datePriority = 'MEDIUM';
      }
    } else {
      this.dataModel.maintenanceOrderTypeId = null;

    }
  }

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
      this.dataModel.responsebyId = event.employeeId;
      this.dataModel.responseby = event;
    } else {
      this.dataModel.responsebyId = null;
      this.dataModel.responseby = null;
    }
  }

  reset() {

    this.dataModel = {
      maintenanceOrderId: null,
      actualStartDate: null,
      address: null,
      responseby: null,
      assembly: null,
      dateBasicStart: null,
      mainWorkStationName: null,
      maintenanceActivityTypeName: null,
      equipmentName: null,
      datePriority: null,
      dateRevision: null,
      datebasicFinish: null,
      equipmentId: null,
      actualFinishDate: null,
      mainWorkStationId: null,
      maintenanceActivityTypeId: null,
      maintenanceCategoryId: null,
      maintenanceFunctionalLocationId: null,
      maintenanceNotificationId: null,
      maintenanceOrderTypeId: null,
      maintenanceReasonId: null,
      maintenanceStatus: null,
      maintenanceSystemConditionId: null,
      plannerGroupId: null,
      plannerGroup: null,
      planningPlantId: null,
      priority: null,
      problemDefination: null,
      responsebyId: null
    }
  }


  save() {
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.dataModel.maintenanceOrderId = result.maintenanceId;
          this.saveAction.next('saved');
          this.activeTabIndex = 1;
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
}
