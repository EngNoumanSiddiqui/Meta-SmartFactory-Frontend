export class Workstation {
  workStationNo: string;
  workStationName: string;
  workStationTypeIdx: string;
  employeeIdx: string;
  workCenterStatus: string;
  description: string;
  cancelDate: string;
  mark: string;
  numberOfScissors: number;
  model: string;
  serialNo: string;
  capacity: string;
  minCapacity: string;
  cyclePeriod: string;
  kwh: string;
  kwhCost: string;
  workStationStatus: string;
  producer: string;
  productDate: string;
  purchaseDate: string;
}


export enum WorkStationStateEnum {
  PRODUCTION = 'PRODUCTION',
  STOPPED = 'STOPPED',
  MAINTENANCE = 'MAINTENANCE',
  WAITING_FOR_JOB = 'WAITING_FOR_JOB',
  WAITING_FOR_LABOR = 'WAITING_FOR_LABOR',
  WAITING_FOR_MAINTENANCE = 'WAITING_FOR_MAINTENANCE',
  WAITING_FOR_QUALITY = 'WAITING_FOR_QUALITY',
  CLOSED = 'CLOSED',
  SETUP = 'SETUP',
  SETUP_OVERTIME = 'SETUP_OVERTIME',
  UNKNOWN_STOPPED = 'UNKNOWN_STOPPED',
  MANIPULATION = 'MANIPULATION'
}

export enum MachineStateEnum {
  Closed = 'Closed',
  StandBy = 'StandBy',
  Running = 'Running',
  Setup = 'Setup',
  Stopped = 'Stopped'

}


export interface ResponseWorkstationStateChangeDto {
  workstationId: number;
  workstationName: String;

  states: WorkStationStatusDurationDto[];
}


export interface WorkStationMachineStatusDto {

  day: Date;

  statusArray: WorkStationStatusDurationDto[];
}

export interface WorkStationStatusDurationDto {

  // status: MachineStateEnum;
  // durationSeconds: number;
  // offset: number;
  d?: number;
  s: string;
  st?: number;
  scid?: number;
  scn?: string;
  ft?: number;
  wn?: string;
  wid?: number;
  ds?: number;
  o: number;
}

export class WorkstationUnitDto {
  unit: string;
  dimension: string;
  unitDescription: string;
}

export class WorkstationEfficiencyDto {
  wsPrmtId: null;
  wsId: null;
  wsEffcnCode: null;
  wsEffcnParameterCode: null;
  wsEffcnRate: 0;
}

export class WorkstationCapacityDto {
  baseUnitMeasurementId = null;
  capacity: number = null;
  capacityUnitId = null;
  capacityUtilization = null;
  factoryCalendarId = null;
  finish: Date = null;
  lenghtOfBreaks = null;
  numberOfIndividualCapacity = null;
  operationTime: number = null;
  start: Date = null;
  workstationId = null;
  wsCapacityId = null;
  scheduleSimulationId: number = null;
  workCenterId: number = null;
}

/**
 * Machine Daily Analysis DTO
 */
export interface MachineStatusDailyPayload {

  workstationId: number;
  date: string | Date;
  shiftId: number;
  plantId: number;
}

export interface MachineStatusDailyDto {

  shiftStartTime: string;
  shiftEndTime: string;
  plannedJobOrderList: PlannedJobOrderDtoList[];
  plannedStopList: PlannedStopListDto[];
  plannedMaintenanceList: PlannedMaintenanceListDto[];
  machineStateList: MachineStateDailyDto[];
  workstationStateList: PlannedStopListDto[];
  //workstationStatesTotalDurationMap:  WorkstationStatesTotalDurationMapDto;
  stopCauseGroupList: StopCauseGroupDto[];
  stopCauseGroupTotalDurationList: StopCauseGroupTotalDurationDto[];
  workstationStatesTotalDurationList: StopCauseGroupTotalDurationDto[];
  machineStatesTotalDurationList: any;
  machineStatesInWaitingForJobTotalDurationList: any;

}


export interface MachineStateDailyDto {
  // day: number;
  // durationSeconds: number;
  // finishTime: number;
  // offset: number;
  // startTime: number;
  // status: string;
  d: number;
  s: string;
  st: number;
  scid: number;
  scn: string;
  ft: number;
  wn: string;
  wid: number;
  ds: number;
  o: number;
}

export interface PlannedJobOrderDtoList {
  // day: number;
  // startTime: number;
  // finishTime: number;
  // durationSeconds: number;
  // offset: number;
  // jobOrderId: number;
  d: number;
  s: string;
  st: number;
  scid: number;
  scn: string;
  ft: number;
  wn: string;
  wid: number;
  ds: number;
  o: number;
  jobOrderId: number;
}

export interface PlannedMaintenanceListDto {
  // day: number;
  // durationSeconds: number;
  // finishTime: number;
  // maintenanceTypeId: number;
  // maintenanceTypeName: string;
  // offset: number;
  // startTime: number;
  d: number;
  s: string;
  st: number;
  scid: number;
  scn: string;
  ft: number;
  wn: string;
  wid: number;
  ds: number;
  o: number;
}

export interface MachineStatesDailyDto {
  d: number;
  s: string;
  st: number;
  scid: number;
  scn: string;
  ft: number;
  wn: string;
  wid: number;
  ds: number;
  o: number;
  // day: number;
  // durationSeconds: number;
  // finishTime: number;
  // offset: number;
  // startTime: Date | string;
  // status: string;
}

export interface PlannedStopListDto {
  // day: number;
  // durationSeconds: number;
  // finishTime: number;
  // offset: number;
  // startTime: number;
  // status?: string;
  // stopCauseId: number;
  // stopCauseName: string;
  d: number;
  s: string;
  st: number;
  scid: number;
  scn: string;
  ft: number;
  wn: string;
  wid: number;
  ds: number;
  o: number;
}

export interface WorkstationStatesTotalDurationMapDto {
  CLOSED: number,
  WAITING_FOR_JOB: number,
  WAITING_FOR_LABOR: number, 
  WAITING_FOR_MAINTENANCE: number, 
  WAITING_FOR_QUALITY: number,
  STOPPED: number,
  PRODUCTION: number,
  SETUP: number,
  MAINTENANCE: number
}

export interface StopCauseGroupDto {
  name: string;
  stateList: PlannedStopListDto[]
}

export interface StopCauseGroupTotalDurationDto {
  name: string,
  duration: number;
}


export class CreateOperationWorkStation {
  active: boolean;
  createDate: string;
  defaultOperation: string;
  operationId: number;
  operationWorkStationId: number;
  updateDate: string;
  workStationId: number;
}

export class CreateOperationWorkStationList {
  active: boolean;
  createDate: string;
  defaultOperation: boolean;
  operationId: number;
  operationWorkStationId: number;
  updateDate: string;
  workStationId: number;
  workStation: any;
}
