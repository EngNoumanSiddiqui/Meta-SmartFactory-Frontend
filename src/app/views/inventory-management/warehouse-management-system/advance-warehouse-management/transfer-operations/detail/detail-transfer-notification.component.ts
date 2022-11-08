import { Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { StockTransferNotificationService } from 'app/services/dto-services/stock-transfer-notification/stock-transfer-notification.service';
import { StockTransferNotificationDetailDto } from 'app/dto/stock/stock-transfer-notification.model';
import { ConfirmationService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'transfer-notification-detail',
  templateUrl: './detail-transfer-notification.component.html',
  styles: [
    `
    body .ui-inplace{
      min-height: 0 !important;
    }
   
    body .ui-table-wrapper{
      margin-right: 0px;
    }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class DetailStockTransferNotificationComponent implements OnInit {

  id;

  showSaveAndConfirmBtn = false;
  
  selectedItemIndex;

  modal = {active: false};

  stockTransferReceipt: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set d(data){
    if(data){
      this.stockTransferReceipt = data;
      console.log('@stockTransferReceipt', data)

      this.stockTransferReceipt.responseStockTransferNotificationDetailList.forEach(itm => {
        if (itm.dimensionUnit === '0') {
          itm.dimensionUnit = null;
        }
      });
      this.setStockTransferReceipt();
    }
  }

  @Output() notificationQuantityChanged = new EventEmitter<any>();

  @Output() saveAction = new EventEmitter<any>();

  palletSelectedColumns = [
    { field: 'palletId', header: 'pallet-id' },
    { field: 'goodQuantity', header: 'good-quantity' },
    { field: 'scrapQuantity', header: 'scrap-quantity' },
    { field: 'reworkQuantity', header: 'rework-quantity' },
    // { field: 'cycleQuantity', header: 'cycle-quantity'},
    { field: 'unit', header: 'unit' },
    { field: 'palletStatus', header: 'pallet-status' }
  ];

  palletList: any;

  constructor(
    private _router: Router,
    private _transferSvc: StockTransferNotificationService,
    private _stockTransferReceiptSvc: StockTransferReceiptService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService) {
    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._transferSvc.getStockTransferReceiptNotificationDetail(this.id)
      .then((result: StockTransferNotificationDetailDto) => {
        this.loaderService.hideLoader();
        this.stockTransferReceipt = result;
        this.stockTransferReceipt.responseStockTransferNotificationDetailList.forEach(itm => {
          if (itm.dimensionUnit === '0') {
            itm.dimensionUnit = null;
          }
        });
        this.setStockTransferReceipt();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  onSelectWarehouseLocation(event) {
    if(event) {
      this.stockTransferReceipt.responseStockTransferNotificationDetailList[this.selectedItemIndex].locationNo = event?.warehouseLocationNo;
    }
  }

  setStockTransferReceipt(){
    if (this.stockTransferReceipt.responseStockTransferNotificationDetailList) {
      const treeData = JSON.parse(JSON.stringify(this.stockTransferReceipt.responseStockTransferNotificationDetailList));
      const pallet = [];
      treeData.forEach(itm => {
        if (itm.pallet) {
          // itm.stockTransferNotificationDetail.forEach(stitem => {
          pallet.push({ ...itm.pallet });
          // });
        }
      });
      this.palletList = pallet;
    }

    if (!this.stockTransferReceipt.documentDate) {
      this.showSaveAndConfirmBtn = true;
    } else {
      this.stockTransferReceipt.documentDate = new Date(this.stockTransferReceipt.documentDate);
    }
    if (!this.stockTransferReceipt.postingDate) {
      this.showSaveAndConfirmBtn = true;
    } else {
      this.stockTransferReceipt.postingDate = new Date(this.stockTransferReceipt.postingDate);
    }
  }

  ngOnInit() { }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/stocks/transfers/new']);
    } else {
      this._router.navigate(['/stocks/transfers/edit/' + id]);
    }
  }

  showPalletDetail(palletId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PALLETRECORD, palletId);
  }

  saveAndConfirmStockTransfer() {
    this.loaderService.showLoader();
    if (this.showSaveAndConfirmBtn && this.stockTransferReceipt.postingDate) {
      this.stockTransferReceipt.postingDate = this.stockTransferReceipt.documentDate;
    }
    const stockTransferReceipt = {
      stockTransferReceiptId: null,
      goodsMovementActivityType: this.stockTransferReceipt.goodsMovementActivityType,
      goodMovementDocumentType: this.stockTransferReceipt.goodMovementDocumentType,
      purchaseOrderId: this.stockTransferReceipt.purchaseOrderId,
      purchaseOrderDetailId: this.stockTransferReceipt.purchaseOrderDetailId, // not present
      prodOrderId: this.stockTransferReceipt.prodOrderId,
      jobOrderId: this.stockTransferReceipt.jobOrderId, // not present
      orderId: this.stockTransferReceipt.saleOrderId,
      orderDetailId: this.stockTransferReceipt.orderDetailId, // not present
      documentNo: this.stockTransferReceipt.documentNo,
      documentDate: this.stockTransferReceipt.documentDate,
      postingDate: this.stockTransferReceipt.postingDate,
      actId: this.stockTransferReceipt.actId,
      goodsMovementStatus: this.stockTransferReceipt.goodsMovementStatus,
      description: this.stockTransferReceipt.description,
      requestCreateStockTransferDetailList: this.stockTransferReceipt.responseStockTransferNotificationDetailList ?
        this.stockTransferReceipt.responseStockTransferNotificationDetailList.map(itm => (
          {
            'baseUnit': itm.baseUnit,
            'batch': itm.batch,
            'batchFrom': itm.batchFrom,
            'defected': itm.defect,
            'goodsMovementStatus': itm.goodsMovementStatus,
            'itemNo': itm.itemNo,
            'height': itm.height,
            'width': itm.width,
            'dimensionUnit': itm.dimensionUnit,
            'jobOrderPosition': itm.jobOrderPosition,
            'palletRequest': itm.palletRequest,
            'plantId': itm.plantId,
            'quantity': parseInt(itm.quantity),
            'stockId': itm.materialId,
            'stockTransferDetailId': null,
            'stockTransferNotificationDetailId': itm.stockTransferNotificationDetailId,
            'stockTransferReceiptId': null,
            'wareHouseFromId': itm.wareHouseFromId,
            'wareHouseToId': itm.wareHouseToId
          }
        ))
        : null
    };

    // console.log('@stockTransferReceipt', stockTransferReceipt);return;
    this._stockTransferReceiptSvc.save(stockTransferReceipt).then(() => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
      setTimeout(() => {
        this.saveAction.emit('yes');
      }, 300);
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  cancelTransferNotification(id: number, key = 'lisNotification') {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-trash',
      key: key,
      accept: () => {
        this._transferSvc.cancel(id).then(() => {
          this.utilities.showSuccessToast('cancel-success');
          this.initialize(this.id);
        }
        ).catch(err => {
          this.utilities.showErrorToast(err);
        })
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  onQuantityChange(quantity){
    this.notificationQuantityChanged.emit(this.stockTransferReceipt);
  }

  onBatchCodeChanged(batch, index){
    if(batch){
      this.stockTransferReceipt.responseStockTransferNotificationDetailList[index].batch =  batch.batchCode;
      this.notificationQuantityChanged.emit(this.stockTransferReceipt);
    }
  }

  showDetailDialog(type, id){
    if(type === 'PROD_ORDER') this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, id);
    else if(type === 'SALE_ORDER') this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, id);
    else if(type === 'JOB_ORDER') this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, id);
    else if(type === 'PLANT') this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
    else if(type === 'STOCK') this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, id);
    else if(type === 'BATCH') this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, id);
    else if(type === 'WAREHOUSE') this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, id);
    else if(type === 'PURCHASE_ORDER') this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, id);
    else if(type === 'PURCHASEORDERITEM') this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, id);
    
  }

}
