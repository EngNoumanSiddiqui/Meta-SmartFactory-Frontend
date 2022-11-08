import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
import { RequestCreateStockTransferDetailListItemDto, ResponseStockTransferDto, GoodsMovementActivityTypeEnum } from 'app/dto/stock/stock-transfer-receipt.model';
import { StockStockResponseDto } from 'app/dto/stock/stock-card.model';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'transfer-receipts-edit',
  templateUrl: './edit.component.html'
})
export class EditStockTransferReceiptComponent implements OnInit {
  modal: any;
  @Output() saveAction = new EventEmitter<any>();
  wareHouseFrom: any;
  wareHouseTo: any;
  selectedPlant: any;
  selectedItemIndex: any;
  supplierId = null;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  id;
  params = {
    dialog: {title: '', inputValue: '', visible: false},
    warehouseDialog: {title: '', stockId: null, stockName: '', visible: false},
  };

  activityTypeList: any;
  documentTypeList: any;
  purchaseOrderDetailList = [];
  jobOrderList = [];
  saleOrderDetailList = [];
  unitList = [];
  // plantList: any;

  stockTransferReceipt: any;
  stockTransferReceiptUpdateDto: any;
  newRequestCreateStockTransferDetailListItemDto: any = new RequestCreateStockTransferDetailListItemDto();
  initialRequestCreateStockTransferDetailListItemDto = new RequestCreateStockTransferDetailListItemDto();

  selectedDetailIndex = -1;
  selectedStock: StockStockResponseDto = new StockStockResponseDto();

  constructor(private _router: Router,
              private _stockSvc: StockCardService,
              private _stockTransferReceiptSvc: StockTransferReceiptService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private UsrSvc: UsersService,
              private _porderSvc: PorderService,
              private _prodOrderSvc: ProductionOrderService,
              private _saleOrderSvc: SalesOrderService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService) {
                this.selectedPlant = JSON.parse(this.UsrSvc.getPlant());
    /*   this._route.params.subscribe((params) => {
     this.id = params['id'];
     console.log(this.id);
     });*/
  }

  private initialize(id) {
    const me = this;
    this.loaderService.showLoader();
    this._stockTransferReceiptSvc.getDetail(this.id).then((result: any) => {
      this.loaderService.hideLoader();
      if (result['postingDate']) {
        result['postingDate'] = new Date(result['postingDate']);
      }
      if (result['documentDate']) {
        result['documentDate'] = new Date(result['documentDate']);
      }
      this.supplierId = result.actId;
      me.stockTransferReceipt = result as ResponseStockTransferDto;
    
      if (this.stockTransferReceipt && this.stockTransferReceipt.responseStockTransferDetailList) {
        this.stockTransferReceipt.responseStockTransferDetailList.forEach(item => {
          item.stockId = item.materialId;
          item.stockNo = item.materialNo;
          item.stockName = item.materialName;
          delete item.materialId;
          delete item.materialNo;
          delete item.materialName;
        });
      }
      if (me.stockTransferReceipt.purchaseOrderId > 0) {
        this._porderSvc.getDetail(me.stockTransferReceipt.purchaseOrderId).then((rs: any) => {
          this.purchaseOrderDetailList = rs.purchaseOrderDetailList;
          if (this.purchaseOrderDetailList && this.purchaseOrderDetailList.length > 0) {
            const detailItem = this.purchaseOrderDetailList[0];
            this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
            this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
            this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
            this.initialRequestCreateStockTransferDetailListItemDto.stockNo = detailItem.stockNo;
            this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
            this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
            this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
            this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.baseUnit;
            this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
            this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
            this.getAlternativeUnitList(detailItem.stockId)
          }
        }).catch(error => {
          console.log(error);
          this.utilities.showErrorToast(error);
        });

      } else if (this.stockTransferReceipt.prodOrderId > 0) {
        this._prodOrderSvc.getDetail(this.stockTransferReceipt.prodOrderId).then((rs: any) => {
          const detailItem = rs;
          this.jobOrderList = rs.jobOrderList;

          this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
          this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
          this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.materialId;
          this.initialRequestCreateStockTransferDetailListItemDto.stockNo = detailItem.materialNo;
          this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.materialName;
          this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
          this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
          this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.baseUnit;
          this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
          this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.warehouseName;
          this.getAlternativeUnitList(detailItem.materialId)
        }).catch(error => {
          console.log(error);
          this.utilities.showErrorToast(error);
        });

      } else if (this.stockTransferReceipt.saleOrderId > 0) {
        this._saleOrderSvc.getDetail(this.stockTransferReceipt.saleOrderId).then((rs: any) => {
          const detailItem = rs;
          this.saleOrderDetailList = rs.orderDetailDtoList;

          this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
          this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
          this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
          this.initialRequestCreateStockTransferDetailListItemDto.stockNo = detailItem.stockNo;
          this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
          this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
          this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
          this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.unit;
          this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
          this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
          this.getAlternativeUnitList(detailItem.stockId)

        }).catch(error => {
          console.log(error);
          this.utilities.showErrorToast(error);
        });
      }
    }).catch(error => {
      this.loaderService.hideLoader();
    });
  }

  setSelectedBatch(batch) {
    if (batch) {
      this.newRequestCreateStockTransferDetailListItemDto.batch = batch.batchCode;
    } else {
      this.newRequestCreateStockTransferDetailListItemDto.batch = null;
    }
  }

  ngOnInit() {
    this._enumSvc.getGoodsMovementActivityTypeList().then(result => {
      this.activityTypeList = result;
    }).catch(error => console.log(error));

    this._enumSvc.getGoodsMovementDocumentTypeList().then(result => {
      this.documentTypeList = result;
    }).catch(error => console.log(error));

  }

  setSelectedPlant(event) {
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
  goPage() {
    this._router.navigate(['/stocks/transfers']);
  }


  cancel() {
    this.goPage();
  }

  onPurchaseOrderDetailChange(event) {
    const detailItem = this.purchaseOrderDetailList.find(item => item.purchaseOrderDetailId === event);

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = event;
    this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
    this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
    this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
    this.initialRequestCreateStockTransferDetailListItemDto.stockNo = detailItem.stockNo;
    this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
    this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
    this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
    this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.unit;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.wareHouseId;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
    this.getAlternativeUnitList(detailItem.stockId);

  }

  onJobOrderChange(event) {

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = event;
  }

  onSaleOrderDetailChange(event) {
    // console.log(event);
    const detailItem = this.saleOrderDetailList.find(item => item.orderDetailId === event);

    this.initialRequestCreateStockTransferDetailListItemDto.itemNo = event;
    this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
    this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
    this.initialRequestCreateStockTransferDetailListItemDto.stockId = detailItem.stockId;
    this.initialRequestCreateStockTransferDetailListItemDto.stockNo = detailItem.stockNo;
    this.initialRequestCreateStockTransferDetailListItemDto.stockName = detailItem.stockName;
    this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
    this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
    this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.unit;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.warehouseId;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.warehouseName;
    this.getAlternativeUnitList(detailItem.stockId);
  }

  // onPlantChange(event) {
  //   // console.log(event);
  //   const detailItem = this.plantList.find(item => item.plantId === event);
  //   this.newRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
  // }

  onMaterialChange(event) {
    this.selectedStock = event.value;
    this.newRequestCreateStockTransferDetailListItemDto.stockId = event.value.stockId;
    this.newRequestCreateStockTransferDetailListItemDto.stockNo = event.value.stockNo;
    this.newRequestCreateStockTransferDetailListItemDto.stockName = event.value.stockName;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = event.value.baseUnit;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.value.baseUnit;

    this.getAlternativeUnitList(event.value.stockId)

  }
  onStockChanged(event) {
    this.selectedStock = event;
    this.newRequestCreateStockTransferDetailListItemDto.stockId = event.stockId;
    this.newRequestCreateStockTransferDetailListItemDto.stockNo = event.stockNo;
    this.newRequestCreateStockTransferDetailListItemDto.stockName = event.stockName;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = event.baseUnit;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.baseUnit;

    this.getAlternativeUnitList(event.stockId)

  }


  private getAlternativeUnitList(stockId) {
    this.unitList = null;
    if (stockId) {
      this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
        this.unitList = result;
      }).catch(error => console.log(error));
    }
  }

  // onWareHouseFromChange(event) {
  //   // console.log(event);
  //   const detailItem = this.warehouseList.find(item => item.wareHouseId === event);
  //   this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
  // }

  // onWareHouseToChange(event) {
  //   // console.log(event);
  //   const detailItem = this.warehouseList.find(item => item.wareHouseId === event);
  //   this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = detailItem.wareHouseName;
  // }

  openTransferDetailsModal(index) {
    this.params.dialog.title = 'Transfer Details';
    this.params.dialog.visible = true;
    // this.myModal.show();
    // this.getStockItems();
    this.selectedDetailIndex = index;

    if (this.selectedDetailIndex < 0) {
      // new
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.initialRequestCreateStockTransferDetailListItemDto);
      this.newRequestCreateStockTransferDetailListItemDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
      // if (this.newRequestCreateStockTransferDetailListItemDto.plantId) {
      //   this._stockSvc.filter({...this.filterAllData, plantId: this.newRequestCreateStockTransferDetailListItemDto.plantId}).then(result => {
      //     this.stockList = result['content'];
      //   }).catch(error => console.log(error));
      // }
      // this.selectedStock = this.stockList.find(item => item.stockId === this.newRequestCreateStockTransferDetailListItemDto.stockId);
      // if (this.selectedStock) {
      //   this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = this.selectedStock['baseUnit'];
      // }
      // this.getAlternativeUnitList(this.newRequestCreateStockTransferDetailListItemDto.stockId);
    } else {
      // edit
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.stockTransferReceipt.responseStockTransferDetailList[index]);
      // this.newRequestCreateStockTransferDetailListItemDto.stockId = this.newRequestCreateStockTransferDetailListItemDto.materialId;
      // this.newRequestCreateStockTransferDetailListItemDto.stockNo = this.newRequestCreateStockTransferDetailListItemDto.materialNo;
      // this.newRequestCreateStockTransferDetailListItemDto.stockName = this.newRequestCreateStockTransferDetailListItemDto.materialName;
      // this.selectedStock = this.stockList.find(item => item.stockId === this.newRequestCreateStockTransferDetailListItemDto.stockId);
      // if (this.selectedStock) {
      //   this.newRequestCreateStockTransferDetailListItemDto.baseUnitOfQuantity = this.selectedStock['baseUnit'];
      // }
      // this.getAlternativeUnitList(this.newRequestCreateStockTransferDetailListItemDto.stockId)
    }
    
  }

  addDetails() {
    const cloneOfNewTransferDetailListItem = Object.assign({}, this.newRequestCreateStockTransferDetailListItemDto);
    if (this.selectedStock && this.selectedStock.stockId) {
      cloneOfNewTransferDetailListItem.stockId = this.selectedStock.stockId;
      cloneOfNewTransferDetailListItem.stockNo = this.selectedStock.stockNo;
      cloneOfNewTransferDetailListItem.stockName = this.selectedStock.stockName;
    }
    
    if (this.selectedDetailIndex < 0) {
      // add
      this.stockTransferReceipt.responseStockTransferDetailList.push(cloneOfNewTransferDetailListItem);
    } else {
      // update
      this.stockTransferReceipt.responseStockTransferDetailList[this.selectedDetailIndex] = cloneOfNewTransferDetailListItem;
    }

    this.params.dialog.visible = false;
  }


  resetNewItemDetails() {
    // stockTransferDetailId = 0;
    this.newRequestCreateStockTransferDetailListItemDto.stockTransferReceiptId = null;
    this.newRequestCreateStockTransferDetailListItemDto.batch = null;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromId = null;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = null;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseToId = null;
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = null;
    this.newRequestCreateStockTransferDetailListItemDto.quantity = 0;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = null;
    this.newRequestCreateStockTransferDetailListItemDto.goodsMovementStatus = null;
    this.newRequestCreateStockTransferDetailListItemDto.defected = null;

    if (this.stockTransferReceipt.goodsMovementActivityType === GoodsMovementActivityTypeEnum.TRANSFER_POSTING) {
      this.newRequestCreateStockTransferDetailListItemDto.itemNo = null;
      this.newRequestCreateStockTransferDetailListItemDto.stockNo = null;
      this.newRequestCreateStockTransferDetailListItemDto.stockId = null;
      this.newRequestCreateStockTransferDetailListItemDto.stockName = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantId = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = null;

      this.selectedStock = null;
    }
  }

  deleteDetailItemFromList(index) {
    const detailItem = this.stockTransferReceipt.responseStockTransferDetailList[index];

    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        console.log('StockTransferDetailId: ' + detailItem.stockTransferDetailId);
        if (detailItem.stockTransferDetailId > 0) {
          // exists in db
          this._stockTransferReceiptSvc.cancelDetailItem(detailItem.stockTransferDetailId)
            .then(() => {
              this.utilities.showSuccessToast('deleted-success');
              this.stockTransferReceipt.responseStockTransferDetailList.splice(index, 1);
            })
            .catch(error => {
              this.utilities.showErrorToast(error)
            });
        } else {
          this.stockTransferReceipt.responseStockTransferDetailList.splice(index, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  saveStockTransfer() {
    this.stockTransferReceiptUpdateDto = Object.assign({}, this.stockTransferReceipt);
    this.stockTransferReceiptUpdateDto.requestCreateStockTransferDetailList = this.stockTransferReceiptUpdateDto.responseStockTransferDetailList;
    delete this.stockTransferReceiptUpdateDto.responseStockTransferDetailList;

    this.stockTransferReceiptUpdateDto.orderId = this.stockTransferReceiptUpdateDto.saleOrderId;

    this.loaderService.showLoader();
    this._stockTransferReceiptSvc.update(this.stockTransferReceiptUpdateDto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }
}
