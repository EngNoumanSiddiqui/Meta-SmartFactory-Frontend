export interface OeeAverageReport {

  workstationId: number;
  shiftId: number;
  availability: number;
  quality: number;
  oee1: number;
  oee2: number;
  actualPerformance: number;
  workPerformance: number;
  teep: number;
  utilization: number;
  fullyProductiveTime: string;
  hiddenFactory: string;


}

export interface RequestOeeDateIntervalDto extends FilterDto {
  oeeReportId?: number;
  workstationId?: number;
  shiftId?: number;
  rangeStart?: Date | any;
  rangeEnd?: Date | any;
}


export interface FilterDto {
  pageNumber?: number;
  pageSize?: number;
}

export interface ResponseOeeDataIntervalDto {
  oeeReportId;
  recordDate;
  workstationId;
  shiftId;
  shiftStartDate;
  availability;
  quality;
  oee1;
  oee2;
  rangeStart;
  rangeEnd;
  timeInterval;
  plannedProductionTime;
  standByTime;
  plannedStopDurationInStandby;
  runningTime;
  unplannedStopDurationInStandby;
  actualPerformance;
  workPerformance;
  cycleTimesAndCount: string;
  fullyProductiveTime;
  hiddenFactory;
  teep;
  utilization;
  alltime;
  createDate;
  updateDate;
  goodQuantity;
  scrapQuantity;
  totaluantity;
}


export interface RequestOeeReportDto extends FilterDto {
  plantId: number;
  workcenterId: number;
  oeeReportId?: number;
  orderByDirection?: string,
  orderByProperty?: string,
  query?: string,
  rangeStart?: Date | any;
  rangeEnd?: Date | any;
  shiftId?: number;
  workstationId?: number;
}


export interface JobOrderOEE {
  oee: string,
  availability: string,
  performance: string,
  quality: string,
  teep: string,
  plannedProductionTime: string,
  runTime: string,
  availabilityLost: string,
  availabilityLostPercentage: number;
  scheduleLostPercentage: number;
  scheduleLost: string;
  performanceLostPercentage: number;
  qualityLostPercentage: number;
  netRunTime: string,
  realPerformance: string,
  realNetRunTime: string,
  realFullyProductiveTime: string,
  performanceLost: string,
  fullyProductiveTime: string,
  qualityLost: string,
  goodCount: string,
  scrapCount: string,
  qualityLossScrapReasonList?: any,
  scheduleLossReasonList?: any,
  reportItemList?: any,
  topQualityLostList?: any,
  topPerformanceLostList?: any,
  topAvailabilityLostList?: any
}

export interface OeeReportDashboardDto{
    oeeReportId: number,
    orderByDirection: string,
    orderByProperty: string,
    pageNumber: number,
    pageSize: number,
    plantId: number,
    query: string,
    rangeEnd: string | Date,
    rangeStart: string | Date,
    shiftId: number,
    workcenterId: number,
    workstationId: number
}

export interface OeeReportDto{
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  teep: number;
  plannedProductionTime: number;
  runTime: number;
  availabilityLost: number;
  availabilityLostPercentage: number;
  netRunTime: number;
  realPerformance: number;
  realNetRunTime: number;
  realFullyProductiveTime: number;
  performanceLost: number;
  performanceLostPercentage: number;
  fullyProductiveTime: number;
  qualityLost: number;
  qualityLostPercentage: number;
  goodCount: number;
  scrapCount: number;
  scheduleLost: number;
  scheduleLostPercentage: number;
  plannedStopTime: number;
  waitingForJobTime: number;
  plannedMaintenance: number;
  reportItemList: null
  topQualityLostList: null
  topPerformanceLostList: null
  topAvailabilityLostList: null
}
export interface OeeReportDtoResponse {
  workstationName: string,
  workstationNo: string,
  workstationId: number,
  dimension: string,
  totalCount: number,
  scrapCount: number,
  oee: number,
  oeeLostTime: number,
  productionTime: number,
  runTime: number,
  innerList: any
}
