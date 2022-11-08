import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, Input, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';

import {AppStateService} from 'app/services/dto-services/app-state.service';
import {EnumStockStatusService} from 'app/services/dto-services/enum/stock-status.service';
import {TranslateService} from '@ngx-translate/core';
import {CreateStockCostingDto, WeightUnit, StockPurchasing, StockSales} from 'app/dto/stock/stock-card.model';
import {ImageAdderComponent} from 'app/views/image/image-adder/image-adder.component';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {StockTypeService} from 'app/services/dto-services/stock-type/stock-type.service';
import {StockCardService} from 'app/services/dto-services/stock/stock.service';
import {EnumMaterialTypeService} from 'app/services/dto-services/enum/metal-type.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {WorkstationService} from 'app/services/dto-services/workstation/workstation.service';
import {PlantService} from 'app/services/dto-services/plant/plant.service';
import {TableTypeEnum} from 'app/dto/table-type-enum';
import {environment} from 'environments/environment';
import { StockStrategyService } from 'app/services/dto-services/stock-stategy/stock-strategy.service';

@Component({
  selector: 'material-card-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.css']
})
export class NewMaterialCardComponent implements OnInit, OnDestroy {

  @ViewChild('materialForm') materialform: NgForm;

  @Input() fromChoosePane = false;

  @Output() selectedTab = new EventEmitter<any>();

  warehouseLocationModal = {active : false};
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

  currentPricePeriod = (new Date().getMonth() < 9 ? '0' : '') + (new Date().getMonth() + 1) + '.' + new Date().getFullYear();

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

  unitOfMeasure = {
    'denominator': null,
    'numerator': null,
    'baseUnit': null,
    'alternativeUnit': null,
    'stockId': null,
    'stockName': null,
    'stockUnitMeasureId': null
  };

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  @Output() saveAction = new EventEmitter<any>();

  stockTypes = [];
  stockTypesOneList = [];
  stockTypesTwoList = [];

  materialTypes;

  params = {
    dialog: {title: '', inputValue: ''},
  };

  @ViewChild('myModal') public myModal: ModalDirective;

  lastStockNos;

  industryList;

  materialGroupList;

  weightUnit: WeightUnit = new WeightUnit();

  unitList;

  plants: any = [];

  purchasingScreen: StockPurchasing = new StockPurchasing();

  stockSales: StockSales;

  stockUnitMessage: string;

  stockUnitEditrowId;

  subscription: Subscription;

  selectedPlant: any;

  statusList: any;

  reorderPlanningStrategyList: any;

  sub: Subscription;

  procurementTypes = ['STANDARD', 'SUBCONTRACTING', 'PIPELINE', 'CONSIGNMENT'];

  movingPrices = ['STANDARD PRICE', 'MOVING PRICE'];

  warehouseType: string = null;

  isDefaultSelected;
  sentRequest: boolean = false;

  constructor(private _router: Router,
              private _stockTypeSvc: StockTypeService,
              private _stockSvc: StockCardService,
              private _enunmMetarialTypeSvc: EnumMaterialTypeService,
              private utilities: UtilitiesService,
              private stockStrategyService: StockStrategyService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private workstationService: WorkstationService,
              private appStateService: AppStateService,
              private plantService: PlantService,
              private cdx: ChangeDetectorRef,
              private enumStockStatusService: EnumStockStatusService) {
   

  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.stock.plantId = this.selectedPlant.plantId;
        this.stock.plantName = this.selectedPlant.plantName;
        this._stockSvc.getMaterialGroupListByPlant(this.stock.plantId).then(result => this.materialGroupList = result).catch(error => console.log(error));
      } else {
        this.selectedPlant = null;
      }
    });
    this.stock.stockUnitMeasureList = [];
    // this.resetPurchasingScreen();
    // this.workstationService.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));
    this._enunmMetarialTypeSvc.getEnumList().then(result => this.materialTypes = result).catch(error => console.log(error));
    this._stockTypeSvc.getIdNameList().then((result: any) => this.stockTypes = result).catch(error => console.log(error));
    this._stockSvc.getLasStockNos().then(result => this.lastStockNos = result).catch(error => console.log(error));
    this._stockSvc.getIndustryList().then(result => this.industryList = result).catch(error => console.log(error));
    
    this.enumStockStatusService.getEnumList().then(result => this.statusList = result).catch(error => console.log(error));
    this.enumStockStatusService.getEnumReOrderPlanningStrategyList()
      .then(result => this.reorderPlanningStrategyList = result).catch(error => console.log(error));
    this.plantService.getAllPlants().then(r => {
      this.plants = r;
    });

    this.subscription = this._stockSvc.saveAction$.asObservable().subscribe(rs => {
      if (this.materialform.valid && !this.sentRequest) {
        this.save();
      } else {
        // this.utilities.showWarningToast('Fill The Form Completely');
        // const invalidFields = [].slice.call(this.materialform.controls[0]..getElementsByClassName('form-control ng-invalid'));
        // invalidFields[0].focus();
        for (const key in this.materialform.controls) {
          if (this.materialform.controls.hasOwnProperty(key) && this.materialform.controls[key].status === 'INVALID') {
            this.utilities.showWarningToast('Fill ' + key + ' Property');
            return;
          }
        }
        // console.log(invalidFields[0]);
        // let control;
        //   Object.keys(this.materialform.controls).reverse().forEach( (field) => {
        //     if (this.materialform.get(field).invalid) {
        //       control = this.materialform.get(field);
        //       control.markAsDirty();
        //     }
        //   });

        //   if(control) {
        //     let el =  $('.ng-invalid:not(form):first');
        //     $('html,body').animate({scrollTop: (el.offset().top - 20)}, 'slow', () => {
        //       el.focus();
        //     });
        //   }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.sub.unsubscribe();
  }

  goPage() {
    this._router.navigate(['/stocks/stockcards']);
  }

  setMovingPriceSelection(value) {
    const val = value === 'true';
    this.stockCosting.stockValuation.movingPriceSelection = val;
    this.stockCosting.stockCostEstimate.movingPriceSelection = val;
  }

  save() {
// console.log('@stock', this.stock); return;
    if (this.stock.stockNoChangeAllowed==true && this.stock.stockNo ==null) {
      this.utilities.showWarningToast('material-no-is-missing');
      return;
    }

    if (!this.validateDuration('stock-name', this.stock.stockName)) {
      return;
    }
    if (!this.validateDuration('plant', this.stock.plantId)) {
      return;
    }
    if ((this.stock.buy || this.stock.stockTypeId===9) && !this.stock.stockPurchasing.wareHouseId) {
      this.utilities.showWarningToast('buy-should-have-purchasing-warehouse');
      return;
    }

    if ((this.stock.buy || this.stock.stockTypeId===9) && this.stock.stockPurchasing) {
      if (!this.stock.stockPurchasing.orderUnit) {
        this.utilities.showWarningToast('please-select-order-unit');
        return;
      }
    }
    // revert changes for this issue 1040
    // if ((+this.stock.stockTypeId === 3) && !this.stockSales || !this.stockSales.wareHouseId) {
    //   this.utilities.showWarningToast('fert-should-have-purchasing-warehouse');
    //   return;
    // }

    //  console.log('@beforeSaveStock', this.stock);
    //  return;

    if (this.stock.make) {
      if (!this.stock.productionOrderWareHouseId) {
        this.utilities.showWarningToast('please-select-prod-order-warehouse');
        return;
      }
    }
    if ((this.stock.buy || this.stock.stockTypeId===9)) {
      if (this.stock.stockPurchasing.hasOwnProperty('plantId')) {

        if ((+this.stock.stockTypeId !== 3) && (+this.stock.stockTypeId !== 2)) {
          if (this.stock.plantId !== this.stock.stockPurchasing.plantId) {
            const lbl = this._translateSvc.instant('plant-must-be-same');
            this.utilities.showWarningToast(lbl);
            return;
          }
        }
        this.stockCosting.orderUnit = this.stock.stockPurchasing.orderUnit;
      }
    } else {
      this.stock.stockPurchasing = null;
    }
    if (this.stockSales) {
      this.stock.salesOrderWarehouseId = this.stockSales.wareHouseId;
    }

    if (this.stock.hasOwnProperty('warehouseList')) {
      delete this.stock['warehouseList'];
    }

    if (!this.stockCosting.stockValuation.movingPriceSelection) {
      this.stockCosting.stockCostEstimate.currentPrice = this.stockCosting.stockCostEstimate.standardPrice;
    } else {
      this.stockCosting.stockCostEstimate.currentPrice = this.stockCosting.stockCostEstimate.movingPrice;
    }
    this.stock.stockCosting = this.stockCosting;

    const temp = Object.assign({}, this.stock);

    if (temp.hasOwnProperty('stockQuality')) {
      delete temp['stockQuality'];
    }

    this.loaderService.showLoader();
    this.sentRequest = true;
    this._stockSvc.save(temp)
      .then(stockId => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('MATERIAL Master ' + stockId + ' saved successfully');
        this.stock.stockId = stockId;
        this.stockStrategyService.saveStockStrategyAction$.next(this.stock);
        this.saveImages(stockId);
        setTimeout(() => {
          this.sentRequest = false;
        }, 3000);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.sentRequest = false;
        this.utilities.showErrorToast(error)
      });
  }

  validateDuration(label, value) {
    if (!value || value === '') {
      const lbl = this._translateSvc.instant(label);
      this.utilities.showWarningToast(lbl + ' must not be empty');
      return false;
    }
    return true;
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
    const stockType = this.stockTypes.find(item => item.stockTypeId === +this.stock.stockTypeId);
    if(stockType) {
      this.stockTypesOneList = stockType.stockTypeOneList || [];
      if(this.stockTypesOneList && this.stockTypesOneList.length > 0) {
        const stockTwoType = this.stockTypesOneList.map(item => item.stockTypeTwoList || []);
        this.stockTypesTwoList = [].concat.apply([], stockTwoType);
      }
    }

  }

  onBuySelected(event) {
    this.stock.buy = event;
    if (event) {
      this.stock.reorderStrategy = 'BASIC_STRATEGY';
      if (+this.stock.stockTypeId === 2) {
        setTimeout(() => {
          this.stock.make = false;
          this.cdx.detectChanges();
        }, 200);
      }
    } else {
      if ((+this.stock.stockTypeId === 1) || (+this.stock.stockTypeId === 4) || (+this.stock.stockTypeId === 7) || (+this.stock.stockTypeId === 10)) {
        setTimeout(() => {
          this.stock.buy = true;
          this.cdx.detectChanges();
        }, 500);
      } else if (+this.stock.stockTypeId === 2) {
        setTimeout(() => {
          this.stock.make = true;
          this.cdx.detectChanges();
        }, 200);
      }
    }
  }

  onMakeSelected(event) {
    if (event) {
      this.warehouseType = 'GOODS';
      this.isDefaultSelected = true;
    } else {
      this.warehouseType = 'DEFAULT';
      this.isDefaultSelected = false;
    }
    this.stock.make = event;
    if (event) {
      if (+this.stock.stockTypeId === 2) {
        setTimeout(() => {
          this.stock.buy = false;
          this.cdx.detectChanges();
        }, 200);
      }
      // this.stock.reorderStrategy = 'BASIC_STRATEGY';
    } else {
      if (+this.stock.stockTypeId === 3) {
        setTimeout(() => {
          this.stock.make = true;
          this.cdx.detectChanges();
        }, 500);
      } else if (+this.stock.stockTypeId === 2) {
        setTimeout(() => {
          this.stock.buy = true;
          this.cdx.detectChanges();
        }, 200);
      }
    }
  }

  private saveImages(stockId) {
    const me = this;
    me.stock['stockId'] = stockId;
    this.imageAdderComponent.updateMedia(stockId, TableTypeEnum.STOCK).then(() => {
        // this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.sentRequest = false;
          this.saveAction.emit(Object.assign({}, me.stock));
          // this.reset();
        }, environment.DELAY);
      }
    ).catch(error => {
      this.utilities.showErrorToast(error);
      this.sentRequest = false;
    });
  }

  baseUnitChanged(baseUnit) {
    if (this.stock.stockUnitMeasureList) {
      this.stock.stockUnitMeasureList.forEach(item => {
        item.baseUnit = baseUnit;
      })
    }
  }


  setSelectedWarehouse(event) {
    if (event && event.hasOwnProperty('wareHouseId')) {
      // this.purchasingScreen.wareHouseId = event.wareHouseId;
      // this.purchasingScreen.wareHouseName = event.wareHouseName;
    } else {
      this.stock.purchaseOrderWarehouseId = null;
    }
  }

  setSelectedSalesWarehouse(event) {
    this.stockSales = new StockSales();
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.stockSales.wareHouseId = event.wareHouseId;
      this.stockSales.wareHouseName = event.wareHouseName;

    } else {
      this.stockSales.wareHouseId = null;
      this.stockSales.wareHouseName = null;
    }
  }

  isValidString(data) {
    return data && data.length > 0 && data.trim();
  }

  isValidPurchaseScreen(data, dt, wrhouse) {
    return data && dt && wrhouse && data.length > 0 && dt.length > 0 && data.trim() && dt.trim();
  }

  addWeightUnit() {
    this.workstationService.saveWorkstarionUnit(this.weightUnit).then(result => {
      this.utilities.showSuccessToast('saved-success');
      this.workstationService.getWorkstationUnitList().then(s => this.unitList = s).catch(error => console.log(error));

    })
      .catch(error => this.utilities.showErrorToast(error));
  }

  resetWeightUnit() {
    this.weightUnit.unit = null;
    this.weightUnit.dimension = null;
    this.weightUnit.unitDescription = null;
  }

  resetunitOfMeasure() {
    this.unitOfMeasure = {
      'denominator': null,
      'numerator': null,
      'baseUnit': this.stock.baseUnit,
      'alternativeUnit': null,
      'stockId': null,
      'stockName': null,
      'stockUnitMeasureId': null
    }
  }


  
  onStockType2Selected(event) {
    if(event) {
      this.stockTypesTwoList = this.stockTypesOneList.find(item => +this.stock.stockTypeOneId ===item.stockTypeOneId).stockTypeTwoList || [];
    }
  }


  reset() {
    this.stock = {
      stockName: null,
      stockName2: null,
      formula: null,
    innerDiameter: null,
    outerDiameter: null,
    density: null,
    scrapMust: false,
    unit2: null,
      extraProductionPercentage: 0,
      purchaseNotificationPeriod: null,
      stockName3: null,
      stockNo: null,
      stockNoChangeAllowed: null,
      stockManagement: true,
      defaultProductTreeId: null,
      dimensionUnit: null,
      grossWeight: null,
      industryId: null,
      flexibleCut: false,
      netWeight: 0,
      stockTypeId: null,
      combineStockIds: null,
      stockTypeOneId: null,
      stockTypeTwoId: null,
      locationNo: null,
      baseUnit: null,
      productionOrderWareHouseId: null,
      height: 0,
      isBatchActive: true,
      length: 0,
      plantId: null,
      plantName: null,
      stockGroupId: null,
      groupDescription: null,
      stockId: null,
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
    // this.purchasingScreen = new StockPurchasing();
  }

  closeModal() {
    this.myModal.hide();
  }

  resetPurchasingScreen() {
  }

  onTabChange(event) {

    if (event.index == 2) {
      this.stock.stockPurchasing.baseUnit = this.stock.baseUnit;
      this.stock.stockPurchasing.orderUnit = this.stock.baseUnit;
      this.stock.stockPurchasing.plantId = this.stock.plantId;
      this.stock.stockPurchasing.plantName = this.stock.plantName;
      this.stock.stockPurchasing.stockId = this.stock.stockId;
      this.stock.stockPurchasing.stockName = this.stock.stockName;

    } else if (event.index == 3) {
      this.stockCosting.plantId = this.selectedPlant.plantId;
      this.stockCosting.baseUnit = this.stock.baseUnit;
      this.stockCosting.orderUnit = this.stock.baseUnit;
    }
  }

  salesScreenShow() {
    if (!this.stock.baseUnit) {
      this.utilities.showWarningToast('select-base-unit');
      return;
    }
    this.myModal.show();
  }

  stockUnitMeasureListShow(i, mesaj) {
    if (!this.stock.baseUnit) {
      this.utilities.showWarningToast('select-base-unit');
      return;
    }

    if (mesaj === 'NEW') {
      this.stockUnitMessage = mesaj;
      this.unitOfMeasure.baseUnit = this.stock.baseUnit;
    } else if (mesaj === 'EDIT') {
      this.stockUnitMessage = mesaj;
      this.stockUnitEditrowId = i;
      this.unitOfMeasure.baseUnit = this.stock.stockUnitMeasureList[i].baseUnit;
      this.unitOfMeasure.denominator = this.stock.stockUnitMeasureList[i].denominator;
      this.unitOfMeasure.numerator = this.stock.stockUnitMeasureList[i].numerator;
      this.unitOfMeasure.alternativeUnit = this.stock.stockUnitMeasureList[i].alternativeUnit;
      this.unitOfMeasure.stockId = this.stock.stockUnitMeasureList[i].stockId;
      this.unitOfMeasure.stockUnitMeasureId = this.stock.stockUnitMeasureList[i].stockUnitMeasureId;
    }
    this.myModal.show()
  }

  addUnitOfMeasures() {
    if (this.stockUnitMessage === 'NEW') {

      const cloneMeasure = Object.assign({}, this.unitOfMeasure);
      this.stock.stockUnitMeasureList.push(cloneMeasure);
      this.unitOfMeasure = {
        'denominator': null,
        'numerator': null,
        'baseUnit': null,
        'alternativeUnit': null,
        'stockId': null,
        'stockName': null,
        'stockUnitMeasureId': null
      };
    } else if (this.stockUnitMessage === 'EDIT') {
      this.stock.stockUnitMeasureList.splice(this.stockUnitEditrowId, 1, this.unitOfMeasure);

    }
  }

  removeFromUnitMeasureList(i) {
    this.stock.stockUnitMeasureList.splice(i, 1);
    console.log(this.stock.stockUnitMeasureList);
  }

  handleChange(e) {
    const index = e.index;
    this.selectedTab.emit(index);
  }

  setCurrency(currency) {
    if (currency && currency.currencyCode) {
      this.stockCosting.currencyCode = currency.currencyCode;
    } else {
      this.stockCosting.currencyCode = null;
    }
  }
}
