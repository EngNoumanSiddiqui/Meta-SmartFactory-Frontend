import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng';
import { StockTypeService } from 'app/services/dto-services/stock-type/stock-type.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { CreateStockCostingDto, StockSales } from 'app/dto/stock/stock-card.model';
import { BookType } from 'xlsx';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { StockStrategyService } from 'app/services/dto-services/stock-stategy/stock-strategy.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  stockTypes = [];
  stockTypesOneList = [];
  stockTypesTwoList = [];

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myPlusModal') public myPlusModal: ModalDirective;
  @ViewChild('myClassModal') public myClassModal: ModalDirective;
  @ViewChild('myClassModalEdit') public myClassModalEdit: ModalDirective;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  showLoader = false;
  workcenters: any = [];//change name
  sentRequest: boolean = false;
  stockSales: StockSales;
  isUpdate = false;
  menuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportCSV('csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportCSV('xlsx');
      }
    }
  ];

  // classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  dialog = {
    mode: null,
    visible: false,
    uniqueId: null,
    data: null
  };
  workcenterModal = {
    modal: null,
    data: null,
    id: null
  };
  workcenterModalPlus = {
    modal: null,
    data: null,
    id: null
  };

  // list of selected column
  selectedColumns = [
    { field: 'stockTypeId', header: 'stock-type-id' },
    { field: 'stockTypeCode', header: 'stock-type-no' },
    { field: 'stockTypeName', header: 'stock-type-name' },
    { field: 'stockTypeOneCode', header: 'class-2-no' },
    { field: 'stockTypeOneName', header: 'class-2-name' },
    { field: 'stockTypeTwoCode', header: 'class-3-no' },
    { field: 'stockTypeTwoName', header: 'class-3-name' }
  ];

  stock = {
    stockName: null,
    stockName2: null,
    stockName3: null,
    stockNo: null,
    stockNoChangeAllowed: false,
    defaultProductTreeId: null,
    dimensionUnit: null,
    grossWeight: null,
    extraProductionPercentage: 0,
    industryId: null,
    netWeight: 0,
    locationNo: null,
    scrapMust: false,
    stockTypeId: null,
    stockTypeOneId: null,
    unit2: null,
    stockTypeTwoId: null,
    flexibleCut: false,
    productionOrderWareHouseId: null,
    baseUnit: null,
    height: 0,
    isBatchActive: true,
    stockManagement: true,
    length: 0,
    purchaseNotificationPeriod: null,
    plantId: null,
    plantName: null,
    stockGroupId: null,
    groupDescription: null,
    stockId: null,
    combineStockIds: null,
    stockPurchasing: {
      baseUnit: null,
      batchManagement: true,
      orderUnit: null,
      plantId: null,
      plantName: null,
      purchaseInfoRecordList: [],
      stockId: null,
      stockName: null,
      stockPurchasingCode: null,
      stockPurchasingId: null,
      wareHouseId: null,
      wareHouseName: null,
      supplierLeadTimeDay: null,
      maxOrderSizePerWeek: null

    },
    minSchReadyReservationPercentage: null,
    maxStockLevel: null,
    reorderPoint: null,
    reorderStrategy: null,
    safetyStock: null,
    stockUnitMeasureList: null,
    thickness: 0,
    formula: null,
    innerDiameter: null,
    outerDiameter: null,
    density: null,
    volume: null,
    volumeUnit: null,
    weightUnit: null,
    ytdScrapPercentage: 0,
    techScrapPercentage: 0,
    numberOfEdge: 0,
    width: 0,
    buy: false,
    make: false,
    purchaseOrderWarehouseId: null,
    salesOrderWarehouseId: null,
    stockStatus: null,
    stockCosting: null,
    stockQuality: null
  };
  stockCosting: CreateStockCostingDto = {
    baseUnit: null,
    costCenterId: null,
    currencyCode: null,
    orderUnit: null,
    plantId: null,
    stockCostingCode: null,
    stockCostingId: null,
    stockId: null,
    procurementType: 'STANDARD',
    stockCostEstimate: {
      costEstimateCode: null,
      costEstimateId: null,
      currentPrice: null,
      currentPricePeriod: new Date(),
      movingPrice: null,
      movingPriceSelection: false,
      plannedPrice: null,
      plannedPricePeriod: new Date(),
      previousPrice: null,
      previousPricePeriod: null,
      standardPrice: null,
      stockCostingId: null,
      stockId: null
    },
    stockValuation: {
      movingPriceSelection: false,
      stockCostingId: null,
      stockId: null,
      stockTotalValue: null,
      stockValuationCode: null,
      stockValuationId: null,
      validFrom: null
    }
  }

  stockType = {
    stockTypeId: null,
    classTwoCode: '',
    classTwoName: '',
    classThreeCode: '',
    classThreeName: ''
  };

  validateDuration(label, value) {
    if (!value || value === '') {
      const lbl = this._translateSvc.instant(label);
      this.utilities.showWarningToast(lbl + ' must not be empty');
      return false;
    }
    return true;
  }

  sub: Subscription;
  withPanelSubscription: Subscription;
  isWithPanel: boolean = false;
  jobOrderOperationIds: any;

  constructor(
    private _stockTypeSvc: StockTypeService,
    private stockStrategyService: StockStrategyService,
    private _translateSvc: TranslateService,
    private _stockSvc: StockCardService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.getStockTypeList();
  }

  getStockTypeList() {
    this._stockTypeSvc.getIdNameList().then((result: any) => this.stockTypes = result).catch(error => console.log(error));
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  exportCSV(type: BookType = 'csv') {
    const transformData = [];
    for (let index = 0; index < this.stockTypes.length; index++) {
      const stockType = this.stockTypes[index];
      if (stockType.stockTypeOneList && stockType.stockTypeOneList.length) {
        for (let i = 0; i < stockType.stockTypeOneList.length; i++) {
          const stockTypeOne = stockType.stockTypeOneList[i];
          const transformData2 = [];
          transformData2.push({ ...stockType, stockTypeOne: stockTypeOne });
          if (stockTypeOne.stockTypeTwoList && stockTypeOne.stockTypeTwoList) {
            for (let x = 0; x < stockTypeOne.stockTypeTwoList.length; x++) {
              const stockTypeTwo = stockTypeOne.stockTypeTwoList[x];
              transformData.push({ ...transformData2, stockTypeTwo: stockTypeTwo });
            }
          }
        }
      }
    }
    const mappedDAta = transformData.map(itm => {
      const obj = {};
      this.selectedColumns.forEach(col => {
        if (col.field === 'stockTypeId') {
          obj[this._translateSvc.instant(col.header)] = itm[0].stockTypeId;
        } else if (col.field === 'stockTypeCode') {
          obj[this._translateSvc.instant(col.header)] = itm[0].stockTypeCode;
        } else if (col.field === 'stockTypeName') {
          obj[this._translateSvc.instant(col.header)] = itm[0].stockTypeName;
        } else if (col.field === 'stockTypeOneCode') {
          obj[this._translateSvc.instant(col.header)] = itm[0].stockTypeOne.stockTypeCode;
        }
        else if (col.field === 'stockTypeOneName') {
          obj[this._translateSvc.instant(col.header)] = itm[0].stockTypeOne.stockTypeName;
        }
        else if (col.field === 'stockTypeTwoCode') {
          obj[this._translateSvc.instant(col.header)] = itm.stockTypeTwo.stockTypeCode;
        }
        else if (col.field === 'stockTypeTwoName') {
          obj[this._translateSvc.instant(col.header)] = itm.stockTypeTwo.stockTypeName;
          // obj[this._translateSvc.instant(col.header)] = itm.map(one => one.stockTypeTwoList.map(two =>two.stockTypeName).join()).join();
        }

        else if (itm.hasOwnProperty(col.field)) {
          obj[this._translateSvc.instant(col.header)] = itm[col.field];
        }

      });
      return (obj);
    });

    this.loaderService.showLoader();
    this.appStateService.exportAsFile(mappedDAta, type, 'stock-types');
    this.loaderService.hideLoader();
  }

  modalShow(id, mod: string, data) {
    this.stockTypesOneList
    this.workcenterModal.id = id;
    this.workcenterModal.modal = mod;
    this.workcenterModal.data = data;
    this.myModal.show();
  }

  modalShowPlus(id, mod: string, data) {
    this.workcenterModalPlus.id = id;
    this.workcenterModalPlus.modal = mod;
    this.workcenterModalPlus.data = data;
    this.myPlusModal.show();
  }

  modalShowClass(id, mod: string, data) {
    this.workcenterModalPlus.id = id;
    this.workcenterModalPlus.modal = mod;
    this.workcenterModalPlus.data = data;
    this.myClassModal.show();
  }

  modalShowEditClassTwo() {
    this.isUpdate = true;
    const selectedStock = this.stockTypesOneList.find(x => x.stockTypeOneId == this.stock.stockTypeOneId);
    if (selectedStock) {
      this.myPlusModal.show();
      this.stockType.classTwoCode = selectedStock.stockTypeCode;
      this.stockType.classTwoName = selectedStock.stockTypeName;
    }

  }

  modalShowEditClassThree() {
    this.isUpdate = true;
    const selectedStock = this.stockTypesTwoList.find(x => x.stockTypeTwoId == this.stock.stockTypeTwoId);
    if (selectedStock) {
      this.stockType.classThreeCode = selectedStock.stockTypeCode;
      this.stockType.classThreeName = selectedStock.stockTypeName;
    }
    this.myClassModal.show();
  }

  onStockTypeSelected(event) {
    // console.log('@onStockTypeSelected', event)
    if (event && (+event === 1) || (+event === 4) || (+event === 7) || (+event === 10) || (+event === 13)) {
      this.stock.buy = true;
    } else {
      this.stock.buy = false;
    }
    if (event && ((+event === 3) || (+event === 2))) {
      this.stock.make = true;
    } else {
      this.stock.make = false;
    }
    const stockType = this.stockTypes.find(item => item.stockTypeId === +this.stockType.stockTypeId);
    if (stockType) {
      this.stockTypesOneList = stockType.stockTypeOneList || [];
      if (this.stockTypesOneList && this.stockTypesOneList.length > 0) {
        const stockTwoType = this.stockTypesOneList.map(item => item.stockTypeTwoList || []);
        this.stockTypesTwoList = [].concat.apply([], stockTwoType);
      }
    }
  }

  onStockType2Selected(event) {
    if (event) {
      this.stockTypesTwoList = this.stockTypesOneList.find(item => +this.stock.stockTypeOneId === item.stockTypeOneId).stockTypeTwoList || [];
    }
  }

  saveClassTwoOk() {
    if (this.isUpdate) {
      this.updateClassTwoOk();
    } else {
      const stockData = this.stockTypes.find(x => x.stockTypeId == this.stockType.stockTypeId);
      if (stockData) {
        let reqJson = {
          "stockTypeCode": stockData.stockTypeCode,
          "stockTypeId": stockData.stockTypeId,
          "stockTypeName": stockData.stockTypeName,
          "stockTypeOneList": [
            {
              "stockTypeCode": this.stockType.classTwoCode,
              "stockTypeId": this.stockType.stockTypeId,
              "stockTypeName": this.stockType.classTwoName,
              "stockTypeOneId": null
            }
          ]
        };

        this.saveOk(reqJson);
      }
    }

  }


  saveClassThreeOk() {
    if (this.isUpdate) {
      this.updateClassThreeOk();
    } else {
      const stockData = this.stockTypes.find(x => x.stockTypeId == this.stockType.stockTypeId);
      const stockOneData = this.stockTypesOneList.find(x => x.stockTypeOneId == this.stock.stockTypeOneId);
      if (stockData && stockOneData) {
        let reqJson = {
          "stockTypeCode": stockData.stockTypeCode,
          "stockTypeId": stockData.stockTypeId,
          "stockTypeName": stockData.stockTypeName,
          "stockTypeOneList": [
            {
              "stockTypeCode": stockOneData.stockTypeCode,
              "stockTypeId": this.stockType.stockTypeId,
              "stockTypeName": stockOneData.stockTypeName,
              "stockTypeOneId": stockOneData.stockTypeOneId,
              "stockTypeTwoList": [
                {
                  "stockTypeCode": this.stockType.classThreeCode,
                  "stockTypeName": this.stockType.classThreeName,
                  "stockTypeOneId": stockOneData.stockTypeOneId,
                  "stockTypeTwoId": null
                }
              ]
            }
          ]
        };

        this.saveOk(reqJson);
      }
    }

  }


  updateClassTwoOk() {
    const stockData = this.stockTypes.find(x => x.stockTypeId == this.stockType.stockTypeId);
    if (stockData) {
      let reqJson = {
        "stockTypeCode": stockData.stockTypeCode,
        "stockTypeId": stockData.stockTypeId,
        "stockTypeName": stockData.stockTypeName,
        "stockTypeOneList": [
          {
            "stockTypeCode": this.stockType.classTwoCode,
            "stockTypeId": this.stockType.stockTypeId,
            "stockTypeName": this.stockType.classTwoName,
            "stockTypeOneId": this.stock.stockTypeOneId,
            "stockTypeTwoList": [
              {
                "stockTypeCode": null,
                "stockTypeName": null,
                "stockTypeOneId": null,
                "stockTypeTwoId": null
              }
            ]
          }
        ]
      };

      this.saveOk(reqJson);
    }
  }


  updateClassThreeOk() {
    const stockData = this.stockTypes.find(x => x.stockTypeId == this.stockType.stockTypeId);
    const stockOneData = this.stockTypesOneList.find(x => x.stockTypeOneId == this.stock.stockTypeOneId);
    if (stockData && stockOneData) {
      let reqJson = {
        "stockTypeCode": stockData.stockTypeCode,
        "stockTypeId": stockData.stockTypeId,
        "stockTypeName": stockData.stockTypeName,
        "stockTypeOneList": [
          {
            "stockTypeCode": stockOneData.stockTypeCode,
            "stockTypeId": this.stockType.stockTypeId,
            "stockTypeName": stockOneData.stockTypeName,
            "stockTypeOneId": stockOneData.stockTypeOneId,
            "stockTypeTwoList": [
              {
                "stockTypeCode": this.stockType.classThreeCode,
                "stockTypeName": this.stockType.classThreeName,
                "stockTypeOneId": stockOneData.stockTypeOneId,
                "stockTypeTwoId": this.stock.stockTypeTwoId
              }
            ]
          }
        ]
      };

      this.saveOk(reqJson);
    }
  }




  saveOk(reqJson) {
    const updt = Object.assign({}, reqJson);
    this.loaderService.showLoader();
    this.sentRequest = true;
    this._stockSvc.stockUpdate(updt)
      .then(stockId => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('STOCK TYPE saved successfully');
        this.stockType = {
          stockTypeId: null,
          classTwoCode: '',
          classTwoName: '',
          classThreeCode: '',
          classThreeName: ''
        };
        this.stockTypesOneList = [];
        this.stockTypesTwoList = [];
        this.stock.stockTypeOneId = null;
        this.stock.stockTypeTwoId = null;
        this.myPlusModal.hide();
        this.myClassModal.hide();
        this.getStockTypeList();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.sentRequest = false;
        this.utilities.showErrorToast(error)
      });
  }

  getStockTypeInfo(stockTypeId): string {
    if (stockTypeId) {
      const stockType = this.stockTypes.find(x => x.stockTypeId == stockTypeId);
      if (stockType) {
        return stockType.stockTypeCode + ' | ' + stockType.stockTypeName;
      }
    }
  }
}