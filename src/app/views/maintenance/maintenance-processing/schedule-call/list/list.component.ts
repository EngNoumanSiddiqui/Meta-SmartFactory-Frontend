/**
 * Created by reis on 29.07.2019.
 */
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { MaintenancePlanScheduleCallService } from 'app/services/dto-services/maintenance/maintenance-plan-schedule-call.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'schedule-call-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ScheduleCallListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  scheduleCallModal = {
    modal: null,
    data: null,
    id: null
  };
  private searchTerms = new Subject<any>();
  // tslint:disable-next-line: no-input-rename
  @Input('activeTab') activeTab: any;
  maintenanceOrderPlanId: any;
  scheduleCallStatusList = [];
  scheduleCallTypeList = [];

  @Input('maintenanceOrderPlanId') set e(maintenanceOrderPlanId) {
    if (maintenanceOrderPlanId) {
      this.maintenanceOrderPlanId = maintenanceOrderPlanId;
      console.log('maintenanceOrderPlanId ===========>', maintenanceOrderPlanId)
      this.pageFilter.maintenanceOrderPlanId = maintenanceOrderPlanId;
      this.filter(this.pageFilter);
    }
  }

  @Input() isDetail = false;
  @Input() maintenanceOrderPlanType: any;

  tableData = [];
  selectedData = [];
  selectedColumns = [

    {field: 'cycle', header: 'cycle-no'},
    {field: 'planDate', header: 'plan-date'},
    {field: 'callDate', header: 'call-date'},
    {field: 'completionDate', header: 'completion-date'},
    {field: 'duePackages', header: 'due-packages'},
    {field: 'actualCycle', header: 'actual-cycle'},
    {field: 'maintenanceOrderPlanCycleItem', header: 'maintenance-plan-cycle-item'},
    {field: 'unit', header: 'cycle-unit'},
    {field: 'schedulingType', header: 'scheduling-type'},
    {field: 'schedulingStatus', header: 'scheduling-status'}

  ];
  cols = [
    {field: 'cycle', header: 'cycle-no'},
    {field: 'planDate', header: 'plan-date'},
    {field: 'callDate', header: 'call-date'},
    {field: 'completionDate', header: 'completion-date'},
    {field: 'duePackages', header: 'due-packages'},
    {field: 'actualCycle', header: 'actual-cycle'},
    {field: 'maintenanceOrderPlanCycleItem', header: 'maintenance-plan-cycle-item'},
    {field: 'unit', header: 'cycle-unit'},
    {field: 'schedulingType', header: 'scheduling-type'},
    {field: 'schedulingStatus', header: 'scheduling-status'},
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
    actualCycle: null,
    callDate: null,
    completionDate: null,
    createDate: null,
    cycle: null,
    maintenanceOrderPlanId: null,
    maintenancePlanScheduledCallId: null,
    planDate: null,
    schedulingStatus: null,
    schedulingType: null,
    unit: null,
    updateDate: null,
    query: null,
    orderByProperty: 'maintenanceOrderPlanId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private enumService: EnumService,
              private scheduleCallService: MaintenancePlanScheduleCallService) {
  }

  ngOnInit() {
    if (this.maintenanceOrderPlanType) {
      if (this.maintenanceOrderPlanType === 'TIME_BASE_SINGLE_CYCLE_PLAN' || this.maintenanceOrderPlanType === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN') {
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'duePackages'), 1);
        this.cols.splice(this.cols.findIndex(itm => itm.field === 'duePackages'), 1);
      }
    }
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.scheduleCallService.filterObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        this.tableData = this.tableData.sort((a,b) => b.planDate - a.planDate);
        this.loaderService.hideLoader();
      },
      error => {
        this.tableData = [];
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );

    this.filter(this.pageFilter);

    this.enumService.getMaintenanceOrderPlanScheduleCallStatusEnum().then((res: any) => this.scheduleCallStatusList = res);
    this.enumService.getMaintenanceOrderPlanScheduleCallTypeEnum().then((res: any) => this.scheduleCallTypeList = res);
  }

  createScheduleCall() {
    this.loaderService.showLoader();
    this.scheduleCallService.create(this.maintenanceOrderPlanId)
          .then(() => {
            this.loaderService.hideLoader();
            this.utilities.showSuccessToast('created-success');
            this.filter(this.pageFilter);
          }).catch(error => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error);
          });
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
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string,data) {

    this.scheduleCallModal.id = id;
    this.scheduleCallModal.modal = mod;
    this.scheduleCallModal.data = data;
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
    this.filter(this.pageFilter);
  }



  resetFilter() {
   this.pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    actualCycle: null,
    callDate: null,
    completionDate: null,
    createDate: null,
    cycle: null,
    maintenanceOrderPlanId: this.maintenanceOrderPlanId,
    maintenancePlanScheduledCallId: null,
    planDate: null,
    schedulingStatus: null,
    schedulingType: null,
    unit: null,
    updateDate: null,
    query: null,
    orderByProperty: 'maintenanceOrderPlanId',
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
        this.scheduleCallService.delete(id)
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

  showDetailDialog(id, type:string){
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }
}
