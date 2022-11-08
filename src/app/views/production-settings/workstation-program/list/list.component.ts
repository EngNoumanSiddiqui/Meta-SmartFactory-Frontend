/**
 * Created by reis on 29.07.2019.
 */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'environments/environment';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { WorkstationProgramService } from 'app/services/dto-services/product-tree/worksation-program.service';
import { ConvertUtil } from 'app/util/convert-util';
import { WorkstationProgramFilterDto } from 'app/dto/workstation-program/workstation.program';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'workstation-program-list',
  templateUrl: './list.component.html'
})

export class WorkstationProgramListComponent implements OnInit, OnDestroy {
  
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null
  };

  private searchTerms = new Subject<any>();

  tableData = [];
  selectedData = [];
  selectedColumns = [
    { field: 'workstationProgramId', header: 'workstation-program-id' },
    // { field: 'code', header: 'code' },
    { field: 'workStationId', header: 'workstation-id' },
    { field: 'workStationName', header: 'workstation-name' },
    { field: 'description', header: 'name' },
    { field: 'plcCode', header: 'plc-code' },
    { field: 'plcValue', header: 'plc-value' },
    { field: 'unit', header: 'unit' },
    { field: 'createDate', header: 'create-date' },
  ];
  cols = [
    { field: 'workstationProgramId', header: 'workstation-program-id' },
    { field: 'code', header: 'code' },
    { field: 'workStationId', header: 'workstation-id' },
    { field: 'workStationName', header: 'workstation-name' },
    { field: 'description', header: 'name' },
    { field: 'plcCode', header: 'plc-code' },
    { field: 'plcValue', header: 'plc-value' },
    { field: 'unit', header: 'unit' },
    { field: 'createDate', header: 'create-date' },
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
  pageFilter: WorkstationProgramFilterDto = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    workstationProgramId: null,
    code: null,
    description: null,
    query: null,
    createDate: null,
    plcCode: null,
    plcValue: null,
    updateDate:null,
    workStationId: null,
    orderByProperty: 'workstationProgramId',
    orderByDirection: 'desc',
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;
  plantId: number;
  subscription: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private mCategoryTypeSvc: WorkstationProgramService,
    private appStateService: AppStateService) {
      this.subscription = this.appStateService.plantAnnounced$.subscribe(res => {
        if (!(res)) {
         this.plantId = null;
        } else {
          this.plantId = res.plantId;
        }
      });
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.mCategoryTypeSvc.filterObservable(this.pageFilter))).subscribe(
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
      workstationProgramId: null,
      code: null,
      description: null,
      query: null,
      createDate: null,
      plcCode: null,
      plcValue: null,
      updateDate:null,
      workStationId: null,
      orderByProperty: 'workstationProgramId',
      orderByDirection: 'desc',
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.mCategoryTypeSvc.delete(id)
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

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
