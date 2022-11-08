import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceOrderService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order.service';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';
import {EmployeeService} from '../../../../../services/dto-services/employee/employee.service';
import { UsersService } from 'app/services/users/users.service';
import { TranslateService } from '@ngx-translate/core';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'maintenance-order-edit',
  templateUrl: './edit.component.html'
})
export class EditMaintenanceOrderComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input() actionType: any;
  maintenanceStatusList: any;
  operationList = [];
  actualStartDate: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  @Input('data') set zdata(data) {
    if (data) {
      const datamodel = JSON.parse(JSON.stringify(data));
      this.id = datamodel.maintenanceId;
      this.detailData = datamodel;
      this.assigntoMainObject(datamodel);
    }
  };
  maintenanceOrderTypes;
  maintenanceActivityTypes;

  modal = {
    active: false,
    type: null
  }
  activeTabIndex = 0;
  dataModel = {
    actualFinishDate: null,
    actualStartDate: null,
    maintenanceOrderId: null,
    address: null,
    assembly: null,
    dateBasicStart: null,
    datePriority: null,
    dateRevision: null,
    datebasicFinish: null,
    equipmentId: null,
    equipmentName: null,
    mainWorkStationId: null,
    mainWorkStationName: null,
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
    responseby: null
  };
  detailData;

  fromOutStandToProcess = false;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _translateSvc: TranslateService,
              private _userSvc: UsersService,
              private mStrategyService: MaintenanceOrderService,
              private enumService: EnumService) {

                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }

  }
  modalShow(type) {
    if (type === "FUNCTIONAL_LOCATION" && this.dataModel.maintenanceStatus === 'COMPLETED' && this.detailData.maintenanceFunctionalLocation) {
      return;
    }
    this.modal.active = true;
    this.modal.type = type;
  }

  ngOnInit() {
    this.enumService.getMaintenanceStatusEnum().then((res: any) => this.maintenanceStatusList = res);
    
    this.enumService.getMaintenanceOrderTypeEnum().then(result => this.maintenanceOrderTypes = result).catch(error => console.log(error));
    this.enumService.getMaintenanceActivityTypeEnum().then(result => this.maintenanceActivityTypes = result).catch(error => console.log(error));


    // this.initialize(this.id);
  }

  private initialize(id) {

    this.loaderService.showLoader();

    
    this.mStrategyService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        this.assigntoMainObject(result);

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  assigntoMainObject(result) {
    if (result) {
      if (result['equipment']) {
        this.dataModel.equipmentId = result['equipment'].equipmentId;
        this.dataModel.equipmentName = result['equipment'].equipmentName;
      }
      if (result['maintenanceId']) {
        this.dataModel.maintenanceOrderId = result['maintenanceId'];
      }
      if (result['address']) {
        this.dataModel.address = result['address'];
      }
      if (result['assembly']) {
        this.dataModel.assembly = result['assembly'];
      }
      if (result['dateBasicStart']) {
        this.dataModel.dateBasicStart = new Date(result['dateBasicStart']);
      }
      if (result['actualStartDate']) {
        this.dataModel.actualStartDate = new Date(result['actualStartDate']);
      } else {
        this.dataModel.actualStartDate = new Date(result['createDate']);
      }
      if (result['actualFinishDate']) {
        this.dataModel.actualFinishDate = new Date(result['actualFinishDate']);
      }
      if (result['datePriority']) {
        this.dataModel.datePriority = result['datePriority'];
      }
      if (result['dateRevision']) {
        this.dataModel.dateRevision = result['dateRevision'];
      }
      if (result['datebasicFinish']) {
        this.dataModel.datebasicFinish = new Date(result['datebasicFinish']);
      }
      if (result['problemDefination']) {
        this.dataModel.problemDefination = result['problemDefination'];
      }
      if (result['priority']) {
        this.dataModel.priority = result['priority'];
      }
      if (result['maintenanceStatus']) {
        this.dataModel.maintenanceStatus = result['maintenanceStatus'];
      }
      if (result['plannerGroup']) {
        this.dataModel.plannerGroupId = result['plannerGroup'].plannerGroupId;
      }
      if (result['maintenanceOrderType']) {
        this.dataModel.maintenanceOrderType = result['maintenanceOrderType'].maintenanceOrderType;
      }
      if (result['maintenanceActivityType']) {
        this.dataModel.maintenanceActivityType = result['maintenanceActivityType'].maintenanceActivityType;
      }
      if (result['maintenanceCategory']) {
        this.dataModel.maintenanceCategoryId = result['maintenanceCategory'].maintenanceCategoryId;
      }
      if (result['maintenanceFunctionalLocation']) {
        this.dataModel.maintenanceFunctionalLocationId = result['maintenanceFunctionalLocation'].maintenanceFunctionalLocationId;
      }
      if (result['maintenanceNotification']) {
        this.dataModel.maintenanceNotificationId = result['maintenanceNotification'].maintenanceNotificationId;
      }
      if (result['maintenanceReason']) {
        this.dataModel.maintenanceReasonId = result['maintenanceReason'].maintenanceReasonId;
      }
      if (result['responseby']) {
        this.dataModel.responseby = result['responseby'];
        this.dataModel.responsebyId = result['responseby'].employeeId;
      }
      if (result['maintenanceOrderOperationList']) {
        this.operationList = result['maintenanceOrderOperationList'];
      }
      if (result['maintenanceSystemCondition']) {
        this.dataModel.maintenanceSystemConditionId = result['maintenanceSystemCondition'].maintenanceSystemConditionId;
      }
      if (result['planningPlant']) {
        this.dataModel.planningPlantId = result['planningPlant'].plantId;
      }
      if (result['mainWorkStation']) {
        this.dataModel.mainWorkStationId = result['mainWorkStation'].workStationId;
        this.dataModel.mainWorkStationName = result['mainWorkStation'].workStationName;
      }
    }
  }

  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
      this.dataModel.equipmentName = equipment.equipmentName;
    } else {
      this.dataModel.equipmentId = null;
      this.dataModel.equipmentName = null;
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.dataModel.mainWorkStationId = event.workStationId;
      this.dataModel.mainWorkStationName = event.workStationName;
    } else {
      this.dataModel.mainWorkStationId = null;
      this.dataModel.mainWorkStationName = null;

    }
  }

  // setSelectedActivityType(event) {
  //   if (event) {
  //     this.dataModel.maintenanceActivityTypeId = event.maintenanceActivityTypeId;
  //     this.dataModel.maintenanceActivityTypeName = event.maintenanceActivityTypeName;

  //   } else {
  //     this.dataModel.maintenanceActivityTypeId = null;
  //     this.dataModel.maintenanceActivityTypeName = null;

  //   }
  // }
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

  setSelectedNotification(event, myModal) {
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
      myModal.hide();
    } else {
      this.dataModel.maintenanceNotificationId = null;
      myModal.hide();

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
    if (event !== 'null') {
      this.dataModel.responseby = event;
      this.dataModel.responsebyId = event.employeeId;
    } else {
      this.dataModel.responsebyId = null;
    }
  }

  save() {
    if (this.actionType === 'INPROCESS') {
      if (!this.dataModel.actualStartDate) {
        this.utilities.showWarningToast('please-select-actual-start-date');
        return ;
      }
      if (!this.dataModel.responsebyId) {
        this.utilities.showWarningToast('please-select-response-by');
        return ;
      }
      if (!this.operationList || !(this.operationList.length > 0)) {
        this.utilities.showWarningToast('operation-should-be-added');
        return ;
      }

      this.dataModel.maintenanceStatus = 'INPROCESS';
      this.loaderService.showLoader();
      this.mStrategyService.statusChange(this.dataModel)
        .then((res: any) => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('status-changed');
          // this.saveAction.emit('saved');
          setTimeout(() => {
          this.activeTabIndex = 1;
          }, environment.DELAY);
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });


    } else {

      if (this.dataModel.maintenanceStatus === 'INPROCESS' &&
          !this.dataModel.responsebyId) {
            this.utilities.showWarningToast('please-select-response-by');
            return ;
      }
      this.loaderService.showLoader();
      this.mStrategyService.save(this.dataModel)
        .then((result: any) => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('saved-success');
          setTimeout(() => {
          this.activeTabIndex = 1;
          }, environment.DELAY);
        })
        .catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
    }
  }

  statusChanged(event) {
    if ( event === 'INPROCESS') {
      this.fromOutStandToProcess = true;
      this.actualStartDate = this.dataModel.actualStartDate;
      this.dataModel.actualStartDate = new Date();
    } else {
      this.fromOutStandToProcess = false;
      this.dataModel.actualStartDate = this.actualStartDate;
    }
  }

  cancel() {
    this.dataModel = {
      actualFinishDate: null,
      actualStartDate: null,
      maintenanceOrderId: null,
      address: null,
      assembly: null,
      dateBasicStart: null,
      equipmentName: null,
      maintenanceActivityType: null,
      mainWorkStationName: null,
      datePriority: null,
      dateRevision: null,
      plannerGroup: null,
      datebasicFinish: null,
      equipmentId: null,
      mainWorkStationId: null,
      maintenanceCategoryId: null,
      maintenanceFunctionalLocationId: null,
      maintenanceNotificationId: null,
      maintenanceOrderType: null,
      maintenanceReasonId: null,
      maintenanceStatus: null,
      maintenanceSystemConditionId: null,
      plannerGroupId: null,
      planningPlantId: null,
      priority: null,
      problemDefination: null,
      responsebyId: null,
      responseby: null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
