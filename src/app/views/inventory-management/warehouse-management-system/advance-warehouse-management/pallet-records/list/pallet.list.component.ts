import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MenuItem, Message } from 'primeng';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { PalletFilterRequestDto, PalletListResponse } from 'app/dto/stock/pallet.model';
import { PalletService } from 'app/services/dto-services/pallet/pallet.service';
import { CmsService } from 'app/services/dto-services/print/cms.service';
import { BarCodeService } from 'app/services/dto-services/barcode/barcode.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { TranslateService } from '@ngx-translate/core';
import { BookType } from 'xlsx/types';
import { JobOrderOperationPalletService } from 'app/services/dto-services/job-order/job-order-operation-pallet.service';

@Component({
  selector: 'pallet-list',
  templateUrl: './pallet.list.component.html',
})
export class PalletListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  palletModal = {
    modal: null,
    id: null
  };
  selectedPallets: PalletListResponse[] = [];
  msgs: Message[] = [];
  pallets: any[] = [];
  showLoader = false;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc','asc' ,'asc', 'asc' ,'asc', 'asc' ,'asc'];
  pallet: PalletListResponse;
  plantId: number = null;
  templateId = 6;
  palletStatus = ['REQUESTED', 'COMPLETED', 'CANCELLED'];
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

  pageFilter: PalletFilterRequestDto = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    jobOrderId: null,
    palletId: null,
    palletStatus: null,
    palletPosition: null,
    palletStatusList: [],
    query: null,
    stockId: null,
    wareHouseId: null,
    orderByProperty: 'palletId',
    orderByDirection: 'desc',
    plantId: null
  };

  selectedColumns = [
    { field: 'palletId', header: 'pallet-id' },
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material-name' },
    { field: 'goodQuantity', header: 'quantity' },
    { field: 'unit', header: 'unit' },
    { field: 'wareHouseName', header: 'warehouse' },
    { field: 'palletType', header: 'pallet-type' },
    { field: 'palletPosition', header: 'pallet-position' },
    { field: 'batch', header: 'batch' },
    { field: 'createDate', header: 'create-date' },
    { field: 'palletStatus', header: 'status' },
  ];
  
  cols = [
    { field: 'palletId', header: 'pallet-id' },
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material-name' },
    { field: 'goodQuantity', header: 'quantity' },
    { field: 'unit', header: 'unit' },
    {field: 'variety', header: 'variety'},
    {field: 'maxBoxQuantity', header: 'max-box-quantity'},
    {field: 'requirementPalletQuantityForForklift', header: 'requirement-pallet-quantity-for-forklift'},
    { field: 'wareHouseName', header: 'warehouse' },
    { field: 'palletType', header: 'pallet-type' },
    { field: 'palletPosition', header: 'pallet-position' },
    { field: 'batch', header: 'batch' },
    { field: 'createDate', header: 'create-date' },
    { field: 'palletStatus', header: 'status' },

  ];

  private searchTerms = new Subject<any>();

  private palletSearchTerms = new Subject<any>();

  palletPositions = ['FILLING', 'SENT'];

  sub: Subscription;


  selectedPalletCols = [
    {field: 'jobOrderOperationPalletId', header: 'job-order-operation-pallet-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'palletSetting', header: 'pallet-setting-id'},
    {field: 'palletName', header: 'pallet-setting-name'},
    {field: 'plannedQuantity', header: 'planned-quantity'},
    {field: 'reservedQuantity', header: 'reserved-quantity'},
    {field: 'plannedStartTime', header: 'planned-start-time'},
    {field: 'plannedFinishTime', header: 'planned-finish-time'},
    {field: 'createDate', header: 'create-date'},
  ];
  palletCols = [
    {field: 'jobOrderOperationPalletId', header: 'job-order-operation-pallet-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'palletSetting', header: 'pallet-setting-id'},
    {field: 'palletName', header: 'pallet-setting-name'},
    {field: 'plannedQuantity', header: 'planned-quantity'},
    {field: 'reservedQuantity', header: 'reserved-quantity'},
    {field: 'plannedStartTime', header: 'planned-start-time'},
    {field: 'plannedFinishTime', header: 'planned-finish-time'},
    {field: 'createDate', header: 'create-date'},
  ];
  palletPagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 200, 500, 1000],
    rows: 20,
    tag: ''
  };

  palletPageFilter = {
    pageNumber: 1,
    pageSize:20,
    query: null,
    orderByProperty: 'jobOrderOperationPalletId',
    orderByDirection: 'desc',
    plantId: null,
    plantName: null,
    jobOrderOperationId: null,
    jobOrderOperationPalletId: null,
    palletSettingId: null,
  };
  tableData: any;
  selectedTableData: any;

  constructor(private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _palletSvc: PalletService,
    private _cmsSvc: CmsService,
    private jobOrderOperationPalletSerive: JobOrderOperationPalletService,
    private _translateSvc: TranslateService,
    private appStateService: AppStateService,
    private _barCodeSvc: BarCodeService,
    private _appStateSvc: AppStateService) {
    
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._palletSvc.filterObservable(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.pallets = result['content'];
          // this.stockQuery =  this.pageFilter.stockName;
          this.loaderService.hideLoader();
        },
        error => {
          this.loaderService.hideLoader();
          this.pallets = [];
          this.utilities.showErrorToast(error)
        }
      );
    this.palletSearchTerms.pipe(
      debounceTime(500),
      switchMap(term => this.jobOrderOperationPalletSerive.filterObservable(term))).subscribe(
        result => {
          this.tableData = result['content'];
          this.palletPagination.currentPage = result['currentPage'];
          this.palletPagination.totalElements = result['totalElements'];
          this.palletPagination.totalPages = result['totalPages'];
          this.loaderService.hideLoader();
        },
        error2 => {
          this.tableData = [];
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error2)
        }
      );

     this.sub= this._appStateSvc.plantAnnounced$.subscribe(res => {
        if (!(res)) {
          this.plantId = null;
          this.pageFilter.plantId = null;
        } else {
          this.plantId = res.plantId;
          this.pageFilter.plantId = this.plantId;
          this.palletPageFilter.plantId = this.plantId;
          this.filter(this.pageFilter);
          this.filterPallet(this.palletPageFilter);
        }
      });
    
  }

  pushPalletToErp(jobOrderOperationId) {
    this._palletSvc.pushPalletToErp(jobOrderOperationId).then(() => {
      this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
      }, environment.DELAY);
    }
  ).catch(error => this.utilities.showErrorToast(error));
}


  

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }
  filterByColumnPallet(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.palletPageFilter[field] = value;
    this.filterPallet(this.palletPageFilter);
  }
  reOrderPalletData(id, item: string) {
    this.palletPageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.palletPageFilter.orderByDirection = this.classReOrder[id];
    this.filterPallet(this.palletPageFilter);
  }

  modalShow(id, mod: string) {

    this.palletModal.id = id;
    this.palletModal.modal = mod;

    this.myModal.show();
  }


  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  search(data) {
    this.loaderService.showLoader();

    this.searchTerms.next(data);
  }

  filterPallet(data) {
    this.palletPageFilter.pageNumber = 1;
    this.searchPallet(data);
  }
  searchPallet(data) {
    this.loaderService.showLoader();
    this.palletSearchTerms.next(data);
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
  myChangesPallet(event) {
    this.palletPagination.currentPage = event.currentPage;
    this.palletPagination.pageNumber = event.pageNumber;
    this.palletPagination.totalElements = event.totalElements;
    this.palletPagination.pageSize = event.pageSize;
    this.palletPagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.palletPagination.tag !== event.searchItem) {
      this.palletPagination.pageNumber = 1;
    }
    this.palletPagination.tag = event.searchItem;

    this.palletPageFilter.pageNumber = this.palletPagination.pageNumber;
    this.palletPageFilter.pageSize = this.palletPagination.pageSize;
    this.palletPageFilter.query = this.palletPagination.tag;

    this.searchPallet(this.palletPageFilter)
  }

  reOrderData(id, item: string) {
    
    if(item !== 'palletId') return;
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  showPalletDetails(palletSettingId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PALLET, palletSettingId);
  }

  showJobOrderOperationDetail(jobOrderOperationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, jobOrderOperationId);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      jobOrderId: null,
      palletId: null,
      palletStatus: null,
      palletPosition: null,
      palletStatusList: [],
      query: null,
      stockId: null,
      wareHouseId: null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  printPallet(pallet: PalletListResponse) {
    this.loaderService.showLoader();
    this.pallet = pallet;
    console.log('pallet', pallet)
    if (pallet.jobOrder) {
      this._barCodeSvc.getBarcode(pallet.jobOrder.jobOrderId).then((bCode:any) => {
        this.createImageFromBlob(bCode);
      });
    } else {
      this.getCommonTemplate(this.templateId)
    }

  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log('resultImage', reader.result);
      this.getCommonTemplate(this.templateId, reader.result);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  getCommonTemplate(id, bCode = null) {
    this._cmsSvc.detail(id).then((res: any) => {
      this.loaderService.hideLoader();
      let printContents, popupWin;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      printContents = this.stripHtmlText(res.templeteText, this.pallet, bCode);
      popupWin.document.open();
      popupWin.document.write(`
          <html>
              <head>
                  <title>Print tab</title>
                  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                  <style>
                  img{
                    max-height: 150px;
                    max-width: 210px;
                  }.table{
                    width:100%;
                  }
                  </style>
              </head>
              <body onload="window.print(); window.close()">
                  ${printContents}
              </body>
          </html>
        `);
      // popupWin.onafterprint = (evt) => this.afterPrint(evt);
      popupWin.document.close();
    });
  }

  stripHtmlText(printContents, pallet, bCode) {
    let quantity = 0;
    if(pallet.goodQuantity > 0){
      quantity = pallet.goodQuantity;
    }else if(pallet.scrapQuantity){
      quantity = pallet.scrapQuantity;
    }else if(pallet.reworkQuantity){
      quantity = pallet.reworkQuantity;
    }
    printContents = printContents.replace('{{createDate}}', (pallet.createDate) ? pallet.createDate : '');
    printContents = printContents.replace('{{unit}}', (pallet.stock) ? pallet.stock?.baseUnit : '');
    printContents = printContents.replace('{{batch}}', (pallet.batch) ? pallet.batch : '');
    printContents = printContents.replace('{{goodQuantity}}', quantity);
    printContents = printContents.replace('{{stockNo}}', (pallet.stock) ? pallet.stock.stockNo : '');
    printContents = printContents.replace('{{stockName}}', (pallet.stock) ? pallet.stock.stockName : '');
    printContents = printContents.replace('{{jobOrderId}}', (pallet.jobOrder) ? pallet.jobOrder.jobOrderId : '');
    printContents = printContents.replace('{{shiftId}}', (pallet.shiftId) ? pallet.shiftId : '');
    printContents = printContents.replace('{{barcode}}', `<img src="${bCode}">`);

    return printContents;
  }

  selectedJobOrderEvent(event) {
    if (event) {
      this.pageFilter.jobOrderId = event.jobOrderId;
      this.filter(this.pageFilter);
    }
  }

  showDetailModal(field:string, data:any){
    if(field === 'jobOrderId'){
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, data.jobOrder.jobOrderId);
    }else if(field === 'stockNo' || field === 'stockName'){
      this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, data.stock.stockId)
    }else if(field === 'wareHouseName'){
      this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, data.wareHouse.wareHouseId)
    }else if(field === 'batch'){
      this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, data.batch)
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedPallets.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'jobOrderId') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrder?.jobOrderId;
          } else if(col.field === 'stockNo') {
            obj[this._translateSvc.instant(col.header)] = itm.stock?.stockNo;
          } else if(col.field === 'stockName') {
            obj[this._translateSvc.instant(col.header)] = itm.stock?.stockName;
          } else if(col.field === 'wareHouseName') {
            obj[this._translateSvc.instant(col.header)] = itm.wareHouse?.wareHouseName;
          } else if(col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] =  itm.createDate ? new Date(itm.createDate).toLocaleString(): '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'palledRecords');
    } else {
      this.loaderService.showLoader();
      this._palletSvc.filterObservable({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .subscribe(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'jobOrderId') {
              obj[this._translateSvc.instant(col.header)] = itm.jobOrder?.jobOrderId;
            } else if(col.field === 'stockNo') {
              obj[this._translateSvc.instant(col.header)] = itm.stock?.stockNo;
            } else if(col.field === 'stockName') {
              obj[this._translateSvc.instant(col.header)] = itm.stock?.stockName;
            } else if(col.field === 'wareHouseName') {
              obj[this._translateSvc.instant(col.header)] = itm.wareHouse?.wareHouseName;
            } else if(col.field === 'createDate') {
              obj[this._translateSvc.instant(col.header)] =  itm.createDate ? new Date(itm.createDate).toLocaleString(): '';
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'palledRecords');
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
  showworkStationDetail(workstation) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation);
  }

}
