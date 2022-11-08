export interface ResponseWorkStationPowerAnaliseWithDate {

  workStationName: string;
  totalPower: number;
  totalCost: number;
  workStationPowerDtos: Array<WorkStationPowerDto>;
}


export interface WorkStationPowerDto {

  date;
  power: number;
  cost: number;
}
export interface ResponsePowerCostJobOrderDto {

  jobOrderId: number;
  actualStartTime;
  actualFinishTime;
  customer: string;
  product: string;
  workStation: string;
  operationDuration: string;
  plannedQuantity: number;
  producedQuantity: number;
  power: number;
  cost: number;
}
export class RequestPowerWorkStationDto {

  workStationId: number;
  startDate: Date;
  endDate: Date;

}
