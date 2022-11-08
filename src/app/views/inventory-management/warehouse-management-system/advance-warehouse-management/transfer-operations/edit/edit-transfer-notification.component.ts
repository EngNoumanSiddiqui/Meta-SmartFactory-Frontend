import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
import { 
  StockTransferReceiptNotificationRequestDto,
  ResponseStockTransferNotificationDetailListDto
} from 'app/dto/stock/stock-transfer-notification.model';
import { StockTransferNotificationService } from 'app/services/dto-services/stock-transfer-notification/stock-transfer-notification.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { StockStockResponseDto } from 'app/dto/stock/stock-card.model';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { WarehouseService } from 'app/services/dto-services/warehouse/warehouse.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { GoodsMovementActivityTypeEnum } from 'app/dto/stock/stock-transfer-receipt.model';
import { environment } from 'environments/environment';


@Component({
  selector: 'transfer-notification-edit',
  templateUrl: './edit-transfer-notification.component.html'
})
export class EditStockTransferNotificationComponent implements OnInit {

  modal: any;
  @Output() saveAction = new EventEmitter<any>();
  @Input() showMovementCancelButton: boolean = false;
  @Input() showMovementEditButton: boolean = false;
  wareHouseFrom: any;
  wareHouseTo: any;
  selectedPlant: any;
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
  stockList;
  warehouseList;


  filterAllData = {
    pageNumber: 1,
    pageSize: 1000
  };

  activityTypeList: any;
  documentTypeList: any;
  purchaseOrderDetailList = [];
  jobOrderList = [];
  saleOrderDetailList = [];
  unitList = [];
  plantList: any;

  stockTransferReceipt: any;
  stockTransferReceiptUpdateDto: any;
  newRequestCreateStockTransferDetailListItemDto: any = new ResponseStockTransferNotificationDetailListDto();
  initialRequestCreateStockTransferDetailListItemDto: any = new ResponseStockTransferNotificationDetailListDto();

  selectedDetailIndex = -1;
  selectedStock: StockStockResponseDto = new StockStockResponseDto();
  selectedItemIndex = -1;
  constructor(private _router: Router,
              private _stockSvc: StockCardService,
              private stockTransferNotificationService: StockTransferNotificationService,
              private stockTransferReceiptService: StockTransferReceiptService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _wareHouseSvc: WarehouseService,
              private _enumSvc: EnumService,
              private UsrSvc: UsersService,
              private _porderSvc: PorderService,
              private _prodOrderSvc: ProductionOrderService,
              private _saleOrderSvc: SalesOrderService,
              private _plantSvc: PlantService,
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
    this.stockTransferNotificationService.getStockTransferReceiptNotificationDetail(this.id).then((result: any) => {
      this.loaderService.hideLoader();
      if (result['postingDate']) {
        result['postingDate'] = new Date(result['postingDate']);
      }
      if (result['documentDate']) {
        result['documentDate'] = new Date(result['documentDate']);
      }
      this.supplierId = result.actId;
      me.stockTransferReceipt = result as StockTransferReceiptNotificationRequestDto;
      me.stockTransferReceipt.responseStockTransferNotificationDetailList.forEach(itm => {
        if (itm.dimensionUnit === '0') {
          itm.dimensionUnit = null;
        }
      });
      console.log('stockTranRecipt', me.stockTransferReceipt)
      if (me.stockTransferReceipt.purchaseOrderId > 0) {
        this._porderSvc.getDetail(me.stockTransferReceipt.purchaseOrderId).then((rs: any) => {
          const detailItem = rs;
          this.purchaseOrderDetailList = rs.purchaseOrderDetailList;
          this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
          this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
          this.initialRequestCreateStockTransferDetailListItemDto.materialId = detailItem.stockId;
          this.initialRequestCreateStockTransferDetailListItemDto.materialNo = detailItem.stockNo;
          this.initialRequestCreateStockTransferDetailListItemDto.materialName = detailItem.stockName;
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

      } else if (this.stockTransferReceipt.prodOrderId > 0) {
        this._prodOrderSvc.getDetail(this.stockTransferReceipt.prodOrderId).then((rs: any) => {
          const detailItem = rs;
          this.jobOrderList = rs.jobOrderList;

          this.initialRequestCreateStockTransferDetailListItemDto.plantId = detailItem.plantId;
          this.initialRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
          this.initialRequestCreateStockTransferDetailListItemDto.materialId = detailItem.materialId;
          this.initialRequestCreateStockTransferDetailListItemDto.materialNo = detailItem.materialNo;
          this.initialRequestCreateStockTransferDetailListItemDto.materialName = detailItem.materialName;
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
          this.initialRequestCreateStockTransferDetailListItemDto.materialId = detailItem.stockId;
          this.initialRequestCreateStockTransferDetailListItemDto.materialNo = detailItem.stockNo;
          this.initialRequestCreateStockTransferDetailListItemDto.materialName = detailItem.stockName;
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
    this._wareHouseSvc.getIdNameList().then(result => this.warehouseList = result).catch(error => console.log(error));

    this._plantSvc.getAllPlants().then(result => {
      this.plantList = result;
    }).catch(error => console.log(error));

    this._stockSvc.filter(this.filterAllData).then(result => {
      this.stockList = result['content'];
    }).catch(error => console.log(error));

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
    this.initialRequestCreateStockTransferDetailListItemDto.materialId = detailItem.stockId;
    this.initialRequestCreateStockTransferDetailListItemDto.materialNo = detailItem.stockNo;
    this.initialRequestCreateStockTransferDetailListItemDto.materialName = detailItem.stockName;
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
    this.initialRequestCreateStockTransferDetailListItemDto.materialId = detailItem.stockId;
    this.initialRequestCreateStockTransferDetailListItemDto.materialNo = detailItem.stockNo;
    this.initialRequestCreateStockTransferDetailListItemDto.materialName = detailItem.stockName;
    this.initialRequestCreateStockTransferDetailListItemDto.batch = detailItem.batch;
    this.initialRequestCreateStockTransferDetailListItemDto.quantity = detailItem.quantity;
    this.initialRequestCreateStockTransferDetailListItemDto.baseUnit = detailItem.unit;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromId = detailItem.warehouseId;
    this.initialRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.warehouseName;
    this.getAlternativeUnitList(detailItem.stockId);
  }

  onPlantChange(event) {
    // console.log(event);
    const detailItem = this.plantList.find(item => item.plantId === event);
    this.newRequestCreateStockTransferDetailListItemDto.plantName = detailItem.plantName;
  }

  onMaterialChange(event) {
    this.newRequestCreateStockTransferDetailListItemDto.materialId = event.value.stockId;
    this.newRequestCreateStockTransferDetailListItemDto.materialNo = event.value.stockNo;
    this.newRequestCreateStockTransferDetailListItemDto.materialName = event.value.stockName;
    this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.value.baseUnit;
    // this.newRequestCreateStockTransferDetailListItemDto.baseUnit = event.value.baseUnit;

    this.getAlternativeUnitList(event.value.stockId)

  }


  private getAlternativeUnitList(stockId) {
    this.unitList = null;
    if (stockId) {
      this._stockSvc.metarialActiveUnits(stockId).then((result: any) => {
        this.unitList = result;
      }).catch(error => console.log(error));
    }
  }

  onWareHouseFromChange(event) {
    // console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === event);
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseFromName = detailItem.wareHouseName;
  }

  onWareHouseToChange(event) {
    // console.log(event);
    const detailItem = this.warehouseList.find(item => item.wareHouseId === event);
    this.newRequestCreateStockTransferDetailListItemDto.wareHouseToName = detailItem.wareHouseName;
  }

  openTransferDetailsModal(index) {
    this.params.dialog.title = 'Transfer Details';
    this.params.dialog.visible = true;
    // this.myModal.show();
    // this.getStockItems();

    this.selectedDetailIndex = index;
console.log('StockTransferDetailListItem', this.stockTransferReceipt)
    if (this.selectedDetailIndex < 0) {
      // new
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.initialRequestCreateStockTransferDetailListItemDto);
      this.newRequestCreateStockTransferDetailListItemDto.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
      if (this.newRequestCreateStockTransferDetailListItemDto.plantId) {
        this._stockSvc.filter({...this.filterAllData, plantId: this.newRequestCreateStockTransferDetailListItemDto.plantId}).then(result => {
          this.stockList = result['content'];
        }).catch(error => console.log(error));
      }
      this.selectedStock = this.stockList.find(item => item.stockId === this.newRequestCreateStockTransferDetailListItemDto.materialId);
      if (this.selectedStock) {
        this.newRequestCreateStockTransferDetailListItemDto.baseUnit = this.selectedStock['baseUnit'];
      }
    } else {
      // edit
      this.newRequestCreateStockTransferDetailListItemDto = Object.assign({}, this.stockTransferReceipt.responseStockTransferNotificationDetailList[index]);
      this.newRequestCreateStockTransferDetailListItemDto.materialId = this.newRequestCreateStockTransferDetailListItemDto.materialId;
      this.newRequestCreateStockTransferDetailListItemDto.materialNo = this.newRequestCreateStockTransferDetailListItemDto.materialNo;
      this.newRequestCreateStockTransferDetailListItemDto.materialName = this.newRequestCreateStockTransferDetailListItemDto.materialName;
      this.selectedStock = this.stockList.find(item => item.stockId === this.newRequestCreateStockTransferDetailListItemDto.materialId);
      if (this.selectedStock) {
        this.newRequestCreateStockTransferDetailListItemDto.baseUnit = this.selectedStock['baseUnit'];
      }
    }
  }

  addDetails() {
    const cloneOfNewTransferDetailListItem = Object.assign({}, this.newRequestCreateStockTransferDetailListItemDto);
    if(this.selectedStock){
      cloneOfNewTransferDetailListItem.materialId = this.selectedStock.stockId;
    }
    cloneOfNewTransferDetailListItem.materialId = cloneOfNewTransferDetailListItem.materialId;
    cloneOfNewTransferDetailListItem.materialName = cloneOfNewTransferDetailListItem.materialNo;
    cloneOfNewTransferDetailListItem.materialName = cloneOfNewTransferDetailListItem.materialName;


    if (this.selectedDetailIndex < 0) {
      // add
      this.stockTransferReceipt.responseStockTransferNotificationDetailList.push(cloneOfNewTransferDetailListItem);
    } else {
      // update
      this.stockTransferReceipt.responseStockTransferNotificationDetailList[this.selectedDetailIndex] = cloneOfNewTransferDetailListItem;
    }

    this.params.dialog.visible = false;
  }


  resetNewItemDetails() {
    // stockTransferDetailId = 0;
    //this.newRequestCreateStockTransferDetailListItemDto.stockTransferReceiptId = null;
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
      this.newRequestCreateStockTransferDetailListItemDto.materialNo = null;
      this.newRequestCreateStockTransferDetailListItemDto.materialId = null;
      this.newRequestCreateStockTransferDetailListItemDto.materialName = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantId = null;
      this.newRequestCreateStockTransferDetailListItemDto.plantName = null;

      this.selectedStock = null;
    }
  }

  deleteDetailItemFromList(index) {
    const detailItem = this.stockTransferReceipt.responseStockTransferNotificationDetailList[index];
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        console.log('StockTransferDetailId: ' + detailItem.stockTransferNotificationDetailId);
        if (detailItem.stockTransferNotificationDetailId > 0) {
          // exists in db
          this.stockTransferNotificationService.cancel(detailItem.stockTransferNotificationDetailId)
            .then(() => {
              this.utilities.showSuccessToast('deleted-success');
              this.stockTransferReceipt.responseStockTransferNotificationDetailList.splice(index, 1);
            })
            .catch(error => {
              this.utilities.showErrorToast(error)
            });
        } else {
          this.stockTransferReceipt.responseStockTransferNotificationDetailList.splice(index, 1);
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  saveStockTransfer() {
    this.stockTransferReceiptUpdateDto = Object.assign({}, this.stockTransferReceipt);
    this.stockTransferReceiptUpdateDto.requestCreateStockTransferDetailList = this.stockTransferReceiptUpdateDto.responseStockTransferNotificationDetailList;
    //this.stockTransferReceiptUpdateDto['stockTransferNotificationDetailList'] = this.stoc
    delete this.stockTransferReceiptUpdateDto.responseStockTransferNotificationDetailList;
    this.stockTransferReceiptUpdateDto.orderId = this.stockTransferReceiptUpdateDto.saleOrderId;

    this.loaderService.showLoader();
    console.log('@beforeSave', this.stockTransferReceiptUpdateDto);
   // return;
    this.stockTransferReceiptService.save(this.stockTransferReceiptUpdateDto)
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

