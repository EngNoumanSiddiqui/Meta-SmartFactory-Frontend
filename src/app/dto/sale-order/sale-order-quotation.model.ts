export class CreateOrderQuotationDetailList {
    active: boolean;
    baseUnit: string;
    costPrice: number;
    createDate: Date;
    deliveryDate: any;
    dimensionUnit: string;
    stockNo: string;
    stockName: string;
    stockName2: string;
    stockName3?: string;
    description: string;
    discount: number = 0;
    discountPrice: number = 0;
    currency: any;
    height: number;
    orderDetailQuotationStatus: string;
    orderQuotationId: number;
    plantId: number;
    plantName: string;
    priority: string;
    quantity: number;
    quotationDetailId: number;
    quotationDetailNo: string;
    salePrice: number;
    stockId: number;
    updateDate: Date;
    vat: number = 0;
    vatPrice: number = 0;
    width: number;
  costCenterId: null;
  unitNetPrice: number = 0;
  netPrice: number = 0;
  deliveryCost: number = 0;
}

export class CreateSalesQuotations {
    actId: number;
    active: boolean;
    actTypeName: string = null;
    actTypeId?: number;
    parity: any;
    createDate: Date;
    note: string;
    customerOrderNo: any;
    costCenterId: number;
    deliveryDate?: Date;
    description: string;
    orderId: number;
    orderQuotationDetailList: CreateOrderQuotationDetailList[] = [];
    orderQuotationStatus: string;
    quotationDate: Date;
    validFrom: Date = new Date();
    validTo: Date;
    rejectReason: string;
    quotationId: number;
    quotationNo: string;
    updateDate: Date;
    totalSalesPrice;
    totalVatPrice: number;
    totalDiscountPrice: number;
    totalNetPrice: number;
}

export interface Act {
    actId: number;
    actName: string;
    actType: any;
    priority: string;
}

export interface Order {
    description: string;
    orderId: number;
    orderNo: string;
}

export interface OrderQuotationDetailList {
    active: boolean;
    baseUnit: string;
    costPrice: number;
    createDate: Date;
    deliveryDate: Date;
    dimensionUnit: string;
    discount: number;
    height: number;
    orderDetailQuotationStatus: string;
    orderQuotationId: number;
    plantId: number;
    priority: string;
    quantity: number;
    quotationDetailId: number;
    quotationDetailNo: string;
    salePrice: number;
    stockId: number;
    updateDate: Date;
    width: number;
  costCenter: null;
  unitNetPrice: number;
  netPrice: number;
  deliveryCost: number;
}

export interface ResponseOrderQuotationDto {
    act: Act;
    actId: number;
    active: boolean;
    createDate: Date;
    description: string;
    parity: string;
    order: Order;
    orderId: number;
    orderQuotationDetailList: OrderQuotationDetailList[];
    orderQuotationStatus: string;
    quotationDate: Date;
    validFrom: Date;
    validTo: Date;
    rejectReason: string;
    quotationId: number;
    quotationNo: string;
    updateDate: Date;
}


export interface OrderQuotation {
    actId: number;
    active: boolean;
    createDate: Date;
    description: string;
    orderId: number;
    orderQuotationStatus: string;
    quotationDate: Date;
    quotationId: number;
    quotationNo: string;
    updateDate: Date;
}

export interface Company {
    address: string;
    cityId: number;
    cityName: string;
    companyAddress: string;
    companyCode: string;
    companyId: number;
    companyName: string;
    countryId: number;
    countryName: string;
    plantList: any[];
    postcode: string;
}

export interface PurchaseQuotationDetailList {
    baseUnit: string;
    batch: string;
    createDate: Date;
    currency: string;
    deliveryCost: number;
    deliveryDate: Date;
    effectivePrice: number;
    netPrice: number;
    orderUnit: string;
    purchaseQuotationDetailId: number;
    purchaseQuotationDetailStatus: string;
    quotedQuantity: number;
    requestedQuantity: number;
    unitPrice: number;
    updateDate: Date;
    validUntil: Date;
}

export interface Plant {
    address: string;
    cityId: number;
    cityName: string;
    company: Company;
    companyAddress: string;
    companyId: number;
    countryId: number;
    countryName: string;
    createdDate: Date;
    plantCode: string;
    plantId: number;
    plantName: string;
    postcode: string;
    purchaseQuotationDetailList: PurchaseQuotationDetailList[];
}

export interface Stock {
    hasTree: boolean;
    isBatchActive: boolean;
    quantity: number;
    stockId: number;
    stockName: string;
    stockNo: string;
    stockTypeName: string;
}

export interface SalesQuotationItemDetails {
    active: boolean;
    baseUnit: string;
    costPrice: number;
    createDate: Date;
    deliveryDate: Date;
    dimensionUnit: string;
    discount: number;
    height: number;
    orderDetailQuotationStatus: string;
    orderQuotation: OrderQuotation;
    orderQuotationId: number;
    plant: Plant;
    plantId: number;
    priority: string;
    quantity: number;
    quotationDetailId: number;
    quotationDetailNo: string;
    salePrice: number;
    stock: Stock;
    stockId: number;
    updateDate: Date;
    width: number;
  costCenter: null;
  unitNetPrice: number;
  netPrice: number;
  deliveryCost: number;
}
