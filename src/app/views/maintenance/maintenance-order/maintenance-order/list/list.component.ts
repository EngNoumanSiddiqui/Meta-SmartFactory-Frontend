import { AppStateService } from './../../../../../services/dto-services/app-state.service';
/**
 * Created by reis on 29.07.2019.
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { UtilitiesService } from '../../../../../services/utilities.service';
import { MaintenanceOrderService } from '../../../../../services/dto-services/maintenance-equipment/maintenance-order.service';
import { environment } from '../../../../../../environments/environment';
import { ConvertUtil } from '../../../../../util/convert-util';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import * as moment from 'moment';

@Component({
  selector: 'maintenance-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MaintenanceOrderListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myGantModal') public myGantModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null,
    data: null
  };


  tableData = [];
  selectedData = [];
  maintenanceOrderTypes;
  maintenanceActivityTypes;
  selectedColumns = [
    {field: 'maintenanceId', header: 'maintenance-order-id'},
    {field: 'maintenanceOrderNo', header: 'maintenance-order-no'},
    {field: 'maintenanceFunctionalLocation', header: 'functional-location'},
    {field: 'equipment', header: 'equipment'},
    // {field: 'equipment', header: 'equipment'},
    // {field: 'plannerGroup', header: 'planner-group'},
    { field: 'maintenanceOrderType', header: 'maintenance-order' },
    { field: 'mainWorkStation', header: 'workstation' },
    // {field: 'planningPlant', header: 'planning-plant'},
    { field: 'maintenanceSystemCondition', header: 'system-condition' },
    { field: 'maintenanceActivityType', header: 'maintenance-activity-type' },
    // {field: 'maintenanceFunctionalLocation', header: 'functional-location'},
    { field: 'maintenanceCategory', header: 'maintenance-category' },
    { field: 'maintenanceReason', header: 'maintenance-reason' },
    { field: 'plannerGroup', header: 'planner-group' },
    // {field: 'responseby', header: 'response-by'},
    { field: 'priority', header: 'priority' },
    { field: 'datePriority', header: 'date-priority' },
    // {field: 'address', header: 'address'},
    // {field: 'assembly', header: 'assembly'},
    // {field: 'dateRevision', header: 'date-revision'},
    // {field: 'problemDefination', header: 'problem-definition'},
    { field: 'dateBasicStart', header: 'date-basic-start' },
    { field: 'datebasicFinish', header: 'date-basic-finish' },
    { field: 'maintenanceStatus', header: 'status' },
  ];
  cols = [
    { field: 'maintenanceId', header: 'maintenance-order-id' },
    { field: 'maintenanceOrderNo', header: 'maintenance-order-no' },
    { field: 'equipmentNo', header: 'equipment-no' },
    { field: 'equipment', header: 'equipment' },
    { field: 'maintenanceOrderType', header: 'maintenance-order' },
    { field: 'mainWorkStation', header: 'workstation' },
    { field: 'planningPlant', header: 'planning-plant' },
    { field: 'maintenanceSystemCondition', header: 'system-condition' },
    { field: 'maintenanceActivityType', header: 'maintenance-activity-type' },
    { field: 'maintenanceFunctionalLocation', header: 'functional-location' },
    { field: 'maintenanceCategory', header: 'maintenance-category' },
    { field: 'maintenanceReason', header: 'maintenance-reason' },
    { field: 'plannerGroup', header: 'planner-group' },
    { field: 'responseby', header: 'response-by' },
    { field: 'priority', header: 'priority' },
    { field: 'datePriority', header: 'date-priority' },
    { field: 'address', header: 'address' },
    { field: 'assembly', header: 'assembly' },
    { field: 'dateRevision', header: 'date-revision' },
    { field: 'problemDefination', header: 'problem-definition' },
    { field: 'dateBasicStart', header: 'date-basic-start' },
    { field: 'datebasicFinish', header: 'date-basic-finish' },
    { field: 'maintenanceStatus', header: 'status' },
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
  dataModel = {
    maintenanceOrderId: null,
    address: null,
    assembly: null,
    dateBasicStart: null,
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
    planningPlantId: null,
    priority: null,
    problemDefination: null,
    responsebyId: null
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    maintenanceNotificationId: null,
    maintenanceFunctionalLocationId: null,
    maintenanceSystemConditionId: null,
    maintenanceOrderType: null,
    planningPlantName: null,
    priority: null,
    address: null,
    assembly: null,
    dateBasicStart: null,
    datePriority: null,
    dateRevision: null,
    datebasicFinish: null,
    equipmentName: null,
    mainWorkStationId: null,
    maintenanceActivityType: null,
    maintenanceCategoryId: null,
    maintenanceReasonId: null,
    maintenanceId: null,
    plannerGroupId: null,
    planningPlantId: null,
    responsebyId: null,
    problemDefination: null,
    maintenanceStatus: null,
    workStationName: null,
    query: null,
    orderByProperty: 'maintenanceId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  private searchTerms = new Subject<any>();
  maintenanceStatusList: any;
  sub: Subscription;
  scales: any;
  data: any;
  me: any;
  jobGantViewModal = { active: false };
  selectedWorkstation: any = null;
  filterDto: any;
  responseTotalAllocationData: any;
  filterGantDto = {
    dayly: true,
    erp: null,
    finishDate: moment().add((4 * 7), 'days').toDate(),
    monthly: true,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 999999,
    plantId: null,
    query: null,
    startDate: new Date(),
    weekly: true,
    workCenterId: null,
    workStationName: null,
    workStationId: null,
    workStationStatus: null,


  }

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private appStateSvc: AppStateService,
    private mStrategyTypeSvc: MaintenanceOrderService,
    private appStateService: AppStateService) {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.resetFilter();
        this.search(this.pageFilter);
      } else {
        this.pageFilter.planningPlantId = res.plantId;
        this.pageFilter.planningPlantName = res.plantName;
        this.search(this.pageFilter);
      }
    });
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.mStrategyTypeSvc.filterObservable(this.pageFilter))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.tableData = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.tableData = [];
          this.utilities.showErrorToast(error)
          this.loaderService.hideLoader();
        }
      );

    this.enumService.getMaintenanceOrderTypeEnum().then(result => this.maintenanceOrderTypes = result).catch(error => console.log(error));
    this.enumService.getMaintenanceActivityTypeEnum().then(result => this.maintenanceActivityTypes = result).catch(error => console.log(error));

    this.filter(this.pageFilter);

    this.enumService.getMaintenanceStatusEnum().then((res: any) => {
      this.maintenanceStatusList = res;
      this.arrayitemmove(this.maintenanceStatusList, 5, 2);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  arrayitemmove(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
  search(data) {
    this.loaderService.showLoader();
    const temp = Object.assign({}, data);
    if (temp.dateBasicStart) {
      temp.dateBasicStart = new Date(temp.dateBasicStart);
      temp.dateBasicStart.setHours(0, 0, 0, 0);
    }
    if (temp.datebasicFinish) {

      temp.datebasicFinish = new Date(temp.datebasicFinish);
      temp.datebasicFinish.setHours(23, 59, 59, 999);
    }
    this.searchTerms.next(temp);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

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
      maintenanceNotificationId: null,
      maintenanceFunctionalLocationId: null,
      maintenanceSystemConditionId: null,
      maintenanceOrderType: null,
      planningPlantName: null,
      priority: null,
      address: null,
      assembly: null,
      dateBasicStart: null,
      datePriority: null,
      dateRevision: null,
      datebasicFinish: null,
      equipmentName: null,
      mainWorkStationId: null,
      maintenanceActivityType: null,
      maintenanceCategoryId: null,
      maintenanceReasonId: null,
      maintenanceId: null,
      plannerGroupId: null,
      planningPlantId: null,
      responsebyId: null,
      problemDefination: null,
      maintenanceStatus: null,
      workStationName: null,
      query: null,
      orderByProperty: 'maintenanceId',
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
        this.mStrategyTypeSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-task');
      }
    })
  }

  showEquipmentDetail(equipmentId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENT, equipmentId);
  }

  showWorkStationDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showfunctionalModal(functionalId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.FUNCTIONALLOCATION, functionalId);
  }

  showMaintenanceSystemConditionDetail(systemCondition) {
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCESYSTEMCONDITION, systemCondition);
  }


  showMaintenanceCategoryTypeDetail(categoryType) {
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCECATEGORYTYPE, categoryType);
  }
  showMaintenanceReasonDetail(maintenanceReason) {
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCEREASON, maintenanceReason);
  }

  showMaintenanceOrderDetail(maintenanceOrder) {
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCEORDER, maintenanceOrder);
  }

  save(id: any) {
    this.changeStatus(id);
  }

  changeStatus(id: any) {
    this.loaderService.showLoader();
    this.mStrategyTypeSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        if (result) {
          if (result['equipment']) {
            this.dataModel.equipmentId = result['equipment'].equipmentId;
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
            this.dataModel.responsebyId = result['responseby'].employeeId;
          }
          if (result['maintenanceSystemCondition']) {
            this.dataModel.maintenanceSystemConditionId = result['maintenanceSystemCondition'].maintenanceSystemConditionId;
          }
          if (result['planningPlant']) {
            this.dataModel.planningPlantId = result['planningPlant'].plantId;
          }
          if (result['mainWorkStation']) {
            this.dataModel.mainWorkStationId = result['mainWorkStation'].mainWorkStationId;
          }
          if (result['maintenanceStatus']) {
            if (result['maintenanceStatus'] === 'OUTSTANDING') {
              this.dataModel.maintenanceStatus = 'INPROCESS';
            } else if (result['maintenanceStatus'] === 'INPROCESS') {
              this.dataModel.maintenanceStatus = 'COMPLETED';
            }
          }
        }
        this.loaderService.showLoader();
        this.mStrategyTypeSvc.save(this.dataModel)
          .then(() => {
            this.loaderService.hideLoader();
            this.utilities.showSuccessToast('Status changed successfuly');
            this.filter(this.pageFilter);
            setTimeout(() => {
            }, environment.DELAY);
          })
          .catch(error => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error);
          });


      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }
  setSelectedWorkstation(event) {
    if (event) {
      this.filterDto.workStationId = event.workStationId;
    } else {
      this.filterDto.workStationId = null;
    }
  }

  modalShowGraph(e) {
    this.jobGantViewModal.active = true;
  }
}