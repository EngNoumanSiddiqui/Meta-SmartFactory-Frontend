export interface EmployeeAnlyzItemDto {

  responseEmployeeStopItemDtos: Array<ResponseEmployeeStopItemDto>;
  totalStopDuration: string;
  totalStopPercentage: number;

}

export interface ResponseEmployeeStopItemDto {

  stopCauseName: string;
  stopDuration: string;
  stopPercentage: number;

}



export interface EmployeeWorkItemDto {

  sdate: string;
  workStationName: string;
  startTime: string;
  endTime: string;
  totalWorkingTime: string;
  stopDuration: string;
  netWorkingTime: string;
  workingTimeEfficiency: number;
  producedQuantity: number;

}

export interface ResponseEmployeeWorkDetailDto {
  employeeId: number;
  employeeName: string;
  totalWorkingTime: string;
  stopDuration: string;
  netWorkingTime: string;
  workingTimeEfficiency: string;
}
