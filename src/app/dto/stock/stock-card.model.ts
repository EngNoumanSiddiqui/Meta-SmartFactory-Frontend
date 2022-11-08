export interface ResponseWareHouseStockFilterListDto {
  stockId: number;
  warehouseId: number;

  stockNo: string;
  stockName: string;
  wareHouseName: string;
  quantity: number;

  unit: string;
}

export class StockStockResponseDto {
  baseUnit: string;
  batchActive: boolean;
  description: string;
  dimensionUnit: string;
  grossWeight: null;
  height: null;
  industryId: number;
  industryName: string;
  isBatchActive: true;
  length: null;
  minSchReadyReservationPercentage: number;
  netWeight: null;
  outSource: false;
  plantId: number;
  plantName: string;
  productTreeId: number;
  stockGroupId: number;
  stockGroupName: string;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockPurchasing: {};
  stockStatus: string;
  stockTypeId: number;
  stockTypeName: string;
  stockUnitMeasureList: [];
  thickness: null;
  volume: null;
  volumeUnit: string;
  warehouseList: [];
  weightUnit: string;

}
export class WeightUnit {
  unit: string;
  dimension: string;
  unitDescription: string;
}
export class StockPurchasing {
  batchManagement: boolean;
  orderUnit: string;
  plantId: number;
  plantName: string;
  stockId: number;
  stockName: string;
  stockPurchasingId: number;
  wareHouseId?: number;
  wareHouseName?: string;
  baseUnit: string;
  supplierLeadTimeDay: number;
  maxOrderSizePerWeek: number;

}

export class StockSales {
  wareHouseId: number;
  wareHouseName: string;
  stockId: number;
  stockName: string;
  stockSalesId: number;
}

export interface 	RequestCreateStockPurchasingDto {
  baseUnit: string,
  batchManagement: true,
  orderUnit: string,
  plantId: number,
  plantName: string,
  purchaseInfoRecordList: PurchaseInfoRecorListDto[],
  stockId: number,
  stockName: string,
  stockPurchasingCode: string,
  stockPurchasingId: number,
  wareHouseId?: number,
  wareHouseName?: string,
  baseUnitMeasure?: string,
  supplierLeadTimeDay: number,
  maxOrderSizePerWeek: number,
  minSchReadyReservationPercentage: number
  
}

export interface PurchaseConditionDetailDtoList {
  amountValue: number,
  percentageValue: number,
  purchaseConditionTypeCode: string
}

export interface PurchaseInfoRecorListDto {
  description: string,
  orderUnit: string,
  plantId: number,
  purchaseConditionRecord: {
    currencyCode: string,
    description: string,
    effectivePrice: number,
    incoTerm: string,
    netPrice: number,
    plantId: number,
    purchaseConditionDetailDtoList: PurchaseConditionDetailDtoList[],
    purchaseConditionRecordCode: string,
    purchaseConditionRecordId: number,
    purchaseInfoRecordId: number,
    stockId: number,
    stockPurchasingId: number,
    unitFreightCost: number,
    unitInsuranceCost: number,
    unitPackingCost: number,
    unitShippingCost: number,
    unitTaxCost: number,
    validFrom: string,
    validTo: string
  },
  purchaseControl: {
    employeeGenericGroupId: number,
    maximumQuantity: number,
    minimumQuantity: number,
    plannedDeliveryTime: string,
    plantId: number,
    purchaseControlCode: string,
    purchaseControlId: number,
    purchaseInfoRecordId: number,
    standardQuantity: number,
    stockId: number
  },
  purchaseInfoRecordCode: string,
  purchaseInfoRecordId: number,
  purchaseInfoRecordStatus: string,
  stockId: number,
  stockPurchasingId: number,
  vendorId: number,
  vendorName: string
}



export interface CreateStockCostingDto {
  baseUnit: string,
  currencyCode: string,
  costCenterId: number,
  orderUnit: string,
  plantId: number,
  procurementType: string,
  stockCostEstimate: {
    costEstimateCode: string,
    costEstimateId: number,
    currentPrice: number,
    currentPricePeriod: string | Date,
    movingPrice: number,
    movingPriceSelection: boolean,
    plannedPrice: number,
    plannedPricePeriod: string | Date,
    previousPrice: number,
    previousPricePeriod: string,
    standardPrice: number,
    stockCostingId: number,
    stockId: number
  },
  stockCostingCode: string,
  stockCostingId: number,
  stockId: number,
  stockValuation: {
    movingPriceSelection: boolean,
    stockCostingId: number,
    stockId: number,
    stockTotalValue: number,
    stockValuationCode: string,
    stockValuationId: number,
    validFrom: string | Date
  }
}
