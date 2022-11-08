import {Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Subscription} from 'rxjs';
import {EnumStockStatusService} from 'app/services/dto-services/enum/stock-status.service';
import {TranslateService} from '@ngx-translate/core';
import {NgForm} from '@angular/forms';
import {UsersService} from 'app/services/users/users.service';
import {CreateStockCostingDto, WeightUnit, StockPurchasing, StockSales} from 'app/dto/stock/stock-card.model';
import {TableTypeEnum} from 'app/dto/table-type-enum';
import {PlantModelDto} from 'app/dto/plant/plant.model';
import {WorkstationUnitDto} from 'app/dto/workstation/workstation.model';
import {ImageAdderComponent} from 'app/views/image/image-adder/image-adder.component';

import {StockTypeService} from 'app/services/dto-services/stock-type/stock-type.service';
import {StockCardService} from 'app/services/dto-services/stock/stock.service';
import {EnumMaterialTypeService} from 'app/services/dto-services/enum/metal-type.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {WorkstationService} from 'app/services/dto-services/workstation/workstation.service';
import {environment} from 'environments/environment';
import { StockStrategyService } from 'app/services/dto-services/stock-stategy/stock-strategy.service';

@Component({
  selector: 'material-card-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.css'],
  encapsulation: ViewEncapsulation.None
})

export class EditMaterialCardComponent implements OnInit, OnDestroy {

  @Input() fromChoosePane = false;

  @Output() selectedTab = new EventEmitter<any>();

  @ViewChild('materialForm') materialform: NgForm;

  stock = {
    // 'stockNo': null,
    stockName: null,
    stockName2: null,
    stockName3: null,
    stockNo: null,
    extraProductionPercentage: 0,
    locationNo:null,
    stockNoChangeAllowed: false,
    scrapMust: null,
    dimensionUnit: null,
    formula: null,
    innerDiameter: null,
    outerDiameter: null,
    density: null,
    defaultProductTreeId: null,
    defaultProductTreereVisionNo: null,
    productionOrderWareHouseId: null,
    grossWeight: null,
    industryId: null,
    netWeight: 0,
    stockManagement: true,
    stockTypeId: null,
    stockTypeOneId: null,
    stockTypeTwoId: null,
    purchaseNotificationPeriod: null,
    flexibleCut: false,
    combineStockIds: null,
    baseUnit: null,
    unit2: null,
    description: null,
    height: 0,
    isBatchActive: true,
    productTreeList: null,
    length: null,
    outSource: true,
    plantId: null,
    plantName: null,
    stockGroupId: null,
    stockId: null,
    minSchReadyReservationPercentage: null,
    stockPurchasing: {
      batchManagement: null,
      orderUnit: null,
      baseUnit: null,
      plantId: null,
      plantName: null,
      stockId: null,
      stockName: null,
      stockPurchasingId: null,
      supplierLeadTimeDay: null,
      maxOrderSizePerWeek: null
    },
    stockUnitMeasureList: [],
    thickness: 0,
    maxStockLevel: null,
    reorderPoint: null,
    reorderStrategy: null,
    safetyStock: null,
    /* unit: null,*/
    volume: null,
    numberOfEdge: 0,
    width: 0,
    volumeUnit: null,
    weightUnit: null,
    ytdScrapPercentage: 0,
    techScrapPercentage: 0,
    buy: false,
    make: false,
    purchaseOrderWarehouseId: null,
    salesOrderWarehouseId: null,
    stockStatus: null,
    stockCosting: null,
    stockCostEstimate: null,
    stockValuation: null,

  };


  warehouseLocationModal = {active : false};

  unitOfMeasure = {
    denominator: null,
    numerator: null,
    baseUnit: null,
    alternativeUnit: null,
    stockId: null,
    stockName: null,
    stockUnitMeasureId: null
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

  tableTypeForImg = TableTypeEnum.STOCK;

  stockTypes = [];

  params = {
    dialog: {title: '', inputValue: ''}
  };

  lastStockNos;

  materialTypes;

  id; // stock id

  industryList;

  materialGroupList;

  weightUnit: WeightUnit = new WeightUnit();

  unitList;

  plants: any = [];

  purchasingScreen: StockPurchasing = new StockPurchasing();

  stockSales: StockSales = new StockSales();

  purchasingScreenPlant: PlantModelDto = new PlantModelDto();

  purchasingScreenOrderUnit: WorkstationUnitDto = new WorkstationUnitDto();

  purchasingScreenBatchManagement: boolean;

  stockUnitMessage: string;

  stockUnitEditrowId;

  subscription: Subscription;

  statusList: any;

  reorderPlanningStrategyList: any;

  procurementTypes = ['STANDARD', 'SUBCONTRACTING', 'PIPELINE', 'CONSIGNMENT'];

  movingPrices = ['MOVING PRICE', 'STANDARD PRICE'];

  @ViewChild('myModal') public myModal: ModalDirective;
  selectedPlant: any;
  isSingleProductTree = false;
  stockTypesOneList = [];
  stockTypesTwoList = [];
  sentRequest = false;


  @ViewChild(ImageAdderComponent) set ft(imgViewer: ImageAdderComponent) {
    this.imageAdderComponent = imgViewer;
    this.showImages();
  };

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  @Output() saveAction = new EventEmitter<any>();

  stockPurchaseWareHouseName: string;

  @Input('id') set z(id) {
    console.log('id', id)
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set dataz(data) {
    if (data) {
      const materialData = JSON.parse(JSON.stringify(data));
      // this.initialize(this.id);
      this.id = materialData.stockId;

      this.setStockData(materialData);

      setTimeout(() => {
        this.showImages();
      }, 500);
    }
  };

  private setStockData(materialData) {

    this.stock = materialData as any;
    const tempCosting = Object.assign(this.stockCosting);

    if (materialData.stockCosting) {
      this.stockCosting = Object.assign(this.stockCosting, materialData.stockCosting);
      this.stockCosting.stockId = materialData.stockId;
      this.stockCosting.costCenterId = materialData.stockCosting?.costCenter ? materialData.stockCosting?.costCenter?.costCenterId : materialData.stockCosting?.costCenterId;
      this.stockCosting.plantId = materialData.plantId;
    }
    if (materialData.stockCostEstimate) {
      this.stockCosting.stockCostEstimate = Object.assign({}, materialData.stockCostEstimate);
      this.stockCosting.stockCostEstimate.stockId = materialData.stockId;
      this.stockCosting.stockCostEstimate.stockCostingId = this.stockCosting.stockCostingId;
    }else {
      this.stockCosting.stockCostEstimate = Object.assign({}, tempCosting.stockCostEstimate);
    }
    if (materialData.stockValuation) {
      this.stockCosting.stockValuation = Object.assign({}, materialData.stockValuation);
      this.stockCosting.stockValuation.stockId = materialData.stockId;
      this.stockCosting.stockValuation.stockCostingId = this.stockCosting.stockCostingId;
    } else {
      this.stockCosting.stockValuation = Object.assign({}, tempCosting.stockValuation);
    }
    if (materialData.stockPurchasing) {
      this.purchasingScreen = materialData.stockPurchasing;
    } else {
      this.purchasingScreen.plantId = materialData.plantId;
      this.purchasingScreen.stockId = materialData.stockId;
      this.purchasingScreen.stockName = materialData.stockName;
      this.purchasingScreen.baseUnit = materialData.baseUnit;
    }
    if (materialData.purchaseOrderWarehouseId) {
      this.purchasingScreen.wareHouseId = materialData.purchaseOrderWarehouseId.wareHouseId;
      this.purchasingScreen.wareHouseName = materialData.purchaseOrderWarehouseId.wareHouseName;
      this.stock.purchaseOrderWarehouseId = materialData.purchaseOrderWarehouseId.wareHouseId;
    }
    if (materialData.salesOrderWarehouseId) {
      this.stockSales = new StockSales();
      this.stockSales.wareHouseId = materialData.salesOrderWarehouseId.wareHouseId;
      this.stockSales.wareHouseName = materialData.salesOrderWarehouseId.wareHouseName;
      this.stock.salesOrderWarehouseId = materialData.salesOrderWarehouseId.wareHouseId;

    }

    if (materialData.productionOrderWareHouseId) {
      this.stock.productionOrderWareHouseId = materialData.productionOrderWareHouseId.wareHouseId;
    }

    if(this.stock.stockTypeId && this.stockTypes) {
      const stockType = this.stockTypes.find(item => item.stockTypeId === +this.stock.stockTypeId);
      if(stockType) {
        this.stockTypesOneList = stockType.stockTypeOneList || [];
        if(this.stockTypesOneList && this.stockTypesOneList.length > 0) {
          const stockTwoType = this.stockTypesOneList.map(item => item.stockTypeTwoList || []);
          this.stockTypesTwoList = [].concat.apply([], stockTwoType);
        }
      }
    //   this.onStockTypeSelected(this.stock.stockTypeId);
    }

    // if(this.stock.stockTypeId) {
    //   this.onStockTypeSelected(this.stock.stockTypeId);
    // }
  }

  constructor(private _router: Router,
              private _stockTypeSvc: StockTypeService,
              private _stockSvc: StockCardService,
              private _enunmMetarialTypeSvc: EnumMaterialTypeService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private stockStrategyService: StockStrategyService,
              private workstationService: WorkstationService,
              private cdx: ChangeDetectorRef,
              private _translateSvc: TranslateService,
              private _userSvc: UsersService,
              private enumStockStatusService: EnumStockStatusService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    // if (this.selectedPlant) {
    //   this.stock.plantId = this.selectedPlant.plantId;
    // }
    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.stock.stockId = this.id;
     });*/
  }


  showImages() {
    if ((this.imageAdderComponent)) {
      if (this.id) {
        this.imageAdderComponent.initImages(this.id, this.tableTypeForImg);
      }

    }
  }

  ngOnInit() {
    this.workstationService.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));

    this._enunmMetarialTypeSvc.getEnumList().then(result => this.materialTypes = result).catch(error => console.log(error));

    this._stockTypeSvc.getIdNameList().then((result: any) => {
      this.stockTypes = result;
      if(this.stock.stockTypeId) {
        const stockType = this.stockTypes.find(item => item.stockTypeId === +this.stock.stockTypeId);
        if(stockType) {
          this.stockTypesOneList = stockType.stockTypeOneList || [];
          if(this.stockTypesOneList && this.stockTypesOneList.length > 0) {
            // if(this.stock.stockTypeOneId) {
            //   this.stockTypesTwoList = this.stockTypesOneList.find(item => item.stockTypeOneId === +this.stock.stockTypeOneId).stockTypeTwoList || [];
            // } else {
              const stockTwoType = this.stockTypesOneList.map(item => item.stockTypeTwoList || []);
              this.stockTypesTwoList = [].concat.apply([], stockTwoType);
            // }
          }
        }
      //   this.onStockTypeSelected(this.stock.stockTypeId);
      }
    }).catch(error => console.log(error));

    this._stockSvc.getLasStockNos().then(result => this.lastStockNos = result).catch(error => console.log(error));

    this._stockSvc.getIndustryList().then(result => this.industryList = result).catch(error => console.log(error));


    this._stockSvc.getMaterialGroupListByPlant(this.selectedPlant?.plantId).then(result => this.materialGroupList = result).catch(error => console.log(error));

    this.enumStockStatusService.getEnumList().then(result => this.statusList = result).catch(error => console.log(error));
    this.enumStockStatusService.getEnumReOrderPlanningStrategyList()
      .then(result => this.reorderPlanningStrategyList = result).catch(error => console.log(error));
    this.subscription = this._stockSvc.saveAction$.asObservable().subscribe(rs => {
      if (this.materialform.valid && !this.sentRequest) {
        this.save();
      } else {
        // this.utilities.showWarningToast('Fill The Form Completely');
        for (const key in this.materialform.controls) {
          if (this.materialform.controls.hasOwnProperty(key) && this.materialform.controls[key].status === 'INVALID') {
            this.utilities.showWarningToast('Fill ' + key + ' Property');
            return;
          }
        }
      }
    });
  }

  onStockType2Selected(event) {
    if(event) {
      this.stockTypesTwoList = this.stockTypesOneList.find(item => +this.stock.stockTypeOneId ===item.stockTypeOneId).stockTypeTwoList || [];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  baseUnitChanged(baseUnit) {
    if (this.stock.stockUnitMeasureList) {
      this.stock.stockUnitMeasureList.forEach(item => {
        item.baseUnit = baseUnit;
      })
    }
  }

  private initialize(id) {
    this.stock.stockId = this.id;
    this.stock.stockUnitMeasureList = [];
    this.loaderService.showLoader();
    this._stockSvc.getDetail(id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.setStockData(result);

      })
      .then(() => {
        this.showImages();
      }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

  setMovingPriceSelection(value) {
    const val = value === 'true';
    this.stockCosting.stockValuation.movingPriceSelection = val;
    this.stockCosting.stockCostEstimate.movingPriceSelection = val;
  }

  goPage() {
    this._router.navigate(['/stocks/stockcards']);
  }

  selectedWareHouseEvent(event) {
    if (event) {
      this.stock.productionOrderWareHouseId = event.wareHouseId;
    } else {
      this.stock.productionOrderWareHouseId = null;
    }
  }

  save() {
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
    if ((this.stock.buy || this.stock.stockTypeId===9) && !this.stock.stockPurchasing) {
      this.stock.stockPurchasing = new StockPurchasing();
    }

    if (this.stock.make) {
      if (!this.stock.productionOrderWareHouseId) {
        this.utilities.showWarningToast('please-select-prod-order-warehouse');
        return;
      }
    }

    if ((this.stock.buy || this.stock.stockTypeId===9) && this.stock.stockPurchasing) {
      // this.stock.stockPurchasing = new StockPurchasing();
      if (!this.purchasingScreen.wareHouseId) {
        this.utilities.showWarningToast('buy-should-have-purchasing-warehouse');
        return;
      }
      if (!this.purchasingScreen.orderUnit) {
        this.utilities.showWarningToast('please-select-order-unit');
        return;
      }
      this.stock.stockPurchasing.orderUnit = this.purchasingScreen ? this.purchasingScreen.orderUnit : null;
      this.stock.stockPurchasing.batchManagement = this.purchasingScreen ? this.purchasingScreen.batchManagement : null;
      this.stock.stockPurchasing.plantId = this.purchasingScreen ? this.purchasingScreen.plantId : null;
      this.stock.stockPurchasing.plantName = this.purchasingScreen ? this.purchasingScreen.plantName : null;
      // this.stock.plantId = this.purchasingScreen ? this.purchasingScreen.plantId : null;
      this.stock.stockPurchasing.stockName = this.purchasingScreen ? this.purchasingScreen.stockName : null;
      this.stock.purchaseOrderWarehouseId = this.purchasingScreen.wareHouseId;
      this.stockPurchaseWareHouseName = this.stock.purchaseOrderWarehouseId ? this.stock.purchaseOrderWarehouseId.wareHouseName : null;
      // this.stock.salesOrderWarehouseId = this.stockSales ? this.stockSales.wareHouseId : null;
    }
    if (this.purchasingScreen && this.purchasingScreen.plantId) {
      if (this.stock.plantId !== this.purchasingScreen.plantId) {
        const lbl = this._translateSvc.instant('plant-must-be-same');
        this.utilities.showWarningToast(lbl);
        return;
      }
    } else {
      this.stock.stockPurchasing = null;
    }
    // revert changes for this issue 1040
    //  if ((+this.stock.stockTypeId === 3) && !this.stockSales || !this.stockSales.wareHouseId) {
    //   this.utilities.showWarningToast('fert-should-have-purchasing-warehouse');
    //   return;
    // }
    if (this.stockSales && this.stockSales.wareHouseId) {
      this.stock.salesOrderWarehouseId = this.stockSales.wareHouseId;
    }
    if (this.stock.make) {
      if (!this.stock.productionOrderWareHouseId) {
        this.utilities.showWarningToast('please-select-prod-order-warehouse');
        return;
      }
    }
    if (!this.stockCosting.stockValuation.movingPriceSelection) {
      this.stockCosting.stockCostEstimate.currentPrice = this.stockCosting.stockCostEstimate.standardPrice;
    } else {
      this.stockCosting.stockCostEstimate.currentPrice = this.stockCosting.stockCostEstimate.movingPrice;
    }
    this.stock.stockCosting = this.stockCosting;

    this.loaderService.showLoader();
    this.sentRequest = true;
    this._stockSvc.save(this.stock)
      .then(() => {
        this.loaderService.hideLoader();
        this.saveImages(this.id)

        this.stockStrategyService.saveStockStrategyAction$.next(this.stock);
        setTimeout(() => {
          this.sentRequest = false;
        }, 3000);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
        this.sentRequest = false;
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

  reset() {

  }

  setSelectedStockPlant(event) {
    if (event) {
      this.stock.plantId = event.plantId;
    } else {
      this.stock.plantId = null;
    }
  }

  private saveImages(id) {
    this.imageAdderComponent.updateMedia(id, TableTypeEnum.STOCK).then(() => {
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      }
    ).catch(error => this.utilities.showErrorToast(error));

  }


  saveStockType() {
    this._stockTypeSvc.save({
      stockTypeName: this.params.dialog.inputValue,
    })
      .then(result => {
        this.utilities.showSuccessToast('updated-success');
        this.stockTypes.push({stockTypeId: result, stockTypeName: this.params.dialog.inputValue});
        this.params.dialog.inputValue = '';
        this.stock.stockTypeId = result;
      })
      .catch(error => this.utilities.showErrorToast(error));
  }


  isValidString(data) {
    return data && data.length > 0 && data.trim();
  }

  isValidPurchaseScreen(data, dt, wrhouse) {
    return data && dt && wrhouse && data.length > 0 && data.trim();
  }

  cancel() {
    this.goPage();
  }

  addWeightUnit() {
    this.workstationService.saveWorkstarionUnit(this.weightUnit).then(result => {
      this.utilities.showSuccessToast('saved-success');
      this.workstationService.getWorkstationUnitList().then((res: any) => this.unitList = res)
        .catch(error => console.log(error));

    })
      .catch(error => this.utilities.showErrorToast(error));
  }


  onStockTypeSelected(event) {
    if (event && (+event === 1) || (+event === 4) || (+event === 7) || (+event === 10) || (+event === 13)) {
      this.stock.buy = true;
      this.purchasingScreen.stockName = this.stock.stockName;
      this.purchasingScreen.plantId = this.stock.plantId;
      this.purchasingScreen.stockId= this.stock.stockId;
      this.purchasingScreen.plantName = this.stock.plantName;
    } else {
      this.stock.buy = false;
    }
    if (event && ((+event === 3) || (+event === 2))) {
      this.stock.make = true;
      this.purchasingScreen = new StockPurchasing();
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

  setSelectedWarehouse(event) {
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.stock.purchaseOrderWarehouseId = {
        wareHouseId: event.wareHouseId,
        wareHouseName: event.wareHouseName
      };
      this.purchasingScreen.wareHouseId = event.wareHouseId;
      this.purchasingScreen.wareHouseName = event.wareHouseName;
    } else {
      this.stock.purchaseOrderWarehouseId = null;
    }
  }

  setSelectedSalesWarehouse(event) {
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.stockSales.wareHouseId = event.wareHouseId;
      this.stockSales.wareHouseName = event.wareHouseName;

    } else {
      this.stockSales.wareHouseId = null;
      this.stockSales.wareHouseName = null;
    }
  }

  resetWeightUnit() {
    this.weightUnit.unit = null;
    this.weightUnit.dimension = null;
    this.weightUnit.unitDescription = null;
  }

  salesScreenShow() {
    if (!this.stock.baseUnit) {
      this.utilities.showWarningToast('select-base-unit');
      return;
    }
    this.myModal.show();
  }

  purchasingScreenShow() {

    if (!this.stock.baseUnit) {
      this.utilities.showWarningToast('select-base-unit');
      return;
    }
    if (!this.stock.stockName) {
      this.utilities.showWarningToast('select-material');
      return;
    }
    if (this.purchasingScreen) {
      for (let i = 0; i < this.plants.length; i++) {

        if (this.plants[i].plantId === this.purchasingScreen.plantId) {
          this.purchasingScreenPlant.plantId = this.plants[i].plantId;
          this.purchasingScreenPlant.plantName = this.plants[i].plantName;
          this.purchasingScreenPlant.address = this.plants[i].address;
          this.purchasingScreenPlant.createdDate = this.plants[i].createdDate;
          this.purchasingScreenPlant.postcode = this.plants[i].postcode;
          this.purchasingScreenPlant.plantCode = this.plants[i].plantCode;

        }
      }
      for (let i = 0; i < this.unitList.length; i++) {

        if (this.unitList[i].unit === this.purchasingScreen.orderUnit) {
          this.purchasingScreenOrderUnit.unit = this.unitList[i].unit;
          this.purchasingScreenOrderUnit.dimension = this.unitList[i].dimension;
          this.purchasingScreenOrderUnit.unitDescription = this.unitList[i].unitDescription;
        }
      }
      this.purchasingScreenPlant.plantId = this.purchasingScreen.plantId;
      this.purchasingScreenPlant.plantName = this.purchasingScreen.plantName;
      this.purchasingScreenBatchManagement = this.purchasingScreen.batchManagement;
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
    this.myModal.show();
  }

  resetPurchasingScreen() {
    this.purchasingScreen.wareHouseId = null;
    this.purchasingScreen.wareHouseName = null;
    this.purchasingScreen.orderUnit = null;
    this.purchasingScreen.batchManagement = false;
    this.purchasingScreen.plantId = null;
    this.purchasingScreen.plantName = null;
    this.purchasingScreenOrderUnit.unit = null;
  }

  addPurchasingScreen() {
    this.purchasingScreen.stockName = this.stock.stockName;
    // this.purchasingScreen.plantName = this.purchasingScreenPlant.plantName;
    // this.purchasingScreen.plantId = this.purchasingScreenPlant.plantId;
    this.purchasingScreen.batchManagement = this.purchasingScreenBatchManagement;
    this.purchasingScreen.orderUnit = this.purchasingScreenOrderUnit.unit;
    this.stock.stockPurchasing = this.purchasingScreen;
  }

  hideModal() {
    if (this.params.dialog.title === 'salesScreen') {
      this.stockSales = new StockSales();
      if (this.stock.salesOrderWarehouseId) {
        this.stockSales.wareHouseId = this.stock.salesOrderWarehouseId.wareHouseId;
        this.stockSales.wareHouseName = this.stock.salesOrderWarehouseId.wareHouseName;
      }
    }
    this.myModal.hide();
  }

  resetUnitOfMeasures() {
    this.unitOfMeasure = {
      denominator: null,
      numerator: null,
      baseUnit: null,
      alternativeUnit: null,
      stockId: null,
      stockName: null,
      stockUnitMeasureId: null
    };
  }

  addUnitOfMeasures() {
    if (this.stockUnitMessage === 'NEW') {
      if (!this.stock.stockUnitMeasureList) {
        this.stock.stockUnitMeasureList = [];
      }
      this.stock.stockUnitMeasureList.push(this.unitOfMeasure);
      this.unitOfMeasure = {
        denominator: null,
        numerator: null,
        baseUnit: null,
        alternativeUnit: null,
        stockId: null,
        stockName: null,
        stockUnitMeasureId: null
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

  onBuySelected(event) {
    this.stock.buy = event;
    if (event) {
      this.stock.reorderStrategy = 'BASIC_STRATEGY';
      this.purchasingScreen.stockName = this.stock.stockName;
      this.purchasingScreen.plantId = this.stock.plantId;
      this.purchasingScreen.plantName = this.stock.plantName;
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
    this.stock.make = event;
    if (event) {
      this.purchasingScreen = new StockPurchasing();
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

  setCurrency(currency) {
    if (currency && currency.currencyCode) {
      this.stockCosting.currencyCode = currency.currencyCode;
    } else {
      this.stockCosting.currencyCode = null;
    }
  }
}
