/**
 * Created by reis on 29.07.2019.
 */
import {Component, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {OrderOperationService} from '../../../../../services/dto-services/maintenance-equipment/order-operation.service';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { AppStateService } from 'app/services/dto-services/app-state.service';
@Component({
  selector: 'maintenance-order-operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrderOperationListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };
  private searchTerms = new Subject<any>();
  // tslint:disable-next-line: no-input-rename
  @Input('activeTab') activeTab: any;

  @Input() equipmentId: any;
  @Input() maintenanceStatus: any;
  @Input() mainWorkStationId: any;
  @Input() maintenanceActivityType: any;
  @Input() planningPlantId: any;
  @Input() equipmentName;
  @Input() mainWorkStationName;
  @Input() fromOutStandToProcess = false;
  @Output() operationAddedEvent = new EventEmitter<any>();
  sub: Subscription;
  @Input('maintenanceOrderId') set e(maintenanceOrderId) {
    if (maintenanceOrderId) {
      console.log('mainternanceOrderId ===========>', maintenanceOrderId)
      this.pageFilter.maintenanceOrderId = maintenanceOrderId;
      this.filter(this.pageFilter);
    }
  }

  @Input() isDetail = false;

  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'maintenanceOperationId', header: 'maintenance-operation-id'},
    // {field: 'maintenanceOrder', header: 'maintenance-order'},
    {field: 'equipmentOperation', header: 'equipment-operation'},
    {field: 'equipment', header: 'equipment'},
    {field: 'maintenanceEmployee', header: 'employee'},
    {field: 'work', header: 'work'},
    {field: 'workUnit', header: 'work-unit'},
    {field: 'actualWork', header: 'actual-work'},
    {field: 'actualWorkUnit', header: 'actual-work-unit'},
    {field: 'duration', header: 'duration'},
    {field: 'finalCost', header: 'final-cost'},
    {field: 'costRate', header: 'cost-rate'},
    // {field: 'durationUnit', header: 'duration-unit'},
    {field: 'indexNo', header: 'index-no'},
    // {field: 'numberOfperson', header: 'no-of-person'},
    {field: 'maintenanceActivityType', header: 'activity-type'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'workstation', header: 'workstation'},
    {field: 'plannedStartDate', header: 'planned-start'},
    {field: 'plannedFinishDate', header: 'planned-finish'},
    // {field: 'actualStartDate', header: 'actual-start'},
    // {field: 'actualFinishedDate', header: 'actual-finish'},
  ];
  cols = [
    {field: 'maintenanceOperationId', header: 'maintenance-operation-id'},
    {field: 'equipment', header: 'equipment'},
    {field: 'equipmentOperation', header: 'equipment-operation'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'workstation', header: 'workstation'},
    {field: 'maintenanceActivityType', header: 'activity-type'},
    {field: 'work', header: 'work'},
    {field: 'workUnit', header: 'work-unit'},
    {field: 'resultNote', header: 'result-note'},
    {field: 'duration', header: 'duration'},
    {field: 'finalCost', header: 'final-cost'},
    {field: 'costRate', header: 'cost-rate'},
    // {field: 'durationUnit', header: 'duration-unit'},
    // {field: 'numberOfperson', header: 'no-of-person'},
    {field: 'plannedStartDate', header: 'planned-start'},
    {field: 'plannedFinishDate', header: 'planned-finish'},
    // {field: 'actualStartDate', header: 'actual-start'},
    // {field: 'actualFinishedDate', header: 'actual-finish'},

    // {field: 'maintenanceOrder', header: 'maintenance-order'},

    // {field: 'actualWork', header: 'actual-work'},
    // {field: 'actualWorkUnit', header: 'actual-work-unit'},

    // {field: 'indexNo', header: 'index-no'},
    // {field: 'plannedStartDate', header: 'planned-start'},
    // {field: 'plannedFinishDate', header: 'planned-finish'},
  ];

  maintenanceOrderOperaionId = null;

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
    equipmentOperationId: null,
    maintenanceOrderId: null,
    planningPlantId: null,
    maintenanceOperationId: null,
    query: null,
    orderByProperty: 'maintenanceOperationId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
              private loaderService: LoaderService,
              private mStrategyTypeSvc: OrderOperationService) {

                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (res) {
                    this.pageFilter.planningPlantId = res.plantId;
                  } else {
                    this.pageFilter.planningPlantId = null;
                  }
                  this.filter(this.pageFilter);
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
        // if (this.tableData) {
        //   this.tableData.forEach(itm => {
        //     if (itm.duration) {
        //       itm.duration = ConvertUtil.longDuration2DHHMMSSTime(itm.duration * 1000);
        //     }
        //   });
        // }
        this.operationAddedEvent.next(this.tableData);
        this.loaderService.hideLoader();
      },
      error => {
        this.tableData = [];
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );

    this.filter(this.pageFilter);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;
    if (mod === 'EXTERNAL-SERVICE') {
      this.maintenanceOrderOperaionId = this.selectedData[0].maintenanceOperationId;
    }
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



  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      maintenanceOrderId: this.pageFilter.maintenanceOrderId,
      equipmentOperationId: null,
      planningPlantId: this.pageFilter.planningPlantId,
      maintenanceOperationId: null,
      query: null,
      orderByProperty: 'maintenanceOperationId',
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
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showDetailDialog(id, type:string){
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }

  getDuration(duration) {
    if (duration) {
      return ConvertUtil.longDuration2DHHMMSSTime(duration * 1000);
    }
  }
}
