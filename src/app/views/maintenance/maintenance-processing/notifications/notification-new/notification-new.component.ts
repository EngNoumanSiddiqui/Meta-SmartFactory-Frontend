import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {EquipmentCodeGroupHeaderService} from '../../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import {NotificationsService} from '../../../../../services/dto-services/maintenance/notifications.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {EquipmentAbcIndicatorService} from '../../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {NotificationRequestDto} from '../../../../../dto/maintenance/notification.dto';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'notification-new',
  templateUrl: './notification-new.component.html',
  styleUrls: ['./notification-new.component.scss']
})
export class NotificationNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();


  dataModel: NotificationRequestDto = new NotificationRequestDto();
  functionalLocations: any[];
  equipmentList: any[];
  workstations: any[];
  selectedWorkstation;
  plannerGroup: any[];
  abcIndicators: any[];
  plantList: any;
  employeeList: any;
  catalogs: any[];
  maintenanceNotificationTypes;
  priority = [
    {value: 'VERY_HIGH', label: 'VERY HIGH'},
    {value: 'HIGH', label: 'HIGH'},
    {value: 'MEDIUM', label: 'MEDIUM'},
    {value: 'LOW', label: 'LOW'},
  ];
  selectedPlant: any;

  constructor(private functionalLocationService: FunctionalLocationService,
              private notificationService: NotificationsService,
              private _enumSrv: EnumService,
              private utilities: UtilitiesService,
              private abcIndicatorService: EquipmentAbcIndicatorService,
              private _userSvc: UsersService,
              private equipmentCodeGroupService: EquipmentCodeGroupHeaderService,
              private loaderService: LoaderService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.mainPlantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    this.dataModel.maintenanceFunctionalLocationId = null;
    this.getFunctionalLocation();
    this._enumSrv.getMaintenanceOrderNotificationTypeEnum().then(result => this.maintenanceNotificationTypes = result).catch(error => console.log(error));


    this.getAbcIndicator();
    this.getCatalogs();
  }

  // setSelectedNotificationType(event) {
  //   if (event) {
  //     this.dataModel.maintenanceNotificationTypeId = event.maintenanceNotificationTypeId;
  //     if (event.description === 'Breakdown Notification') {
  //       this.dataModel.priority = 'VERY_HIGH';
  //     } else {
  //       this.dataModel.priority = 'MEDIUM';
  //     }
  //   } else {
  //     this.dataModel.maintenanceNotificationTypeId = null;
  //   }
  // }

  setSelectedEquipment(event) {
    if (event) {
      this.dataModel.equipmentId = event.equipmentId;
      this.dataModel.workStationId = event.maintenanceWorkstation ? event.maintenanceWorkstation.workStationId : null;
      this.dataModel.equipmentPlannerGroupId = event.equipmentPlannerGroup ? event.equipmentPlannerGroup.plannerGroupId : null;
      this.dataModel.equipmentPlannerGroup = event.equipmentPlannerGroup;
    } else {
      this.dataModel.equipmentId = null;
    }
  }
  getFunctionalLocation() {
    this.functionalLocationService.filterShared({pageSize: 100000, pageNumber: 1, planningPlantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.functionalLocations = r['content'];
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

  getAbcIndicator() {
    this.abcIndicatorService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.abcIndicators = r['content'];
      }).catch();
  }

  getCatalogs() {
    this.equipmentCodeGroupService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.catalogs = r['content'];
      }).catch();
  }

  save() {

    if (this.dataModel.breakdown) {
      this.dataModel.malfunctionStart = this.dataModel.requiredStart;
      this.dataModel.malfunctionEnd = this.dataModel.requiredEnd;
    }
    this.notificationService.save(this.dataModel).then(r => {
      this.utilities.showSuccessToast('Success');
      this.saveAction.emit('close');
    }).catch(e => {
      this.utilities.showErrorToast('Failed');
    });
  }

  reset() {
    this.dataModel = new NotificationRequestDto();
  }

  onReportBySelected(event) {
    if (event) {
      this.dataModel.reportedby = event;
      this.dataModel.reportedbyId = event.employeeId;
    }
  }
  onResponseBySelected(event) {
    if (event) {
      this.dataModel.responseby = event;
      this.dataModel.responsebyId = event.employeeId;
    }
  }
}
