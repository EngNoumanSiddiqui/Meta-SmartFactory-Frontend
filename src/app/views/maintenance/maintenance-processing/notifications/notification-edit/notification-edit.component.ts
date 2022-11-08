import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {NotificationsService} from '../../../../../services/dto-services/maintenance/notifications.service';
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {EquipmentAbcIndicatorService} from '../../../../../services/dto-services/maintenance-equipment/abc-indicator.service';

import {NotificationRequestDto} from '../../../../../dto/maintenance/notification.dto';
import {environment} from '../../../../../../environments/environment';
import {EmployeeService} from '../../../../../services/dto-services/employee/employee.service';
import { UsersService } from 'app/services/users/users.service';
import { EquipmentCodeGroupHeaderService } from 'app/services/dto-services/maintenance-equipment/code-group-header.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'notification-edit',
  templateUrl: './notification-edit.component.html',
  styleUrls: ['./notification-edit.component.scss'],
  providers: [DatePipe]
})
export class NotificationEditComponent implements OnInit {


  @Output() saveAction = new EventEmitter<any>();
  id;   // porder id
  @Input() actionType;
  selectedPlant: any;
  maintenanceStatusList = [];
  catalogs = [];
  showCreateOrderModalClicked =  false;
  @Input('inputData') set z(inputData) {
    if (inputData) {
      this.id = inputData.maintenanceNotificationId;
      this.initialize(inputData);
    }
  };

  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };

  detailData;

  modal = {active: false};
  dataModel: any = {};
  notificationTypes: any[];
  notificationType: any;
  functionalLocations: any[];
  equipmentList: any[];
  workstations: any[];
  selectedWorkstation;
  plannerGroup: any[];
  abcIndicators: any[];
  plantList: any;
  employeeList: any;
  maintenanceNotificationTypes;
  editSenarioForOrder = false;
  priority = [
    {value: 'VERY_HIGH', label: 'VERY HIGH'},
    {value: 'HIGH', label: 'HIGH'},
    {value: 'MEDIUM', label: 'MEDIUM'},
    {value: 'LOW', label: 'LOW'},
  ];

  constructor(
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private notificationServie: NotificationsService,
              private functionalLocationService: FunctionalLocationService,
              private enumService: EnumService,
              private abcIndicatorService: EquipmentAbcIndicatorService,
              private equipmentCodeGroupService: EquipmentCodeGroupHeaderService,
              private _userSvc: UsersService,
              private employeeService: EmployeeService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.mainPlantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    this.getFunctionalLocation();

    this.getAbcIndicator();
    this.getCatalogs();
    this.enumService.getMaintenanceOrderNotificationTypeEnum().then(result => this.maintenanceNotificationTypes = result).catch(error => console.log(error));
    this.enumService.getMaintenanceStatusEnum().then((res: any) =>  {
      this.maintenanceStatusList = res;
      this.arrayitemmove(this.maintenanceStatusList, 5, 2);
    });

  }

  arrayitemmove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }


  getFunctionalLocation() {
    this.functionalLocationService.filterShared({pageSize: 100000, pageNumber: 1, planningPlantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.functionalLocations = r['content'];
      }).catch();
  }

  getCatalogs() {
    this.equipmentCodeGroupService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.catalogs = r['content'];
      }).catch();
  }


  getAbcIndicator() {
    this.abcIndicatorService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.abcIndicators = r['content'];
      }).catch();
  }


  setSelectedPlant(event) {
    if (event) {
      this.dataModel.mainPlantId = event.plantId;
      // if ( !this.seletedPlant) {
      //   this.seletedPlant = event;
      // }
    }
  }

  setSelectedEquipment(event) {
    if (event) {
      this.dataModel.equipmentId = event.equipmentId;
      // this.dataModel.workStationId = event.maintenanceWorkstation ? event.maintenanceWorkstation.workStationId : null;
      this.dataModel.equipmentPlannerGroupId = event.equipmentPlannerGroup ? event.equipmentPlannerGroup.plannerGroupId : this.dataModel.equipmentPlannerGroupId;
      this.dataModel.equipmentPlannerGroup = event.equipmentPlannerGroup ? event.equipmentPlannerGroup : this.dataModel.equipmentPlannerGroup;
    } else {
      this.dataModel.equipmentId = null;
    }
  }
  // setSelectedNotificationType(event) {
  //   if (event) {
  //     this.dataModel.maintenanceNotificationTypeId = event.maintenanceNotificationTypeId;
  //   } else {
  //     this.dataModel.maintenanceNotificationTypeId = null;
  //     this.notificationType = null;
  //   }
  // }
  private initialize(inputData) {
    this.loaderService.showLoader();
    if (inputData) {
      this.detailData = inputData;
      this.dataModel.maintenanceNotificationId = inputData.maintenanceNotificationId;
      this.dataModel.notificationNo = inputData['notificationNo'];
      this.dataModel.problemDefination = inputData['problemDefination'];
      this.dataModel.requiredStart = inputData['requiredStart'] ? new Date(inputData['requiredStart']) : null;
      this.dataModel.requiredEnd = inputData['requiredEnd'] ? new Date(inputData['requiredEnd']) : null;
      this.dataModel.notificationStatus = inputData['notificationStatus'];
      this.dataModel.priority = inputData['priority'];
      this.dataModel.maintenanceNotificationType= inputData['maintenanceNotificationType'] || null;
      if (inputData['malfunctionStart']) {
        this.dataModel.malfunctionStart = new Date(inputData['malfunctionStart']);
      } if (inputData['malfunctionEnd']) {
        this.dataModel.malfunctionEnd = new Date(inputData['malfunctionEnd']);
      }
      if (inputData['equipment']) {
        this.dataModel.equipmentId = inputData['equipment'].equipmentId;
      }
      if (inputData['workStation']) {
        this.dataModel.workStationId = inputData['workStation'].workStationId;
      }

      if (inputData['reportedby']) {
        this.dataModel.reportedbyId = inputData['reportedby'].employeeId;
        this.dataModel.reportedby = inputData['reportedby'];
      }
      if (inputData['responseby']) {
        this.dataModel.responsebyId = inputData['responseby'].employeeId;
        this.dataModel.responseby = inputData['responseby'];
      }
      if (inputData['mainPlant']) {
        this.dataModel.mainPlantId = inputData['mainPlant'].plantId;
      }
      if (inputData['maintenanceFunctionalLocation']) {
        this.dataModel.maintenanceFunctionalLocationId = inputData['maintenanceFunctionalLocation'].maintenanceFunctionalLocationId;
      }
      if (inputData['equipmentPlannerGroup']) {
        this.dataModel.equipmentPlannerGroupId = inputData['equipmentPlannerGroup'].plannerGroupId;
        this.dataModel.equipmentPlannerGroup = inputData['equipmentPlannerGroup'];
      }
      if (inputData['equipmentABCIndicator']) {
        this.dataModel.equipmentABCIndicatorId = inputData['equipmentABCIndicator'].equipmentAbcIndicatorId;
      }
      this.dataModel.breakdown = inputData['breakdown'];
      this.dataModel.maintenanceOrder = inputData['maintenanceOrder'];
      if (inputData['breakdownDuration']) {
        this.dataModel.breakdownDuration = inputData['breakdownDuration'];
      }
      if (inputData['cancelReason']) {
        this.dataModel.cancelReason = inputData['cancelReason'];
      }

      if (!inputData.equipment || !inputData.workStation || !inputData.equipmentPlannerGroup) {
        this.editSenarioForOrder = true;
      }
    }
    this.loaderService.hideLoader();
  }

  showCreateOrderModal() {

    if (this.editSenarioForOrder) {
      if (!this.dataModel.equipmentId) {
        this.utilities.showWarningToast('equipment', 'enter-the-required-information');
        return;
      }
      if (!this.dataModel.workStationId) {
        this.utilities.showWarningToast('workstation', 'enter-the-required-information');
        return;
      }
      if (!this.dataModel.equipmentPlannerGroupId) {
        this.utilities.showWarningToast('equipment-planner-group', 'enter-the-required-information');
        return;
      }
      this.showCreateOrderModalClicked = true;
      this.save();
    } else {
      this.notificationServie.eventHandler.next('order');
    }
  }

  save() {
    if (this.actionType === 'CANCEL') {
      this.dataModel.notificationStatus = 'CANCELLED';
      this.statusChanged();
    } else if (this.actionType === 'COMPLETE') {
      this.dataModel.notificationStatus = 'COMPLETED';
      this.statusChanged();
    } else if (this.actionType === 'INPROCESS') {
      this.dataModel.notificationStatus = 'INPROCESS';
      if (!this.dataModel.responsebyId) {
        this.utilities.showErrorToast('please-select-response-by');
        return 0;
      }
      this.statusChanged();
    }
    this.loaderService.showLoader();
    this.notificationServie.save(this.dataModel)
    .then((res: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {

        if (this.editSenarioForOrder && this.showCreateOrderModalClicked) {
          this.notificationServie.eventHandler.next(res);
        } else {
          this.saveAction.emit('close');
        }

      }, environment.DELAY);
    })
    .catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  statusChanged() {
    this.loaderService.showLoader();
    this.notificationServie.statusChange(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('status-changed');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
    this.dataModel = new NotificationRequestDto();
    this.dataModel.maintenanceNotificationId = this.id;
    this.notificationType = null;
  }

}
