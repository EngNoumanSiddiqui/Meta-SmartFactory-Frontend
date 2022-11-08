import {Component, Input, OnInit} from '@angular/core';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';

@Component({
  selector: 'batch-detail',
  templateUrl: './detail.component.html',
  styleUrls:['./detail.component.scss']
})
export class DetailBatchComponent implements OnInit {

  code;

  @Input('code') set z(code) {
    this.code = code;
    if (code) {
      this.initialize(this.code);
    }
  };

  batch;
  prodOrderDetail: any = [];
  goodMovementsDetail: any = [];
  purchaseOrderDetail: any = [];
  purchaseOrderDetailList: any = [];
  orderDetail: any = [];
  reservationDetail: any = [];
  batchMappings: any = [];
  stockReportDetail: any = [];
  purchaseOrder: any;
  modal2 = { active: false, mode: null, id: null };
  batchMappingsColumns = [
    {field: 'batchMappingId', header: 'batch-mapping-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'stockTypeName', header: 'stock-type'},
    {field: 'baseBatch', header: 'base-batch'},
    {field: 'activeBatch', header: 'active-batch'},
    {field: 'eventType', header: 'event-type'},
    {field: 'quantity', header: 'quantity'},
    {field: 'unit', header: 'unit'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'requestedBy', header: 'requested-by'},
  ];

  reservationColumns = [
    {field: 'reservationId', header: 'reservation-id'},
    {field: 'batch', header: 'batch'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    // {field: 'plantName', header: 'plant-name'},
    {field: 'warehouseName', header: 'warehouse-name'},
    {field: 'requirementQuantity', header: 'requirement-quantity'},
    {field: 'withdrawnQuantity', header: 'quantity-withdrawn'},
    {field: 'enteredUnitMeasure', header: 'base-unit'},
    {field: 'movementType', header: 'movement-type'},
    // {field: 'warehouseName', header: 'store-location'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'status', header: 'status'}
  ];
 goodMovementsColumns = [
    {field: 'stockTransferDetailId', header: 'good_movement_detail_id'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    // {field: 'plantName', header: 'plant-name'},
    {field: 'batchFrom', header: 'batch-from'},
    {field: 'batch', header: 'batch-to'},
    {field: 'quantity', header: 'quantity'},
    {field: 'baseUnit', header: 'base-unit'},
    {field: 'goodsMovementActivityType', header: 'activity-type'},
    {field: 'goodMovementDocumentType', header: 'good-movement-document-type'},
    
    {field: 'itemNo', header: 'item-no'}
  ];
  saleOrderColumns = [
    {field: 'orderId', header: 'sale-order-detail-id'},
    {field: 'stockNo', header: 'material-no'},
    {field: 'stockName', header: 'material-name'},
    {field: 'batch', header: 'batch'},
    {field: 'warehouse', header: 'warehouse-name'},
    {field: 'quantity', header: 'quantity'},
    {field: 'unit', header: 'unit'},
    {field: 'customer', header: 'customer'},
    {field: 'orderDetailStatus', header: 'status'}
  ];
  prodOrderColumns = [
    {field: 'prodOrderId', header: 'id'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    {field: 'batch', header: 'batch'},
    {field: 'warehouseName', header: 'warehouse-name'},
    {field: 'quantity', header: 'quantity'},
    {field: 'prodOrderType', header: 'prod-order-type'},
    {field: 'prodOrderStatus', header: 'status'}
  ];
  porderOrderColumns = [
    {field: 'purchaseOrderDetailId', header: 'purchase-order-detail-id'},
    {field: 'stockNo', header: 'material-no'},
    {field: 'stockName', header: 'material-name'},
    {field: 'wareHouseName', header: 'warehouse-name'},
    {field: 'batch', header: 'batch'},
    {field: 'quantity', header: 'quantity'},
    {field: 'totalIncomeQuantity', header: 'total-income-quantity'},
    {field: 'orderUnit', header: 'unit'},
    {field: 'purchaseOrderStatus', header: 'status'},
    {field: 'porderDate', header: 'order-date'},
    {field: 'supplierName', header: 'supplier-name'},
    {field: 'description', header: 'description'}
  ];
  stockReportColumns = [
    {field: 'wareHouseStockId', header: 'id'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material-name'},
    {field: 'warehouseName', header: 'warehouse'},
    {field: 'batch', header: 'batch'},
    {field: 'quantity', header: 'quantity'},
    {field: 'reservation', header: 'reservation'},
    {field: 'incoming', header: 'incoming'},
    {field: 'outgoing', header: 'outgoing'},
    {field: 'unRestricted', header: 'unrestricted'},
    {field: 'baseUnit', header: 'base-unit'},
  ];

  constructor(private _batchSrvc: BatchService,
              private utilities: UtilitiesService,
              private _stockReceiptSvc: StockTransferReceiptService,
              private loaderService: LoaderService) {
  }

  private initialize(code: string) {
    this.getDetailWithBatchCode(code);
  }

  ngOnInit() {
  }

  getDetailWithBatchCode(code) {
    this.loaderService.showLoader();
    this._batchSrvc.getDetailWithBatchCode(code)
      .then(result => {
        this.loaderService.hideLoader();
        this.batch = result;
        this.prodOrderDetail = result['prodOrderDetail'];
        this.goodMovementsDetail = result['goodMovementsDetail'];
        this.purchaseOrderDetail = result['purchaseOrderDetail'];
        this.purchaseOrderDetailList = [];
        this.purchaseOrderDetail.forEach(item => {
          item.purchaseOrderDetailList.forEach(listItem => {
            listItem.supplierName = item.supplierName;
            listItem.supplierId = item.supplierId;
            const purchaseOrderDetailListItem = Object.assign({}, listItem) ;
            this.purchaseOrderDetailList.push(purchaseOrderDetailListItem);
          });
        });

        this.orderDetail = result['orderDetail'];
        this.reservationDetail = result['reservationDetail'];
        this.stockReportDetail = result['stockReportDetail'];
        this.batchMappings = result['batchMappings'];
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  showReferenceIdDetails(data) {
    if (data.eventType === 'PRODUCTION_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, data.referenceId);
    } else if (data.eventType === 'TRANSFER_RECIPT') {
      this.loaderService.showDetailDialog(DialogTypeEnum.GOODTRANSFER, data.referenceId);
    } else if (data.eventType === 'PURCHASE_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, data.referenceId);
    } else if (data.eventType === 'JOB_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, data.referenceId);
    } else if (data.eventType === 'SALES_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, data.referenceId);
    } else if (data.eventType === 'MAINTENANCE_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCEORDER, data.referenceId);
    } else if (data.eventType === 'INSPECTION_ORDER') {
      // this.loaderService.showDetailDialog(DialogTypeEnum., data.referenceId);
    } 
  }

  openPurchaseOrderDetails(purchaseOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, purchaseOrderId);
  }
  openSaleOrderDetails(saleOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, saleOrderId);
  }
  openStockDetails(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }
  openPlantDetails(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
  openEmployeeDetails(employeeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, employeeId);
  }
  openWarehouseDetails(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }
  openGoodTransferDetails(stockDetailid) {
    this.loaderService.showLoader();
    this._stockReceiptSvc.filterDetailsObservable({pageNumber: 1,
      pageSize: 9999, stockTransferDetailId: stockDetailid}).toPromise().then(res => {
        this.loaderService.hideLoader();
        if (res['content'] && res['content'].length > 0) {
          const stockdetail = res['content'].find(itm => itm.stockTransferDetailId === stockDetailid);
          if (stockdetail) {
            this.loaderService.showDetailDialog(DialogTypeEnum.GOODTRANSFER, stockdetail.stockTransferReceiptId);
          }
        }
    })
    
  }
  openProdOrderDetails(prodId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodId);
  }
  openItemNoDetails(item) {
    if (item.movementType === 'RESERVATION_FOR_SALE_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, item.saleOrderId);
    } else if (item.movementType === 'RESERVATION_FOR_PRODUCTION_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, item.prodOrderId);
    } else if (item.movementType === 'RESERVATION_FOR_JOB_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, item.itemNo);
    } else if (item.goodMovementDocumentType === 'PURCHASE_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, item.purchaseOrderId);
    }
  }

  openBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }
  openSupplierDetails(supplierId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, supplierId);
  }
}
