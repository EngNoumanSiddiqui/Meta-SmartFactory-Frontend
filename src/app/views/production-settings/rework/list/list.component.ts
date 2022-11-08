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
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { BookType } from 'xlsx/types';


@Component({
  selector: 'rework-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ReworkListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  partModal = {
    modal: null,
    id: null
  };

  dialog = { visible: false }
  selectedReworkForProductionOrder = null;
  prodEditModal = { active: false, uniqueId: null, data: null, selectedIndex: 'small' };

  selectedColumns = [
    // {field: 'plant', header: 'plant', index:1},
    {field: 'scrapId', header: 'rework-id'},
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
    {field: 'reworkStatus', header: 'status'},
    {field: 'scrapCause', header: 'rework-cause'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'employeeLoginDate', header: 'employee-login-date'},
    {field: 'createDate', header: 'create-date'},
  ];
  cols = [
    {field: 'scrapId', header: 'rework-id'},
    {field: 'scrapType', header: 'rework-type'},
    {field: 'type', header: 'type'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'workstation', header: 'workstation'},
    {field: 'reworkStatus', header: 'status'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'returnQuantity', header: 'return-quantity'},
    {field: 'returnQuantityUnit', header: 'return-quantity-unit'},
    {field: 'reworkWorker', header: 'reworkWorker'},
    {field: 'plant', header: 'plant'},
    {field: 'scrapCause', header: 'rework-cause'},
    {field: 'operator', header: 'operator'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'material', header: 'material'},
    {field: 'jobOrder', header: 'job-order-id'},
    {field: 'jobOrderOperation', header: 'job-order-operation-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'shiftName', header: 'shift-name'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
    {field: 'batch', header: 'batch'},
    {field: 'employeeLoginDate', header: 'employee-login-date'},
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
    wareHouseName: null,
    query: null,
    type: 'REWORK',
    orderByProperty: 'scrapId',
    orderByDirection: 'desc'
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
  prodOrderTypeList: any;
  constructor(
    private scrapService: ScrapService,
    private loaderService: LoaderService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private appStateService: AppStateService,
    private enumService: EnumService,
    private utilities: UtilitiesService,
    private _prodOrderSvc: ProductionOrderService,
    ) {
     
     }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(700),
      switchMap(term => this.scrapService.filterObservable(this.pageFilter))).subscribe(
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
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      }
      
    });


    this.enumService.getProductionOrderTypeList().then(result => this.prodOrderTypeList = result).catch(error => console.log(error));
  }

  onEditedProdItem(event) {
    if (event === 'close') {
      this.prodEditModal.data = null;
      this.prodEditModal.uniqueId = null;
      this.prodEditModal.active = false;
    } else {

      this.prodEditModal.data = null;
      this.prodEditModal.uniqueId = null;
      this.prodEditModal.active = false;
    }
  }
  saveCombineOrderModal() {
    if(this.prodEditModal?.data?.prodOrderStatus==='WAITING_FINAL_REVIEW') {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-save-without-changes-in-job-order-operations'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-save',
        accept: () => {
          this._prodOrderSvc.saveEventFire.next('saveEvent');
        },
        reject: () => {

        }
      })
    } else {
      this._prodOrderSvc.saveEventFire.next('saveEvent');
    }
  }
  completeReviewModal() {
    this._prodOrderSvc.saveCompleteEventFire.next('saveEvent');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  // filterByColumn(value, field) {
  //   //console.log("@value",value,field);
  //   if (ConvertUtil.isEmptyString(value)) {
  //     value = null;
  //   }
  //   if (value && field === 'amount') {
  //     value = String(value).toUpperCase();
  //   }
  //   this.pageFilter[field] = value;
  //   this.filter(this.pageFilter);
  // }
// FILTERING AREA
filtingAreaColumns (event) {
  this.selectedColumns.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
}

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }


    // // for material filter
    // if (value && field === 'material') {
    //   this.pageFilter.materiaName = value;
    // } else if (!value && field === 'material') {
    //   this.pageFilter.materiaName = null;
    // }

    // // for operator filter
    // if (value && field === 'operator') {
    //   this.pageFilter.operatorName = value;
    // } else if (!value && field === 'operator') {
    //   this.pageFilter.operatorName = null;
    // }

    // // for Plant  filter
    // if (value && field === 'plant') {
    //   this.pageFilter.plantName = value;
    // } else if (!value && field === 'plant') {
    //   this.pageFilter.plantName = null;
    // }

    //   // for wareHouse  filter
    //   if (value && field === 'wareHouse') {
    //     this.pageFilter.wareHouseName = value;
    //   } else if (!value && field === 'wareHouse') {
    //     this.pageFilter.wareHouseName = null;
    //   }

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

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.pageFilter.orderByProperty = item;
    this.filter(this.pageFilter);
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
      this.appStateService.exportAsFile(mappedDAta, type, 'Rework');
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
        this.appStateService.exportAsFile(mappedDAta, type, 'Rework');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
   
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


  createProductionOrder(rowData) {
    this.selectedReworkForProductionOrder = JSON.parse(JSON.stringify(rowData));
    this.dialog.visible = true;
  }

  saveProdOrder() {

    this.loaderService.showLoader();
    const dto = {
      scrapId: this.selectedReworkForProductionOrder.scrapId,
      quantity: this.selectedReworkForProductionOrder.quantity,
    }
    this.scrapService.saveProdOrderForRework(dto).then(res => {
      this.utilities.showInfoToast('prod-order-created-success');
      this.loaderService.hideLoader();
      
      this._prodOrderSvc.getDetail(res)
      .then((result: any) => {
        this.dialog.visible = false;
        this.prodEditModal.data = result;
        this.prodEditModal.active = true;
        this.prodEditModal.uniqueId = res;
      });

    }).catch(err => {
      this.utilities.showInfoToast('error-creating-production-order');
      this.loaderService.hideLoader();
    })

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
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }
  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showOpertorDetail(operatorId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, operatorId);
  }

  showScrapCauseDetail(scrapCauseId) {

  }

  showScrapCauseReworkDetail(scrapCauseReworkId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SCRAPCAUSEREWORK, scrapCauseReworkId);
  }

  showScrapTypeDetail(scrapTypeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SCRAPTYPE, scrapTypeId);
  }

  showPlantDetail(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showWarehouseDetail(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showShiftDetailDialog(shiftId){
    if(shiftId) this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }
  
  getStyle(field){
    if(field ==  'wareHouse' || field == 'workstation') return '114px';

    if(field == 'operator') return '6em';
  }
}
