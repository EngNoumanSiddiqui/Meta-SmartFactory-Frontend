import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'transfer-receipts-detail',
  templateUrl: './detail.component.html'
})
export class DetailStockTransferReceiptComponent implements OnInit {

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  stockTransferReceipt;
  palletSelectedColumns = [
    { field: 'palletId', header: 'pallet-id'},
    { field: 'goodQuantity', header: 'good-quantity'},
    { field: 'scrapQuantity', header: 'scrap-quantity'},
    { field: 'reworkQuantity', header: 'rework-quantity'},
    { field: 'cycleQuantity', header: 'cycle-quantity'},
    { field: 'unit', header: 'unit'},
    { field: 'palletStatus', header: 'pallet-status'}
  ];
  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'quantity', header: 'qt'},
    { field: 'baseUnit', header: 'unit'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'goodsMovementStatus', header: 'status'},
  ];
  palletList: any;
  StockTransferNotificationDetailList: any;
  selectedItemIndex;
  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _transferSvc: StockTransferReceiptService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    /*this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.initialize(this.id);
     });*/
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this._transferSvc.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        this.stockTransferReceipt = result;
        if (this.stockTransferReceipt.responseStockTransferDetailList) {
          const treeData = JSON.parse(JSON.stringify(this.stockTransferReceipt.responseStockTransferDetailList));
          const notifications = [];
          const pallet = [];
          treeData.forEach(itm => {
            if (itm.stockTransferNotificationDetail) {
              // itm.stockTransferNotificationDetail.forEach(stitem => {
                notifications.push({...itm.stockTransferNotificationDetail});
                if (itm.stockTransferNotificationDetail.pallet) {
                  pallet.push({...itm.stockTransferNotificationDetail.pallet});
                }
              // });
            }
          });
          this.StockTransferNotificationDetailList = notifications;
          this.palletList = pallet;
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  goPage(id) {
    if (id === -1) {
      this._router.navigate(['/stocks/transfers/new']);
    } else {
      this._router.navigate(['/stocks/transfers/edit/' + id]);
    }
  }

}
