/**
 * Created by reis on 31.07.2019.
 */
import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { MaintenanceOrderService } from 'app/services/dto-services/maintenance-equipment/maintenance-order.service';

@Component({
  selector: 'maintenance-order-detail',
  templateUrl: './detail.component.html'
})
export class MaintenanceOrderDetailComponent implements OnInit {

  showLoader = false;
  reservationList = [];
  notificationList = [];
  modalType = DialogTypeEnum;
  reservationSelectedColumns = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    { field: 'status', header: 'status' },
    // { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    // { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestReservationStatus', header: 'stock-reservation-status' },
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },

    // { field: 'movementType', header: 'movement-type' }
  ];
  reservationCols = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    { field: 'status', header: 'status' },
    { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementDate', header: 'requirement-date' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestStockReservationStatus', header: 'stock-reservation-status' },
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },

    { field: 'withdrawnQuantity', header: 'quantity-withdrawn' },
    { field: 'enteredUnitQuantity', header: 'quantity-in-entered-unit' },
    { field: 'enteredUnitMeasure', header: 'entered-unit-of-measure' },
    { field: 'prodOrderId', header: 'production-order' },
    { field: 'saleOrderId', header: 'sales-order' },
    { field: 'orderDetailId', header: 'sales-order-item' },
    { field: 'movementType', header: 'movement-type' },
  ];
  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'quantity', header: 'quantity'},
    { field: 'baseUnit', header: 'unit'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'goodsMovementStatus', header: 'status'},
  ];
  notificationColumns = [
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'materialId', header: 'material-id'},
    { field: 'materialName', header: 'material-name'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'plantId', header: 'plant-id'},
    { field: 'plantName', header: 'plant-name'},
    { field: 'wareHouseToId', header: 'warehouse-to-id'},
    { field: 'employee', header: 'employee'},
    { field: 'pemployeeName', header: 'pemployee-name'},
    { field: 'wareHouseToName', header: 'warehouse-to-name'},
    { field: 'wareHouseFromId', header: 'warehouse-from-id'},
    { field: 'wareHouseFromName', header: 'warehouse-from-name'},
    { field: 'batch', header: 'batch'},
    { field: 'batchFrom', header: 'batch-from'},
    { field: 'palletRequest', header: 'pallet-request'},
    { field: 'baseUnit', header: 'base-unit'},
    { field: 'quantity', header: 'quantity'},
    { field: 'defected', header: 'defected'},
    { field: 'itemNo', header: 'item-no'},
    { field: 'documentDate', header: 'document-date'},
    { field: 'postingDate', header: 'posting-date'},
    { field: 'documentNo', header: 'document-no'},
    { field: 'actId', header: 'act-id'},
    { field: 'actName', header: 'act-name'},
    { field: 'goodsMovementStatus', header: 'goods-movement-status'},
    { field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    { field: 'description', header: 'description'},
    { field: 'goodsMovementActivityType', header: 'goods-movement-activity-type'},
    { field: 'responseStockTransferNotificationDetailList', header: 'response-stock-transfer-notification-detail-list'},
    { field: 'saleOrderId', header: 'sale-order-id'},
    { field: 'prodOrderId', header: 'prod-order-id'},
    { field: 'purchaseOrderId', header: 'purchase-order-id'},
    { field: 'saleOrderNo', header: 'sale-order-no'},
    { field: 'purchaseOrderNo', header: 'purchase-order-no'},
    { field: 'prodOrderNo', header: 'prod-order-no'},
    { field: 'createDate', header: 'create-date'},
    { field: 'pallet', header: 'pallet'},
  ];

  data: any;

  @Input('data') set setId(data: any) {
    if(data && typeof(data) === 'object') {
      this.data = data;
    } else{
      this.initialize(data);
    }
  }

  constructor(private utilities: UtilitiesService,
    private mStrategyService: MaintenanceOrderService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.data = result;
        // this.assigntoMainObject(result);

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }


  OnComponentData(data) {
    if (data) {
      this.reservationList = data.reservationList;
      this.notificationList = data.notificationList;
    }
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showCustomerDetail(customerId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }
  showBatchDetail(batch) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batch);
  }

  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }
  showWorkstationDetail(workStationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStationId);
  }

  showDetailModal(uniqueId, modalType) {
    this.loaderService.showDetailDialog(modalType, uniqueId);
  }
  showPurchaseOrderDetailItem(purchaseOrderItemId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, +purchaseOrderItemId);
  }

}
