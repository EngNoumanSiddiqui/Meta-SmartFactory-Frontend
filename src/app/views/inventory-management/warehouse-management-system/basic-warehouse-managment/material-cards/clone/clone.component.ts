import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EnumStockStatusService } from 'app/services/dto-services/enum/stock-status.service';
import { TranslateService } from '@ngx-translate/core';
import { CreateStockCostingDto, WeightUnit, StockPurchasing, StockSales } from 'app/dto/stock/stock-card.model';
import { ImageAdderComponent } from 'app/views/image/image-adder/image-adder.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StockTypeService } from 'app/services/dto-services/stock-type/stock-type.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { EnumMaterialTypeService } from 'app/services/dto-services/enum/metal-type.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { environment } from 'environments/environment';
import { WorkstationUnitDto } from 'app/dto/workstation/workstation.model';
import { PlantModelDto } from 'app/dto/plant/plant.model';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { StockStrategyService } from 'app/services/dto-services/stock-stategy/stock-strategy.service';
@Component({
  selector: 'material-card-clone',
  templateUrl: 'clone.component.html',
  styleUrls: ['clone.component.scss']
})
export class CloneMaterialCardComponent implements OnInit, OnDestroy {

  @ViewChild('materialForm') materialform: NgForm;

  @Input() fromChoosePane = false;

  @Output() selectedTab = new EventEmitter<any>();
  stock = {
    stockName: null,
    stockName2: null,
    stockName3: null,
    stockNo: null,
    stockNoChangeAllowed: false,
    stockManagement: true,
    defaultProductTreeId: null,
    locationNo: null,
    formula: null,
    innerDiameter: null,
    outerDiameter: null,
    density: null,
    cloneProductTree: true,
    productTreeId: null,
    dimensionUnit: null,
    clone: true,
    extraProductionPercentage: 0,
    purchaseNotificationPeriod: 0,
    grossWeight: null,
    industryId: null,
    scrapMust: null,
    netWeight: 0,
    stockTypeId: null,
    stockTypeOneId: null,
    stockTypeTwoId: null,
    flexibleCut: false,
    productionOrderWareHouseId: null,
    baseUnit: null,
    unit2: null,
    height: 0,
    isBatchActive: true,
    length: 0,
    plantId: null,
    plantName: null,
    stockGroupId: null,
    groupDescription: null,
    stockId: null,
    stockPurchasing: {
      batchManagement: null,
      orderUnit: null,
      baseUnit: null,
      plantId: null,
      plantName: null,
      stockId: null,
      stockName: null,
      stockPurchasingId: null
    },
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
    combineStockIds: null,
    buy: false,
    make: false,
    purchaseOrderWarehouseId: null,
    salesOrderWarehouseId: null,
    stockStatus: null,
    stockCosting: null,
    stockQuality: null
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

  purchasingScreenPlant: PlantModelDto = new PlantModelDto();

  stockPurchaseWareHouseName: string;

  currentPricePeriod = (new Date().getMonth() < 9 ? '0': '') + (new Date().getMonth()+1) + '.' + new Date().getFullYear();

  stockCosting: CreateStockCostingDto = {
    baseUnit: null,
    costCenterId: null,
    currencyCode: null,
    orderUnit: null,
    plantId: null,
    stockCostingCode: null,
    stockCostingId: null,
    stockId:null,
    procurementType: 'STANDARD',
    stockCostEstimate: {
      costEstimateCode: null,
      costEstimateId: null,
      currentPrice: null,
      currentPricePeriod:  new Date(),
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

  purchasingScreenOrderUnit: WorkstationUnitDto = new WorkstationUnitDto();
  purchasingScreenBatchManagement: boolean;

  @ViewChild(ImageAdderComponent) imageAdderComponent: ImageAdderComponent;

  @Output() saveAction = new EventEmitter<any>();

  stockTypes = [];

  materialTypes;

  params = {
    dialog: { title: '', inputValue: '' },
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

  movingPrices = ['MOVING PRICE', 'STANDARD PRICE'];
  warehouseType: string;
  isDefaultSelected: boolean;
  stockTypesOneList: any = [];
  stockTypesTwoList: any = [];
  sentRequest: any = false;


  @Input('data') set setData (data) {
    if (data) {
      const materialData = JSON.parse(JSON.stringify(data));
      // this.initialize(this.id);
       
      // delete materialData.productTreeId;
      delete materialData.productTreeList;
      this.stock = materialData as any;
      this.stock.productTreeId = materialData.defaultProductTreeId;
      this.stock.stockNo = null;
      delete this.stock.defaultProductTreeId;
      this.stock.cloneProductTree = true;

      const tempCosting = Object.assign(this.stockCosting);

      if (materialData.stockCosting) {
        this.stockCosting = Object.assign({}, materialData.stockCosting);
        this.stockCosting.stockId = materialData.stockId;
        this.stockCosting.stockCostingId = null;
        this.stockCosting.costCenterId = materialData.stockCosting.costCenter?materialData.stockCosting.costCenter?.costCenterId : materialData.stockCosting.costCenterId;
        this.stockCosting.plantId = materialData.plantId;
      }
      if (materialData.stockCostEstimate) {
        this.stockCosting.stockCostEstimate = Object.assign({}, materialData.stockCostEstimate);
        this.stockCosting.stockCostEstimate.stockId = materialData.stockId;
        this.stockCosting.stockCostEstimate.costEstimateId = null;
      } else {
        this.stockCosting.stockCostEstimate = Object.assign({}, tempCosting.stockCostEstimate);
      }
      if (materialData.stockValuation) {
        this.stockCosting.stockValuation = Object.assign({}, materialData.stockValuation);
        this.stockCosting.stockValuation.stockId = materialData.stockId;
        this.stockCosting.stockValuation.stockValuationId = null;
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
      // this.stock.productionOrderWareHouseId = null;
      // this.stock.salesOrderWarehouseId = null;
      if (materialData.purchaseOrderWarehouseId || materialData.buy) {
        this.purchasingScreen.wareHouseId = materialData.purchaseOrderWarehouseId?.wareHouseId || null;
        this.purchasingScreen.wareHouseName = materialData.purchaseOrderWarehouseId?.wareHouseName || null;
        this.stock.purchaseOrderWarehouseId = materialData.purchaseOrderWarehouseId?.wareHouseId || null;
      }
      if (materialData.salesOrderWarehouseId || materialData.make) {
        this.stockSales = new StockSales();
        this.stockSales.wareHouseId = materialData.salesOrderWarehouseId?.wareHouseId || null;
        this.stockSales.wareHouseName = materialData.salesOrderWarehouseId?.wareHouseName || null;
        this.stock.salesOrderWarehouseId = materialData.salesOrderWarehouseId?.wareHouseId || null;

      }
      if(this.stock.stockTypeId){
        this.onStockTypeSelected(this.stock.stockTypeId);
      }

      if (materialData.productionOrderWareHouseId) {
        this.stock.productionOrderWareHouseId = materialData.productionOrderWareHouseId.wareHouseId;
      }

      this.stock.clone = true;

      // if (this.stock.stockTypeId) {
      //   this.onStockTypeSelected(this.stock.stockTypeId);
      // }

      setTimeout(() => {
        if ((this.imageAdderComponent)) {
          this.imageAdderComponent.initImages(this.stock.stockId, TableTypeEnum.STOCK);
        }

      }, 1000);
      // console.log(this.stock);
    }
  }
  constructor(private _router: Router,
    private _stockTypeSvc: StockTypeService,
    private _stockSvc: StockCardService,
    private _enunmMetarialTypeSvc: EnumMaterialTypeService,
    private utilities: UtilitiesService,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private stockStrategyService: StockStrategyService,
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
        this._stockSvc.getMaterialGroupListByPlant(this.stock.plantId)
        .then(result => this.materialGroupList = result).catch(error => console.log(error));
      } else {
        this.selectedPlant = null;
      }
    });
    this.workstationService.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));

    this._enunmMetarialTypeSvc.getEnumList().then(result => this.materialTypes = result).catch(error => console.log(error));

    this._stockTypeSvc.getIdNameList().then((result: any) => {
      this.stockTypes = result;
      if(this.stock.stockTypeId) {
        this.onStockTypeSelected(this.stock.stockTypeId);
      }
    }).catch(error => console.log(error));

    this._stockSvc.getLasStockNos().then(result => this.lastStockNos = result).catch(error => console.log(error));

    this._stockSvc.getIndustryList().then(result => this.industryList = result).catch(error => console.log(error));


    

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

  setMovingPriceSelection(value) {
    const val = value === 'true';
    this.stockCosting.stockValuation.movingPriceSelection = val;
    this.stockCosting.stockCostEstimate.movingPriceSelection = val;
  }

  // setMovingPriceSelection(movingPriceSelection) {

  //   if (movingPriceSelection === 'MOVING PRICE') {
  //     this.stockCosting.stockValuation.movingPriceSelection = true;
  //     this.stockCosting.stockCostEstimate.movingPriceSelection = true;
  //   } else if (movingPriceSelection === 'STANDARD PRICE') {
  //     this.stockCosting.stockValuation.movingPriceSelection = false;
  //     this.stockCosting.stockCostEstimate.movingPriceSelection = false;
  //   }
  // }

  goPage() {
    this._router.navigate(['/stocks/stockcards']);
  }

  selectedWareHouseEvent(event){
    if(event){
      this.stock.productionOrderWareHouseId = event.wareHouseId;
    }else{
      this.stock.productionOrderWareHouseId = null;
    }
  }
  closeModal() {
    this.myModal.hide();
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
    if (this.stock.buy && !this.stock.stockPurchasing) {
      this.stock.stockPurchasing = new StockPurchasing();
    }

    if (this.stock.make) {
      if (!this.stock.productionOrderWareHouseId) {
        this.utilities.showWarningToast('please-select-prod-order-warehouse');
        return;
      }
    }

    if (this.stock.buy && this.stock.stockPurchasing) {
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


    this.stock.stockId = null;

    this.loaderService.showLoader();
    this.sentRequest = true;
    this._stockSvc.save(this.stock)
      .then((stockId) => {
        this.loaderService.hideLoader();
        this.stock.stockId = stockId;
        this.saveImages(stockId);
        this.stockStrategyService.saveStockStrategyAction$.next(this.stock);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.sentRequest = false;
        this.utilities.showErrorToast(error);
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
        this.sentRequest = false;
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
        this.stockTypes.push({ stockTypeId: result, stockTypeName: this.params.dialog.inputValue });
        this.params.dialog.inputValue = '';
        this.stock.stockTypeId = result;
      })
      .catch(error => this.utilities.showErrorToast(error));
  }


  isValidString(data) {
    return data && data.length > 0 && data.trim();
  }
  isValidPurchaseScreen(data, dt, wrhouse) {
    return data && dt && wrhouse && data.length > 0 && dt.length > 0 && data.trim() && dt.trim();
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

  setSelectedPlant(event) {
    if (event) {
      if (this.stock.plantId !== event.plantId) {
        const lbl = this._translateSvc.instant('plant-must-be-same');
        this.utilities.showWarningToast(lbl);
        return;
      }
      this.purchasingScreen.plantId = event.plantId;
      this.purchasingScreen.plantName = event.plantName;
    } else {
      this.purchasingScreen.plantId = null;
      this.purchasingScreen.plantName = null;
    }
  }
  onStockTypeSelected(event) {
    if (event && (+event === 1) || (+event === 4) || (+event === 7) || (+event === 10) || (+event === 13)) {
      this.stock.buy = true;
      this.purchasingScreen.stockName = this.stock.stockName;
      this.purchasingScreen.plantId = this.stock.plantId;
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

  onStockType2Selected(event) {
    if(event) {
      this.stockTypesTwoList = this.stockTypesOneList.find(item => +this.stock.stockTypeOneId ===item.stockTypeOneId).stockTypeTwoList || [];
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
  setCurrency(currency) {
    if (currency && currency.currencyCode) {
      this.stockCosting.currencyCode = currency.currencyCode;
    } else {
      this.stockCosting.currencyCode = null;
    }
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


  modalProductTreeShow(productTreeId) { 
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);
  }
}
