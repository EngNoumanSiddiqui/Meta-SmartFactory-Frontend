import {MachineStateEnum, WorkStationStateEnum} from '../workstation/workstation.model';
import {OeeAverageReport} from '../oee/oee.model';

export class JobSch {

  workStationName: string;
  workstationCategory: string;
  workStationId: number;
  plantId: number;
  workCenterId: number;
  jobOrderId: number;
  jobOrderOperationId: number;
  referenceId: string;
  stockToProduce: string;
  plannedQuantity: number;
  producedQuantity: number;
  position: number;
  stopReason: string;
  lastStopReason: string;
  lastStopDuration: number;
  lastStopDurationAsString?: string; // this field created on client side
  jobOperationTimeAsString?: string; // this field created on client side
  dailyStopDuration: number;
  efficiency: number;
  employeeDtoList: Array<EmployeeDTO>;
  status: WorkStationStateEnum;
  statusId: number;
  hsc1: any;
  hsc2: any;
  hsc3: any;
  hsc4: any;
  hsc5: any;
  hsc6: any;
  hsc7: any;
  hsc8: any;
  hsc9: any;
  hsc10: any;
  hsc11: any;
  hsc12: any;
  hsc13: any;
  hsc14: any;
  hsc15: any;
  hsc16: any;
  hsc17: any;
  hsc18: any;
  hsc19: any;
  hsc20: any;
  
  currentValue: number; // son alinan akım degeri
  powerConsumption; // power consumption in kw
  powerConsumptionCost: number; // toplam maliyet
  employees: Array<string>;
  machineStatus: MachineStateEnum;
  maintenanceState: string;
  maintenanceOperationWsDto: MaintenanceOperationWsDto;
  materiaList?: Array<any>;
  componentList?: Array<any>;
  equipmentDataStream: any;
  stockToUse: string;
  jobStartTime: Date;
  jobOperationTime: number;
  dailyJobLoadedTime: number;
  oeeAvarageReport: OeeAverageReport;
  onSchedule: any;
  onScheduleEmployee: any;
  dailyJobLoadedTimeAsString: any;
  dailyStopDurationAsString: any;
  operationName: string;
}


export class MonitoringDataDto {
  datas: JobSch[];
}

export class EquipmentMonitoringDataDto {
  workStationId: number;
  workStationName: string;
  workCenterId: number;
  plantId: number;
  recordDate: Date;
  equipmentDataList?: Array<any>;
}

export class EmployeeDTO {
  employeeId: number;
  identity: string;
  firstName: string;
  lastName: string;
  loginWithRfid: string;
  rfid: string;
  shiftId: string;
  loginDate: string;
  genericGroupType: string;

  position: number;
  workDurationAsString: string;

  stopReason: string;
  stopCauseId: string;
  plannedStop: boolean;
  plannedStopDuration: number;

  plannedDuration: number;
  plannedDurationAsString: string;
  remainingCycleDuration: number;
  remainingCycleDurationAsString: string;
  remainingDuration: number;
  remainingDurationAsString: string;
  goodQuantity: number;
  scrapQuantity: number;
  reworkQuantity: number;
  onSchedule: number;
  jobOrderState: string;
  workDuration: string;
  cycleQuantity: number;
  jobOrderOperationId: number;
  stopDurationAsString: string;
  totalStopDuration: number;
}


export class MaintenanceOperationWsDto {
  plannerGroup: any;
  responseBy: any;
  maintenanceOrderType: any;
  maintenanceNotification: any;
  maintenanceOnSchedule: any;
  maintenanceOperationId: any;
  maintenanceOrder: any;
  equipmentOperation: any;
  workstation: any;
  actualWork: any;
  work: any;
  workUnit: any;
  duration: any;
  durationUnit: any;
  plannedStartDate: any;
  plannedFinishDate: any;
  equipment: any;
  maintenanceActivityType: any;
  actualStartDate: any;
  planningPlant: any;
  createDate: any;
  updateDate: any;
  indexNo: any;
}
