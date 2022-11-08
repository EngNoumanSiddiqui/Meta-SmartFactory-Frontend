//Stock Transfer Notification Details List DTO
//stocktransferreceiptnotification/filterstocktransferreceiptnotification/items
export interface FilterStockTransferNotificationItemDto {
  actId: number,
  baseUnit: string,
  batch: string,
  defected: boolean,
  description: string,
  palletId?: number,
  barcode?: string,
  documentDate: string,
  documentNo: string,
  dispatchingStatusEnum: string;
  employeeId: number,
  employeeName: string,
  dispacher: number,
  dispacherName: string,
  endDate: string | Date,
  goodMovementDocumentType: string,
  goodsMovementActivityType: string,
  goodsMovementStatus: string,
  groupCodeId: number,
  itemNo: number,
  materialId: number,
  materialName: string,
  materialNo: string,
  orderByDirection: string,
  orderByProperty: string,
  orderDetailId: number,
  orderId: number,
  pageNumber: number,
  pageSize: number,
  plantId: number,
  plantName: string,
  postingDate: number,
  prodOrderId: number,
  purchaseOrderId: number,
  quantity: string,
  query: string,
  startDate: string,
  stockId: number,
  stockTransferDetailId: number,
  stockTransferReceipNotificationtId: number,
  wareHouseFromId: number,
  wareHouseFromName: string,
  wareHouseToId: number,
  wareHouseToName: string
}

export interface StockTranferNotifcaticationItemResponse {
  content: [
    {
      actId: number,
      actName: string,
      baseUnit: string,
      batch: string,
      batchFrom: string,
      createDate: string,
      defected: true,
      description: string,
      documentDate: string,
      documentNo: string,
      employee: number,
      goodMovementDocumentType: string,
      goodsMovementActivityType: string,
      goodsMovementStatus: string,
      itemNo: number,
      materialId: number,
      materialName: string,
      materialNo: string,
      pemployeeName: string,
      plantId: number,
      plantName: string,
      postingDate: string,
      prodOrderId: number,
      prodOrderNo: string,
      purchaseOrderId: number,
      purchaseOrderNo: string,
      quantity: number,
      responseStockTransferNotificationDetailList: [],
      saleOrderId: number,
      saleOrderNo: string,
      stockTransferNotificationDetailId: number,
      stockTransferReceiptNotificationId: number,
      wareHouseFromId: number,
      wareHouseFromName: string,
      wareHouseToId: number,
      wareHouseToName: string
    }
  ],
  currentPage: 0,
  totalElements: 0,
  totalPages: 0
}

//Save Request Stock Transfer Notification  
//stocktransferreceiptnotification/save
export class StockTransferReceiptNotificationRequestDto {

  description: string = null;
  documentDate: string = null;
  documentNo: string = null;
  goodMovementDocumentType: string = null;
  goodsMovementActivityType: string = null;
  goodsMovementStatus: string = null;
  groupCodeId: number = null;
  orderId: number = null;
  postingDate: string | Date;
  prodOrderId: number = null;
  purchaseOrderId: number = null;
  requestCreateStockTransferNotificationDetailList: RequestCreateStockTransferNotificationDetailListItemDto[] = [];
  stockTransferReceipNotificationtId: number = null;
  purchaseOrderDetailId: number;

}

export class RequestCreateStockTransferNotificationDetailListItemDto {

  baseUnit: string = null;
  baseUnitOfQuantity?: string = null;
  batch: string = null;
  batchFrom: string = null;
  defected = false;
  goodsMovementStatus: string = null;
  itemNo: number = null;
  referenceId?= null;
  jobOrderPosition: string = null;
  plantId: number = null;
  plantName: string = null;
  quantity: number = null;
  barcode= null;
  locationNo= null;
  stockId: number = null;
  stockName: string = null;
  height = 0;
  width = 0;
  dimensionUnit: string = null;
  stockNo: string = null;
  wareHouseFromId: number = null;
  wareHouseFromName: string = null;
  wareHouseToId: number = null;
  wareHouseToName: string = null;

}

export interface StockTransferNotificationDetailDto {
  actId: number,
  actName: string,
  createDate: string,
  description: string,
  documentDate: string,
  documentNo: string,
  goodMovementDocumentType: string,
  goodsMovementActivityType: string,
  goodsMovementStatus: string,
  groupCode: string,
  groupCodeId: number,
  postingDate: string,
  prodOrderId: number,
  prodOrderNo: string,
  purchaseOrderId: number,
  purchaseOrderNo: string,
  responseStockTransferNotificationDetailList: ResponseStockTransferNotificationDetailListDto[]
  saleOrderId: number,
  saleOrderNo: string,
  stockTransferReceiptNotificationId: number
}

export class ResponseStockTransferNotificationDetailListDto {
  actId: number;
  actName: string;
  baseUnit: string;
  batch: string;
  batchFrom: string;
  createDate: string;
  defected: true;
  description: string;
  documentDate: string;
  documentNo: string;
  employee: number;
  goodMovementDocumentType: string;
  goodsMovementActivityType: string;
  goodsMovementStatus: string;
  itemNo: number;
  materialId: number;
  materialName: string;
  materialNo: string;
  pemployeeName: string;
  plantId: number;
  plantName: string;
  postingDate: string;
  prodOrderId: number;
  prodOrderNo: string;
  purchaseOrderId: number;
  purchaseOrderNo: string;
  quantity: number;
  responseStockTransferNotificationDetailList: [];
  saleOrderId: number;
  saleOrderNo: string;
  stockTransferNotificationDetailId: number;
  stockTransferReceiptNotificationId: number;
  wareHouseFromId: number;
  wareHouseFromName: string;
  wareHouseToId: number;
  wareHouseToName: string
}