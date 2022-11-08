export class RequestReservationCreateDto {
  movementType: string;
  reservationId: number;
  finalIssue: string;
  material: number;
  plantId: any;
  wareHouse: any;
  height = 0;
  width = 0;
  dimensionUnit: string;
  batch: string;
  quantity: number;
  baseUnit: any;
  baseUnitOfStock?: any;
  prodOrder: any;
  jobOrder: any;
  saleOrder: any;
  orderDetail: any;
  status: null;
  materialId: null;
  materialName: null;
}

export class ResponseReservationDetailDto {
  reservationId: number;
  plantId: number;
  plantName: string;
  movementType: string;
  barcode?: string;
  locationNo?: string;
  prodOrderId: number;
  itemNo: number;
  height = 0;
  width = 0;
  dimensionUnit: string;
  saleOrderId: number;
  orderDetailId: number;
  materialId: number;
  materialName: string;
  materialNo?: string;
  enteredUnitQuantity: number;
  enteredUnitMeasure: string;
  warehouseId: number;
  fromWarehouseId?: number;
  warehouseName: string;
  batch: string;
  finalIssue: string;
  requirementDate: Date;
  requirementQuantity: number;
  withdrawnQuantity: number;
  baseUnitMeasure: string;
  status: string;
  isActive: boolean;
}
