export class CreatePurchaseQuotationDto {
    createDate: string;
    description: string;
    purchaseQuotationDetailList: CreatePurchaseQuotationDetailDto[];
    purchaseQuotationId: number;
    purchaseQuotationStatus: string;
    requiredDate: string;
    updateDate: string;
    vendorId: number;
  }
  
 export class CreatePurchaseQuotationDetailDto {
    baseUnit: string;
    batch: string;
    createDate: string;
    currency: string;
    deliveryCost: number;
    deliveryDate: any;
    discountPrice: number;
    discountPercentage: number;
    grossPrice: number;
    effectivePrice: number;
    netPrice: number;
    orderUnit: string;
    plantId: number;
    plantName: string;
    purchaseQuotationDetailId: number;
    purchaseQuotationDetailStatus: string;
    purchaseQuotationId: number;
    quotedQuantity: number;
    requestedQuantity: number;
    stockId: number;
    stockName: string;
    stockName2: string;
    stockNo: string;
    unitPrice: number;
    updateDate: string;
    validUntil: any;

    constructor() {
      this.baseUnit = null;
      this.batch = null;
      this.createDate = null;
      this.currency = null;
      this.deliveryCost = null;
      this.deliveryDate = null;
      this.effectivePrice = null;
      this.netPrice = null;
      this.orderUnit = null;
      this.plantId = null;
      this.purchaseQuotationDetailId = null;
      this.purchaseQuotationDetailStatus = null;
      this.purchaseQuotationId = null;
      this.quotedQuantity = null;
      this.requestedQuantity = null;
      this.stockId = null;
      this.stockName = null;
      this.stockNo = null;
      this.unitPrice = null;
      this.updateDate = null;
      this.validUntil = null;
    }
  }
