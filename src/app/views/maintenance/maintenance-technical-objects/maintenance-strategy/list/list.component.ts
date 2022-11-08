import { MaintenanceCategoryService } from './../../../../../services/dto-services/maintenance-equipment/maintenance-category.service';
/**
 * Created by reis on 29.07.2019.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {MaintenanceStrategyService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';
@Component({
  selector: 'maintenance-strategy-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MaintenanceStrategyListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal={
    modal: null,
    id: null
  };
  private searchTerms = new Subject<any>();
  tableData = [];
  selectedData = [];

  selectedColumns = [
    {field: 'maintenanceStrategyId', header: 'strategy-id'},
    {field: 'strategyName', header: 'strategy-name'},
    {field: 'description', header: 'description'},
    {field: 'strategyUnit', header: 'strategy-unit'},
    {field: 'schedulingIndicator', header: 'scheduling-indicator'},

  ];
  cols = [
    {field: 'maintenanceStrategyId', header: 'strategy-id'},
    {field: 'strategyName', header: 'strategy-name'},
    // {field: 'strategyType', header: 'strategy-type'},
    {field: 'description', header: 'description'},
    {field: 'strategyUnit', header: 'strategy-unit'},
    {field: 'schedulingIndicator', header: 'scheduling-indicator'},

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
    maintenanceStrategyId: null,
    strategyName: null,
    description: null,
    active: null,
    plantId: null,
    query: null,
    orderByProperty:null,
    orderByDirection:null,
    callHerizon:0,
    schedulingIndicator:null,
    shiftFactorForEarlyCompletion:0,
    shiftFactorForLateCompletion:0,
    strategyUnit: null,
    toleranceFactorForEarlyCompletion:0,
    toleranceFactorForLateCompletion:0
  };


  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;
  sub: any;
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private appStateSvc: AppStateService,
              private mStrategyTypeSvc: MaintenanceStrategyService) {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    });
  }

  ngOnInit(){
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.mStrategyTypeSvc.filterObservable(this.pageFilter))).subscribe(result => {
        // console.log("@result",result);
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        // console.log("tabData",this.tableData);
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
    this.filter(this.pageFilter);
  }

modalShow(id, mod: string) {
    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
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

  getIndex(index) {
    this.tableDetailIndex = index;
  }

  resetFilter() {
    this.pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    maintenanceStrategyId: null,
    strategyName: null,
    description: null,
    active: null,
    query: null,
    orderByProperty:null,
    orderByDirection:null,
    callHerizon:0,
    plantId: this.pageFilter.plantId,
    schedulingIndicator:0,
    shiftFactorForEarlyCompletion:0,
    shiftFactorForLateCompletion:0,
    strategyUnit: null,
    toleranceFactorForEarlyCompletion:0,
    toleranceFactorForLateCompletion:0
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
}
