import {Component, EventEmitter, OnInit, Output, ViewChild, Input} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {NotificationRequestDto} from '../../../dto/maintenance/notification.dto';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {NotificationsService} from '../../../services/dto-services/maintenance/notifications.service';
import {ConvertUtil} from '../../../util/convert-util';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'choose-notification-pane',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ChooseNotificationListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  notificationModal = {
    modal: null,
    data: null,
    id: null
  };

  @Input() fromMaintenanceOrder = false;

  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'maintenanceNotificationId', header: 'maintenance-notification-id'},
    {field: 'notificationNo', header: 'notification-no'},
    {field: 'requiredStart', header: 'required-start'},
    {field: 'problemDefination', header: 'problem-definition'},
    {field: 'maintenanceFunctionalLocationId', header: 'functional-location'},
    {field: 'mainPlantName', header: 'workstation-plant'},
    {field: 'equipmentName', header: 'equipment'},
    {field: 'maintenanceNotificationTypeId', header: 'notification-type'},
    {field: 'notificationStatus', header: 'status'},
  ];
  cols = [
    {field: 'maintenanceNotificationId', header: 'notification-id'},
    {field: 'notificationNo', header: 'notification-no'},
    {field: 'requiredStart', header: 'required-start'},
    {field: 'problemDefination', header: 'problem-definition'},
    {field: 'maintenanceFunctionalLocationId', header: 'functional-location'},
    {field: 'mainPlantName', header: 'workstation-plant'},
    {field: 'equipmentName', header: 'equipment'},
    {field: 'maintenanceNotificationTypeId', header: 'notification-type'},
    {field: 'notificationStatus', header: 'status'},
  ];

  modal = {active: false};
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    maintenanceNotificationId: null,
    notificationNo: null,
    requiredStart: null,
    problemDefination: null,
    maintenanceFunctionalLocationId: null,
    maintenanceWorkstationPlant: null,
    equipmentName: null,
    plantId: null,
    maintenanceNotificationTypeId: null,
    query: null,
    orderByProperty: 'maintenanceNotificationId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;
  dataModel: NotificationRequestDto = new NotificationRequestDto();
  detailData;
  actionType: string;

  @Output() selectedEvent = new EventEmitter();
  selectedPlant: any;
  onRowSelect(event) {
    // event.data
    if (this.fromMaintenanceOrder) {
      if (event.data.maintenanceOrder) {
        this.utilities.showWarningToast(this._translateSvc.instant('maintenance-order-has-already-generated'));
        return ;
      } else {
        this.selectedEvent.next(event.data);
      }
    } else {
      this.selectedEvent.next(event.data);
    }
  }
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private notificationService: NotificationsService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.mainPlantId = this.selectedPlant.plantId;
                  this.pageFilter.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this.notificationService.filter(data)
      .then(result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {
    this.actionType = mod;
    this.notificationModal.id = id;
    this.notificationModal.modal = mod;

    this.modal.active = true;
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;
    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;
    this.filter(this.pageFilter)
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  getIndex(index) {
    this.tableDetailIndex = index;
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      maintenanceNotificationId: null,
      notificationNo: null,
      requiredStart: null,
      problemDefination: null,
      plantId: this.pageFilter.plantId,
      maintenanceFunctionalLocationId: null,
      maintenanceWorkstationPlant: null,
      equipmentName: null,
      maintenanceNotificationTypeId: null,
      query: null,
      orderByProperty: 'maintenanceNotificationId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.notificationService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showCreateOrderModal(data) {
    /*console.log('adsfsdfsfgsdf');
     this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, null);*/
  }

  changeStatus(id) {
    this.loaderService.showLoader();
    this.notificationService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          this.dataModel.maintenanceNotificationId = id;
          this.dataModel.notificationNo = result['notificationNo'];
          this.dataModel.problemDefination = result['problemDefination'];
          this.dataModel.requiredStart = new Date(result['requiredStart']);
          this.dataModel.requiredEnd = new Date(result['requiredEnd']);
          this.dataModel.notificationStatus = result['notificationStatus'];
          this.dataModel.priority = result['priority'];
          this.dataModel.malfunctionStart = new Date(result['malfunctionStart']);
          this.dataModel.malfunctionEnd = new Date(result['malfunctionEnd']);
          if (result['equipment']) {
            this.dataModel.equipmentId = result['equipment'].equipmentId;
          }
          if (result['workStation']) {
            this.dataModel.workStationId = result['workStation'].workStationId;
          }
          // if (result['maintenanceNotificationType']) {
          //   this.dataModel.maintenanceNotificationTypeId = result['maintenanceNotificationType'].maintenanceNotificationTypeId;
          // }
          if (result['reportedby']) {
            this.dataModel.reportedbyId = result['reportedby'].employeeId;
          }
          if (result['responseby']) {
            this.dataModel.responsebyId = result['reportedby'].responsebyId;
          }
          if (result['mainPlant']) {
            this.dataModel.mainPlantId = result['mainPlant'].plantId;
          }
          if (result['maintenanceFunctionalLocation']) {
            this.dataModel.maintenanceFunctionalLocationId = result['maintenanceFunctionalLocation'].maintenanceFunctionalLocationId;
          }
          if (result['equipmentPlannerGroup']) {
            this.dataModel.equipmentPlannerGroupId = result['equipmentPlannerGroup'].plannerGroupId;
          }
          if (result['equipmentABCIndicator']) {
            this.dataModel.equipmentABCIndicatorId = result['equipmentABCIndicator'].equipmentAbcIndicatorId;
          }
          this.dataModel.breakdown = result['breakdown'];
          if (result['breakdownDuration']) {
            this.dataModel.breakdownDuration = result['breakdownDuration'];
          }
          if (result['cancelReason']) {
            this.dataModel.cancelReason = result['cancelReason'];
          }
          if (result['notificationStatus']) {
            if (result['notificationStatus'] === 'OUTSTANDING') {
              this.dataModel.notificationStatus = 'INPROCESS'
            } else if (result['notificationStatus'] === 'INPROCESS') {
              this.dataModel.notificationStatus = 'COMPLETED'
            } else if (result['notificationStatus'] === 'COMPLETED') {
              this.dataModel.notificationStatus = 'OUTSTANDING'
            }
          }
          this.notificationService.save(this.dataModel)
            .then(() => {
              this.loaderService.hideLoader();
              this.utilities.showSuccessToast('Status changed successfuly');
              this.filter(this.pageFilter);
            })
            .catch(error => {
              this.loaderService.hideLoader();
              this.utilities.showErrorToast(error);
            });
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save(id) {
    this.changeStatus(id);
  }
}
