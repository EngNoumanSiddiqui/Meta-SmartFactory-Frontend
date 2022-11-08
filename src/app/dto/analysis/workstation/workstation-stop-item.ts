export interface WorkstationStopItemDto {
  workStationName: string;
  workStationId: number;
  shiftDate: string;
  shiftStartTime: string;
  shiftId: number;
  stopDuration: string;
  stopDurationAsMin: any;
  jobWaitingTime: string;
  jobLoadedTime: string;
  jobLoadedTimeAsMin: any;
  netWorkingTime: string;
  netWorkingTimeAsMin: any;
  efficiency: any;
  powerConsumption: number;
  powerCost: any;
  totalProductionQuantity: number;
  totalDefectQuantity: number;
}



