import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { environment } from 'environments/environment';
import { ResponseStockReportListDto } from 'app/dto/stock/stock-transfer-receipt.model';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StockTypeService } from 'app/services/dto-services/stock-type/stock-type.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'stock-report-list',
  templateUrl: './stock-report-list.component.html',
  styleUrls: ['./stock-report-list.component.css'],
})
export class ListStockReportComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  stockReportModal = {
    modal: null,
    id: null
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

  private searchTerms = new Subject<any>();

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,

    startDate: null,
    endDate: null,
    plantId: null,
    wareHouseId: null,
    materialId: null,
    materialType: null,
    batch: null,
    displayBatchStock: null,

    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    // {field: 'plantName', header: 'plant'},
    {field: 'warehouseName', header: 'warehouse-name'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    {field: 'materialType', header: 'material-type'},
    {field: 'batch', header: 'batch'},
    // {field: 'height', header: 'height' },
    // {field: 'width', header: 'width' },
    {field: 'quantity', header: 'quantity'},
    // {field: 'reservation', header: 'reservation'},
    // {field: 'incoming', header: 'incoming'},
    // {field: 'outgoing', header: 'outgoing'},
    {field: 'unRestricted', header: 'unrestricted'},
    {field: 'baseUnit', header: 'base-unit'},
    // {field: 'blocked', header: 'blocked'}


  ];

  cols = [
    {field: 'plantId', header: 'plant-id'},
    {field: 'plantName', header: 'plant'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'warehouseId', header: 'warehouse-id'},
    {field: 'warehouseName', header: 'warehouse-name'},
    {field: 'materialId', header: 'material-id'},
    {field: 'materialName', header: 'material-name'},
    {field: 'materialType', header: 'material-type'},
    {field: 'batch', header: 'batch'},
    { field: 'height', header: 'height' },
    { field: 'width', header: 'width' },
    // { field: 'dimensionUnit', header: 'dimension-unit' },
    {field: 'quantity', header: 'quantity'},
    {field: 'unRestricted', header: 'unrestricted'},
    {field: 'baseUnit', header: 'base-unit'},

    // {field: 'blocked', header: 'blocked'},
    // {field: 'reservation', header: 'reservation'},
    // {field: 'incoming', header: 'incoming'},
    // {field: 'outgoing', header: 'outgoing'}
  ];

  selectedStockReports = [];
  listStatus;
  showLoader = false;
  stockReports: ResponseStockReportListDto[];
  isFilterMaterial: boolean = false;
  materialTypes;

  @Input('selectedStock') set s(stock){
    if(stock){
      this.pageFilter['materialName'] = stock.stockName;
      this.isFilterMaterial = true;
    }
  }
  @Output() selectedStockEvent = new EventEmitter();

  constructor(private stockCardService: StockCardService,
              private utilities: UtilitiesService,
              private _stockTypesSvc: StockTypeService,
              private appStateService: AppStateService,
              private loaderService: LoaderService) {
                this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.plantId = null;
                  } else {
                    this.pageFilter.plantId = res.plantId;
                  }
                  this.filter(this.pageFilter);
                });
  }

  ngOnInit() {
    this.pageFilter.endDate = new Date();
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.stockCardService.filterStockReports(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.stockReports = result['content'];
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
      },
      error => {
        this.loaderService.hideLoader();
        this.stockReports = [];
        this.utilities.showErrorToast(error);
      }
    );
    this._stockTypesSvc.getIdNameList().then(result => this.materialTypes = result).catch(error => console.log(error));
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

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,

      startDate: null,
      endDate: null,
      plantId: this.pageFilter.plantId,
      wareHouseId: null,
      materialId: null,
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
}
