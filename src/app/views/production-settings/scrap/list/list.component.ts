import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { ScrapService } from 'app/services/dto-services/scrap.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { UtilitiesService } from 'app/services/utilities.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { BookType } from 'xlsx/types';


@Component({
  selector: 'scrap-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ScrapListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  partModal = {
    modal: null,
    id: null
  };
  selectedColumns = [
    // {field: 'plant', header: 'plant'},
    {field: 'scrapId', header: 'scrap-id'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'material', header: 'material'},
    {field: 'jobOrder', header: 'job-order-id'},
    {field: 'jobOrderOperation', header: 'job-order-operation-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'shiftName', header: 'shift-name'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'workstation', header: 'workstation'},
    {field: 'operator', header: 'operator'},
    // {field: 'type', header: 'type'},
    {field: 'scrapType', header: 'scrap-type'},
    {field: 'scrapCause', header: 'scrap-cause'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'employeeLoginDate', header: 'employee-login-date'},
    {field: 'createDate', header: 'create-date'},
  ];
  cols = [
    {field: 'scrapId', header: 'scrap-id'},
    {field: 'scrapType', header: 'scrap-type'},
    {field: 'type', header: 'type'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'workstation', header: 'workstation'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'returnQuantity', header: 'return-quantity'},
    {field: 'returnQuantityUnit', header: 'return-quantity-unit'},
    {field: 'reworkWorker', header: 'reworkWorker'},
    {field: 'plant', header: 'plant'},
    {field: 'scrapCause', header: 'scrap-cause'},
    {field: 'operator', header: 'operator'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'material', header: 'material'},
    {field: 'jobOrder', header: 'job-order-id'},
    {field: 'jobOrderOperation', header: 'job-order-operation-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'shiftName', header: 'shift-name'},
    {field: 'createDate', header: 'create-date'},
    {field: 'employeeLoginDate', header: 'employee-login-date'},
    {field: 'updateDate', header: 'update-date'},
    {field: 'batch', header: 'batch'},
    {field: 'description', header: 'description'},
  ];

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    batch: null,
    createDate: null,
    jobOrderId: null,
    materialId: null,
    materiaName: null,
    materialNo: null,
    workstationId: null,
    workstationName: null,
    operatorId: null,
    operatorName: null,
    plantId: null,
    plantName: null,
    reworkWorkerId: null,
    scrapCauseId: null,
    scrapCauseName : null,
    scrapCode : null,
    scrapDescription : null,
    scrapId: null,
    scrapTypeId: null,
    updateDate: null,
    wareHouseId: null,
    warehouseName: null,
    jobOrderOperationId: null,
    query: null,
    type: 'SCRAP',
    orderByProperty: 'scrapId',
    orderByDirection: 'desc',
    employeeLoginDate: null
  };

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };

  menuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(false, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(false, 'xlsx');
      }
    }
  ];
  selecteMenuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(true, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(true, 'xlsx');
      }
    }
  ];

  scraps = [];
  selectedScraps = [];
  private searchTerms = new Subject<any>();
  sub: Subscription;
  constructor(
    private scrapService: ScrapService,
    private loaderService: LoaderService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService
    ) {

    }
  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(700),
      switchMap(term => this.scrapService.filterObservable(term))).subscribe(
      (result: any) => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.scraps = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.scraps = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );
    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantName = null;
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }

    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  search(data) {
    this.loaderService.showLoader();
    const temp = Object.assign({}, data);
    if (temp.createDate) {
      // converted to iso string
      temp.createDate = ConvertUtil.localDateShiftAsUTC(temp.createDate);
    }
    this.searchTerms.next(temp);
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
    setTimeout(() => {
      this.search(this.pageFilter);
    }, 2500);
  }

  modalShow(id, mod: string) {
    // console.log('@call', id, mod);
      this.partModal.id = id;
      this.partModal.modal = mod;
      this.myModal.show();
  }
  reOrderData(id, item: string) {

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    if (item === 'material') {
      this.pageFilter.orderByProperty = 'materiaName';
    } else if (item === 'jobOrder') {
      this.pageFilter.orderByProperty = 'jobOrderId';
    } else if (item === 'operator') {
      this.pageFilter.orderByProperty = 'operatorName';
    } else if (item === 'plant') {
      this.pageFilter.orderByProperty = 'plantName';
    } else {
      this.pageFilter.orderByProperty = item;
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];

    this.filter(this.pageFilter);
  }
  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.scrapService.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedScraps.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.orderDate ? new Date(itm.orderDate).toLocaleString() : '';
          } else if(col.field === 'jobOrder') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrder?.jobOrderId;
          } else if(col.field === 'jobOrderOperation') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperation?.jobOrderOperationId;
          } else if(col.field === 'material') {
            obj[this._translateSvc.instant(col.header)] = itm.material?.stockName;
          } else if(col.field === 'materialNo') {
            obj[this._translateSvc.instant(col.header)] = itm.material?.stockNo;
          } else if(col.field === 'scrapCause') {
            obj[this._translateSvc.instant(col.header)] = itm.scrapCause?.scrapCauseName;
          } else if(col.field === 'scrapType') {
            obj[this._translateSvc.instant(col.header)] = itm.scrapType?.scrapDescription;
          } else if(col.field === 'shift') {
            obj[this._translateSvc.instant(col.header)] = itm.shift?.shiftName;
          } else if(col.field === 'wareHouse') {
            obj[this._translateSvc.instant(col.header)] = itm.wareHouse?.wareHouseName;
          } else if(col.field === 'workstation') {
            obj[this._translateSvc.instant(col.header)] = itm.workstation?.workStationName;
          }  else if(col.field === 'operator') {
            obj[this._translateSvc.instant(col.header)] = itm.operator?.firstName + ' ' + itm.operator?.lastName;
          }  else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Scrap');
    } else {
      this.loaderService.showLoader();
      this.scrapService.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'createDate') {
              obj[this._translateSvc.instant(col.header)] = itm.orderDate ? new Date(itm.orderDate).toLocaleString() : '';
            } else if(col.field === 'jobOrder') {
              obj[this._translateSvc.instant(col.header)] = itm.jobOrder?.jobOrderId;
            } else if(col.field === 'jobOrderOperation') {
              obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperation?.jobOrderOperationId;
            } else if(col.field === 'material') {
              obj[this._translateSvc.instant(col.header)] = itm.material?.stockName;
            } else if(col.field === 'materialNo') {
              obj[this._translateSvc.instant(col.header)] = itm.material?.stockNo;
            } else if(col.field === 'scrapCause') {
              obj[this._translateSvc.instant(col.header)] = itm.scrapCause?.scrapCauseName;
            } else if(col.field === 'scrapType') {
              obj[this._translateSvc.instant(col.header)] = itm.scrapType?.scrapDescription;
            } else if(col.field === 'shift') {
              obj[this._translateSvc.instant(col.header)] = itm.shift?.shiftName;
            } else if(col.field === 'wareHouse') {
              obj[this._translateSvc.instant(col.header)] = itm.wareHouse?.wareHouseName;
            } else if(col.field === 'workstation') {
              obj[this._translateSvc.instant(col.header)] = itm.workstation?.workStationName;
            }  else if(col.field === 'operator') {
              obj[this._translateSvc.instant(col.header)] = itm.operator?.firstName + ' ' + itm.operator?.lastName;
            }  else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'Scrap');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
   
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }
  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
  showJobOrderOperationDetail(jobOrderOperationId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, jobOrderOperationId);
    }
  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, opearationId);
  }
  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showScrapCauseDetail(scrapCauseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SCRAPCAUSE, scrapCauseId);
  }
  showScrapTypeDetail(scrapTypeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SCRAPTYPE, scrapTypeId);
  }

  showProdOrderDetail(prodOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
  }

  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(materialId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showWarehouseDetailDialog(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  showBatchDetailModal(batch) {
    if (batch) { this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batch); }
  }

  showShiftDetailDialog(shiftId) {
    if (shiftId) { this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId); }
  }

  getStyle(field) {
    if (field ==  'wareHouse') { return '7em'; }
    if (field ==  'operator') { return '6em'; } else if (field == 'materialNo' || field == 'material' ) { return '5.7em' } else if (field == 'workstation') { return '8em'; } else { return ; }
  }
}
