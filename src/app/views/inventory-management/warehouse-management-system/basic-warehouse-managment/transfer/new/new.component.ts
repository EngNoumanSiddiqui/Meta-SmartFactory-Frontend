import { UsersService } from 'app/services/users/users.service';
import { Component, EventEmitter, OnInit, Output, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';
import { RequestStockTransferReceiptCreateDto, RequestCreateStockTransferDetailListItemDto, GoodsMovementActivityTypeEnum, GoodsMovementDocumentTypeEnum } from 'app/dto/stock/stock-transfer-receipt.model';
import { StockStockResponseDto } from 'app/dto/stock/stock-card.model';
import { environment } from 'environments/environment';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';

@Component({
  selector: 'transfer-receipts-new',
  templateUrl: './new.component.html'
})
export class NewStockTransferReceiptComponent implements OnInit, OnDestroy {

  modal: any;
  @Output() saveAction = new EventEmitter<any>();

  params = {
    dialog: { title: '', inputValue: '', visible: false },
    materialDetailsDialog: { title: '', inputValue: '', visible: false },
    batchCodeFromDialog: { title: '', inputValue: '', visible: false },
    warehouseDialog: { title: '', stockId: null, stockName: '', visible: false, item: null },
  };
  reportSelectedStock = {
    stockName: null
  };

  filterAllData = {
    pageNumber: 1,
    pageSize: 1000,
    plantId: null
  };
 

  supplierId: null;
  selectedItemIndex: any;
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
  plantList: any;
  stockTransferReceipt = new RequestStockTransferReceiptCreateDto();
  newRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferDetailListItemDto();
  initialRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferDetailListItemDto();
  currentDate = new Date();
  selectedDetailIndex = -1;
  selectedStock: StockStockResponseDto = new StockStockResponseDto();
  wareHouseFrom: any;
  selectedwarehousefromId: any;
  wareHouseTo: any;
  preSelectedPlant: any;
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

  @Input('data') set setDatafromSalesOrder( data) {
    if (data) {
      setTimeout(() => {
        this.stockTransferReceipt.goodsMovementActivityType = 'GOODS_ISSUE';
        this.stockTransferReceipt.goodMovementDocumentType = 'SALES_ORDER';
        setTimeout(() => {
          this.onSelectActivityType(this.stockTransferReceipt.goodsMovementActivityType);
          this.onDocumentTypeSelected(this.stockTransferReceipt.goodMovementDocumentType);
        }, 1000);
        this.stockTransferReceipt.orderId = data.orderDetailDtoList ? data.orderDetailDtoList[0].orderId : null;
        this.stockTransferReceipt.orderDetailId = data.orderDetailDtoList ? data.orderDetailDtoList[0].orderDetailId : null;
        this.stockTransferReceipt.documentDate = data.orderDate ? new Date(data.orderDate) : null;
        this.stockTransferReceipt.documentDate = data.orderDetailDtoList ? new Date(data.orderDetailDtoList[0].deliveryDate) : null;
        this.stockTransferReceipt.requestCreateStockTransferDetailList = [];
        this.stockTransferReceipt.postingDate = new Date();
        if (data.orderDetailDtoList) {
          data.orderDetailDtoList.forEach(item => {
            const newItem = {
              itemNo : item.orderId,
              stockTransferDetailId : null,
              stockTransferReceiptId : null,
              stockId : item.stockId,
              stockName : item.stockName,
              stockNo : item.stockNo,
              plantId : item.plantId,
              plantName : item.plantName,
              defected : item.defected,
              dimensionUnit: item.unit,
              height: 0,
              width: 0,
              batchFrom : item.batchFrom,
              batch : item.batch,
              wareHouseFromId : item.warehouseId,
              wareHouseFromName : item.warehouseName,
              wareHouseToId : null,
              wareHouseToName : null,
              quantity : item.quantity,
              baseUnit : item.unit,
              baseUnitOfQuantity : item.baseUnitOfQuantity,
              goodsMovementStatus : item.goodsMovementStatus,
              materialId : item.materialId,
              materialNo : item.materialNo,
              materialName : item.materialName,
            }
            this.stockTransferReceipt.requestCreateStockTransferDetailList.push(newItem);
          });
        }
      }, 1000);
    }
  }

  constructor(private _router: Router,
    private _stockSvc: StockCardService,
    private _stockTransferReceiptSvc: StockTransferReceiptService,
    private utilities: UtilitiesService,
    private UsrSvc: UsersService,
    private loaderService: LoaderService,
    private cdx: ChangeDetectorRef,
    private _enumSvc: EnumService,
    private _porderSvc: PorderService,
    private _prodOrderSvc: ProductionOrderService,
    private _saleOrderSvc: SalesOrderService,
    private _confirmationSvc: ConfirmationService,
    private appStateService: AppStateService,
    private _translateSvc: TranslateService) {
    // this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.checkIfPlantAlreadySelected();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.filterAllData.plantId = null;
      } else {
        this.filterAllData.plantId = res.plantId;
      }
    });
  }

  ngOnInit() {
    this.stockWarehouseFilter.endDate = new Date();

    this._enumSvc.getGoodsMovementActivityTypeList().then(result => {
      this.activityTypeList = result;
     
    }).catch(error => console.log(error));

    this._enumSvc.getGoodsMovementDocumentTypeList().then(result => {
      this.documentTypeList = result;
      if (this.stockTransferReceipt.goodsMovementActivityType) {
        this.onSelectActivityType(null);
      }
    }).catch(error => console.log(error));



  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  quantityChange(event, max) {
    if (event > max) {
      this.newRequestCreateStockTransferDetailListItemDto.quantity = max;
    }
  }
  
  checkIfPlantAlreadySelected() {
    this.preSelectedPlant = this.UsrSvc.getPlant();
    if ((this.preSelectedPlant)) {
      this.setSelectedPlant(JSON.parse(this.preSelectedPlant));
    }
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
    this.stockTransferReceipt = new RequestStockTransferReceiptCreateDto();
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
            this.stockTransferReceipt.actId =result.supplierId;
          }
        })
        .catch(error => {
          console.log(error)
          this.utilities.showErrorToast(error)
        });
    }

  }

  onPurchaseOrderDetailChange(event) {
    console.log('onPurchaseOrderDetailChange', event)
    if (!event) return;
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
    // this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
    // this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
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
    this.saleOrderDetailList = detailItem ? detailItem.orderDetailDtoList : null;
  }

  onSaleOrderDetailChange(event) {
    const detailItem = this.saleOrderDetailList.find(item => item.orderDetailId === +event);

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = +event;
    if (detailItem) {
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
  }

  onPlantChange(event) {
    // console.log(event);
    const detailItem = this.plantList.find(item => item.plantId === +event);
    this.newRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
  }

  onMaterialChange(event) {

    if (event.value.stockName) {
      this.reportSelectedStock.stockName = event.value.stockName.split('|')[1].trim();
    }

    this.newRequestCreateStockTransferDetailListItemDto.stockId = event.value.stockId;
    this.newRequestCreateStockTransferDetailListItemDto.stockNo = event.value.stockNo;
    this.newRequestCreateStockTransferDetailListItemDto.stockName = event.value.stockName;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = event.value.baseUnit;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.value.baseUnit;
    this.getAlternativeUnitList(event.value.stockId);

    if (this.stockTransferReceipt.goodsMovementActivityType == 'TRANSFER_POSTING') {
      this.getMaterialWarehouses(event.value.stockName);
    }
  }

  onStockChanged(event) {

    if (event.stockName) {
      this.reportSelectedStock.stockName = event.stockName.split('|')[1].trim();
    }

    this.newRequestCreateStockTransferDetailListItemDto.stockId = event.stockId;
    this.newRequestCreateStockTransferDetailListItemDto.stockNo = event.stockNo;
    this.newRequestCreateStockTransferDetailListItemDto.stockName = event.stockName;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = event.baseUnit;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.baseUnit;
    this.getAlternativeUnitList(event.stockId);

    if (this.stockTransferReceipt.goodsMovementActivityType == 'TRANSFER_POSTING') {
      this.getMaterialWarehouses(event.stockName);
    }
  }

  private getAlternativeUnitList(stockId) {
    if (stockId) {
      this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
        this.unitList = result;
        this.cdx.markForCheck();
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

  onSelectActivityType(event) {
    this.documentTypeListFiltered = this.documentTypeList.filter(x => {
      if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.GOODS_RECEIPT) {
        if (x === GoodsMovementDocumentTypeEnum.PURCHASE_ORDER
          || x === GoodsMovementDocumentTypeEnum.PRODUCTION_ORDER) {
          return true;
        }
      } else if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.GOODS_ISSUE) {
        if (x === GoodsMovementDocumentTypeEnum.SALES_ORDER) {
          return true;
        }
      } else if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.TRANSFER_POSTING) {
        if (x === GoodsMovementDocumentTypeEnum.ON_SITE) {
          return true;
        }
      }
    });

    this.resetInitialItemDetails();
  }

  onDocumentTypeSelected(event) {
    
    if (event === 'PURCHASE_ORDER') {
      this.loaderService.showLoader();
      this._porderSvc.filter(this.filterAllData).then(result => {
        this.loaderService.hideLoader();
      this.purchaseOrderList = result['content'].filter((item) => {
        return (item.purchaseOrderStatus === 'CONFIRMED' || item.purchaseOrderStatus === 'PARTIAL_COMPLETED')
      });
    }).catch(error => { 
      this.loaderService.hideLoader();
      console.log(error);
    });


    } else if (event === 'PRODUCTION_ORDER') {
      this.loaderService.showLoader();
      this._prodOrderSvc.filterProdObservable(this.filterAllData).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.productionOrderList = result['content'];
      },
      error => {
        console.log(error)
        this.loaderService.hideLoader();
      });

    } else if (event === 'SALES_ORDER') {
      this.loaderService.showLoader();
      this._saleOrderSvc.filter(this.filterAllData).then(result => {
          this.saleOrderList = result['content'];
          this.loaderService.hideLoader();
          if (this.stockTransferReceipt.orderId > 0) {
            this._saleOrderSvc.getDetail(this.stockTransferReceipt.orderId).then((rs: any) => {
              const detailItem = rs;
              this.saleOrderDetailList = rs.orderDetailDtoList;
              this.onSaleOrderChange(this.stockTransferReceipt.orderId);
              this.onSaleOrderDetailChange(this.stockTransferReceipt.orderDetailId);
              // this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
              // this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
              // this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
              // this.initialRequestCreateStockTransferDetailListItemDto.stockNo = detailItem.stockNo;
              // this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
              // this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
              // this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
              // this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.unit;
              // this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
              // this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
              this.getAlternativeUnitList(detailItem.stockId);
    
            }).catch(error => {
              console.log(error);
              this.utilities.showErrorToast(error);
            });
          }
        }).catch(error => {
          console.log(error);
          this.loaderService.hideLoader();
        });
    }
  }

  openTransferDetailsModal(index) {
    this.params.dialog.title = 'Transfer Details';
    this.params.dialog.visible = true;
    this.selectedDetailIndex = index;
    if (this.selectedDetailIndex < 0) {
      // new
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.initialRequestCreateStockTransferDetailListItemDto);
      if (this.preSelectedPlant) {
        let plant = JSON.parse(this.preSelectedPlant);
        this.newRequestCreateStockTransferDetailListItemDto.plantId = plant.plantId;
        this.newRequestCreateStockTransferDetailListItemDto.plantName = plant.plantName;
      }
     
      // this.getAlternativeUnitList(this.newRequestCreateStockTransferDetailListItemDto.stockId);
    } else {
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.stockTransferReceipt.requestCreateStockTransferDetailList[index]);
      // this.getAlternativeUnitList(this.newRequestCreateStockTransferDetailListItemDto.stockId);
    }
  }

  openMaterialQuantity() {
    this.params.materialDetailsDialog.visible = true;
  }

  openBatchCodeFromDialog() {
    this.params.batchCodeFromDialog.visible = true;
  }

  addDetails() {
    const cloneOfNewTransferDetailListItem = Object.assign({}, this.newRequestCreateStockTransferDetailListItemDto);
    if (this.selectedStock && this.selectedStock.stockId) {
      cloneOfNewTransferDetailListItem.stockId = this.selectedStock.stockId;
      cloneOfNewTransferDetailListItem.stockNo = this.selectedStock.stockNo;
    }

    if (this.selectedDetailIndex < 0) {
      // add
      this.stockTransferReceipt.requestCreateStockTransferDetailList.push(cloneOfNewTransferDetailListItem);
    } else {
      // update
      this.stockTransferReceipt.requestCreateStockTransferDetailList[this.selectedDetailIndex] = cloneOfNewTransferDetailListItem;
    }

    this.params.dialog.visible = false;
  }

  resetInitialItemDetails() {
    this.initialRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferDetailListItemDto();
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

      this.selectedStock = null;
    }
  }

  deleteDetailItemFromList(index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.stockTransferReceipt.requestCreateStockTransferDetailList.splice(index, 1);
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  setSelectedPlant(event) {
    // this.wareHouseto = null;
    if (event) {
      // this.order.plantId = event.plantId;
      this.newRequestCreateStockTransferDetailListItemDto.plantId = event.plantId;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = event.plantName;
    } else {
      this.newRequestCreateStockTransferDetailListItemDto.plantId = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = null;
    }
  }
  setSelectedWarehouseFrom(event) {
    console.log('@s!!', event);
    // this.workStation.wareHouse = event;
    // this.onWareHouseChange(event);
    this.wareHouseFrom = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = event.wareHouseId;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = event.wareHouseName;
    } else {
      // this.workStation.warehouseId = null;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = null;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = null;
    }
  }
  setSelectedWarehouseTo(event) {
    console.log('@s!!', event);
    // this.workStation.wareHouse = event;
    // this.onWareHouseChange(event);
    this.wareHouseTo = event;
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId = event.wareHouseId;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = event.wareHouseName;
    } else {
      // this.workStation.warehouseId = null;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId = null;
      this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = null;
    }
  }

  saveStockTransfer() {
    this.loaderService.showLoader();
    this._stockTransferReceiptSvc.save(this.stockTransferReceipt)
      .then(() => {
        this.loaderService.hideLoader();
        console.log('ok');
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
}
