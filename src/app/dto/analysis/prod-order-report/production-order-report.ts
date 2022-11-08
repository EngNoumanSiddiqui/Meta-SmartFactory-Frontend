import { ResponseJobOrderReportDto } from '../daily-report/job-order-report'

export interface ResponseProductionOrderReport {
    actualTotalCycleTime: any;
    finishDate: string;
    jobOrderOperationList: ResponseJobOrderReportDto[]
    lateTime: any;
    plantId: number;
    prodOrderId: number;
    prodOrderReferenceId: string;
    prodOrderStatus: string;
    startDate: string;
    stock: any;
    totalTime: any;
    totalPlannedTime: any;
    totalCycleTime: any;
    totalFinishedPercentage: number;
    referenceId: number;
    materialName: string;
    materialId: number;
    materialNo: string;
}

export interface ResponseProdOrderReportDto {
    actualTotalCycleTime: number,
    finishDate: number,
    jobOrderOperationList: ProdOrderJobOperationList[],
    lateTime: number,
    plantId: number,
    prodOrderId: number,
    prodOrderReferenceId: string,
    prodOrderStatus: number,
    startDate: string,
    stock: any,
    totalCycleTime: number,
    totalFinishedPercentage: number
}

export interface ProdOrderJobOperationList {
    capacityEfficiency: number,
    customerId: number,
    customerName: string,
    jobOrderActualFinishDate: string,
    jobOrderActualStartDate: string,
    jobOrderFinishDate: string,
    jobOrderId: number,
    jobOrderOperationId: number,
    referenceId: string;
    jobOrderStartDate: string,
    jobOrderStatus: string,
    jobWaitingTime: number,
    machineOccupancy: number,
    minPreparingTime: number,
    netWorkingTime: number,
    operationName?: string,
    plannedQuantity: number,
    powerConsumption: number,
    powerCost: number,
    preparingTime: number,
    productNormalQuantity: number,
    productScrapQuantity: number,
    qualityPerformance: number,
    quantityEfficiency: number,
    quantityPerformance: number,
    reportRecordCreateDate: string,
    reportRecordUpdateDate: string,
    setupNormalQuantity: number,
    setupReworkQuantity: number,
    setupScrapQuantity: number,
    singleProductCycleTime: number,
    singleProductCycleTimeActual: number,
    singleProductPowerConsumption: number,
    singleProductPowerCost: number,
    stockToProduceId: number,
    stockToProduceName: string,
    timeEfficiency: number,
    workstationId: number,
    workstationName: string
}
