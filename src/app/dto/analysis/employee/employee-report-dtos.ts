export class EmployeeReportSumDto {
  employeeReportDetailList: Array<EmployeeReportDetailDto>;
  rangeFinishDate: Date;
  rangeStartDate: Date;
  actualWorkPercentage: number | any;
  sumOfActual: number | any;
  sumOfPlanned: number | any;

  goodQuantity: number | any;
  scrapQuantity: number | any;
  reworkQuantity: number | any;
  onSchedule: number | any;
  plannedStop: number | any;
  unplannedStop: number | any;
  malfunction: number | any;
  cumulativeStopReasonList: any;
  totalWorkingEfficiencyDto: Map<number, EmployeeTotalWorkingEfficiencyDto>;
  employeeAllTimeWorkingEfficiencyDto: EmployeeTotalWorkingEfficiencyDto;
  plantIntervalWorkingEfficiencyDto: PlantTotalWorkingEfficiencyDto;
  plantAllTimeWorkingEfficiencyDto: PlantTotalWorkingEfficiencyDto;

}

export interface PlantTotalWorkingEfficiencyDto {
  workingTime: number;
  stopTime: number;
  workingEfficiency: number;
  qualityEfficiency: number;

}

export interface EmployeeTotalWorkingEfficiencyDto {
  employeeId: number;
  employeeName: string;
  workingTime: number;
  stopTime: number;
  workingEfficiency: number;
  qualityEfficiency: number;

}

export class EmployeeReportDetailDto {
  employeeId: number;
  employeeName: string;
  day: Date | any;
  actualWorkPercentage: number | any;
  sumOfActualWork: number | any;
  sumOfPlannedWork: number | any;

  goodQuantity: number | any;
  scrapQuantity: number | any;
  reworkQuantity: number | any;
  onSchedule: number | any;
  plannedStop: number | any;
  unplannedStop: number | any;
  malfunction: number | any;
  shiftName: string | any;
  shiftId: number | any;
}

export class MSFLoginSummaryReportDto {
  employeeLoginSummaryId: number;
  employeeId: number;
  workstationId: number;
  jobOrderId: number;
  employeeName: string;
  loginDate: Date | any;
  logoutDate: Date | any;
  rangeStart: Date | any;
  rangeFinish: Date | any;
  actualWork: number | any;
  plannedWork: number | any;
  goodQuantity: number | any;
  scrapQuantity: number | any;
  reworkQuantity: number | any;
  onSchedule: number | any;
  plannedStop: number | any;
  stopDuration: number | any;
  unPlannedStop: number | any;
  jobOrderStop: number | any;
  jobOrderPlannedStop: number | any;
  jobOrderUnPlannedStop: number | any;
  jobOrderOperationId: number | any;
  jobOrderDuration: number | any;
  malfunction: number | any;
  shiftId: number | any;
}

