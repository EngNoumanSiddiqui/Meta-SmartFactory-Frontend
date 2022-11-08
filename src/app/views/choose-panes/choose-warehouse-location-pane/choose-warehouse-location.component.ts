import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { ResponseStockReportListDto } from 'app/dto/stock/stock-transfer-receipt.model';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { WarehouseLocationService } from 'app/services/dto-services/warehouse/warehouse-location.service';
@Component({
  selector: 'choose-warehouse-location-pane',
  templateUrl: './choose-warehouse-location.component.html'
})
export class ChooseWarehouseLocationPaneComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('myModal') public myModal: ModalDirective;
  stockReportModal = {
    modal: null,
    id: null
  };

  modal = { active: false };
  modal2 = { active: false, data:null, quantity:0 };
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

  @Input() wareHouseStockId = null;
  @Input() fromChoosePane = false;
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    batch: null,
    bayNo: null,
    binNo: null,
    freeze: null,
    locationId: null,
    locationName: null,
    locationNo: null,
    plantId: null,
    plantName: null,
    rowNo: null,
    stockId: null,
    stockName: null,
    stockNo: null,
    tierNo: null,
    wareHouseId: null,
    wareHouseLocationId: null,
    wareHouseName: null,
    wareHouseNo: null,
    wareHouseStockId: null,
    query: null,
    orderByProperty: 'wareHouseLocationId',
    orderByDirection: 'desc'
  };



  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    { field: 'wareHouseLocationId', header: 'warehouse-location-id' },
    { field: 'warehouseLocationNo', header: 'warehouse-location-no' },
    { field: 'wareHouseLocationGroup', header: 'warehouse-location-group' },
    { field: 'wareHouseNo', header: 'warehouse-no' },
    { field: 'wareHouseName', header: 'warehouse-name' },
    { field: 'rowNo', header: 'row-no' },
    { field: 'tierNo', header: 'tier-no' },
    { field: 'bayNo', header: 'bay-no' },
    { field: 'binNo', header: 'bin-no' },
    // { field: 'batch', header: 'batch' },
    // { field: 'barcode', header: 'barcode' },
  ];

  cols = [
    { field: 'wareHouseLocationId', header: 'warehouse-location-id' },
    { field: 'wareHouseNo', header: 'warehouse-no' },
    { field: 'wareHouseName', header: 'warehouse-name' },
    { field: 'wareHouseLocationGroup', header: 'warehouse-location-group' },
    { field: 'warehouseLocationNo', header: 'warehouse-location-no' },
    { field: 'batch', header: 'batch' },
    { field: 'barcode', header: 'barcode' },
    { field: 'rowNo', header: 'row-no' },
    { field: 'tierNo', header: 'tier-no' },
    { field: 'bayNo', header: 'bay-no' },
    { field: 'binNo', header: 'bin-no' },
  ];

  @Input('filterData') set rFilter(filter) {
    if (filter) {
      // this.pageFilter.enteredUnitQuantity = filter.reservation;
      // this.pageFilter.stockId = filter.materialId;
      // this.pageFilter.materialName = filter.materialName;
      this.pageFilter.stockNo = filter.materialNo;
      this.pageFilter.locationNo = filter.locationNo;

      // this.pageFilter.warehouseId = filter.warehouseId;
      // this.pageFilter.warehouseName = filter.warehouseName;
      // this.pageFilter.batch = filter.batch;

      // this.selectedColumns = [
      //   { field: 'materialNo', header: 'material-no' },
      //   { field: 'materialName', header: 'material' },
      //   { field: 'warehouseName', header: 'warehouse' },
      // ];
    }
  }

  @Input('warehouseName') set setWarehouseName(warehouseName) {
    if(warehouseName) {
      this.pageFilter.wareHouseName = warehouseName;
      this.filter(this.pageFilter);
    }
  }
  @Input('wareHouseNo') set setwareHouseNo(wareHouseNo) {
    if(wareHouseNo) {
      this.pageFilter.wareHouseNo = wareHouseNo;
      this.filter(this.pageFilter);
    }
  }
  selectedStockReports = [];
  listStatus;
  showLoader = false;
  stockReports: ResponseStockReportListDto[];
  isFilterMaterial = false;
  materialTypes;

  @Input('selectedStock') set s(stock) {
    if (stock) {
      this.pageFilter['materialName'] = stock.stockName;
      this.isFilterMaterial = true;
    }
  }
  @Output() selectedStockEvent = new EventEmitter();

  sub: Subscription;
  constructor(
    private warehouseLocationService: WarehouseLocationService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loaderService: LoaderService) {

  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.warehouseLocationService.filterObservable(term))).subscribe(
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

    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }

    });


    // if(this.fromChoosePane) {
    //   // remove last Two Items 
    //   this.selectedColumns = this.selectedColumns.slice(0, -2);
    //   // this.selectedColumns = this.selectedColumns.slice(0, -1);
    // }
  }

  ngOnChanges(simpledChanges: SimpleChanges) {
    if(simpledChanges.wareHouseStockId && simpledChanges.wareHouseStockId.currentValue) {
      this.pageFilter.wareHouseStockId = simpledChanges.wareHouseStockId.currentValue;
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 800);
    } else if(simpledChanges.filterData && simpledChanges.filterData.currentValue) {
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 800);
    }
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



  onWaitingTransferToClicked(rowData) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
    this.selectedRow.waitingNotificationTransferFrom = null;
    this.stockReportModal.modal = 'good-movement-notification';
  }
  onWaitingTransferFromClicked(rowData) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
    this.selectedRow.waitingNotificationTransferTo = null;
    this.stockReportModal.modal = 'good-movement-notification';
  }
  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

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
    this. pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      batch: null,
      bayNo: null,
      binNo: null,
      freeze: null,
      locationId: null,
      locationName: null,
      locationNo: null,
      plantId: this.pageFilter.plantId,
      plantName: null,
      rowNo: null,
      stockId: null,
      stockName: null,
      stockNo: null,
      tierNo: null,
      wareHouseId: null,
      wareHouseLocationId: null,
      wareHouseName: null,
      wareHouseNo: null,
      wareHouseStockId: null,
      query: null,
      orderByProperty: 'wareHouseLocationId',
      orderByDirection: 'desc'
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

    this.stockReportModal.id = id;
    this.stockReportModal.modal = mod;

    this.myModal.show();
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  isLoading() {
    return this.loaderService.isLoading();
  }

  showAutoMaticDispatchingModal(rowData) {
    console.log('@rowData', rowData);
      this.selectedRow = {
        selectedRow : JSON.parse(JSON.stringify(rowData)),
        type: 'blocked'
      };
      this.modal.active = true;
      // this.selectedRow.waitingNotificationTransferTo = null;
      this.stockReportModal.modal = 'blocked';
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
  showLocationDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.LOCATION, id);
  }

  showWareHouseDialog(warehouseId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  showReservationDialog(rowData: any) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
    // this.selectedRow.waitingNotificationTransferTo = null;
    this.stockReportModal.modal = 'stock-reservation';
  }

  showIncomingDialog(rowData: any) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
    // this.selectedRow.waitingNotificationTransferTo = null;
    this.stockReportModal.modal = 'incoming';
  }

  showOutgoingDialog(rowData: any) {
    this.selectedRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
    // this.selectedRow.waitingNotificationTransferTo = null;
    this.stockReportModal.modal = 'outgoing';
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
