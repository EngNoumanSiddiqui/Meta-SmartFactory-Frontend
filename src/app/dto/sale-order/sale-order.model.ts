export class RequestOrderCreateDto {
  orderNo: string;
  orderTypeId: any;
  actTypeId?:any;
  orderDate: any;
  parity?: string;
  orderId?: number = null;
  customerOrderNo: any;
  account?:any;
  referenceId: string;
  actName?:any;
  orderQuotationId?: number;
  deliveryDate: any;
  actTypeName: string = null;
  description: string;
  documentNo: string;
  plantId?: number;
  orderStatus: any;
  checkStock: boolean = true;
  orderDetailList: RequestOrderDetailCreateDto[] = [];
  actId: number;
  originalTotalSalesPrice: number;
  totalSalesPrice : number;
  totalDiscountPrice: number;
  totalVatPrice: number;
  totalNetPrice: number;

}
export class purchaseOrderRequestModel {
  description: string;
  porderDate: any;
  porderNo?: any;
  costCenterId: number;
  parity: string;
  //porderNo:string;
  referenceId: string;
  vendorTypeId?: number;
  totalDeliveryCost: number;
  totalEffectivePrice: number;
  totalNetPrice: number;
  purchaseOrderStatus: string;
  purchaseQuotationId?: number;
  purchaseOrderType: string;
  supplier: any;
  supplierName?: any;
  purchaseOrderDetailList: purchaseOrderDetailList[] = [];
}
export class purchaseOrderDetailList {
  baseUnit: string;
  batch: string;
  description: string;
  height = 0;
  width = 0;
  dimensionUnit: string;
  plantId: number;
  parentPurchaseOrderId?: number;
  outsource?: any;
  fixedPrice: boolean;
  referenceId: string;
  //purchaseOrderDetailId:number;
  purchaseOrderStatus: any;
  purchaseOrderDetailId?: any;
  quantity: any;
  purchaseOrderItemCosting: PurchaseOrderItemCosting = new PurchaseOrderItemCosting();
  stockId: any;
  totalIncomeQuantity: any;
  wareHouseId: any;
  plantName: any;
  stockName: any;
  stockName2: any;
  stockNo: any;
  warehouseName: any;
  orderUnit: any;
  deliveryDate: any;
  deliveryStartDate: any;
  priority:string = null;
}

export class PurchaseOrderItemCosting {
  createDate: any = null;
  currency: any = null;
  customsDutiesCost: any = null;
  customsTaxCost: any = null;
  deliveryCost: any  = 0;
  discountPrice: any = null;
  discountPercentage?: any = null;
  effectivePrice: any = null;
  freightCost: any = null;
  grossPrice: any = null;
  incoTerms: any = null;
  totalCost: any = null;
  insuranceCost: any = null;
  netPrice: any = null;
  packingCost: any = null;
  porderItemCostingId: any = null;
  purchaseGroupCode: any = null;
  purchaseOrderDetailId: any = null;
  purchaseOrderId: any = null;
  purchaseOrderItemCostingDetailList: any = null;
  quantity: any = null;
  shippingCost: any = null;
  stockId: any = null;
  taxCost: any = null;
  updateDate: any = null;
  vendorId: any = null;
}


export interface ResponseOrderFilterListDto {
  orderId: number;
  orderNo: string;
  orderTypeId: number;
  orderTypeName: string;
  orderDate: Date;
  actName: string;
  actNo: string;
  deliveryDate: Date;
  description: string;
  documentNo: string;
  orderStatus: OrderStatusEnum;
  orderDetailDtoList: OrderDetailDto[];
  currentJobOrderOperationId: null;
  currentJobOrderOperationName: null;
  currentJobOrderOperationOrderNo: null;
}


export interface ResponseOrderUpdateDto {
  orderId: number;
  orderTypeId: number;
  orderTypeName: string;
  actTypeName: string;
  actTypeId?: string;
  account?: any;
  orderNo: string;
  checkStock: any;
  description: string;
  actId: number;
  actName: string;
  orderStatus: OrderStatusEnum;
  deliveryDate: Date;
  documentNo: string;
  orderDate: Date;
  orderDetailDtoList: OrderDetailDto[];
}

export interface ResponseOrderListDto {

  orderNo: string;

  orderId: string;
  referenceId: string;
  orderTypeId: number;
  orderQuotation?: any;

  orderTypeName: string;

  description: string;
  customerOrderNo: any;

  checkStock: any;
  documentNo: string;

  orderDate: Date;

  deliveryDate: Date;


  orderStatus: OrderStatusEnum;

  actName: string;
  actId: number;

  orderDetailDtoList: OrderDetailDto[];
}


export class OrderDetailDto {
  orderId: number
  orderDetailId: number
  stockId: number;
  stockNo: string;
  stockName: string;
  height = 0;
  costPrice: number;
  discount: number;
  salePrice: number;
  width = 0;
  dimensionUnit: string;
  directProduction = false;
  prepareProduction = false;
  description: string;
  quantity: number;
  unit: string;
  plannedQuantity: number;
  deliveredQuantity: number;
  orderDetailStatus: string;
  deliveryDate: Date;
  batch: string;
  plantId: number;
  warehouseId: number;
  plantName: any;
  warehouseName: any;
  order: any;
  priority?:any;
}

export class RequestOrderDetailCreateDto {
  stockId: number = null;
  unit: string;
  orderStatus: any;
  plannedQuantity: 0;
  height = 0;
  discountPrice :number = 0;
  orderDetailId?: number;
  netPrice: number = 0;
  deliveryCost: number = 0;
  currency: number;
 	vatRate: number = 0;
  vatPrice : number = 0;
 	shipmentDate?: Date = null;
 	confirmedDate?: Date;
  width = 0;
  costCenterId: null;
  costCenterName: null;
  dimensionUnit: string;
  description: string;
  prodOrderList: any;
  directProduction = false;
  prepareProduction = true;
  stockManagement = true;
  costPrice: number;
  referenceId: number;
  discount: number = 0;
  originalSalesPrice: number;
  salePrice: number;
  unitNetPrice: number = 0;
  quantity: number;
  deliveryDate: any;
  orderDetailStatus: any;
  plantId: any;
  batch: any;
  warehouseId: any;
  plantName: any;
  stockNo: any = null;
  stockName: any = null;
  stockName2: string = null;
  stockName3?:string;
  warehouseName: any;
  priority:string = 'MEDIUM';

}


//porder
export class PurchaseOrderDetailDto {
  description: string;
  porderDate: any;
  porderNo: string;
  purchaseOrderDetailList: purchaseOrderDetailListDto[] = [];
  purchaseOrderStatus: PurchaseStatusEnum.REQUESTED;
  purchaseOrderType: PurchaseStatusEnum.STANDARD_PURCHASE_ORDER;
  supplier: 0;
  wareHouseId: any;
  plantId;
  stockId;
  stockNo;
  plantName: any;
  fixedPrice= null;
  stockName: any;
  warehouseName: any;
  priority:string = null;

}

export class purchaseOrderDetailListDto {
  baseUnit: string;
  batch: string;
  plantId: any;
  purchaseOrderDetailId: number;
  purchaseOrderStatus: string;
  quantity: number;
  stockId: number;
  totalIncomeQuantity: number;
  wareHouseId: number;
}

//porder
export enum PurchaseStatusEnum {
  ACTIVE = 'ACTIVE', DELETED = 'DELETED', PLANNED = 'PLANNED', COMPLETED = 'COMPLETED',
  PARTIAL_DELIVERED = 'PARTIAL_DELIVERED', DELIVERED = 'DELIVERED', REQUESTED = 'REQUESTED',
  STANDARD_PURCHASE_ORDER = 'STANDARD_PURCHASE_ORDER'
}


export enum OrderStatusEnum {
  ACTIVE = 'ACTIVE', DELETED = 'DELETED', PLANNED = 'PLANNED', COMPLETED = 'COMPLETED',
  PARTIAL_DELIVERED = 'PARTIAL_DELIVERED', DELIVERED = 'DELIVERED',
  REQUESTED = "REQUESTED",
  WAITING = "WAITING",
  READY_FOR_PLANNING = "READY_FOR_PLANNING",
  IN_PROCESS = "IN_PROCESS",
  PARTIAL_COMPLETED = "PARTIAL_COMPLETED",
  CANCELED = "CANCELED",
  CONFIRMED = "CONFIRMED"
}


export enum OrderDetailStatusEnum {
  ACTIVE = 'ACTIVE', PARTIAL_PLANNED = 'PARTIAL_PLANNED', PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED', PARTIAL_DELIVERED = 'PARTIAL_DELIVERED', DELIVERED = 'DELIVERED'
}
