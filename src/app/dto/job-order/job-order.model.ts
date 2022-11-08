import {OrderDetailDto} from '../sale-order/sale-order.model';
export interface ResponseJobOrderFilterDto {
  jobOrderStatus: JobOrderStatusEnum;
  prodOrderId: number;
  jobOrderId: number;
  individualCapacity?:number;
  operationUseId: number;
  plannedQuantity: number;
  producedQuantity: number;
  operationUseName: string;
  operationNameNext: string;
  workStationId: number;
  workStationName: string;
  startDate: Date;
  referenceId?:number;
  description: string;
  finishDate: Date;
  actualStartTime: Date;
  actualFinishTime: Date;
  jobOrderOperations?: Array<any>;
  jobOrderStockUseList: Array<JobOrderStockDto>;
  jobOrderStockProduceList: Array<JobOrderStockDto>;
  orderDetail: OrderDetailDto;
  customerName: string;
  childJobOrders: Array<ResponseJobOrderDetailDto>;
}

export interface ResponseJobOrderDetailDto {
  jobOrderStatus: JobOrderStatusEnum;
  prodOrderId: number;
  jobOrderId: number;
  parentId: number;
  combinedParentId: number;
  dividedParentId: number;
  operationUseId: number;
  plannedQuantity: number;
  producedQuantity: number;
  operationUseName: string;
  operationNameNext: string;
  customerName: string;
  productionType: string;
  customerId: number;
  workStationId: number;
  workStationName: string;
  startDate: Date;
  description: string;
  finishDate: Date;
  actualStartTime: Date;
  actualFinishTime: Date;
  jobOrderStockUseList: Array<JobOrderStockDto>;
  jobOrderStockProduceList: Array<JobOrderStockDto>;
  orderDetail: OrderDetailDto;
  plannedDuration: string;
  operationDuration: string;
  jobOrderDividedList: Array<ResponseJobOrderDetailDto>;
  jobOrderList:Array<any>;//added for jobOrderList
  jobOrderCombinedList: Array<ResponseJobOrderDetailDto>;
  childJobOrders: Array<ResponseJobOrderDetailDto>;
  customerJobOrderStatus: string;
  orderIndex: string;
}

export enum JobOrderStatusEnum {
  CANTPLANNED = 'CANTPLANNED',
  PLANNED = 'PLANNED',
  READY = 'READY',
  PROCESSING = 'PROCESSING',
  LONG_TERM_PROCESSING = 'LONG_TERM_PROCESSING',
  MODIFIED = 'MODIFIED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  PARTIALLY_COMPLETED= 'PARTIALLY_COMPLETED',
  NOT_READY_YET_MATERIAL_MISSING = 'NOT_READY_YET_MATERIAL_MISSING',
  NOT_READY_YET_WAITING_FOR_JOB= 'NOT_READY_YET_WAITING_FOR_JOB',
  NOT_READY_YET_WAITING_FOR_JOB_AND_MATERIAL_MISSING= 'NOT_READY_YET_WAITING_FOR_JOB_AND_MATERIAL_MISSING'

}

export enum JobOrderPositionStatusEnum {
  STANDARD = 'STANDARD',
  JOINED = 'JOINED',
  DIVIDED = 'DIVIDED',
  JOIN_PAIR = 'JOIN_PAIR'
}

export enum JobOrderScheduleTypeEnum {
  ACTUAL_CASE = 'ACTUAL_CASE',
  BEST_CASE = 'BEST_CASE'
}


export interface JobOrderStockDto {
  jobOrderStockId?: number;

  jobOrderId?: number;
  stockId: number;
  stockName?;
  useStock?: boolean;
  quantity?: number;
  neededQuantity: number;
  unit?: string;

  currentStockQuantity?: number;
  currentStockReservedQuantity?: number;

  defectName?: string;
  defectQuantity?: number;
}


export interface CreateJobOrderRequest {

  jobOrderId?: number;
  receiptNo?: string;
  description?: string;
  jobOrderStatus?: JobOrderStatusEnum;
  position?: JobOrderPositionStatusEnum;
  orderDetailId?: number;
  batch?: any;
  prodOrderId?: number;
  workstationId?: number;
  productTreeId?: number;
  expectedQuantity: number;
  operationRepeat: number;
  jobOrderStockUseList: Array<JobOrderStockDto>;
  jobOrderStockProduceList: Array<JobOrderStockDto>;
  jobOrderOperations: Array<JobOrderOperationDto>;
  jobOrderEquipmentList: Array<any>;
  workstationProgramList: Array<any>;
  parentId?: number;
  singleDuration: number;
  singleSetupDuration: number;
  maxSingleStandbyDuration: number;
  singleStandbyDuration: number;
  processControlFrequency: number;
}

export interface JobOrderOperationDto {
  jobOrderOperationId?: number;
  jobOrderId?: number;
  operationId: number;
  operationName?;
  equipmentId: number;
  equipmentName?;
  totalDuration?: number;
  quantity: number;
}


export interface ResponseJobOrderFollowFilterDto {
  jobOrderStatus: JobOrderStatusEnum;
  prodOrderId: number;
  jobOrderId: number;
  operationUseId: number;
  plannedQuantity: number;
  producedQuantity: number;
  operationUseName: string;
  operationNameNext: string;
  workStationId: number;
  workStationName: string;
  startDate: Date;
  description: string;
  finishDate: Date;
  actualStartTime: Date;
  actualFinishTime: Date;
  jobOrderStockUseList: Array<JobOrderStockDto>;
  jobOrderStockProduceList: Array<JobOrderStockDto>;
  orderDetail: OrderDetailDto;
  customerName: string;
  childJobOrders: Array<ResponseJobOrderDetailDto>;
  singleSetupDuration: number;

}
