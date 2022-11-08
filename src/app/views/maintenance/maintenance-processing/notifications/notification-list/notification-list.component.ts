

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '../../../../../services/utilities.service';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { NotificationsService } from '../../../../../services/dto-services/maintenance/notifications.service';
import { environment } from '../../../../../../environments/environment';
import { ConvertUtil } from '../../../../../util/convert-util';
import { DialogTypeEnum } from '../../../../../services/shared/dialog-types.enum';
import { NotificationRequestDto } from '../../../../../dto/maintenance/notification.dto';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { Subscription, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Workstation } from 'app/dto/workstation/workstation.model';
@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  notificationModal = {
    modal: null,
    data: null,
    id: null
  };
  pageFilterDate = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    measurementDate: null
  };
  statusModel = {
    maintenanceNotificationId: null,
    notificationStatus: null
  };

  maintenanceNotificationTypes;
  moveToOrderPage = false;
  refereshNewData = false;
  tableData = [];
  selectedData = [];
  selectedColumns = [
    { field: 'maintenanceNotificationId', header: 'maintenance-notification-id' },
    { field: 'maintenanceNotificationType', header: 'notification-type' },
    // { field: 'notificationNo', header: 'catalog/code-group' },
    { field: 'problemDefination', header: 'problem-definition' },
    { field: 'maintenanceFunctionalLocationId', header: 'functional-location' },
    { field: 'workStationNo', header: 'workstation-no' },
    // { field: 'workStation', header: 'workstation' },
    { field: 'equipmentNo', header: 'equipment-no' },
    // { field: 'equipmentName', header: 'equipment' },
    { field: 'malfunctionStart', header: 'malfunction-start' },
    { field: 'malfunctionEnd', header: 'malfunction-end' },
    { field: 'requiredStart', header: 'required-start' },
    { field: 'requiredEnd', header: 'required-end' },
    { field: 'createDate', header: 'create-date' },
    { field: 'notificationStatus', header: 'status' },
  ];
  cols = [
    { field: 'maintenanceNotificationId', header: 'maintenance-notification-id' },
    { field: 'maintenanceNotificationType', header: 'notification-type' },
    // { field: 'notificationNo', header: 'catalog/code-group' },
    { field: 'problemDefination', header: 'problem-definition' },
    { field: 'maintenanceFunctionalLocationId', header: 'functional-location' },
    { field: 'workStationNo', header: 'workstation-no' },
    { field: 'workStation', header: 'workstation' },
    { field: 'equipmentNo', header: 'equipment-no' },
    { field: 'equipmentName', header: 'equipment' },
    { field: 'requiredStart', header: 'required-start' },
    { field: 'requiredEnd', header: 'required-end' },
    { field: 'malfunctionStart', header: 'malfunction-start' },
    { field: 'malfunctionEnd', header: 'malfunction-end' },
    { field: 'createDate', header: 'create-date' },
    { field: 'notificationStatus', header: 'status' },
  ];

  modal = { active: false };
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
    notificationFilterStartDate: null,
    notificationFilterFinishDate: null,
    requiredStart: null,
    requiredEnd: null,
    mainPlantId: null,
    problemDefination: null,
    maintenanceFunctionalLocationId: null,
    maintenanceWorkstationPlant: null,
    equipmentName: null,
    notificationStatus: null,
    workStationName: null,
    maintenanceNotificationType: null,

    query: null,
    orderByProperty: 'maintenanceNotificationId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;
  dataModel: NotificationRequestDto = new NotificationRequestDto();
  detailData;
  actionType: string;
  sub: Subscription;
  searchTerms = new Subject<any>();
  maintenanceStatusList = [];
  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private enumService: EnumService,
    private router: Router,
    private notificationService: NotificationsService
  ) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.mainPlantId = null;
      } else {
        this.pageFilter.mainPlantId = res.plantId;
      }
      let testDate = new Date();
      testDate.setDate(testDate.getDate() - 7);
      this.pageFilter.notificationFilterStartDate = testDate;
      this.pageFilter.notificationFilterFinishDate = new Date();
      this.filter(this.pageFilter);
    });
  }
  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.notificationService.filterObservable(term))).subscribe((result: any) => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
      }, error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    this.filter(this.pageFilter);

    this.enumService.getMaintenanceOrderNotificationTypeEnum().then(result => this.maintenanceNotificationTypes = result).catch(error => console.log(error));

    this.enumService.getMaintenanceStatusEnum().then((res: any) => {
      this.maintenanceStatusList = res;
      this.arrayitemmove(this.maintenanceStatusList, 5, 2);
    });

    this.notificationService.eventHandler.asObservable().subscribe(res => {
      if (res === 'order') {
        if (this.selectedData && this.selectedData.length > 0) {
          this.showCreateOrderModal();
        } else {
          this.selectedData.push(this.tableData[this.tableDetailIndex]);
          this.showCreateOrderModal();
        }

      } else {
        if (this.selectedData && this.selectedData.length > 0) {
          this.selectedData[0] = res;
        } else {
          this.selectedData.push(res);
        }
        this.showCreateOrderModal(res);
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  arrayitemmove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(this.pageFilter);

  }

  clearDates() {
    this.pageFilter.notificationFilterStartDate = null;
    this.pageFilter.notificationFilterFinishDate = null;
    this.filter(this.pageFilter);
  }
  search(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    // console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }
  modalShow(id, mod: string, data?: any) {
    this.actionType = mod;
    this.notificationModal.id = id;
    this.notificationModal.data = data;
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
    this.search(this.pageFilter)
  }
  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.search(this.pageFilter);
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
      requiredEnd: null,
      notificationFilterStartDate: null,
      notificationFilterFinishDate: null,
      mainPlantId: null,
      notificationStatus: null,
      workStationName: null,
      problemDefination: null,
      maintenanceFunctionalLocationId: null,
      maintenanceWorkstationPlant: null,
      equipmentName: null,
      maintenanceNotificationType: null,

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
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
  showCreateOrderModal(data?) {
    const selectedNtf = data ? data : this.selectedData[0];
    if (!selectedNtf.equipment) {
      this.utilities.showWarningToast('equipment', 'enter-the-required-information');
      return;
    }
    if (!selectedNtf.workStation) {
      this.utilities.showWarningToast('workstation', 'enter-the-required-information');
      return;
    }
    if (!selectedNtf.equipmentPlannerGroup) {
      this.utilities.showWarningToast('equipment-planner-group', 'enter-the-required-information');
      return;
    }
    // if (selectedNtf.breakdown) {
    //   if (!selectedNtf.breakdownDuration) {
    //     this.utilities.showWarningToast('breakdown-duration', 'enter-the-required-information');
    //     return;
    //   }
    // }
    this.filter(this.pageFilter);
    setTimeout(() => {
      this.modalShow(null, 'ORDER');
    }, 1500);
  }

  onModalHidden() {
    this.modal.active = false;
    if (this.notificationModal.modal === 'ORDER' && this.moveToOrderPage === true) {
      this.moveToOrderPage = false;
      this.router.navigate(['/maintenance/maintenance-processing/maintenance-order']);
    } else if (this.notificationModal.modal !== 'DETAIL' && this.refereshNewData === true) {
      this.filter(this.pageFilter);
      this.selectedData = [];
      this.refereshNewData = false;
    }
  }

  get createOrderprop(): boolean {
    const a = !(this.selectedData.length === 1
      && this.selectedData[0].notificationStatus !== 'COMPLETED'
      && this.selectedData[0].maintenanceOrder === null);
    return a;
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
  showFunctionalLocationDetail(functionalLocationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.FUNCTIONALLOCATION, functionalLocationId);
  }
  showEquipmentDetail(equipmentId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENT, equipmentId);
  }
  showMainPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
  showworkStationDetail(workid) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workid);
  }

  // showMainNotificationTypeDetail(plantId) {
  //   this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCENOTIFICATIONTYPE, plantId);
  // }



}
