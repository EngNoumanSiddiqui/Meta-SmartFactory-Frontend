export interface WorkCenterListDto {

  workCenterId: number;
  workCenterName: string;

}



export interface MachineStateList {
  // day: Date;
  // durationSeconds: number;
  // finishTime: Date;
  // offset: number;
  // startTime: Date;
  // status: string;
  // workstationId: number;
  // workstationName: string;
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

export interface MachineStatesTotalDurationList {
  duration: number;
  name: string;
}

export interface StopStateList {
  // day: Date;
  // durationSeconds: number;
  // finishTime: Date;
  // offset: number;
  // startTime: Date;
  // status: string;
  // stopCauseId: number;
  // stopCauseName: string;
  // workstationId: number;
  // workstationName: string;
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

export interface StopStateTotalDurationList {
  duration: number;
  name: string;
}

export interface WorkstationAnalysisList {
  day: Date;
  goodCount: number;
  machineStateList: MachineStateList[];
  machineStatesTotalDurationList: MachineStatesTotalDurationList[];
  scrapCount: number;
  bottleneckStateList: StopStateList[];
  bottleneckStateTotalDurationList: StopStateTotalDurationList[];
  stopStateList: StopStateList[];
  stopStateTotalDurationList: StopStateTotalDurationList[];
  productionStatesTotalDurationList: StopStateTotalDurationList[];
  productionStateList: [];
  workstationId: number;
  workstationName: string;
  productionTime: number;
  stopTime: number;
  activeTime: number;
  starvedTime: number;
  blockedTime: number;
  activeThroughput: number;
  totalThroughput: number;
  stopCount: number;
}

export interface WorkCenterAnalysisDash {
  day: Date;
  workstationAnalysisList: WorkstationAnalysisList[];
}
