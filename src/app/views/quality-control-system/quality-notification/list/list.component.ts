import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListQualityNotification implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  qualityNotificationModal = {
    modal: null,
    data: null,
    id: null
  };

  anyRecordSelected: boolean = false;



  selectedColumns = [
    { field: 'qualityNotificationId', header: 'notification-id', },
    { field: 'qualityNotificationCode', header: 'notification-code', },
    { field: 'stockno', header: 'material-no', },
    { field: 'stockname', header: 'material-name', },
    { field: 'qualityNotificationType', header: 'notification-type', },
    { field: 'plant', header: 'plant'},
    { field: 'customer', header: 'customer', },
    { field: 'vendor', header: 'vendor', },
    { field: 'requiredStart', header: 'required-start', },
    { field: 'requiredEnd', header: 'required-end', },
    { field: 'qualityNotificationPriority', header: 'priority',  },
    { field: 'description', header: 'description',  },
    { field: 'notificationStatus', header: 'status',  },
  ];
  cols = [
    { field: 'qualityNotificationId', header: 'notification-id', index: 1 },
    { field: 'qualityNotificationCode', header: 'notification-code', index: 2 },
    { field: 'stockno', header: 'material-no', index: 3 },
    { field: 'stockname', header: 'material-name', index: 4 },
    { field: 'qualityNotificationType', header: 'notification-type', index: 5 },
    { field: 'plant', header: 'plant'},
    { field: 'customer', header: 'customer', index: 6 },
    { field: 'vendor', header: 'vendor', index: 7 },
    { field: 'requiredStart', header: 'required-start', index: 8 },
    { field: 'requiredEnd', header: 'required-end', index: 9 },
    { field: 'qualityNotificationPriority', header: 'priority', index: 10 },
    { field: 'description', header: 'description', index: 11 },
    { field: 'notificationStatus', header: 'status', index: 12 },
  ];

  showLoader = false;
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  pageFilter = {
    activityListId: null,
    batchId: null,
    causeListId: null,
    complaintQuantity: null,
    qualityNotificationType: null, // not present
    requiredStart: null, // not present
    requiredEnd: null, // not present
    createDate: null,
    defectRecordingId: null,
    description: null,
    documentNoId: null,
    inspectionLotId: null,
    longText: null,
    notificationStatus: null,
    orderByDirection: 'desc',
    orderByProperty: 'qualityNotificationId',
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    plantName: null,
    purchaseOrderId: null,
    qualityDefectRecordingId: null,
    qualityInspectionLotId: null,
    qualityNotificationCode: null,
    qualityNotificationId: null,
    qualityNotificationPriority: null,
    qualityNotificationReportTypeId: null,
    qualityNotificationStatusId: null,
    qualityNotificationTypeId: null,
    quantityUnit: null,
    query: null,
    stockId: null,
    stockName: null,
    stockNo: null,
    taskListId: null,
    updateDate: null,
    vendorAddress: null,
    vendorId: null,
    workCenterId: null,
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  qualityNotification = [];
  selectedQualityNotification = [];
  modal = { active: false };
  display = false;

  statusList = [];

  priorityList = [];

  private searchTerms = new Subject<any>();

  isSaveAndNew: boolean;
  
  sub: Subscription;

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityNotificationService: QualityNotificationService,
    private appStateService: AppStateService,
    private _enumSvc: EnumService
  ) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
      }
      this.filter(this.pageFilter);
    });
  }

  ngOnInit() {
    // this.qualityNotification = [];
    // this.loaderService.showLoader();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._qualityNotificationService.filterNotification(term))).subscribe(
        (result: any) => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.qualityNotification = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.qualityNotification = [];
          this.utilities.showErrorToast(error);
          this.loaderService.hideLoader();
        }
      );

    this.filter(this.pageFilter);
    this._enumSvc.getQualityNoificationStatusEnum().then((res:any) => this.statusList = res);
    this._enumSvc.getQualityNotificationPriorityEnum().then((res:any) => this.priorityList = res);
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  // FILTERING AREA
  filtingAreaColumns(event) {
    this.selectedColumns.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
  }

  modalShow(id, mod: string) {
    this.qualityNotificationModal.id = id;
    this.qualityNotificationModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.qualityNotificationModal.modal = mod;
    this.qualityNotificationModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.qualityNotificationModal.modal = 'NEW';
      myModal.show();
    }
    this.qualityNotificationModal.id = null;
    this.isSaveAndNew = false;
    this.selectedQualityNotification = null;
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

    this.search(this.pageFilter);
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

  resetFilter() {
    this.pageFilter = {
      activityListId: null,
      batchId: null,
      causeListId: null,
      complaintQuantity: null,
      createDate: null,
      defectRecordingId: null,
      qualityNotificationType: null, // not present
      requiredStart: null, // not present
      requiredEnd: null, // not present
      description: null,
      documentNoId: null,
      inspectionLotId: null,
      longText: null,
      notificationStatus: null,
      orderByDirection: 'desc',
      orderByProperty: 'qualityNotificationId',
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      plantId: null,
      plantName: null,
      purchaseOrderId: null,
      qualityDefectRecordingId: null,
      qualityInspectionLotId: null,
      qualityNotificationCode: null,
      qualityNotificationId: null,
      qualityNotificationPriority: null,
      qualityNotificationReportTypeId: null,
      qualityNotificationStatusId: null,
      qualityNotificationTypeId: null,
      quantityUnit: null,
      query: null,
      stockId: null,
      stockName: null,
      stockNo: null,
      taskListId: null,
      updateDate: null,
      vendorAddress: null,
      vendorId: null,
      workCenterId: null,
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-notifications',
      accept: () => {
        this._qualityNotificationService.deleteNotification(id).then(
          result => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          },
          error => {
            this.utilities.showErrorToast(error);
            this.loaderService.hideLoader();
          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  // on select any row, record buttons should be active.
  onRecordSelectAll(event) {
    // if(event.checked){ this.anyRecordSelected = true;}
    //   else {this.anyRecordSelected = false;}

    this.qualityNotification.map(item => item.selected = true)
  }

  onRecordSelect(event) {
    this.qualityNotification.map(item => {
      if (item.notificationId === event.data.notificationId) { item.selected = true; }
    })
    this.anyRecordSelected = true;
  }

  onRecordDeselect(event) {
    this.qualityNotification.map(item => {
      if (item.notificationId === event.data.notificationId) { item.selected = false; }
    })

    for (let i = 0; i < this.qualityNotification.length; i++) {
      if (this.qualityNotification[i].selected === true) {
        this.anyRecordSelected = true;
        break;
      }
      else {
        this.anyRecordSelected = false;
      }
    }
  }

}
