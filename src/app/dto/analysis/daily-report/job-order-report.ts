import {JobOrderStatusEnum} from '../../job-order/job-order.model';


export interface ResponseJobOrderReportDto {

  jobOrderId: number;
  prodOrderId: number;
  orderNo: string;
  jobOrderStartDate: Date;
  jobOrderFinishDate: Date;
  jobOrderActualStartDate: Date;
  jobOrderActualFinishDate: Date;
  totalDuration: number|string;
  workstationId: number;
  stockToProduceId: number;
  customerId: number;
  
  workstationName: string;
  stockToProduceName: string;
  employeeReport: any[];
  customerName: string;
  jobOrderStatus: JobOrderStatusEnum;

  netWorkingTime: number | any;
  jobWaitingTime: number | any;

  powerConsumption: number | any;
  powerCost: number | any;
  timeEfficiency: number | any;
  capacityEfficiency: number | any;
  quantityEfficiency: number | any;
  quantityPerformance: number | any;
  qualityPerformance: number | any;

  singleProductCycleTime: number | any;
  singleProductCycleTimeActual: number | any;
  singleProductPowerCost: number | any;
  singleProductPowerConsumption: number | any;

  productNormalQuantity: number;
  plannedQuantity: number;
  productScrapQuantity: number;
  setupNormalQuantity: number;
  setupScrapQuantity: number;
  preparingTime: number| any;
  minPreparingTime: number| any;
  programmingDuration: number| any;
  reportRecordCreateDate?: number;
  reportRecordUpdateDate?: number;

  machineOccupancy?: number;
}


export interface ResponseJobOrderLogDetailDto {

  jobOrderId: number;
  jobOrderOperationId: number;
  referenceId: string;
  recordStartDate: any;
  recordFinishDate: any;
  netWorkingTime: number | any;
  powerConsumptions: number | any;
  powerCost: number | any;
  jobWaitingTime: number | any;
  timeEfficiency: number | any;
  capacityEfficiency: number | any;
  quantityEfficiency: number | any;
  quantityPerformance: number | any;
  qualityPerformance: number | any;
  singleProductCycleTimeExpected: number | any;
  singleProductCycleTimeActual: number | any;
  singleProductPowerConsumption: number | any;
  singleProductPowerCost: number | any;
  productionNormalQuantity: number | any;

}
