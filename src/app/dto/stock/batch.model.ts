/**
 * Created by reis on 11.06.2019.
 */
export class BatchRequestDto {
  availableFrom: any;
  batchCode: string;
  batchId: number;
  countryCode: string;
  createDate: any;
  lastGoodsReceipt: any;
  manufactureDate: any;
  note: string;
  plantId: number;
  sledBbdDate: any;
  stockId: number;
  vendor: string;
  vendorBatch: string;
}
export class BatchResponseDto {
  availableFrom: any;
  batchCode: any;
  batchId: number;
  createDate: any;
    lastGoodsReceipt: any;
  manufactureDate: any;
  note: string;
  orderDetail: {
    orderId: number,
    quantity: number,
    stockId: number,
    unit: string
  };
  plantId: number;
  plantName: string;
  sledBbdDate: any;
  stockId: number;
  stockName: string;
  vendor: string;
  vendorBatch: string
}
