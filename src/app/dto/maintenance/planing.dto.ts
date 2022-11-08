export class MaintenancePlaningRequestDto {
  assembly: string;
  calHorizon: string;
  callHorizan: number;
  completionRequirement: number;
  createDate: any;
  cycleCompletionDate: string;
  cycleModificationFactor: number;
  equipmentId: number;
  equipmentTaskId: number;
  mainWorkStationId: number;
  maintenanceFunctionalLocationId: number;
  maintenanceOrderPlanCycleItemList: MaintenanceOrderPlanCycleItemList[] = [];
  maintenanceOrderPlanItemList: MaintenanceOrderPlanItemList[] = [];
  maintenanceOrderPlanTypeId: string;
  maintenancePlanId: number;
  maintenancePlanPlanName: string;
  maintenancePlannerGroupId: number;
  planningPlantId: number;
  priority: string;
  schedulingIndicator: string;
  schedulingOperationType: string;
  schedulingPeriod: string;
  schedulingPeriodUnit: string;
  shiftFactorEarlyCompletion: number;
  shiftFactorEarlyTolerance: number;
  shiftFactorLateCompletion: number;
  shiftFactorLateTolerance: number;
  startOfCycleCounter: string;
  startOfCycleCounterUnit: string;
  startOfCycleDate: any;
  updateDate: any;
}

export class MaintenanceOrderPlanCycleItemList {
  counter: number;
  cycle: number;
  cycleUnit: string;
  description: string;
  maintenanceCycleItemId: number;
  maintenanceCycleText: string;
  maintenancePlanId: number;
  maintenanceStrategyPackageId: number;
  offset: number;
  offsetShortText: string;
  offsetUnit: string;
}

export class MaintenanceOrderPlanItemList {
  assembly: string;
  createDate: any;
  equipmentId: number;
  equipmentName: string;
  imaintenancePlanItemId: number;
  maintenancePlanItemName?: string;
  maintenancePlanItemId?: number;
  equipmentTaskName?: string;
  equipmentTask?: any;
  mainWorkStationId: number;
  mainWorkStationName: string;
  maintenanceActivityType: string;
  maintenanceOrderType: string;
  maintenanceFunctionalLocationId: number;
  maintenanceFunctionalLocation?: any;
  maintenanceFunctionalLocationDesc?: string;
  maintenanceOrderPlanTypeId: number;
  maintenanceOrderPlanType?: any;
  OrderPlandescription?: string;
  equipmentTaskId: number;
  maintenancePlanId?: number;
  maintenancePlannerGroupId: number;
  maintenancePlannerGroup?: any;
  plannerGroupName?: string;
  planningPlantId: number;
  planningPlantName: string;
  priority: string;
  updateDate: any;
}
