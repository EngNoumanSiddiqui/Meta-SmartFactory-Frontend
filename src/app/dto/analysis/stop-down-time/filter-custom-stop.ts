export class RequestStopListDto {
  workstationId?: number;
  jobOrderId?: number;
  waitingComponent: false;
  stopCauseId?: number;
  plantId?: number;
  startDate: Date;
  endDate: Date;

}
