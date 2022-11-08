export class RequestStockTransferReceiptCreateDto {

  stockTransferReceiptId: number = null;
  goodsMovementActivityType: any = null;
  goodMovementDocumentType: any = null;
  purchaseOrderId: any = null;
  purchaseOrderDetailId: any = null;
  prodOrderId: any = null;
  jobOrderId: any = null;
  orderId: any = null;
  orderDetailId: any = null;
  documentNo: string = null;
  documentDate: any = null;
  postingDate: any = null;

  actId: number = 0;
  goodsMovementStatus: any = null;
  description: string = null;

  requestCreateStockTransferDetailList: RequestCreateStockTransferDetailListItemDto[] = [];
}

export class RequestCreateStockTransferDetailListItemDto {
  itemNo: number = null;
  stockTransferDetailId: number = null;
  stockTransferReceiptId: number = null;
  stockId: number = null;
  stockName: string = null;
  stockNo: string = null;
  plantId: number = null;
  height = 0;
  width = 0;
  dimensionUnit: string = null;
  plantName: string = null;
  defected: boolean = null;
  batchFrom: string = null;
  batch: string = null;
  wareHouseFromId: number = null;
  wareHouseFromName: string = null;
  wareHouseToId: number = null;
  wareHouseToName: string = null;
  quantity: number = 0;
  baseUnit: string = null;
  baseUnitOfQuantity?: string = null;
  goodsMovementStatus: any = null;
}

export enum GoodsMovementActivityTypeEnum {
  GOODS_RECEIPT = 'GOODS_RECEIPT',
  GOODS_ISSUE = 'GOODS_ISSUE',
  TRANSFER_POSTING = 'TRANSFER_POSTING'
}

export enum GoodsMovementDocumentTypeEnum {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  MAINTENANCE_ORDER='MAINTENANCE_ORDER',
  OUTSOURCE_ISSUE = 'OUTSOURCE_ISSUE',
  TRUCK_TRANSFER = 'TRUCK_TRANSFER',
  QUALITY_INSPECTION_LOT='QUALITY_INSPECTION_LOT',
  WORKSTATION='WORKSTATION',
  PRODUCTION_ORDER = 'PRODUCTION_ORDER',
  SALES_ORDER = 'SALES_ORDER',
  ON_SITE = 'ON_SITE'
}


export class ResponseStockTransferDto {
  stockTransferReceiptId: number = 0;
  goodsMovementActivityType: any = null;
  goodMovementDocumentType: any = null;
  goodsMovementStatus: any = null;
  purchaseOrderId: any = null;
  prodOrderId: any = null;
  saleOrderId: any = null;
  documentNo: string = null;
  documentDate: any = null;
  postingDate: any = null;

  actId: number = 0;
  actName: string = null;
  description: string = null;

  responseStockTransferDetailList: ResponseStockTransferDetailDto[] = [];
}

export class ResponseStockTransferDetailDto {
  itemNo: number = 0;
  stockTransferDetailId: number = 0;
  stockTransferReceiptId: number = 0;
  materialId: number = null;
  materialName: string = null;
  plantId: number = null;
  plantName: string = null;
  defected: boolean = null;
  batch: string = null;
  batchFrom: string = null;
  wareHouseFromId: number = null;
  wareHouseFromName: string = null;
  wareHouseToId: number = null;
  wareHouseToName: string = null;
  quantity: number = 0;
  baseUnit: string = null;
  goodsMovementStatus: any = null;
  createDate: any = null;
}

export class ResponseStockReportListDto {
  plantId: number;
  plantName: string;
  warehouseId: number;
  warehouseName: string;
  materialId: number;
  materialName: string;
  materialType: string;
  batch: string;
  batchFrom:string;
  quantity: number;
  baseUnit: string;
  unRestricted: number;
  blocked: number;
  reservation: number;
  incoming: number;
  outgoing: number;

  // backend response
  // private Integer materialId;
  // private String materialName;
  // private Integer plantId;
  // private String plantName;
  // private Integer warehouseId;
  // private String warehouseName;
  // private String batch;
  // private String baseUnit;
  // private Boolean unRestricted;
  // private Double blocked;
  // private Double rezervation;
  // private Double incomming;
  // private Double outgoing;
}




