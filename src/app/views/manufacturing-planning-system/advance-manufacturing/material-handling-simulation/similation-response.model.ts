export interface ActType {
  accountPosition: string;
  actTypeId: number;
  actTypeName: string;
  actTypeNo: string;
  plantId: number;
}

export interface Act {
  actId: number;
  actName: string;
  actNo: string;
  actType: ActType;
  currency: string;
  email: string;
  language: string;
  priority: string;
}

export interface JobOrder {
  jobOrderOperationId: number;
  jobOrderOperationReferenceId: string;
  outputMaterialName: string;
  outputMaterialNo: string;
  outputMaterialunit: string;
  targetQuantity: number;
  totalQuantity: number;
}

export interface Pallet {
  materialCode: string;
  materialId: number;
  palletCode: string;
  palletSettingId: number;
  totalCapacity: number;
  totalPalletCapacity: number;
  totalPalletQuantity: number;
  totalQuantity: number;
}

export interface Stock {
  baseUnit: string;
  createDate: Date;
  hasTree: boolean;
  isBatchActive: boolean;
  needed: number;
  purchaseNotificationPeriod: number;
  quantity: number;
  scrapMust: boolean;
  stockId: number;
  stockName: string;
  stockName2: string;
  stockName3: string;
  stockNo: string;
  stockTypeId: number;
  stockTypeName: string;
  updateDate: Date;
}

export interface StockStrategy {
  completedQuantity: number;
  day: number;
  factoryCalendarId: number;
  maxPlannedQuantity: number;
  maxStockLevel: number;
  minPlannedQuantity: number;
  month: number;
  plannedQuantity: number;
  reorderPoint: number;
  safetyStock: number;
  shiftId: number;
  stockId: number;
  stockStrategy: string;
  stockStrategyDetailId: number;
  targetQuantity: number;
  wareHouseId: number;
  week: number;
  year: number;
}

export interface TrendStockWarehouseShiftReportList {
  groupDate: string;
  organizationId: number;
  plantId: number;
  stockId: number;
  stockName: string;
  stockNo: string;
  stockStrategy: StockStrategy;
  stockTypeId: number;
  sumCurrentAmount: number;
  sumIncomingAmount: number;
  sumOutgoingAmount: number;
  sumTotalAmount: number;
  sumTotalProduction: number;
  totalCost: number;
  totalProfit: number;
}

export interface Workstation {
  avarageDiameter: number;
  baseUnit: string;
  capacity: number;
  childId: number;
  currency: string;
  cycleOfcoe: number;
  cyclePeriod: number;
  cycleWriteData: number;
  density: number;
  description: string;
  fromERP: boolean;
  innerDiameter: number;
  kwh: number;
  kwhCost: number;
  length: number;
  locationId: number;
  mark: string;
  maxBufferQuantity: number;
  maxInputSpace: number;
  maxRunningDuration: number;
  maxSetupDuration: number;
  maxStandbyDuration: number;
  maxStopDuration: number;
  minCapacity: number;
  model: string;
  numberOfScissors: number;
  operationIdx: number;
  outerDiameter: number;
  outputWarehouseId: number;
  panelActive: boolean;
  panelIP: string;
  panelUpdateDate: Date;
  parentId: number;
  plantId: number;
  producer: string;
  productDate: Date;
  purchaseDate: Date;
  serialNo: string;
  targetAvailability: number;
  targetOee: number;
  targetPerformance: number;
  targetQuality: number;
  targetTeep: number;
  useMsfCalendar: boolean;
  viewIndex: number;
  warehouseId: number;
  weight: number;
  workCenterId: number;
  workStationId: number;
  workStationName: string;
  workStationNo: string;
  workStationState: string;
  workStationStatus: string;
  workStationTypeId: number;
  workStationTypeName: string;
  workstationCategoryCode: string;
  workstationCostRate: number;
  writeInCcycle: boolean;
}

export interface StockOrderSimulationResponse {
  act: Act;
  jobOrder: JobOrder;
  pallet: Pallet;
  stock: Stock;
  trendStockWarehouseShiftReportList: TrendStockWarehouseShiftReportList[];
  workstation: Workstation;
  totalElements: number;
}

export interface SimulationResponse {
  content: StockOrderSimulationResponse[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface SimulationRequestDto {
  customerName: string;
  customerNo: string;
  finishDate: any;
  orderByDirection: string;
  orderByProperty: string;
  pageNumber: number;
  pageSize: number;
  query: string;
  startDate: any;
  plantId: number;
  stockName: string;
  stockNo: string;
  stockTypeId: string;
  workstationName: string;
  workstationNo: string;
}
