export interface ResponsePorderDetailDto {
  porderId: number;
  porderNo: string;
  porderDate: Date;
  stockId: number;
  stockName: string;
  porderStatus: string;
  quantity: number;
  requestedById: number;
  requestedByName: string;
  supplierId: number;
  supplierName: string;
  description: string;
}

export class RequestPurchaseOrderDetailCreateDto {
  description: string;
  porderDate: any;
  porderNo: string;
  orderDetailList: purchaseOrderDetailListDto[] = [];
  purchaseOrderStatus: PurchaseStatusEnum.REQUESTED;
  purchaseOrderType: PurchaseStatusEnum.STANDARD_PURCHASE_ORDER;
  supplier: 0;
  supplierId: 0;
  constructor() {
    // tslint:disable-next-line: no-use-before-declare
    this.orderDetailList = [new purchaseOrderDetailListDto()];
  }

}
export class purchaseOrderDetailListDto {
  baseUnit: string;
  batch: string;
  plantId: 0;
  purchaseOrderDetailId: 0;
  purchaseOrderStatus: 'REQUESTED';
  quantity: 0;
  stockId: 0;
  totalIncomeQuantity: 0;
  wareHouseId: any;
}

export enum PurchaseStatusEnum {
  ACTIVE = 'ACTIVE', DELETED = 'DELETED', PLANNED = 'PLANNED', COMPLETED = 'COMPLETED',
  PARTIAL_DELIVERED = 'PARTIAL_DELIVERED', DELIVERED = 'DELIVERED', REQUESTED = 'REQUESTED',
  STANDARD_PURCHASE_ORDER= 'STANDARD_PURCHASE_ORDER',
}

export enum OrderStatusEnum {
  ACTIVE = 'ACTIVE', DELETED = 'DELETED', PLANNED = 'PLANNED', COMPLETED = 'COMPLETED',
  PARTIAL_DELIVERED = 'PARTIAL_DELIVERED', DELIVERED = 'DELIVERED'

}


export interface Item {
  baseUnit: string;
  batch: string;
  beginHeight: number;
  beginWidth: number;
  blocked: number;
  dimensionUnit: string;
  endHeight: number;
  endWidth: number;
  height: number;
  incoming: number;
  materialId: number;
  materialName: string;
  materialNo: string;
  materialType: string;
  orderByDirection: string;
  orderByProperty: string;
  outgoing: number;
  pageNumber: number;
  pageSize: number;
  plantId: number;
  plantName: string;
  quantity: number;
  query: string;
  reservation: number;
  unRestricted: number;
  waitingNotificationTransferFrom: number;
  waitingNotificationTransferTo: number;
  wareHouseStockId: number;
  warehouseId: number;
  warehouseName: string;
  width: number;
}

export interface Item2 {
  baseUnit: string;
  batch: string;
  beginHeight: number;
  beginWidth: number;
  blocked: number;
  dimensionUnit: string;
  endHeight: number;
  endWidth: number;
  height: number;
  incoming: number;
  materialId: number;
  materialName: string;
  materialNo: string;
  materialType: string;
  orderByDirection: string;
  orderByProperty: string;
  outgoing: number;
  pageNumber: number;
  pageSize: number;
  plantId: number;
  plantName: string;
  quantity: number;
  query: string;
  reservation: number;
  unRestricted: number;
  waitingNotificationTransferFrom: number;
  waitingNotificationTransferTo: number;
  wareHouseStockId: number;
  warehouseId: number;
  warehouseName: string;
  width: number;
}

export interface JobOrderEquipmentList {
  count: number;
  stockId: number;
  stockName: string;
  jobOrderEquipmentId: number;
  jobOrderId: number;
}

export interface JobOrder {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface ComponentList {
  active: boolean;
  batch: string;
  createDate: Date;
  dimensionUnit: string;
  direction: number;
  height: number;
  neededToBuyQuantity: number;
  quantity: number;
  quantityUnit: string;
  stockId: number;
  stockWareHouseId: number;
  updateDate: Date;
  wareHouseId: number;
  width: number;
}

export interface JobOrder2 {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface RequestJobOrderComponentFeatureList {
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  jobOrderStockId: number;
  productTreeCriteriaId: number;
}

export interface ProductTreeDetailComponentFeatureList {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  productTreeDetailComponentFeatureId: number;
  updateDate: Date;
}

export interface ProductTreeCriteria {
  code: string;
  createDate: Date;
  description: string;
  productTreeCriteriaId: number;
  productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList[];
  updateDate: Date;
}

export interface ResponseComponentFeature {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  productTreeCriteria: ProductTreeCriteria;
  updateDate: Date;
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

export interface JobOrderStockAuxList {
  componentList: ComponentList[];
  currentQuantity: number;
  currentStockQuantity: number;
  currentStockReservedQuantity: number;
  defectName: string;
  defectQuantity: number;
  dimensionUnit: string;
  direction: number;
  height: number;
  jobOrder: JobOrder2;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderOperationName: string;
  jobOrderStockId: number;
  neededQuantity: number;
  neededToBuyQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  quantity: number;
  requestJobOrderComponentFeatureList: RequestJobOrderComponentFeatureList[];
  responseComponentFeature: ResponseComponentFeature[];
  reworkQuantity: number;
  setupDefectQuantity: number;
  stock: Stock;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: number;
  totalDefectQuantity: number;
  totalReworkQuantity: number;
  totalSetupQuantity: number;
  unit: string;
  useStock: boolean;
  wareHouseStockId: number;
  width: number;
}

export interface ComponentList2 {
  active: boolean;
  batch: string;
  createDate: Date;
  dimensionUnit: string;
  direction: number;
  height: number;
  neededToBuyQuantity: number;
  quantity: number;
  quantityUnit: string;
  stockId: number;
  stockWareHouseId: number;
  updateDate: Date;
  wareHouseId: number;
  width: number;
}

export interface JobOrder3 {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface RequestJobOrderComponentFeatureList2 {
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  jobOrderStockId: number;
  productTreeCriteriaId: number;
}

export interface ProductTreeDetailComponentFeatureList2 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  productTreeDetailComponentFeatureId: number;
  updateDate: Date;
}

export interface ProductTreeCriteria2 {
  code: string;
  createDate: Date;
  description: string;
  productTreeCriteriaId: number;
  productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList2[];
  updateDate: Date;
}

export interface ResponseComponentFeature2 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  productTreeCriteria: ProductTreeCriteria2;
  updateDate: Date;
}

export interface Stock2 {
  hasTree: boolean;
  isBatchActive: boolean;
  quantity: number;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeName: string;
}

export interface JobOrderStockProduceList {
  componentList: ComponentList2[];
  currentQuantity: number;
  currentStockQuantity: number;
  currentStockReservedQuantity: number;
  defectName: string;
  defectQuantity: number;
  dimensionUnit: string;
  direction: number;
  height: number;
  jobOrder: JobOrder3;
  outerDiameter?:any;
  innerDiameter?:any;
  length?:any;
  density?:any;
  materialCost?:any;
  materialCostRate?:any;
  weight?:any;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderOperationName: string;
  jobOrderStockId: number;
  neededQuantity: number;
  neededToBuyQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  quantity: number;
  requestJobOrderComponentFeatureList: RequestJobOrderComponentFeatureList2[];
  responseComponentFeature: ResponseComponentFeature2[];
  reworkQuantity: number;
  setupDefectQuantity: number;
  stock: any;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: number;
  totalDefectQuantity: number;
  totalReworkQuantity: number;
  totalSetupQuantity: number;
  unit: string;
  useStock: boolean;
  wareHouseStockId: number;
  width: number;
}

export interface ComponentList3 {
  active: boolean;
  batch: string;
  createDate: Date;
  dimensionUnit: string;
  direction: number;
  height: number;
  neededToBuyQuantity: number;
  quantity: number;
  quantityUnit: string;
  stockId: number;
  stockWareHouseId: number;
  updateDate: Date;
  wareHouseId: number;
  width: number;
}

export interface JobOrder4 {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface RequestJobOrderComponentFeatureList3 {
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  jobOrderStockId: number;
  productTreeCriteriaId: number;
}

export interface ProductTreeDetailComponentFeatureList3 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  productTreeDetailComponentFeatureId: number;
  updateDate: Date;
}

export interface ProductTreeCriteria3 {
  code: string;
  createDate: Date;
  description: string;
  productTreeCriteriaId: number;
  productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList3[];
  updateDate: Date;
}

export interface ResponseComponentFeature3 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  productTreeCriteria: ProductTreeCriteria3;
  updateDate: Date;
}

export interface Stock3 {
  hasTree: boolean;
  isBatchActive: boolean;
  quantity: number;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeName: string;
}

export interface JobOrderStockUseList {
  componentList: ComponentList3[];
  currentQuantity: number;
  currentStockQuantity: number;
  currentStockReservedQuantity: number;
  defectName: string;
  defectQuantity: number;
  raw?: boolean;
  dimensionUnit: string;
  materialCost: number;
  materialCostRate: number;
  description?: string;
  scrapCost: number;
scrapCostRate: number;
innerDiameter: number;
outerDiameter:number;
density?:number;
weight: number;
length: number;
quantityUnit: string;
weightUnit: string;
  direction: number;
  height: number;
  jobOrder: JobOrder4;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderOperationName: string;
  jobOrderStockId: number;
  neededQuantity: number;
  plannedCycleQuantity: number;
  processControlFrequency: number;
  neededToBuyQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  quantity: number;
  requestJobOrderComponentFeatureList: RequestJobOrderComponentFeatureList3[];
  responseComponentFeature: ResponseComponentFeature3[];
  reworkQuantity: number;
  setupDefectQuantity: number;
  stock: any;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: number;
  totalDefectQuantity: number;
  totalReworkQuantity: number;
  totalSetupQuantity: number;
  unit: string;
  useStock: boolean;
  wareHouseStockId: number;
  width: number;
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

export interface OperationType {
  createDate: Date;
  operationTypeDescription: string;
  operationTypeId: number;
  operationTypeName: string;
  operations: any[];
  plant: Plant;
  plantId: number;
}

export interface PurchaseQuotationDetailList2 {
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

export interface Plant2 {
  address: string;
  cityId: number;
  cityName: string;
  companyAddress: string;
  companyId: number;
  countryId: number;
  countryName: string;
  createdDate: Date;
  plantCode: string;
  plantId: number;
  plantName: string;
  postcode: string;
  purchaseQuotationDetailList: PurchaseQuotationDetailList2[];
}

export interface Operation {
  description: string;
  operationId: number;
  operationName: string;
  operationNo: string;
  operationType: OperationType;
  outsource: boolean;
  unit?: string;
  plant: Plant2;
}

export interface WorkStation {
  capacity?: number;
  cycleOfcoe?: number;
  cyclePeriod?: number;
  cycleWriteData?: number;
  description?: string;
  kwh?: number;
  kwhCost?: number;
  mark?: string;
  maxBufferQuantity?: number;
  maxInputSpace?: number;
  maxRunningDuration?: number;
  maxSetupDuration?: number;
  maxStandbyDuration?: number;
  maxStopDuration?: number;
  minCapacity?: number;
  model?: string;
  numberOfScissors?: number;
  panelActive?: boolean;
  panelIP?: string;
  panelUpdateDate?: Date;
  parentId?: number;
  producer?: string;
  productDate?: Date;
  purchaseDate?: Date;
  serialNo?: string;
  viewIndex?: number;
  workStationId: number;
  workStationName: string;
  workStationNo?: string;
  workStationState?: string;
  workStationStatus?: string;
  workStationTypeName?: string;
  writeInCcycle?: boolean;
}

export interface WorkstationProgramList {
  description: string;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderWorkstationProgramId: number;
  operationOrder: number;
  productTreeDetailOperationId: number;
  workstationProgramDescription: string;
  workstationProgramId: number;
}

export interface JobOrderOperation {
  actualFinishTime: Date;
  actualStartTime: Date;
  currentQuantity: number;
  defaultStockId: number;
  orderNo?: any;
  defaultStockName: string;
  direction: number;
  expectedSetupDuration: number;
  individualCapacity: number;
  jobOrder: JobOrder;
  referenceId?: string,
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderStockAuxList: JobOrderStockAuxList[];
  jobOrderStockProduceList: JobOrderStockProduceList[];
  jobOrderStockUseList: JobOrderStockUseList[];
  maxSingleStandbyDuration: number;
  operation: Operation;
  operationId: number;
  operationName: string;
  laborCost: number;
  laborCostRate: number;
  variableCost: number;
  variableCostRate: number;
  totalCost: number;
  fixedCost: number;
  fixedWorkstation?: boolean;
  fixedEmployeeGroup?: boolean;
  operationOrder: number;
  operationRepeat: number;
  operationStatus: string;
  parent: boolean;
  plannedCycleQuantity: number;
  processControlFrequency: number;
  prodOrderId: number;
  quantity: number;
  singleDuration: number;
  singleSetupDuration: number;
  singleTotalDuration: number;

  workStation: WorkStation;
  workStationId: number;
  workStationName: string;
  workstationProgramList: WorkstationProgramList[];
}

export interface ComponentList4 {
  active: boolean;
  batch: string;
  createDate: Date;
  dimensionUnit: string;
  direction: number;
  height: number;
  neededToBuyQuantity: number;
  quantity: number;
  quantityUnit: string;
  stockId: number;
  stockWareHouseId: number;
  updateDate: Date;
  wareHouseId: number;
  width: number;
}

export interface JobOrder5 {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface RequestJobOrderComponentFeatureList4 {
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  jobOrderStockId: number;
  productTreeCriteriaId: number;
}

export interface ProductTreeDetailComponentFeatureList4 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  productTreeDetailComponentFeatureId: number;
  updateDate: Date;
}

export interface ProductTreeCriteria4 {
  code: string;
  createDate: Date;
  description: string;
  productTreeCriteriaId: number;
  productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList4[];
  updateDate: Date;
}

export interface ResponseComponentFeature4 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  productTreeCriteria: ProductTreeCriteria4;
  updateDate: Date;
}

export interface Stock4 {
  hasTree: boolean;
  isBatchActive: boolean;
  quantity: number;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeName: string;
}

export interface JobOrderStockAuxList2 {
  componentList: ComponentList4[];
  currentQuantity: number;
  currentStockQuantity: number;
  currentStockReservedQuantity: number;
  defectName: string;
  defectQuantity: number;
  dimensionUnit: string;
  direction: number;
  height: number;
  jobOrder: JobOrder5;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderOperationName: string;
  jobOrderStockId: number;
  neededQuantity: number;
  neededToBuyQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  quantity: number;
  requestJobOrderComponentFeatureList: RequestJobOrderComponentFeatureList4[];
  responseComponentFeature: ResponseComponentFeature4[];
  reworkQuantity: number;
  setupDefectQuantity: number;
  stock: Stock4;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: number;
  totalDefectQuantity: number;
  totalReworkQuantity: number;
  totalSetupQuantity: number;
  unit: string;
  useStock: boolean;
  wareHouseStockId: number;
  width: number;
}

export interface ComponentList5 {
  active: boolean;
  batch: string;
  createDate: Date;
  dimensionUnit: string;
  direction: number;
  height: number;
  neededToBuyQuantity: number;
  quantity: number;
  quantityUnit: string;
  stockId: number;
  stockWareHouseId: number;
  updateDate: Date;
  wareHouseId: number;
  width: number;
}

export interface JobOrder6 {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface RequestJobOrderComponentFeatureList5 {
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  jobOrderStockId: number;
  productTreeCriteriaId: number;
}

export interface ProductTreeDetailComponentFeatureList5 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  productTreeDetailComponentFeatureId: number;
  updateDate: Date;
}

export interface ProductTreeCriteria5 {
  code: string;
  createDate: Date;
  description: string;
  productTreeCriteriaId: number;
  productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList5[];
  updateDate: Date;
}

export interface ResponseComponentFeature5 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  productTreeCriteria: ProductTreeCriteria5;
  updateDate: Date;
}

export interface Stock5 {
  hasTree: boolean;
  isBatchActive: boolean;
  quantity: number;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeName: string;
}

export interface JobOrderStockProduceList2 {
  componentList: ComponentList5[];
  currentQuantity: number;
  currentStockQuantity: number;
  currentStockReservedQuantity: number;
  defectName: string;
  defectQuantity: number;
  dimensionUnit: string;
  direction: number;
  height: number;
  jobOrder: JobOrder6;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderOperationName: string;
  jobOrderStockId: number;
  neededQuantity: number;
  neededToBuyQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  quantity: number;
  requestJobOrderComponentFeatureList: RequestJobOrderComponentFeatureList5[];
  responseComponentFeature: ResponseComponentFeature5[];
  reworkQuantity: number;
  setupDefectQuantity: number;
  stock: Stock5;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: number;
  totalDefectQuantity: number;
  totalReworkQuantity: number;
  totalSetupQuantity: number;
  unit: string;
  useStock: boolean;
  wareHouseStockId: number;
  width: number;
}

export interface ComponentList6 {
  active: boolean;
  batch: string;
  createDate: Date;
  dimensionUnit: string;
  direction: number;
  height: number;
  neededToBuyQuantity: number;
  quantity: number;
  quantityUnit: string;
  stockId: number;
  stockWareHouseId: number;
  updateDate: Date;
  wareHouseId: number;
  width: number;
}

export interface JobOrder7 {
  actualFinish: Date;
  actualSetupDuration: number;
  actualStart: Date;
  batch: string;
  coefficient: number;
  combinedParentId: number;
  createDate: Date;
  currentQuantity: number;
  description: string;
  dividedParentId: number;
  expectedSetupDuration: number;
  finishDate: Date;
  formattedTotalDuration: string;
  individualCapacity: number;
  jobOrderCreateDate: Date;
  jobOrderId: number;
  jobOrderStatus: string;
  maxSingleStandbyDuration: number;
  operationDuration: string;
  operationRepeat: number;
  parentId: number;
  plannedDuration: string;
  plannedQuantity: number;
  position: string;
  processControlFrequency: number;
  producedQuantity: number;
  quantity: number;
  receiptNo: string;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  updateDate: Date;
}

export interface RequestJobOrderComponentFeatureList6 {
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  jobOrderStockId: number;
  productTreeCriteriaId: number;
}

export interface ProductTreeDetailComponentFeatureList6 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  productTreeDetailComponentFeatureId: number;
  updateDate: Date;
}

export interface ProductTreeCriteria6 {
  code: string;
  createDate: Date;
  description: string;
  productTreeCriteriaId: number;
  productTreeDetailComponentFeatureList: ProductTreeDetailComponentFeatureList6[];
  updateDate: Date;
}

export interface ResponseComponentFeature6 {
  createDate: Date;
  criteriaMaxValue: number;
  criteriaMinValue: number;
  criteriaUnit: string;
  jobOrderComponentFeatureId: number;
  productTreeCriteria: ProductTreeCriteria6;
  updateDate: Date;
}

export interface Stock6 {
  hasTree: boolean;
  isBatchActive: boolean;
  quantity: number;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeName: string;
}

export interface JobOrderStockUseList2 {
  componentList: ComponentList6[];
  currentQuantity: number;
  currentStockQuantity: number;
  currentStockReservedQuantity: number;
  defectName: string;
  defectQuantity: number;
  dimensionUnit: string;
  direction: number;
  height: number;
  jobOrder: JobOrder7;
  jobOrderId: number;
  jobOrderOperationId: number;
  jobOrderOperationName: string;
  jobOrderStockId: number;
  neededQuantity: number;
  neededToBuyQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  quantity: number;
  requestJobOrderComponentFeatureList: RequestJobOrderComponentFeatureList6[];
  responseComponentFeature: ResponseComponentFeature6[];
  reworkQuantity: number;
  setupDefectQuantity: number;
  stock: Stock6;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: number;
  totalDefectQuantity: number;
  totalReworkQuantity: number;
  totalSetupQuantity: number;
  unit: string;
  useStock: boolean;
  wareHouseStockId: number;
  width: number;
}

export interface JobOrderList {
  batch: string;
  customerJobOrderStatus: string;
  description: string;
  endDate: Date;
  expectedQuantity: number;
  expectedSetupDuration: number;
  individualCapacity: number;
  item: Item2;
  jobOrderEquipmentList: JobOrderEquipmentList[];
  jobOrderId: number;
  jobOrderOperations: JobOrderOperation[];
  jobOrderStatus: string;
  jobOrderStockAuxList: JobOrderStockAuxList2[];
  jobOrderStockProduceList: JobOrderStockProduceList2[];
  jobOrderStockUseList: JobOrderStockUseList2[];
  maxSingleStandbyDuration: number;
  operationRepeat: number;
  orderDetailId: number;
  orderIndex: string;
  orderNo:any;
  orderFNo?: any;
  parentId: number;
  plannedCycleQuantity: number;
  plannedHeight: number;
  plannedWidth: number;
  position: string;
  processControlFrequency: number;
  prodOrderId: number;
  productTreeDetailId: number;
  productTreeId: number;
  productionType: string;
  receiptNo: string;
  reverse: boolean;
  singleDuration: number;
  singleSetupDuration: number;
  singleStandbyDuration: number;
  startDate: Date;
  totalDuration: number;
  wareHouseStockId: number;
  workstationId: number;
  workstationName: string;
}

export interface ProdOrderMaterialList {
  combineProdOrderStatus: string;
  combineProdOrderType: string;
  combinejobOrderId: number;
  createDate: Date;
  materialId: number;
  materialNo: string;
  newlyAdded?: any;
  materialName: string;
  outputRate: number;
  prodOrderId: number;
  prodOrderMaterialId: number;
  neededQuantity: number;
  producedQuantity: number;
  quantity: number;
  quantiyUnit: string;
  updateDate: Date;
}

export class CreateNewProdObject {
  actualFinish: Date;
  actualStart: Date;
  actualCost: number;
  costCenterId?: number;
  baseUnit: string;
  innerDiameter?: number;
  weight?: number;
  outerDiameter?: number;
  length?: number;
  autoFillMaterials?: boolean;
  density?:number;
  batch: string;
  createDate: Date;
  description: string;
  orderDetail?: any;
  saleOrder?: any;
  extraProducedQuantityPercentage: number;
  finishDate: Date;
  grQuantity: number;
  item: Item;
  jobOrderList: JobOrderList[] = [];
  materialId: number;
  materialNo?: string;
  materialName:  string;
  orderDetailId: number;
  orderUnit: string;
  unitFinalCost?: number;
  plannedQuantity: number;
  plantId: number;
  locationNo?: string;
  plantName: string;
  priority: string;
  prodOrderId: number;
  projectId?: any;
  milestoneId?: any;
  prodOrderMaterialList: ProdOrderMaterialList[] = [];
  prodOrderStatus: string;
  prodOrderType: string;
  estimatedCost: number;
  finalCost: number;
  productTreeId: number;
  quantity: number;
  barcode?:string;
  receiptNo: string;
  startDate: Date;
  wareHouseId: number;
  currency: string;
  referenceId: any;
  minimumDelayQuantityBetweenOperation: number;
  wareHouseStockId: number;

  constructor() {
    this.actualFinish = null;
    this.actualStart = null;
    this.baseUnit = null;
    this.batch = null;
    this.createDate = null;
    this.description = null;
    this.extraProducedQuantityPercentage = 0;
    this.finishDate = null;
    this.grQuantity = null;
    this.item = null;
    this.referenceId = null;
    this.orderDetailId = null;
    this.orderUnit = null;
    this.plannedQuantity = null;
    this.priority = 'MEDIUM';
    this.prodOrderId = null;
    this.prodOrderStatus = 'CANTPLANNED';
    this.prodOrderType = null;
    this.productTreeId = null;
    this.quantity = null;
    this.receiptNo = null;
    this.startDate = null;
    this.wareHouseId = null;
    this.wareHouseStockId = null;
  }
}

