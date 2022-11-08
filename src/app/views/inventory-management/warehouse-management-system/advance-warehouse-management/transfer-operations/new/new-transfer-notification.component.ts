import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { 
  RequestCreateStockTransferNotificationDetailListItemDto, 
  StockTransferReceiptNotificationRequestDto 
} from 'app/dto/stock/stock-transfer-notification.model';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { environment } from 'environments/environment';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { StockTransferNotificationService } from 'app/services/dto-services/stock-transfer-notification/stock-transfer-notification.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { WarehouseService } from 'app/services/dto-services/warehouse/warehouse.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { GoodsMovementActivityTypeEnum, GoodsMovementDocumentTypeEnum } from 'app/dto/stock/stock-transfer-receipt.model';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'transfer-notification-new',
  templateUrl: './new-transfer-notification.component.html'
})

export class NewStockTransferNotificationComponent implements OnInit, OnDestroy {

  modal: any;

  params = {
    dialog: { title: '', inputValue: '', visible: false },
    materialDetailsDialog: { title: '', inputValue: '', visible: false },
    batchCodeFromDialog: { title: '', inputValue: '', visible: false },
    warehouseDialog: { title: '', stockId: null, stockName: '', visible: false, item: null },
  };

  reportSelectedStock = {
    stockName: null
  };

  warehouseList;

  filterAllData = {
    pageNumber: 1,
    pageSize: 1000,
    plantId: null
  };

  supplierId: null;

  activityTypeList: any;
 
  documentTypeList: any;
 
  documentTypeListFiltered: any;
 
  purchaseOrderList = [];
 
  purchaseOrderDetailList = [];
 
  productionOrderList = [];
 
  jobOrderList = [];
 
  saleOrderList = [];
 
  saleOrderDetailList = [];
 
  unitList = [];
 
  materialWarehouses = [];
 
  selectedItemIndex = -1;
 
  stockTransferReceipt: any = new StockTransferReceiptNotificationRequestDto();
 
  newRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferNotificationDetailListItemDto();
 
  initialRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferNotificationDetailListItemDto();
 
  currentDate = new Date();
  
  selectedDetailIndex = -1;
  
  wareHouseFrom: any;
  
  selectedwarehousefromId: any;
  
  wareHouseTo: any;
  
  selectedPlant: any;
  
  purchaseOrderNo: any;

  stockWarehouseFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    startDate: null,
    endDate: null,
    plantId: null,
    wareHouseId: null,
    materialId: null,
    materialName: null,
    materialType: null,
    batch: null,
    displayBatchStock: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  sub: Subscription;

  requestedById = null;

  @Output() saveAction = new EventEmitter<any>();


  constructor(private _router: Router,
              private _stockSvc: StockCardService,
              private _stockTransferReceiptSvc: StockTransferNotificationService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private _wareHouseSvc: WarehouseService,
              private _enumSvc: EnumService,
              private _porderSvc: PorderService,
              private _prodOrderSvc: ProductionOrderService,
              private _saleOrderSvc: SalesOrderService,
              private _confirmationSvc: ConfirmationService,
              private appStateService: AppStateService,
              private _translateSvc: TranslateService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.filterAllData.plantId = null;
                  } else {
                    this.filterAllData.plantId = res.plantId;
                    this.setSelectedPlant(res);
                  }
                  this.filterAccordingToPlant();
                });
  }

  ngOnInit() {
    this.stockWarehouseFilter.endDate = new Date();

    this._wareHouseSvc.getIdNameList().then(result => this.warehouseList = result).catch(error => console.log(error));

    this.filterAccordingToPlant();

    this._enumSvc.getGoodsMovementActivityTypeList().then(result => {
      this.activityTypeList = result;
    }).catch(error => console.log(error));

    this._enumSvc.getGoodsMovementDocumentTypeList().then(result => {
      this.documentTypeList = result;
    }).catch(error => console.log(error));



  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filterAccordingToPlant() {

    this._porderSvc.filter(this.filterAllData).then(result => {
      this.purchaseOrderList = result['content'].filter((item) => {
        return (item.purchaseOrderStatus == 'CONFIRMED' || item.purchaseOrderStatus == 'PARTIAL_COMPLETED')
      });
    }).catch(error => console.log(error));

    this._prodOrderSvc.filterProdObservable(this.filterAllData).subscribe(
      result => {
        this.productionOrderList = result['content'];
      },
      error => {
        console.log(error)
      });

    this._saleOrderSvc.filter(this.filterAllData).then(result => {
        this.saleOrderList = result['content'];
    }).catch(error => console.log(error));

  }

  goPage() {
    this._router.navigate(['/stocks/transfers']);
  }

  setSelectedBatchFrom(batch) {

    if (batch) {
      this.newRequestCreateStockTransferDetailListItemDto.batchFrom = batch.batch;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = batch.warehouseId;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = batch.warehouseName;
    } else {
      this.newRequestCreateStockTransferDetailListItemDto.batchFrom = null;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = null;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = null;
    }
    this.params.batchCodeFromDialog.visible = false;

  }
  setSelectedBatch(batch) {
    if (batch) {
      this.newRequestCreateStockTransferDetailListItemDto.batch = batch.batchCode;
    } else {
      this.newRequestCreateStockTransferDetailListItemDto.batch = null;
    }
  }

  reset() {
    this.stockTransferReceipt = new StockTransferReceiptNotificationRequestDto();
  }


  // checkDateRestriction(event, field) {
  //   const now = new Date();
  //   const selectedDate = new Date(event);
  //   if (selectedDate > now) {
  //     this.stockTransferReceipt[field] = null;
  //   } else {
  //     this.stockTransferReceipt[field] = selectedDate;
  //   }
  // }
  onPurchaseOrderChange(event) {
    if (event) {
      this._porderSvc.getDetail(event)
      .then((result: any) => {
        if (result) {
          this.purchaseOrderDetailList = result.purchaseOrderDetailList;
          this.purchaseOrderNo = result.porderNo;
          this.supplierId = result.supplierId;
          this.requestedById = result.requestedById;
        }
      })
      .catch(error => {
        console.log(error)
        this.utilities.showErrorToast(error)
      });
    }

  }

  onPurchaseOrderDetailChange(event) {
    if (!event) { return; }
    const detailItem = this.purchaseOrderDetailList.find(item => item.purchaseOrderDetailId === +event);

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = +event;
    this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
    this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
    this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
    this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
    this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
    this.initialRequestCreateStockTransferDetailListItemDto.batchFrom = detailItem.batchFrom;
    this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
    this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.baseUnit;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
    this.getAlternativeUnitList(detailItem.stockId);
  }

  onProductionOrderChange(event) {

    const detailItem = this.productionOrderList.find(item => item.prodOrderId === +event);
    this.jobOrderList = detailItem.jobOrderList;
    this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
    this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
    this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.materialId;
    this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.materialName;
    this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
    this.initialRequestCreateStockTransferDetailListItemDto.batchFrom = detailItem.batchFrom;
    this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
    this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.baseUnit;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.warehouseName;
    this.getAlternativeUnitList(detailItem.stockId);
  }

  onJobOrderChange(event) {
    const detailItem = this.jobOrderList.find(item => item.jobOrderId === +event);

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = +event;
  }

  onSaleOrderChange(event) {

    const detailItem = this.saleOrderList.find(item => item.orderId === +event);
    this.saleOrderDetailList = detailItem.orderDetailDtoList
  }

  onSaleOrderDetailChange(event) {
    const detailItem = this.saleOrderDetailList.find(item => item.orderDetailId === +event);

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = +event;
    this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
    this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
    this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
    this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
    this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
    this.initialRequestCreateStockTransferDetailListItemDto.batchFrom = detailItem.batchFrom;
    this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
    this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.unit;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.warehouseId;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.warehouseName;
    this.getAlternativeUnitList(detailItem.stockId);
  }

  onPlantChange(event) {
    this.newRequestCreateStockTransferDetailListItemDto.plantName = event.plantName;
  }

  onMaterialChange(event) {
    this.newRequestCreateStockTransferDetailListItemDto.batchFrom = null;
    if (event.stockName) {
      this.reportSelectedStock.stockName = event.stockName;
    }
    
    this.newRequestCreateStockTransferDetailListItemDto.stockId = event.stockId;
    this.newRequestCreateStockTransferDetailListItemDto.stockNo = event.stockNo;
    this.newRequestCreateStockTransferDetailListItemDto.stockName = event.stockName;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = event.baseUnit;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.baseUnit;
    this.getAlternativeUnitList(event.stockId);

  }

  private getAlternativeUnitList(stockId) {
    this.unitList = null;
    if (stockId) {
      this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
        this.unitList = result;
      }).catch(error => console.log(error));
    }
  }

  private getMaterialWarehouses(stockName) {
    this.materialWarehouses = null;
    if (stockName) {
      this.stockWarehouseFilter.materialName = stockName;
      this._stockSvc.filterStockReports(this.stockWarehouseFilter).subscribe((result: any) => {
          this.materialWarehouses = result.content;
          console.log('materialhouses', this.materialWarehouses)
      }, (error) => {
        console.log('error', error)
      })
    }
  }


  onWareHouseFromChange(event) {
    // console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === +event);
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
  }

  onWareHouseToChange(event) {
    // console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === +event);
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = detailItem.wareHouseName;
  }

  onSelectActivityType(event) {
    this.documentTypeListFiltered = this.documentTypeList.filter(x => {
      if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.GOODS_RECEIPT) {
        switch (x) {
          case GoodsMovementDocumentTypeEnum.PURCHASE_ORDER:
            return true;
          case GoodsMovementDocumentTypeEnum.MAINTENANCE_ORDER:
              return true;
          case GoodsMovementDocumentTypeEnum.QUALITY_INSPECTION_LOT:
              return true;
          default:
            return false;
        }
      } else if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.GOODS_ISSUE) {
        switch (x) {
          case GoodsMovementDocumentTypeEnum.SALES_ORDER:
            return true;
          case GoodsMovementDocumentTypeEnum.MAINTENANCE_ORDER:
              return true;
          case GoodsMovementDocumentTypeEnum.QUALITY_INSPECTION_LOT:
              return true;
          default:
            return false;
        }
        
      } else if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.TRANSFER_POSTING) {
        switch (x) {
          case GoodsMovementDocumentTypeEnum.ON_SITE:
            return true;
          case GoodsMovementDocumentTypeEnum.WORKSTATION:
              return true;
          case GoodsMovementDocumentTypeEnum.MAINTENANCE_ORDER:
              return true;
          case GoodsMovementDocumentTypeEnum.QUALITY_INSPECTION_LOT:
              return true;
          case GoodsMovementDocumentTypeEnum.OUTSOURCE_ISSUE:
              return true;
          case GoodsMovementDocumentTypeEnum.TRUCK_TRANSFER:
              return true;
          default:
            return false;
        }
      }
    });

    this.resetInitialItemDetails();
  }

  openTransferDetailsModal(index) {
    this.params.dialog.title = 'Transfer Details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      // new
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.initialRequestCreateStockTransferDetailListItemDto);
      if (this.selectedPlant) {
        this.newRequestCreateStockTransferDetailListItemDto.plantId = this.selectedPlant.plantId;
        this.newRequestCreateStockTransferDetailListItemDto.plantName = this.selectedPlant.plantName;
      }
      
    } else {
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.stockTransferReceipt.requestCreateStockTransferNotificationDetailList[index]);
     
    }

    this.getAlternativeUnitList(this.newRequestCreateStockTransferDetailListItemDto.stockId);
  }

  openMaterialQuantity() {
    this.params.materialDetailsDialog.visible = true;
    if (this.stockTransferReceipt.goodsMovementActivityType === 'TRANSFER_POSTING') {
      this.getMaterialWarehouses(this.newRequestCreateStockTransferDetailListItemDto.stockName);
    }
  }

  openBatchCodeFromDialog() {
    this.params.batchCodeFromDialog.visible = true;
  }

  addDetails() {
    const cloneOfNewTransferDetailListItem = Object.assign({}, this.newRequestCreateStockTransferDetailListItemDto);
    // if(this.selectedStock){
    //   cloneOfNewTransferDetailListItem.stockId = this.selectedStock.stockId;
    //   cloneOfNewTransferDetailListItem.stockNo = this.selectedStock.stockNo;
    // }
    
    if (this.selectedDetailIndex < 0) {
      // add
      this.stockTransferReceipt.requestCreateStockTransferNotificationDetailList.push(cloneOfNewTransferDetailListItem);
    } else {
      // update
      this.stockTransferReceipt.requestCreateStockTransferNotificationDetailList[this.selectedDetailIndex] = cloneOfNewTransferDetailListItem;
    }

    this.params.dialog.visible = false;
  }

  resetInitialItemDetails() {
    this.initialRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferNotificationDetailListItemDto();
  }

  resetNewItemDetails() {
    // stockTransferDetailId = 0;
    this.newRequestCreateStockTransferDetailListItemDto.batch = null;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId = this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName;
    this.newRequestCreateStockTransferDetailListItemDto.quantity = 0;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = null;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = null;
    this.newRequestCreateStockTransferDetailListItemDto.goodsMovementStatus = null;
    this.newRequestCreateStockTransferDetailListItemDto.defected = null;
    this.newRequestCreateStockTransferDetailListItemDto.batchFrom = null;

    if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.TRANSFER_POSTING) {
      this.newRequestCreateStockTransferDetailListItemDto.itemNo = 0;
      this.newRequestCreateStockTransferDetailListItemDto.stockId = null;
      this.newRequestCreateStockTransferDetailListItemDto.stockName = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantId = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = null;

      // this.selectedStock = null;
    }
  }

  deleteDetailItemFromList(index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.stockTransferReceipt.requestCreateStockTransferNotificationDetailList.splice(index, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  onDefectChanged(event, scrapModal) {
    if (event) {
      if (this.stockTransferReceipt.goodMovementDocumentType === 'ON_SITE' &&
          this.stockTransferReceipt.goodsMovementActivityType === 'TRANSFER_POSTING'
          ) {
            if (this.newRequestCreateStockTransferDetailListItemDto.stockId && 
              this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId &&
              this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId) {
              scrapModal.show();
            } else {
              setTimeout(() => {
                this.newRequestCreateStockTransferDetailListItemDto.defected = false;  
              }, 1000);
              
            }
      }
      
    }
  }

  setSelectedPlant(event) {
    if (event) {
      this.selectedPlant = event;
      this.newRequestCreateStockTransferDetailListItemDto.plantId = event.plantId;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = event.plantName;
    } else {
      this.newRequestCreateStockTransferDetailListItemDto.plantId = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = null;
    }
  }
  setSelectedWarehouseFrom(event) {
      this.wareHouseFrom = event;
      if (event && event.hasOwnProperty('wareHouseId')) {
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = event.wareHouseId;
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = event.wareHouseName;
      } else {
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = null;
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = null;
      }
  }
  setSelectedWarehouseTo(event) {
      this.wareHouseTo = event;
      if (event && event.hasOwnProperty('wareHouseId')) {
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId = event.wareHouseId;
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = event.wareHouseName;
      } else {
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId = null;
        this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = null;
      }
  }

  saveStockTransfer() {
    this.stockTransferReceipt.purchaseOrderId = +this.stockTransferReceipt.purchaseOrderId;
    this.stockTransferReceipt.purchaseOrderDetailId = +this.stockTransferReceipt.purchaseOrderDetailId;
    this.loaderService.showLoader();
    this._stockTransferReceiptSvc.saveStockTransferReceiptNotification(this.stockTransferReceipt)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  showDetailModal(field:string, data:any){
    if(field === 'wareHouseName'){
      this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, data.warehouseId)
    }else if(field === 'batch'){
      this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, data.batch)
    }
  }
}
