import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { ResponseStockReportListDto } from 'app/dto/stock/stock-transfer-receipt.model';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StockTypeService } from 'app/services/dto-services/stock-type/stock-type.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'choose-advanced-stock-report-list',
  templateUrl: './advanced-stock-report-list.component.html',
  styleUrls: ['./advanced-stock-report-list.component.css'],
})
export class ChooseAdvancedStockReportComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  stockReportModal = {
    modal: null,
    id: null
  };

  modal = { active: false };
  modal2 = { active: false, data:null, quantity:0 };
  modal3 = { active: false, data:null, quantity:0 };
  selectedRow: any;
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

  private searchTerms = new Subject<any>();

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    unRestrictedBiggerThanZero: false,
    startDate: null,
    locationNo: null,
    barcode: null,
    endDate: null,
    plantId: null,
    warehouseId: null,
    warehouseName: null,
    materialId: null,
    materialNo: null,
    materialName: null,
    materialType: null,
    reorderPoint: null,
    batch: null,
    displayBatchStock: null,
    query: null,
    orderByProperty: 'warehousestockId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    // { field: 'plantName', header: 'plant' },
    { field: 'wareHouseStockId', header: 'warehouse-stock-id' },
    { field: 'locationNo', header: 'location-no' },
    { field: 'barcode', header: 'barcode' },
    { field: 'warehouseName', header: 'warehouse-name' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material-name' },
    { field: 'materialName2', header: 'stock-name-2' },
    { field: 'materialType', header: 'material-type' },
    { field: 'maxStockLevel', header: 'max-stock-level' },
    { field: 'safetyStock', header: 'safety-stock' },
    { field: 'reorderPoint', header: 'reorder-point' },

    { field: 'batch', header: 'batch' },
    // { field: 'height', header: 'height' },
    // { field: 'width', header: 'width' },
    // { field: 'dimensionUnit', header: 'dimension-unit' },
    { field: 'quantity', header: 'quantity' },
    { field: 'reservation', header: 'reservation' },
    { field: 'incoming', header: 'incoming' },
    { field: 'outgoing', header: 'outgoing' },
    { field: 'unRestricted', header: 'unrestricted' },
    { field: 'waitingNotificationTransferFrom', header: 'waiting-notification-transfer-from' },
    { field: 'waitingNotificationTransferTo', header: 'waiting-notification-transfer-to' },

    // { field: 'status', header: 'status' },
    { field: 'blocked', header: 'blocked' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'stockManagement', header: 'stock-management' },


  ];

  cols = [
    { field: 'plantId', header: 'plant-id' },
    { field: 'plantName', header: 'plant' },
    { field: 'warehouseId', header: 'warehouse-id' },
    { field: 'warehouseName', header: 'warehouse-name' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialId', header: 'material-id' },
    { field: 'materialName', header: 'material-name' },
    { field: 'materialName2', header: 'stock-name-2' },
    { field: 'materialType', header: 'material-type' },
    { field: 'LocationNo', header: 'location-no' },
    { field: 'batch', header: 'batch' },
    { field: 'height', header: 'height' },
    { field: 'width', header: 'width' },
    { field: 'dimensionUnit', header: 'dimension-unit' },
    { field: 'quantity', header: 'quantity' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'unRestricted', header: 'unrestricted' },
    { field: 'blocked', header: 'blocked' },
    { field: 'reservation', header: 'reservation' },
    { field: 'incoming', header: 'incoming' },
    { field: 'status', header: 'status' },
    { field: 'outgoing', header: 'outgoing' },
    { field: 'waitingNotificationTransferTo', header: 'waiting-notification-transfer-to' },
    { field: 'waitingNotificationTransferFrom', header: 'waiting-notification-transfer-from' },
  ];

  selectedStockReports = [];
  listStatus;
  showLoader = false;
  stockReports: ResponseStockReportListDto[];
  materialTypes;

  @Input('selectedStock') set s(stock) {
    if (stock) {
      this.pageFilter['materialName'] = stock.stockName;
    }
  }
  @Input('filteredData') set sc(filteredData) {
    if (filteredData) {
      this.pageFilter.locationNo = filteredData.locationNo;
      this.pageFilter.barcode = filteredData.barcode;
      this.pageFilter.materialNo = filteredData.materialNo;
      this.pageFilter.warehouseName = filteredData.warehouseName;
      this.pageFilter.batch = filteredData.batch;
      setTimeout(() => {
        this.search(this.pageFilter);
      }, 500);

    }
  }
  @Output() selectedStockEvent = new EventEmitter();

  sub: Subscription;
  constructor(private stockCardService: StockCardService,
    private utilities: UtilitiesService,
    private _stockTypesSvc: StockTypeService,
    private appStateService: AppStateService,
    private loaderService: LoaderService) {

  }

  ngOnInit() {
    // this.pageFilter.endDate = new Date();
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.stockCardService.filterAdvanceWarehouseStockReports(term))).subscribe(
        result => {
          this.loaderService.hideLoader();
          this.stockReports = result['content'];
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          // this.stockReports = this.stockReports.filter(item => item.quantity !== 0 || item.reservation !== 0 || item.incoming !== 0 || item.outgoing !== 0 || item.unRestricted !== 0)
        },
        error => {
          this.loaderService.hideLoader();
          this.stockReports = [];
          this.utilities.showErrorToast(error);
        }
      );
    this._stockTypesSvc.getIdNameList().then(result => this.materialTypes = result).catch(error => console.log(error));
    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }

    });
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }


  editStockQuantity(rowData) {
    this.modal2.data = rowData;
    this.modal2.quantity = rowData.quantity;
    this.modal2.active = true;
  }

  onStockQuantitySubmitted() {
    this.loaderService.showLoader();
    const {wareHouseStockId, quantity} = this.modal2.data;
    const updatedQuantity = this.modal2.quantity - quantity;
    this.stockCardService.updateWareHouseStock(wareHouseStockId, updatedQuantity).then(res => {
      this.loaderService.hideLoader();
      this.modal2.data.quantity = this.modal2.quantity;
      this.modal2.active=false;
      this.utilities.showSuccessToast('stock-quantity-updated');
      this.filter(this.pageFilter);
    }).catch(error => {this.loaderService.hideLoader(); this.utilities.showErrorToast(error); });
  }
  


  onWaitingTransferToClicked(rowData) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    // this.modal.active = true;
    // this.selectedRow.waitingNotificationTransferFrom = null;
    // this.stockReportModal.modal = 'good-movement-notification';
  }
  onWarehouseStockToClicked(rowData) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    // this.modal.active = true;
    // this.stockReportModal.modal = 'warehouse-location';
  }
  onWaitingTransferFromClicked(rowData) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    // this.modal.active = true;
    // this.selectedRow.waitingNotificationTransferTo = null;
    // this.stockReportModal.modal = 'good-movement-notification';
  }
  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  // addNew() {
  //   this.stockReportModal.modal = 'warehousestock';
  //   this.modal.active = true;
  // }

  search(data) {
    this.loaderService.showLoader();
    const temp = Object.assign({}, data);

    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    } if (temp.endDate) {

      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
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

  geTotalQuantity = () => {
    let sum = 0;
    if (this.stockReports) {
      this.stockReports.forEach(itm => {
        sum = sum + itm.quantity;
      });
    }
    return sum;
  }
  geTotalReservation = () => {
    let sum = 0;
    if (this.stockReports) {
      this.stockReports.forEach(itm => {
        sum = sum + itm.reservation;
      });
    }
    return sum;
  }
  geTotalIncoming = () => {
    let sum = 0;
    if (this.stockReports) {
      this.stockReports.forEach(itm => {
        sum = sum + itm.incoming;
      });
    }
    return sum;
  }
  geTotalOutgoing = () => {
    let sum = 0;
    if (this.stockReports) {
      this.stockReports.forEach(itm => {
        sum = sum + itm.outgoing;
      });
    }
    return sum;
  }
  geTotalUnRestricted = () => {
    let sum = 0;
    if (this.stockReports) {
      this.stockReports.forEach(itm => {
        sum = sum + itm.unRestricted;
      });
    }
    return sum;
  }
  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      unRestrictedBiggerThanZero: false,
      startDate: null,
      materialNo: null,
      endDate: null,
      locationNo: null,
      barcode: null,
      plantId: this.pageFilter.plantId,
      warehouseId: null,
      reorderPoint: null,
      warehouseName: null,
      materialId: null,
      materialName: null,
      materialType: null,
      batch: null,
      displayBatchStock: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
    };
    this.filter(this.pageFilter);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    // this.stockReportModal.id = id;
    // this.stockReportModal.modal = mod;

    // this.myModal.show();
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  isLoading() {
    return this.loaderService.isLoading();
  }

  showAutoMaticDispatchingModal(rowData) {
    // console.log('@rowData', rowData);
    //   this.selectedRow = {
    //     selectedRow : JSON.parse(JSON.stringify(rowData)),
    //     type: 'blocked'
    //   };
    //   this.modal.active = true;
    //   // this.selectedRow.waitingNotificationTransferTo = null;
    //   this.stockReportModal.modal = 'blocked';
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(materialId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showWareHouseDialog(warehouseId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  showReservationDialog(rowData: any) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    // this.modal.active = true;
    // // this.selectedRow.waitingNotificationTransferTo = null;
    // this.stockReportModal.modal = 'stock-reservation';
  }

  showIncomingDialog(rowData: any) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    // this.modal.active = true;
    // // this.selectedRow.waitingNotificationTransferTo = null;
    // this.stockReportModal.modal = 'incoming';
  }

  showOutgoingDialog(rowData: any) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    // this.modal.active = true;
    // // this.selectedRow.waitingNotificationTransferTo = null;
    // this.stockReportModal.modal = 'outgoing';
  }

  showSaleOrderItemDialog(outgoingId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, outgoingId);
  }

  showPurchaseOrderItemDialog(incomingId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.RESERVATION, incomingId);
  }

  // getStyle(field){
  //   if(field == 'warehouseName') return '100px';
  //   else if(field == 'reservation') return '105px';
  //   else if(field == 'unRestricted') return '108px';
  //   else if(field == 'incoming' || field == 'outgoing') return '85px';
  //   else if(field == 'waitingNotificationTransferTo' || field == 'waitingNotificationTransferFrom') return '102px';

  // }

}
