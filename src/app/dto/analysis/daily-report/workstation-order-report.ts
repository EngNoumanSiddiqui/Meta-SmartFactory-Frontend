export interface ResponseWorkstationReportDto {

  workstationId: number;
  shiftId: number;
  shiftStartDate: Date;
  shiftEndDate: Date,

  netWorkingTime: number | any;
  jobWaitingTime: number | any;
  powerConsumption: number | any;
  powerCost: number | any;
  timeEfficiency: number | any;
  capacityEfficiency: number | any;

  machineOccupancy?: number| any;
}

export interface ResponseWorkstationReportAvgDto {
  workstationId: number;
  shiftId: number;
  rangeStartDate: Date;
  rangeEndDate: Date;
  type: string;
  netWorkingTimeAvg: number | any;
  runningTimeAvg: number | any;
  preparingTimeAvg: number | any;
  timeEfficiencyAvg: number | any;
  powerConsumptionAvg: number | any;
  powerCostAvg: number | any;
  jobWaitingTimeAvg: number | any;
  capacityEfficiencyAvg: number | any;
  machineOccupancyAvg: number | any;
}


export interface ResponseWorkstationReportLogDetailDto {
  workstationId: number;
  shiftId: number;
  shiftStartDate: Date| any;
  recordStartDate: Date| any;
  recordFinishDate: Date| any;

  netWorkingTime: number | any;
  jobWaitingTime: number | any;
  powerConsumption: number | any;
  powerCost: number | any;
  timeEfficiency: number | any;
  capacityEfficiency: number | any;

  machineOccupancy?: number| any;

}

export interface RequestWorkstationReportDetailDto {
  workstationId: number;
  shiftId: number;
  shiftStartDate: Date| any;
}


