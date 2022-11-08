import { Component, OnInit, Input } from '@angular/core';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'pord-item-details',
  templateUrl: 'item-details.component.html'
})

export class POrderItemDetailsComponent implements OnInit {
  id;
  notificationTree: any[];

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.porderItemDetails = null;
      this.initialize(this.id);
    }
  };
  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'quantity', header: 'qt'},
    { field: 'baseUnit', header: 'base-unit'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'goodsMovementStatus', header: 'status'},
  ];

  porderItemDetails: any;
  constructor(private _porderSvc: PorderService,
   
    private utilities: UtilitiesService,
     private loaderService: LoaderService) { }


    headerDetails;

  ngOnInit() {


  }
  
  private initialize(id) {
    this.loaderService.showLoader();
    this._porderSvc.getDetailItem(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.porderItemDetails = result;
        
       this._porderSvc.getDetail(this.porderItemDetails.purchaseOrderId).then(itm =>
         {
         this.headerDetails = itm;
       }).catch(error => {
        this.utilities.showErrorToast(error)
      });

        
        
        if (this.porderItemDetails.stockTransferNotificationDetailList) {
          this.notificationTree = JSON.parse(JSON.stringify(this.porderItemDetails.stockTransferNotificationDetailList));
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
      
  
  }

  OpenDetailPROrder() {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, +this.porderItemDetails.purchaseOrderId);
  }

  showDetailDialog(id, type:string){
    
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }
}
