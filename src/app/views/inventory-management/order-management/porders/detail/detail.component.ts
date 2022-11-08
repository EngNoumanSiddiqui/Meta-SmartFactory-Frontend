import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ResponsePorderDetailDto } from 'app/dto/porder/porder.model';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'porder-detail',
  templateUrl: './detail.component.html',
})
export class DetailPorderComponent implements OnInit {
  id;
  notificationTree: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  porder: ResponsePorderDetailDto;
  purchaseOrder: any;
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
  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _porderSvc: PorderService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.initialize(this.id);
      }
    });
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._porderSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.purchaseOrder = result;
        this.purchaseOrder.porderId = id as number;
        if (this.purchaseOrder.purchaseOrderDetailList) {
          const treeData = JSON.parse(JSON.stringify(this.purchaseOrder.purchaseOrderDetailList));
          const notifications = [];
          treeData.forEach(itm => {
            if (itm.stockTransferNotificationDetailList) {
              itm.stockTransferNotificationDetailList.forEach(stitem => {
                notifications.push({...stitem});
              });
            }
          });
          this.notificationTree = notifications;
        }
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }

  showSupplierDetailDialog(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, id);
  }

  showDetailDialog(id, type:string){
    
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }
}
